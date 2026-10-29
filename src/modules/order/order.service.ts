import { Types } from 'mongoose';
import { Order } from './order.model';
import { Cart } from '../cart/cart.model';
import { Product } from '../product/product.model';
import { Coupon } from '../coupon/coupon.model';
import { ApiError } from '../../utils/ApiError';
import { getPagination } from '../../utils/pagination';
import { notify } from '../notification/notification.service';
import { addPoints } from '../loyalty/loyalty.service';
import { DeliveryZone } from '../delivery/delivery.model';

export const placeOrder = async (
  userId: string,
  data: {
    shippingAddress: {
      name: string;
      phone: string;
      street: string;
      city: string;
      area: string;
      postalCode?: string;
      email?: string;
    };
    paymentMethod: 'cod' | 'card' | 'bkash' | 'nagad';
    notes?: string;
  }
) => {
  const cart = await Cart.findOne({ user: userId }).populate('items.product');
  if (!cart || cart.items.length === 0) throw new ApiError(400, 'Cart is empty');

  // ─── Validate stock & build items ─────────────────────
  const items: any[] = [];
  for (const cartItem of cart.items as any[]) {
    const product = cartItem.product;
    if (!product) throw new ApiError(400, 'A product in your cart no longer exists');

    const variant = product.variants.find((v: any) => v.sku === cartItem.variantSku);
    if (!variant) throw new ApiError(400, `Variant not found for ${product.name}`);
    if (variant.stock < cartItem.quantity)
      throw new ApiError(400, `Insufficient stock for ${product.name} (${variant.name})`);

    items.push({
      product: product._id,
      name: product.name,
      variantSku: variant.sku,
      variantName: variant.name,
      quantity: cartItem.quantity,
      price: variant.price,
      image: product.images?.[0] || '',
    });
  }

  // ─── Calculate shipping ───────────────────────────────
  const zone = await DeliveryZone.findOne({
    cities: data.shippingAddress.city,
    isActive: true,
  });
  const subtotal = cart.subtotal;
  let shippingFee = zone?.shippingFee ?? 100;
  if (zone?.freeAbove && subtotal >= zone.freeAbove) shippingFee = 0;

  // ─── Deduct stock ─────────────────────────────────────
  for (const cartItem of cart.items as any[]) {
    await Product.updateOne(
      { _id: cartItem.product._id, 'variants.sku': cartItem.variantSku },
      {
        $inc: {
          'variants.$.stock': -cartItem.quantity,
          sold: cartItem.quantity,
        },
      }
    );
  }

  // ─── Increment coupon usage ───────────────────────────
  if (cart.couponCode) {
    await Coupon.updateOne({ code: cart.couponCode }, { $inc: { usedCount: 1 } });
  }

  // ─── Create order ─────────────────────────────────────
  const total = subtotal - cart.discount + shippingFee;
  const order = await Order.create({
    user: userId,
    items,
    subtotal,
    discount: cart.discount,
    shippingFee,
    total,
    paymentMethod: data.paymentMethod,
    paymentStatus: 'pending',
    shippingAddress: data.shippingAddress,
    deliveryZone: zone?.name,
    couponCode: cart.couponCode,
    notes: data.notes,
  });

  // ─── Clear cart ───────────────────────────────────────
  cart.items = [];
  cart.couponCode = undefined;
  cart.subtotal = 0;
  cart.discount = 0;
  cart.total = 0;
  await cart.save();

  // ─── Notify + loyalty (COD only — online via payment.confirm) ──
  if (data.paymentMethod === 'cod') {
    order.status = 'confirmed';
    await order.save();

    const points = Math.floor(total / 100);
    if (points > 0) await addPoints(userId, points, `Order ${order.orderNumber}`, total);

    await notify(
      userId,
      'order',
      'Order placed',
      `Your order ${order.orderNumber} has been placed. Total: ৳${total}.`,
      `/orders/${order._id}`
    );
  }

  return order;
};

export const listUserOrders = async (userId: string, q: any) => {
  const { page, limit, skip } = getPagination(q.page, q.limit);
  const filter: any = { user: userId };
  if (q.status) filter.status = q.status;

  const [data, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Order.countDocuments(filter),
  ]);

  return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

export const listAllOrders = async (q: any) => {
  const { page, limit, skip } = getPagination(q.page, q.limit);
  const filter: any = {};
  if (q.status) filter.status = q.status;
  if (q.search) filter.orderNumber = new RegExp(q.search, 'i');

  const [data, total] = await Promise.all([
    Order.find(filter)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Order.countDocuments(filter),
  ]);

  return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

export const getOrderById = async (id: string, userId?: string) => {
  const filter: any = { _id: id };
  if (userId) filter.user = userId;
  const order = await Order.findOne(filter).populate('user', 'name email phone').lean();
  if (!order) throw new ApiError(404, 'Order not found');
  return order;
};

export const updateOrderStatus = async (
  id: string,
  status: string,
  trackingNumber?: string
) => {
  const update: any = { status };
  if (trackingNumber) update.trackingNumber = trackingNumber;
  if (status === 'delivered') update.deliveredAt = new Date();

  const order = await Order.findByIdAndUpdate(id, update, { new: true });
  if (!order) throw new ApiError(404, 'Order not found');

  await notify(
    order.user.toString(),
    'order',
    `Order ${status}`,
    `Your order ${order.orderNumber} is now ${status}.`,
    `/orders/${order._id}`
  );

  return order;
};

export const cancelOrder = async (id: string, userId: string) => {
  const order = await Order.findOne({ _id: id, user: userId });
  if (!order) throw new ApiError(404, 'Order not found');
  if (!['pending', 'confirmed'].includes(order.status))
    throw new ApiError(400, 'Order cannot be cancelled at this stage');

  // Restore stock
  for (const item of order.items) {
    await Product.updateOne(
      { _id: item.product, 'variants.sku': item.variantSku },
      { $inc: { 'variants.$.stock': item.quantity, sold: -item.quantity } }
    );
  }

  order.status = 'cancelled';
  await order.save();
  return order;
};
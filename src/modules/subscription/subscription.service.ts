import { Subscription } from './subscription.model';
import { Product } from '../product/product.model';
import { ApiError } from '../../utils/ApiError';
import { getPagination } from '../../utils/pagination';
import { CreateSubscriptionInput } from './subscription.interface';

const DISCOUNT_RATES = { weekly: 0.15, biweekly: 0.10, monthly: 0.05 };

const calcNextDate = (from: Date, freq: string): Date => {
  const d = new Date(from);
  if (freq === 'weekly') d.setDate(d.getDate() + 7);
  else if (freq === 'biweekly') d.setDate(d.getDate() + 14);
  else d.setMonth(d.getMonth() + 1);
  return d;
};

export const createSubscription = async (
  userId: string,
  data: CreateSubscriptionInput
) => {
  const product = await Product.findById(data.productId);
  if (!product) throw new ApiError(404, 'Product not found');

  const variant = product.variants.find((v) => v.sku === data.variantSku);
  if (!variant) throw new ApiError(404, 'Variant not found');

  const discountRate = DISCOUNT_RATES[data.frequency];
  const discount = Math.round(variant.price * data.quantity * discountRate);

  return Subscription.create({
    user: userId,
    product: product._id,
    variantSku: data.variantSku,
    quantity: data.quantity,
    frequency: data.frequency,
    nextDeliveryDate: calcNextDate(new Date(), data.frequency),
    price: variant.price * data.quantity,
    discount,
    shippingAddress: data.shippingAddress,
    paymentMethod: data.paymentMethod,
  });
};

export const listSubscriptions = async (userId: string, q: any) => {
  const { page, limit, skip } = getPagination(q.page, q.limit);
  const filter: any = { user: userId };
  if (q.status) filter.status = q.status;

  const [data, total] = await Promise.all([
    Subscription.find(filter)
      .populate('product', 'name images brand basePrice')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Subscription.countDocuments(filter),
  ]);

  return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

export const pauseSubscription = async (id: string, userId: string) => {
  const sub = await Subscription.findOneAndUpdate(
    { _id: id, user: userId, status: 'active' },
    { status: 'paused' },
    { new: true }
  );
  if (!sub) throw new ApiError(404, 'Active subscription not found');
  return sub;
};

export const resumeSubscription = async (id: string, userId: string) => {
  const sub = await Subscription.findOneAndUpdate(
    { _id: id, user: userId, status: 'paused' },
    { status: 'active' },
    { new: true }
  );
  if (!sub) throw new ApiError(404, 'Paused subscription not found');
  return sub;
};

export const cancelSubscription = async (id: string, userId: string) => {
  const sub = await Subscription.findOneAndUpdate(
    { _id: id, user: userId },
    { status: 'cancelled' },
    { new: true }
  );
  if (!sub) throw new ApiError(404, 'Subscription not found');
  return sub;
};
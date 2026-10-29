import { Cart } from './cart.model';
import { Product } from '../product/product.model';
import { Coupon } from '../coupon/coupon.model';
import { ApiError } from '../../utils/ApiError';

const recalculate = async (cart: any) => {
  cart.subtotal = cart.items.reduce((s: number, i: any) => s + i.price * i.quantity, 0);

  let discount = 0;
  if (cart.couponCode) {
    const coupon = await Coupon.findOne({ code: cart.couponCode, isActive: true });
    if (coupon && new Date() <= coupon.expiresAt) {
      if (coupon.type === 'percent')
        discount = (cart.subtotal * coupon.value) / 100;
      else discount = coupon.value;
      if (coupon.maxDiscount && discount > coupon.maxDiscount)
        discount = coupon.maxDiscount;
    } else {
      cart.couponCode = undefined;
    }
  }
  cart.discount = Math.min(discount, cart.subtotal);
  cart.total = cart.subtotal - cart.discount;
  await cart.save();
  return cart;
};

export const getOrCreateCart = async (userId: string) => {
  let cart = await Cart.findOne({ user: userId }).populate('items.product');
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
};

export const addToCart = async (
  userId: string,
  productId: string,
  variantSku: string,
  quantity: number
) => {
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, 'Product not found');
  const variant = product.variants.find((v) => v.sku === variantSku);
  if (!variant) throw new ApiError(404, 'Variant not found');
  if (variant.stock < quantity) throw new ApiError(400, 'Insufficient stock');

  const cart = await getOrCreateCart(userId);
  const existing = cart.items.find(
    (i) => i.product.toString() === productId && i.variantSku === variantSku
  );
  if (existing) existing.quantity += quantity;
  else
    cart.items.push({
      product: product._id,
      variantSku,
      quantity,
      price: variant.price,
    } as any);

  return recalculate(await cart.populate('items.product'));
};

export const updateCartItem = async (userId: string, itemId: string, quantity: number) => {
  const cart = await getOrCreateCart(userId);
  const item = cart.items.find((i) => (i as any)._id.toString() === itemId);
  if (!item) throw new ApiError(404, 'Cart item not found');
  if (quantity <= 0) cart.items = cart.items.filter((i) => (i as any)._id.toString() !== itemId);
  else item.quantity = quantity;
  return recalculate(await cart.populate('items.product'));
};

export const removeFromCart = async (userId: string, itemId: string) => {
  const cart = await getOrCreateCart(userId);
  cart.items = cart.items.filter((i) => (i as any)._id.toString() !== itemId);
  return recalculate(await cart.populate('items.product'));
};

export const applyCoupon = async (userId: string, code: string) => {
  const coupon = await Coupon.findOne({ code, isActive: true });
  if (!coupon) throw new ApiError(404, 'Invalid coupon');
  if (new Date() > coupon.expiresAt) throw new ApiError(400, 'Coupon expired');
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit)
    throw new ApiError(400, 'Coupon usage limit reached');

  const cart = await getOrCreateCart(userId);
  cart.couponCode = code;
  return recalculate(await cart.populate('items.product'));
};

export const removeCoupon = async (userId: string) => {
  const cart = await getOrCreateCart(userId);
  cart.couponCode = undefined;
  return recalculate(await cart.populate('items.product'));
};

export const clearCart = async (userId: string) => {
  const cart = await getOrCreateCart(userId);
  cart.items = [];
  cart.couponCode = undefined;
  return recalculate(cart);
};
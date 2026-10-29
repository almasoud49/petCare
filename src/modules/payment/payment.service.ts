import crypto from 'crypto';
import { Payment } from './payment.model';
import { Order } from '../order/order.model';
import { ApiError } from '../../utils/ApiError';
import { env } from '../../config/env';
import { sslcommerzInit, sslcommerzValidate } from './sslcommerz.client';
import { bkashCreate, bkashExecute, bkashQuery } from './bkash.client';
import { notify } from '../notification/notification.service';
import { addPoints } from '../loyalty/loyalty.service';
import { getPagination } from '../../utils/pagination';

const genTxnId = () =>
  'TXN-' + Date.now() + '-' + crypto.randomBytes(3).toString('hex');

type Provider = 'sslcommerz' | 'bkash' | 'cod' | 'mock';

export const initiatePayment = async (
  userId: string,
  orderId: string,
  provider: Provider
) => {
  const order = await Order.findOne({ _id: orderId, user: userId });
  if (!order) throw new ApiError(404, 'Order not found');
  if (order.paymentStatus === 'paid') throw new ApiError(400, 'Order already paid');

  const txnId = genTxnId();
  const payment = await Payment.create({
    order: order._id,
    user: userId,
    provider,
    providerRef: txnId,
    amount: order.total,
    status: provider === 'cod' ? 'pending' : 'initiated',
  });

  // ─── COD ────────────────────────────────────────────
  if (provider === 'cod') {
    order.paymentStatus = 'pending';
    order.status = 'confirmed';
    await order.save();

    await notify(
      userId,
      'order',
      'Order confirmed',
      `Your order ${order.orderNumber} is confirmed. Cash on delivery.`,
      `/orders/${order._id}`
    );

    return { payment, redirectUrl: null };
  }

  // ─── MOCK (dev only) ────────────────────────────────
  if (provider === 'mock') {
    return {
      payment,
      redirectUrl: `${env.CLIENT_URL}/payment/mock?txn=${txnId}&orderId=${order._id}`,
      mockTxn: txnId,
    };
  }

  // ─── SSLCommerz ─────────────────────────────────────
  if (provider === 'sslcommerz') {
    const payload = await sslcommerzInit({
      total_amount: order.total,
      tran_id: txnId,
      success_url: `${env.SERVER_URL}/api/v1/payments/sslcommerz/success`,
      fail_url: `${env.SERVER_URL}/api/v1/payments/sslcommerz/fail`,
      cancel_url: `${env.SERVER_URL}/api/v1/payments/sslcommerz/cancel`,
      ipn_url: `${env.SERVER_URL}/api/v1/payments/sslcommerz/ipn`,
      cus_name: order.shippingAddress.name,
      cus_email: order.shippingAddress.email || 'customer@petcare.com',
      cus_phone: order.shippingAddress.phone,
      cus_add1: order.shippingAddress.street,
      cus_city: order.shippingAddress.city,
      cus_country: 'Bangladesh',
      shipping_method: 'Courier',
      product_name: `Order ${order.orderNumber}`,
      product_category: 'Pet Supplies',
      product_profile: 'general',
    });

    if (payload.status !== 'SUCCESS')
      throw new ApiError(400, payload.failedreason || 'SSLCommerz init failed');

    payment.status = 'pending';
    payment.rawResponse = payload;
    await payment.save();

    return { payment, redirectUrl: payload.GatewayPageURL };
  }

  // ─── bKash ──────────────────────────────────────────
  if (provider === 'bkash') {
    const resp = await bkashCreate({
      amount: String(order.total),
      payerReference: userId,
      merchantInvoiceNumber: order.orderNumber,
      callbackURL: `${env.SERVER_URL}/api/v1/payments/bkash/callback`,
    });

    payment.status = 'pending';
    payment.providerRef = resp.paymentID;
    payment.rawResponse = resp;
    await payment.save();

    return { payment, redirectUrl: resp.bkashURL };
  }

  throw new ApiError(400, 'Unsupported provider');
};

// ─── Confirm after gateway redirects back ─────────────
export const confirmPayment = async (
  txnOrPaymentId: string,
  extra?: Record<string, any>
) => {
  const payment = await Payment.findOne({ providerRef: txnOrPaymentId });
  if (!payment) throw new ApiError(404, 'Payment not found');
  if (payment.status === 'success') return payment;

  payment.status = 'success';
  payment.rawResponse = { ...(payment.rawResponse || {}), ...(extra || {}) };
  await payment.save();

  const order = await Order.findById(payment.order);
  if (order) {
    order.paymentStatus = 'paid';
    order.status = 'confirmed';
    await order.save();

    const points = Math.floor(order.total / 100);
    if (points > 0)
      await addPoints(
        payment.user.toString(),
        points,
        `Order ${order.orderNumber}`,
        order.total
      );

    await notify(
      payment.user.toString(),
      'order',
      'Payment successful',
      `Payment of ৳${payment.amount} received for order ${order.orderNumber}.`,
      `/orders/${order._id}`
    );
  }

  return payment;
};

export const failPayment = async (txnId: string, reason?: string) => {
  const payment = await Payment.findOne({ providerRef: txnId });
  if (!payment) return null;
  payment.status = 'failed';
  payment.rawResponse = { ...(payment.rawResponse || {}), failReason: reason };
  await payment.save();

  const order = await Order.findById(payment.order);
  if (order) {
    order.paymentStatus = 'failed';
    await order.save();
  }
  return payment;
};

export const refundPayment = async (paymentId: string, reason?: string) => {
  const payment = await Payment.findById(paymentId);
  if (!payment) throw new ApiError(404, 'Payment not found');
  if (payment.status !== 'success')
    throw new ApiError(400, 'Only successful payments can be refunded');

  payment.status = 'refunded';
  payment.refundInfo = {
    refundedAt: new Date(),
    amount: payment.amount,
    reason,
  };
  await payment.save();

  const order = await Order.findById(payment.order);
  if (order) {
    order.paymentStatus = 'refunded';
    order.status = 'returned';
    await order.save();
  }
  return payment;
};

export const listPayments = async (q: {
  page?: string;
  limit?: string;
  status?: string;
  provider?: string;
}) => {
  const { page, limit, skip } = getPagination(q.page, q.limit);
  const filter: any = {};
  if (q.status) filter.status = q.status;
  if (q.provider) filter.provider = q.provider;

  const [data, total] = await Promise.all([
    Payment.find(filter)
      .populate('user', 'name email')
      .populate('order', 'orderNumber total')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Payment.countDocuments(filter),
  ]);

  return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};

// ─── SSLCommerz callback ──────────────────────────────
export const handleSslSuccess = async (query: Record<string, any>) => {
  const validated = await sslcommerzValidate(query.val_id);
  if (validated.status !== 'VALID' && validated.status !== 'VALIDATED')
    throw new ApiError(400, 'Invalid payment');
  return confirmPayment(validated.tran_id, validated);
};

// ─── bKash callback — retry-safe with Query fallback ──
export const handleBkashCallback = async (
  paymentID: string,
  status: string
) => {
  // User cancelled or failed on bKash page
  if (status !== 'success') {
    const payment = await Payment.findOne({ providerRef: paymentID });
    if (payment) {
      payment.status = status === 'cancel' ? 'cancelled' : 'failed';
      await payment.save();
    }
    return null;
  }

  // Try to execute
  try {
    const executed = await bkashExecute(paymentID);
    return confirmPayment(paymentID, executed);
  } catch (err) {
    // Execute failed — query real status before deciding
    try {
      const queried = await bkashQuery(paymentID);

      if (queried.transactionStatus === 'Completed') {
        return confirmPayment(paymentID, queried);
      }

      if (queried.transactionStatus === 'Initiated') {
        const payment = await Payment.findOne({ providerRef: paymentID });
        if (payment) {
          payment.status = 'failed';
          payment.rawResponse = {
            ...(payment.rawResponse || {}),
            queryResult: queried,
          };
          await payment.save();
        }
        return null;
      }
    } catch {
      // ignore query failure — fall through
    }
    throw err;
  }
};
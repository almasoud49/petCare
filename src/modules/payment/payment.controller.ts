import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { ApiResponse } from '../../utils/ApiResponse';
import * as paymentService from './payment.service';
import { env } from '../../config/env';

export const initiate = catchAsync(async (req: Request, res: Response) => {
  const { orderId, provider } = req.body;
  const result = await paymentService.initiatePayment(
    req.user!.id,
    orderId,
    provider
  );
  res.json(new ApiResponse('Payment initiated', result));
});

export const list = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentService.listPayments(req.query);
  res.json(new ApiResponse('Payments', result.data, result.meta));
});

export const refund = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentService.refundPayment(
    String(req.params.id),
    req.body.reason
  );
  res.json(new ApiResponse('Refunded', result));
});

// ─── SSLCommerz callbacks ─────────────────────────────
export const sslSuccess = catchAsync(async (req: Request, res: Response) => {
  try {
    await paymentService.handleSslSuccess(req.body);
    res.redirect(`${env.CLIENT_URL}/payment/success`);
  } catch {
    res.redirect(`${env.CLIENT_URL}/payment/fail`);
  }
});

export const sslFail = catchAsync(async (req: Request, res: Response) => {
  await paymentService.failPayment(req.body.tran_id, req.body.error);
  res.redirect(`${env.CLIENT_URL}/payment/fail`);
});

export const sslCancel = catchAsync(async (req: Request, res: Response) => {
  await paymentService.failPayment(req.body.tran_id, 'Cancelled by user');
  res.redirect(`${env.CLIENT_URL}/payment/cancel`);
});

export const sslIpn = catchAsync(async (req: Request, res: Response) => {
  await paymentService.handleSslSuccess(req.body);
  res.json({ received: true });
});

// ─── bKash callback ───────────────────────────────────
export const bkashCallback = catchAsync(async (req: Request, res: Response) => {
  const { paymentID, status } = req.query;

  if (!paymentID || !status) {
    return res.redirect(`${env.CLIENT_URL}/payment/fail`);
  }

  try {
    await paymentService.handleBkashCallback(
      paymentID as string,
      status as string
    );
    res.redirect(`${env.CLIENT_URL}/payment/success`);
  } catch (err) {
    console.error('bKash callback error:', err);
    res.redirect(`${env.CLIENT_URL}/payment/fail`);
  }
});

// ─── Mock confirm (dev only) ──────────────────────────
export const mockConfirm = catchAsync(async (req: Request, res: Response) => {
  const result = await paymentService.confirmPayment(String(req.params.txn));
  res.json(new ApiResponse('Mock payment confirmed', result));
});
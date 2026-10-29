import { z } from 'zod';

export const initiatePaymentSchema = z.object({
  body: z.object({
    orderId: z.string().length(24),
    provider: z.enum(['sslcommerz', 'bkash', 'cod', 'mock']),
  }),
});

export const refundSchema = z.object({
  body: z.object({
    reason: z.string().optional(),
  }),
});
import { z } from 'zod';

export const createSubscriptionSchema = z.object({
  body: z.object({
    productId: z.string().length(24),
    variantSku: z.string().min(1),
    quantity: z.number().int().positive(),
    frequency: z.enum(['weekly', 'biweekly', 'monthly']),
    shippingAddress: z.object({
      name: z.string().min(2),
      phone: z.string().min(6),
      street: z.string().min(2),
      city: z.string().min(2),
      area: z.string().min(2),
      email: z.string().email().optional(),
    }),
    paymentMethod: z.enum(['cod', 'bkash', 'card']),
  }),
});
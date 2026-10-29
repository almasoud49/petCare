import { z } from 'zod';

export const placeOrderSchema = z.object({
  body: z.object({
    paymentMethod: z.enum(['cod', 'card', 'bkash', 'nagad']),
    shippingAddress: z.object({
      name: z.string().min(2),
      phone: z.string().min(6),
      street: z.string().min(2),
      city: z.string().min(2),
      area: z.string().min(2),
      postalCode: z.string().optional(),
      email: z.string().email().optional(),
    }),
    notes: z.string().optional(),
  }),
});

export const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum([
      'pending',
      'confirmed',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'returned',
    ]),
    trackingNumber: z.string().optional(),
  }),
});
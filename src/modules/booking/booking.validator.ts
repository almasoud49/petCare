import { z } from 'zod';

export const createBookingSchema = z.object({
  body: z.object({
    service: z.string().length(24),
    pet: z.string().length(24),
    date: z.string(),
    timeSlot: z.string(),
    notes: z.string().optional(),
  }),
});

export const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']),
  }),
});

export const listBookingSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']).optional(),
  }),
});
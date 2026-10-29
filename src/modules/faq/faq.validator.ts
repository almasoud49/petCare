import { z } from 'zod';

export const createFaqSchema = z.object({
  body: z.object({
    question: z.string().min(3),
    answer: z.string().min(3),
    category: z.string().optional(),
    order: z.number().optional(),
  }),
});

export const updateFaqSchema = createFaqSchema.partial();
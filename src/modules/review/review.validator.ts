import { z } from 'zod';

export const createReviewSchema = z.object({
  body: z.object({
    service: z.string().length(24),
    rating: z.number().min(1).max(5),
    comment: z.string().min(3),
  }),
});
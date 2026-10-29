import { z } from 'zod';

export const chatSchema = z.object({
  body: z.object({
    sessionId: z.string(),
    message: z.string().min(1).max(1000),
  }),
});

export const suggestSearchSchema = z.object({
  query: z.object({
    q: z.string().min(1),
  }),
});
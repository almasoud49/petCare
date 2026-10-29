import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    phone: z.string().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
});

export const googleSchema = z.object({
  body: z.object({
    googleId: z.string(),
    email: z.string().email(),
    name: z.string(),
    avatar: z.string().url().optional(),
  }),
});
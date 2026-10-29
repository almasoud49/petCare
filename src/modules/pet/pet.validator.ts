import { z } from 'zod';

export const createPetSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    species: z.enum(['dog', 'cat', 'bird', 'rabbit', 'other']),
    breed: z.string().optional(),
    age: z.number().nonnegative().optional(),
    weight: z.number().nonnegative().optional(),
    gender: z.enum(['male', 'female']).optional(),
    image: z.string().url().optional(),
    notes: z.string().optional(),
  }),
});

export const updatePetSchema = createPetSchema.partial();
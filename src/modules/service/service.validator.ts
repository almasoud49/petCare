import { z } from 'zod';

const categoryEnum = z.enum(['grooming', 'vet', 'boarding', 'training', 'walking']);

export const createServiceSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    category: categoryEnum,
    description: z.string().min(10),
    price: z.number().nonnegative(),
    location: z.string().min(2),
    image: z.string().url(),
    durationMinutes: z.number().positive().optional(),
    gallery: z.array(z.string().url()).optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const updateServiceSchema = createServiceSchema.partial();

export const listServiceSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional(),
    category: categoryEnum.optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
    minRating: z.string().optional(),
    location: z.string().optional(),
    sort: z.enum(['price_asc', 'price_desc', 'rating', 'newest']).optional(),
  }),
});
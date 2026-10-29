import { z } from 'zod';

const variantSchema = z.object({
  name: z.string().min(1),
  sku: z.string().min(1),
  price: z.number().nonnegative(),
  comparePrice: z.number().nonnegative().optional(),
  stock: z.number().int().nonnegative(),
  image: z.string().url().optional(),
});

const speciesEnum = z.enum(['dog', 'cat', 'bird', 'rabbit', 'fish', 'other']);
const typeEnum = z.enum([
  'food',
  'treats',
  'litter',
  'toy',
  'accessory',
  'grooming',
  'health',
  'housing',
]);
const ageEnum = z.enum(['puppy', 'kitten', 'adult', 'senior', 'all']);
const sizeEnum = z.enum(['small', 'medium', 'large', 'all']);

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(3),
    brand: z.string().min(1),
    category: z.string().length(24),
    type: typeEnum,
    species: z.array(speciesEnum).min(1),
    ageGroup: z.array(ageEnum).optional(),
    size: z.array(sizeEnum).optional(),
    description: z.string().min(20),
    shortDescription: z.string().min(10).max(300),
    images: z.array(z.string().url()).min(1),
    variants: z.array(variantSchema).min(1),
    tags: z.array(z.string()).optional(),
  }),
});

export const updateProductSchema = z.object({
  body: createProductSchema.shape.body.partial(),
  params: z.object({ id: z.string().length(24) }),
});

export const listProductSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional(),
    category: z.string().optional(),
    type: typeEnum.optional(),
    species: speciesEnum.optional(),
    ageGroup: ageEnum.optional(),
    size: sizeEnum.optional(),
    brand: z.string().optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
    minRating: z.string().optional(),
    inStock: z.string().optional(),
    sort: z
      .enum(['price_asc', 'price_desc', 'rating', 'newest', 'best_selling'])
      .optional(),
    flashSale: z.string().optional(),
  }),
});
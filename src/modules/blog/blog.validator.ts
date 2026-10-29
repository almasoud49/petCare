import { z } from 'zod';

export const createBlogSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    excerpt: z.string().min(10),
    content: z.string().min(20),
    image: z.string().url(),
    tags: z.array(z.string()).optional(),
    published: z.boolean().optional(),
  }),
});

export const updateBlogSchema = createBlogSchema.partial();
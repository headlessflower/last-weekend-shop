import { z } from 'zod'

export const checkoutRequestSchema = z.object({
  productId: z.string().uuid(),
})

export const productSlugSchema = z.string().min(1).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)

export const adminProductSchema = z.object({
  title: z.string().trim().min(1).max(140),
  slug: productSlugSchema,
  description: z.string().trim().max(4000).optional().default(''),
  priceCents: z.number().int().min(100).max(1000000),
  stock: z.number().int().min(0).max(1).default(1),
  status: z.enum(['draft', 'active', 'sold', 'archived']).default('draft'),
  mainImageUrl: z.string().url(),
  mainImageAlt: z.string().trim().min(1).max(200),
})

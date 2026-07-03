import type { Product } from '~~/shared/types/product'

interface ProductRow {
  id: string
  title: string
  slug: string
  description: string | null
  price_cents: number
  stock: number
  status: Product['status']
  main_image_url: string
  main_image_alt: string | null
  created_at: string
}

export const mapProductRow = (row: ProductRow): Product => {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description || '',
    priceCents: row.price_cents,
    stock: row.stock,
    status: row.status,
    mainImageUrl: row.main_image_url,
    mainImageAlt: row.main_image_alt || row.title,
    createdAt: row.created_at,
  }
}

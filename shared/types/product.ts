export type ProductStatus = 'draft' | 'active' | 'sold' | 'archived'

export interface ProductImage {
  id: string
  productId: string
  imageUrl: string
  altText: string
  sortOrder: number
}

export interface Product {
  id: string
  title: string
  slug: string
  description: string
  priceCents: number
  stock: number
  status: ProductStatus
  mainImageUrl: string
  mainImageAlt: string
  createdAt: string
}

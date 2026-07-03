import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

export interface DbProduct {
  id: string
  title: string
  slug: string
  description: string | null
  price_cents: number
  stock: number
  status: 'draft' | 'active' | 'sold' | 'archived'
  main_image_url: string
  main_image_alt: string | null
  created_at: string
  updated_at?: string
}

export interface DbOrder {
  id: string
  stripe_checkout_session_id: string
  stripe_payment_intent_id: string | null
  customer_email: string | null
  status: 'paid' | 'refunded' | 'cancelled'
  created_at: string
  items: {
    product_id: string
    title: string
    price_cents: number
  }[]
}

const getProductsPath = () => {
  const dataDir = path.resolve(process.cwd(), 'server/data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  return path.join(dataDir, 'products.json')
}

const getOrdersPath = () => {
  const dataDir = path.resolve(process.cwd(), 'server/data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  return path.join(dataDir, 'orders.json')
}

export const getDbProducts = (): DbProduct[] => {
  const filePath = getProductsPath()
  if (!fs.existsSync(filePath)) {
    return []
  }
  try {
    const data = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(data)
  }
  catch {
    return []
  }
}

export const saveDbProducts = (products: DbProduct[]) => {
  const filePath = getProductsPath()
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2), 'utf-8')
}

export const getDbOrders = (): DbOrder[] => {
  const filePath = getOrdersPath()
  if (!fs.existsSync(filePath)) {
    return []
  }
  try {
    const data = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(data)
  }
  catch {
    return []
  }
}

export const saveDbOrders = (orders: DbOrder[]) => {
  const filePath = getOrdersPath()
  fs.writeFileSync(filePath, JSON.stringify(orders, null, 2), 'utf-8')
}

export const getProductBySlug = (slug: string): DbProduct | null => {
  const products = getDbProducts()
  return products.find(p => p.slug === slug) || null
}

export const getProductById = (id: string): DbProduct | null => {
  const products = getDbProducts()
  return products.find(p => p.id === id) || null
}

export const saveProduct = (productData: Omit<DbProduct, 'id' | 'created_at'> & { id?: string }): DbProduct => {
  const products = getDbProducts()

  if (productData.id) {
    const index = products.findIndex(p => p.id === productData.id)
    if (index !== -1) {
      const existing = products[index]
      const updatedProduct: DbProduct = {
        ...existing,
        ...productData,
        id: productData.id,
        updated_at: new Date().toISOString(),
      }
      products[index] = updatedProduct
      saveDbProducts(products)
      return updatedProduct
    }
  }

  const newProduct: DbProduct = {
    ...productData,
    id: productData.id || crypto.randomUUID(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  products.push(newProduct)
  saveDbProducts(products)
  return newProduct
}

export const completeOneOffOrder = (
  checkoutSessionId: string,
  paymentIntentId: string | null,
  productId: string,
  customerEmail: string | null,
): void => {
  const products = getDbProducts()
  const productIndex = products.findIndex(p => p.id === productId)

  if (productIndex === -1) {
    throw new Error('Product not found')
  }

  const product = products[productIndex]

  if (product.stock < 1 || product.status !== 'active') {
    throw new Error('Product is not available')
  }

  const orders = getDbOrders()
  const exists = orders.some(o => o.stripe_checkout_session_id === checkoutSessionId)

  if (exists) {
    return
  }

  const orderId = crypto.randomUUID()
  const newOrder: DbOrder = {
    id: orderId,
    stripe_checkout_session_id: checkoutSessionId,
    stripe_payment_intent_id: paymentIntentId,
    customer_email: customerEmail,
    status: 'paid',
    created_at: new Date().toISOString(),
    items: [
      {
        product_id: product.id,
        title: product.title,
        price_cents: product.price_cents,
      },
    ],
  }

  orders.push(newOrder)
  saveDbOrders(orders)

  // Update product stock and status
  product.stock = 0
  product.status = 'sold'
  product.updated_at = new Date().toISOString()
  products[productIndex] = product
  saveDbProducts(products)
}

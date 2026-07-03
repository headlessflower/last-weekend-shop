export default defineEventHandler(async (event) => {
  const slug = productSlugSchema.parse(getRouterParam(event, 'slug'))
  const product = getProductBySlug(slug)

  if (!product || (product.status !== 'active' && product.status !== 'sold')) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Product not found',
    })
  }

  return mapProductRow(product)
})

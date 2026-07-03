export default defineEventHandler(async (event) => {
  const slug = productSlugSchema.parse(getRouterParam(event, 'slug'))
  const products = getDbProducts()

  const sourceProduct = products.find(p => p.slug === slug)

  if (!sourceProduct) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Source product not found',
    })
  }

  const related = getRelatedProducts(sourceProduct, products, 4)

  return related.map(mapProductRow)
})

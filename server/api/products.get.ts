export default defineEventHandler(async () => {
  try {
    const products = getDbProducts()
    const activeOrSold = products
      .filter(p => p.status === 'active' || p.status === 'sold')
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return activeOrSold.map(mapProductRow)
  }
  catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'Products could not be loaded',
    })
  }
})

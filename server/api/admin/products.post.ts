export default defineEventHandler(async (event) => {
  await requireAdminUser(event)

  const body = await readValidatedBody(event, adminProductSchema.parse)

  try {
    const data = saveProduct({
      title: body.title,
      slug: body.slug,
      description: body.description,
      price_cents: body.priceCents,
      stock: body.stock,
      status: body.status,
      main_image_url: body.mainImageUrl,
      main_image_alt: body.mainImageAlt,
    })

    return mapProductRow(data)
  }
  catch {
    throw createError({
      statusCode: 400,
      statusMessage: 'Product could not be created',
    })
  }
})

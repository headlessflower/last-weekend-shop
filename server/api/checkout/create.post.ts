import Stripe from 'stripe'

export default defineEventHandler(async (event) => {
  await enforceCheckoutRateLimit(event)

  const body = await readValidatedBody(event, checkoutRequestSchema.parse)
  const config = useRuntimeConfig()

  if (!config.stripeSecretKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Stripe is not configured',
    })
  }

  const product = getProductById(body.productId)

  if (!product || product.status !== 'active' || product.stock < 1) {
    throw createError({
      statusCode: 409,
      statusMessage: 'This piece is no longer available',
    })
  }

  const stripe = new Stripe(config.stripeSecretKey)
  const siteUrl = config.public.siteUrl

  // Build fully qualified image URL for Stripe
  const absoluteImageUrl = product.main_image_url.startsWith('/')
    ? `${siteUrl}${product.main_image_url}`
    : product.main_image_url

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: product.price_cents,
          product_data: {
            name: product.title,
            description: product.description || undefined,
            images: absoluteImageUrl ? [absoluteImageUrl] : undefined,
          },
        },
      },
    ],
    metadata: {
      productId: product.id,
    },
    success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/product/${product.slug}`,
  })

  if (!session.url) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Checkout session could not be created',
    })
  }

  return {
    checkoutUrl: session.url,
  }
})

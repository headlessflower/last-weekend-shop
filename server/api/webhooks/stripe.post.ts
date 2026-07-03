import Stripe from 'stripe'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  if (!config.stripeSecretKey || !config.stripeWebhookSecret) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Stripe webhook is not configured',
    })
  }

  const stripe = new Stripe(config.stripeSecretKey)
  const signature = getHeader(event, 'stripe-signature')
  const rawBody = await readRawBody(event)

  if (!signature || !rawBody) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid webhook request',
    })
  }

  let stripeEvent: Stripe.Event

  try {
    stripeEvent = stripe.webhooks.constructEvent(rawBody, signature, config.stripeWebhookSecret)
  }
  catch {
    throw createError({
      statusCode: 400,
      statusMessage: 'Webhook signature verification failed',
    })
  }

  if (stripeEvent.type !== 'checkout.session.completed') {
    return { received: true }
  }

  const session = stripeEvent.data.object as Stripe.Checkout.Session
  const productId = session.metadata?.productId

  if (!productId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing product reference',
    })
  }

  try {
    completeOneOffOrder(
      session.id,
      typeof session.payment_intent === 'string' ? session.payment_intent : null,
      productId,
      session.customer_details?.email || null,
    )
  }
  catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'Order could not be completed',
    })
  }

  return { received: true }
})

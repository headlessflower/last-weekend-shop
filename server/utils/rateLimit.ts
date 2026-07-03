import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import type { H3Event } from 'h3'

let checkoutRateLimit: Ratelimit | null = null

const getClientIp = (event: H3Event) => {
  return getRequestIP(event, { xForwardedFor: true }) || 'unknown'
}

export const enforceCheckoutRateLimit = async (event: H3Event) => {
  const config = useRuntimeConfig()

  if (!config.upstashRedisRestUrl || !config.upstashRedisRestToken) {
    if (process.env.NODE_ENV === 'production') {
      throw createError({
        statusCode: 500,
        statusMessage: 'Rate limiting is not configured',
      })
    }

    return
  }

  if (!checkoutRateLimit) {
    const redis = new Redis({
      url: config.upstashRedisRestUrl,
      token: config.upstashRedisRestToken,
    })

    checkoutRateLimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(8, '1 m'),
    })
  }

  const result = await checkoutRateLimit.limit(`checkout:${getClientIp(event)}`)

  if (!result.success) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Too many checkout attempts',
    })
  }
}

export default defineNuxtConfig({
  modules: ['@nuxt/eslint'],
  devtools: { enabled: true },
  css: ['~/assets/css/global.css'],
  runtimeConfig: {
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    upstashRedisRestUrl: process.env.UPSTASH_REDIS_REST_URL,
    upstashRedisRestToken: process.env.UPSTASH_REDIS_REST_TOKEN,
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY,
    },
  },
  routeRules: {
    '/**': {
      headers: {
        'Content-Security-Policy': [
          'default-src \'self\'',
          'script-src \'self\' \'unsafe-inline\' js.stripe.com',
          'style-src \'self\' \'unsafe-inline\'',
          'img-src \'self\' data: blob: https:',
          'font-src \'self\' data:',
          'connect-src \'self\' https://*.supabase.co https://api.stripe.com',
          'frame-src https://js.stripe.com https://hooks.stripe.com',
          'object-src \'none\'',
          'base-uri \'self\'',
          'form-action \'self\'',
        ].join('; '),
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      },
    },
  },
  compatibilityDate: '2026-07-01',
  eslint: {
    config: {
      stylistic: true,
    },
  },
})

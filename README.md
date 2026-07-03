# Last Weekend Shop

A minimal Nuxt 4 + Supabase + Stripe storefront for one-off jewelry pieces.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Required Services

- Supabase project with the migration in `supabase/migrations/001_initial_shop.sql`
- Stripe account with Checkout enabled
- Upstash Redis for production checkout rate limiting

## Development Rules

- No Tailwind.
- All Vue component CSS should use `<style scoped>`.
- TypeScript function names should use camelcase.
- Server-only secrets must stay out of `NUXT_PUBLIC_*`.

## Security Checks

```bash
npm run audit:secrets
npm run audit:deps
```

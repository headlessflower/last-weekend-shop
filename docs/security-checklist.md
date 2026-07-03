# Security Checklist

## Secrets and Credentials

- Keep `.env` and `.env.*` out of git. This scaffold ignores them by default.
- Server-only secrets must not use the `NUXT_PUBLIC_` prefix.
- Public Supabase URL and anon key may be exposed. Never expose `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, or `STRIPE_WEBHOOK_SECRET`.
- Run `npm run audit:secrets` before commits.

## Authentication and Authorization

- Admin endpoints call `requireAdminUser()` server-side.
- Admin status is checked against `admin_profiles` in Supabase.
- Client-side UI is convenience only and must not be treated as authorization.
- Supabase RLS is enabled in `supabase/migrations/001_initial_shop.sql`.
- Prefer HttpOnly, Secure cookies for Supabase sessions. Do not store admin JWTs in `localStorage`.

## API and Endpoint Security

- Checkout creation is rate limited through Upstash in production.
- Stripe webhook signatures are verified before any database write.
- API responses only return storefront fields, not internal order or admin records.
- Security headers and CSP are configured in `nuxt.config.ts`.
- Restrict CORS at the deployment/proxy layer to the production shop domain.

## Data Validation

- Request bodies and route params are validated with Zod.
- Database writes use Supabase client methods instead of string-built SQL.
- Product image uploads should be limited to `image/jpeg`, `image/png`, `image/webp`, and a small file size such as 5 MB.
- Store transformed public image URLs, not arbitrary upload paths from untrusted users.

## Post-Deployment Auditing

- Run `npm run audit:deps` before merging.
- Add Semgrep to CI for static scanning.
- Run OWASP ZAP against staging before launch.
- Review browser Network responses before launch to confirm no secrets, table internals, or admin data are leaking.

# Last Weekend Shop Architecture

This scaffold is built for a small one-off jewelry shop. Each product is the sellable object. There are no variants.

## Stack

| Layer | Choice |
| --- | --- |
| App | Nuxt |
| Styling | Scoped CSS in Vue components |
| Database | Supabase Postgres |
| Auth | Supabase Auth |
| Payments | Stripe Checkout Sessions |
| Rate limiting | Upstash Redis |

## Product Lifecycle

1. Admin creates a product as `draft`.
2. Admin publishes it as `active` with `stock = 1`.
3. Customer starts checkout.
4. Server re-checks `status = active` and `stock > 0`.
5. Stripe creates a Checkout Session.
6. Stripe webhook calls `complete_one_off_order`.
7. The database transaction creates the order, creates the order item, sets `stock = 0`, and marks the product `sold`.

## Naming Conventions

- TypeScript functions use camelcase.
- Database columns use snake case.
- Vue components use PascalCase.
- Routes use lowercase path names.

## Styling Rules

- Do not install Tailwind.
- Use `<style scoped>` in Vue components.
- Put only true global reset/tokens in `assets/css/global.css`.

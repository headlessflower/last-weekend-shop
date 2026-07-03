create extension if not exists pgcrypto;

create table public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 140),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  description text,
  price_cents integer not null check (price_cents >= 100),
  stock integer not null default 1 check (stock in (0, 1)),
  status text not null default 'draft' check (status in ('draft', 'active', 'sold', 'archived')),
  main_image_url text not null,
  main_image_alt text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  alt_text text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  stripe_checkout_session_id text not null unique,
  stripe_payment_intent_id text,
  customer_email text,
  status text not null default 'paid' check (status in ('paid', 'refunded', 'cancelled')),
  created_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  title text not null,
  price_cents integer not null check (price_cents >= 100),
  created_at timestamptz not null default now()
);

create table public.admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role = 'admin'),
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_set_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

create or replace function public.complete_one_off_order(
  checkout_session_id text,
  stripe_payment_intent_id text,
  product_id uuid,
  customer_email text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  product_record public.products%rowtype;
  order_id uuid;
begin
  select *
  into product_record
  from public.products
  where id = product_id
  for update;

  if not found then
    raise exception 'Product not found';
  end if;

  if product_record.stock < 1 or product_record.status <> 'active' then
    raise exception 'Product is not available';
  end if;

  insert into public.orders (
    stripe_checkout_session_id,
    stripe_payment_intent_id,
    customer_email,
    status
  )
  values (
    checkout_session_id,
    stripe_payment_intent_id,
    customer_email,
    'paid'
  )
  on conflict (stripe_checkout_session_id) do nothing
  returning id into order_id;

  if order_id is null then
    return;
  end if;

  insert into public.order_items (
    order_id,
    product_id,
    title,
    price_cents
  )
  values (
    order_id,
    product_record.id,
    product_record.title,
    product_record.price_cents
  );

  update public.products
  set stock = 0,
      status = 'sold'
  where id = product_record.id;
end;
$$;

alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.admin_profiles enable row level security;

create policy "Public can read active and sold products"
on public.products
for select
using (status in ('active', 'sold'));

create policy "Public can read images for visible products"
on public.product_images
for select
using (
  exists (
    select 1
    from public.products
    where products.id = product_images.product_id
      and products.status in ('active', 'sold')
  )
);

create policy "Admins can manage products"
on public.products
for all
using (
  exists (
    select 1
    from public.admin_profiles
    where admin_profiles.user_id = auth.uid()
      and admin_profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.admin_profiles
    where admin_profiles.user_id = auth.uid()
      and admin_profiles.role = 'admin'
  )
);

create policy "Admins can manage product images"
on public.product_images
for all
using (
  exists (
    select 1
    from public.admin_profiles
    where admin_profiles.user_id = auth.uid()
      and admin_profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.admin_profiles
    where admin_profiles.user_id = auth.uid()
      and admin_profiles.role = 'admin'
  )
);

create policy "Admins can read orders"
on public.orders
for select
using (
  exists (
    select 1
    from public.admin_profiles
    where admin_profiles.user_id = auth.uid()
      and admin_profiles.role = 'admin'
  )
);

create policy "Admins can read order items"
on public.order_items
for select
using (
  exists (
    select 1
    from public.admin_profiles
    where admin_profiles.user_id = auth.uid()
      and admin_profiles.role = 'admin'
  )
);

create policy "Admins can read admin profiles"
on public.admin_profiles
for select
using (user_id = auth.uid());

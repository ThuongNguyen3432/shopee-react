-- Shopee backend schema (run in Supabase SQL Editor)
-- Enable RLS as needed.

create table if not exists categories (
  id bigint primary key generated always as identity,
  name text not null,
  slug text,
  created_at timestamptz default now()
);

create table if not exists products (
  id bigint primary key generated always as identity,
  name text not null,
  price numeric not null,
  old_price numeric,
  category_id bigint references categories(id) on delete set null,
  image text,
  rating numeric default 4.5,
  sold int default 0,
  stock int default 0,
  mall boolean default false,
  status text default 'active',
  description text,
  created_at timestamptz default now()
);

create table if not exists order_items (
  id bigint primary key generated always as identity,
  order_id bigint references orders(id) on delete cascade,
  product_id bigint,
  name text,
  price numeric,
  qty int default 1,
  created_at timestamptz default now()
);

create table if not exists orders (
  id bigint primary key generated always as identity,
  code text,
  customer_name text,
  customer_phone text,
  address text,
  total numeric,
  status text default 'pending',
  created_at timestamptz default now()
);

create table if not exists users (
  id uuid primary key default auth.uid(),
  name text,
  email text,
  phone text,
  role text default 'customer',
  created_at timestamptz default now()
);

create table if not exists vouchers (
  id bigint primary key generated always as identity,
  code text unique not null,
  label text,
  sub text,
  value numeric default 0,
  min_order numeric default 0,
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists banners (
  id bigint primary key generated always as identity,
  title text,
  image text,
  link text,
  position text default 'main',
  sort_order int default 0,
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists flash_sales (
  id bigint primary key generated always as identity,
  product_id bigint references products(id) on delete cascade,
  discount int default 0,
  stock int default 0,
  sold int default 0,
  start_at timestamptz,
  end_at timestamptz,
  active boolean default true,
  created_at timestamptz default now()
);

-- RLS: allow anon (publishable key) full access for demo. Tighten for production.
alter table categories enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table users enable row level security;
alter table vouchers enable row level security;
alter table banners enable row level security;
alter table flash_sales enable row level security;
alter table order_items enable row level security;

do $$ begin
  create policy "anon all categories" on categories for all to anon using (true) with check (true);
  create policy "anon all products" on products for all to anon using (true) with check (true);
  create policy "anon all orders" on orders for all to anon using (true) with check (true);
  create policy "anon all users" on users for all to anon using (true) with check (true);
  create policy "anon all vouchers" on vouchers for all to anon using (true) with check (true);
  create policy "anon all banners" on banners for all to anon using (true) with check (true);
  create policy "anon all flash_sales" on flash_sales for all to anon using (true) with check (true);
  create policy "anon all order_items" on order_items for all to anon using (true) with check (true);
exception when duplicate_object then null; end $$;

-- Seed sample data
insert into categories (name, slug) values
  ('Thời Trang Nam','thoi-trang-nam'),
  ('Điện Thoại & Phụ Kiện','dien-thoai'),
  ('Thiết Bị Điện Tử','thiet-bi-dien-tu'),
  ('Máy Tính & Laptop','may-tinh'),
  ('Sắc Đẹp','sac-dep')
on conflict do nothing;
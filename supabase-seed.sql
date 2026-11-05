-- Shopee bulk seed script (run in Supabase SQL Editor)
-- Adjust the counts below to scale. 3M users/orders is NOT recommended on free tier
-- (500MB limit); start small and scale up on a paid plan.

-- 1. Shops table (new)
create table if not exists shops (
  id bigint primary key generated always as identity,
  name text not null,
  avatar text,
  banner text,
  location text,
  mall boolean default false,
  rating numeric default 4.7,
  followers int default 0,
  created_at timestamptz default now()
);

-- 2. Add shop_id to products (if missing)
alter table products add column if not exists shop_id bigint references shops(id);

-- 3. Reviews table (new)
create table if not exists reviews (
  id bigint primary key generated always as identity,
  product_id bigint references products(id) on delete cascade,
  user_id uuid,
  user_name text,
  rating int default 5,
  content text,
  images text[],
  created_at timestamptz default now()
);

-- RLS
alter table shops enable row level security;
alter table reviews enable row level security;
do $$ begin
  create policy "anon all shops" on shops for all to anon using (true) with check (true);
  create policy "anon all reviews" on reviews for all to anon using (true) with check (true);
exception when duplicate_object then null; end $$;

-- 4. Seed 1000 shops
insert into shops (name, avatar, banner, location, mall, rating, followers)
select
  'Shop ' || g,
  'https://ui-avatars.com/api/?name=Shop+' || g || '&background=ee4d2d&color=fff&size=140',
  'https://picsum.photos/seed/shopbanner' || g || '/1200/220',
  (array['Hà Nội','TP. Hồ Chí Minh','Đà Nẵng','Hải Phòng','Cần Thơ','Bình Dương','Đồng Nai','Khánh Hòa'])[1 + (g % 8)],
  (g % 7 = 0),
  4.5 + (g % 50) / 100.0,
  1000 + (g * 97) % 50000
from generate_series(1, 1000) as g
on conflict do nothing;

-- 5. Seed 100,000 products distributed across shops
insert into products (name, price, old_price, category_id, image, rating, sold, stock, mall, status, description, shop_id)
select
  'Sản phẩm ' || g,
  (10000 + (g * 137) % 990000)::numeric,
  (12000 + (g * 137) % 990000 * 1.2)::numeric,
  1 + (g % 5),
  'https://picsum.photos/seed/prod' || g || '/400/400',
  4.0 + (g % 10) / 10.0,
  (g * 37) % 5000,
  10 + (g * 13) % 500,
  (g % 7 = 0),
  'active',
  'Mô tả sản phẩm ' || g || '. Chất lượng cao, giao hàng nhanh.',
  1 + (g % 1000)
from generate_series(1, 100000) as g
on conflict do nothing;

-- 6. Seed sample orders (10,000) — scale up as needed
insert into orders (code, customer_name, customer_phone, address, total, status, created_at)
select
  'SP' || (20260000 + g),
  'Khách hàng ' || g,
  '09' || lpad((g % 100000000)::text, 8, '0'),
  'Địa chỉ ' || g || ', TP. Hồ Chí Minh',
  (50000 + (g * 97) % 950000)::numeric,
  (array['pending','shipping','done','cancelled'])[1 + (g % 4)],
  now() - ((g % 365) || '1 day')::interval
from generate_series(1, 10000) as g
on conflict do nothing;

-- 7. Seed sample order_items (1-3 per order)
insert into order_items (order_id, product_id, name, price, qty)
select
  o.id,
  1 + (o.id * 37) % 100000,
  'Sản phẩm ' || (1 + (o.id * 37) % 100000),
  (10000 + ((o.id * 37) % 100000 * 137) % 990000)::numeric,
  1 + (o.id % 3)
from orders o
limit 10000
on conflict do nothing;

-- 8. Seed sample reviews (20,000)
insert into reviews (product_id, user_name, rating, content, created_at)
select
  1 + (g % 100000),
  'Người dùng ' || g,
  3 + (g % 3),
  'Đánh giá ' || g || ': sản phẩm tốt, giao nhanh.',
  now() - ((g % 365) || '1 day')::interval
from generate_series(1, 20000) as g
on conflict do nothing;

-- NOTE: 3,000,000 users requires a separate auth.users seeding via Supabase Auth Admin API
-- or a paid plan with bulk insert permissions. The `users` table above mirrors auth.users.
-- To scale orders to millions, change the generate_series upper bound and run in batches.

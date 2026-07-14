create extension if not exists pgcrypto;

create type public.app_role as enum ('admin', 'manager', 'editor', 'customer');
create type public.product_status as enum ('draft', 'published', 'hidden', 'archived');
create type public.order_status as enum (
  'pending', 'confirmed', 'preparing', 'ready_to_ship', 'shipped',
  'out_for_delivery', 'delivered', 'cancelled', 'returned', 'refunded'
);
create type public.payment_status as enum ('unpaid', 'paid', 'partial', 'refunded', 'partially_refunded');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text,
  role public.app_role not null default 'customer',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  image_url text,
  banner_url text,
  is_featured boolean not null default false,
  show_on_homepage boolean not null default false,
  show_in_menu boolean not null default true,
  seo jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.collections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  image_url text,
  collection_type text not null default 'manual',
  match_type text not null default 'any',
  rules jsonb not null default '[]'::jsonb,
  product_ids uuid[] not null default '{}',
  is_active boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 200),
  slug text not null unique,
  sku text not null unique,
  barcode text,
  short_description text not null default '',
  description text not null default '',
  category text not null default '',
  collection text not null default '',
  season text not null default 'all',
  brand text not null default 'Soft Muse',
  tags text[] not null default '{}',
  price bigint not null check (price >= 0),
  compare_price bigint not null default 0 check (compare_price >= 0),
  cost_price bigint not null default 0 check (cost_price >= 0),
  stock integer not null default 0 check (stock >= 0),
  low_stock_limit integer not null default 5 check (low_stock_limit >= 0),
  material text not null default '',
  weight numeric(10, 3) not null default 0 check (weight >= 0),
  featured boolean not null default false,
  best_seller boolean not null default false,
  new_arrival boolean not null default false,
  status public.product_status not null default 'draft',
  publish_at timestamptz,
  hide_at timestamptz,
  badge text,
  details text[] not null default '{}',
  fabric text not null default '',
  packaging text not null default '',
  colors text[] not null default '{}',
  sizes text[] not null default '{}',
  costing jsonb not null default '{}'::jsonb,
  seo jsonb not null default '{}'::jsonb,
  stats jsonb not null default '{"views":0,"orders":0,"revenue":0,"wishlistCount":0,"cartCount":0,"reviewsCount":0}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint valid_compare_price check (compare_price = 0 or compare_price >= price)
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  alt_text text not null default '',
  sort_order integer not null default 0,
  unique(product_id, url)
);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  sku text not null unique,
  color text not null default '',
  color_value text,
  size text not null default '',
  price bigint not null check (price >= 0),
  cost bigint not null default 0 check (cost >= 0),
  stock integer not null default 0 check (stock >= 0),
  weight numeric(10, 3) not null default 0,
  image_url text,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete set null,
  customer_number text not null unique default ('SM-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  full_name text not null,
  email text not null,
  phone text not null,
  status text not null default 'active' check (status in ('active', 'inactive', 'blocked')),
  total_orders integer not null default 0,
  total_spent bigint not null default 0,
  notes text not null default '',
  gender text not null default 'unspecified',
  marketing_consent boolean not null default false,
  tags text[] not null default '{}',
  internal_notes jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index customers_email_unique on public.customers(lower(email));

create table public.customer_addresses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  label text not null default 'Địa chỉ nhận hàng',
  recipient_name text not null,
  phone text not null,
  address_line text not null,
  ward text not null default '',
  district text not null default '',
  province text not null default '',
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  discount_type text not null check (discount_type in ('percentage', 'fixed', 'shipping')),
  discount_value bigint not null check (discount_value >= 0),
  minimum_order bigint not null default 0,
  maximum_discount bigint,
  usage_limit integer,
  used_count integer not null default 0,
  starts_at timestamptz,
  expires_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_id uuid references public.customers(id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  customer_notes text not null default '',
  subtotal bigint not null check (subtotal >= 0),
  discount bigint not null default 0 check (discount >= 0),
  tax bigint not null default 0 check (tax >= 0),
  shipping bigint not null default 0 check (shipping >= 0),
  total bigint not null check (total >= 0),
  status public.order_status not null default 'pending',
  payment_status public.payment_status not null default 'unpaid',
  fulfillment_status text not null default 'unfulfilled',
  payment_method text not null default 'cod',
  shipping_method text not null default 'standard',
  shipping_address text not null,
  shipping_company text,
  tracking_number text,
  courier_name text,
  coupon_id uuid references public.coupons(id) on delete set null,
  coupon_code text,
  internal_notes jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  product_name text not null,
  sku text not null,
  quantity integer not null check (quantity > 0),
  price bigint not null check (price >= 0),
  total bigint generated always as (quantity * price) stored,
  image_url text,
  size text,
  color text
);

create table public.order_timeline (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  status public.order_status not null,
  note text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  customer_name text not null,
  customer_email text not null default '',
  customer_avatar text,
  rating smallint not null check (rating between 1 and 5),
  title text not null default '',
  content text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  is_featured boolean not null default false,
  is_pinned boolean not null default false,
  verified_purchase boolean not null default false,
  admin_reply text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table public.audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.stock_movements (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  variant_id uuid references public.product_variants(id) on delete set null,
  movement_type text not null,
  quantity integer not null,
  balance_before integer not null,
  balance_after integer not null,
  reason text not null,
  reference_type text,
  reference_id text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
create index stock_movements_product_idx on public.stock_movements(product_id, created_at desc);

create index products_status_idx on public.products(status);
create index products_category_idx on public.products(category);
create index products_created_at_idx on public.products(created_at desc);
create index product_variants_product_idx on public.product_variants(product_id);
create index orders_customer_idx on public.orders(customer_id);
create index orders_created_at_idx on public.orders(created_at desc);
create index orders_status_idx on public.orders(status);
create index order_items_order_idx on public.order_items(order_id);
create index reviews_product_idx on public.reviews(product_id);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_updated_at before update on public.products for each row execute function public.set_updated_at();
create trigger variants_updated_at before update on public.product_variants for each row execute function public.set_updated_at();
create trigger customers_updated_at before update on public.customers for each row execute function public.set_updated_at();
create trigger orders_updated_at before update on public.orders for each row execute function public.set_updated_at();
create trigger coupons_updated_at before update on public.coupons for each row execute function public.set_updated_at();
create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''), new.raw_user_meta_data ->> 'phone')
  on conflict (id) do nothing;
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role in ('admin', 'manager', 'editor')
  );
$$;

create or replace function public.create_storefront_order(payload jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  new_customer public.customers;
  new_order public.orders;
  item jsonb;
  product_row public.products;
  variant_row public.product_variants;
  calculated_subtotal bigint := 0;
  calculated_discount bigint := 0;
  shipping_fee bigint := 0;
  coupon_row public.coupons;
  generated_number text;
begin
  if jsonb_array_length(coalesce(payload -> 'items', '[]'::jsonb)) = 0 then
    raise exception 'Giỏ hàng đang trống';
  end if;
  if nullif(trim(payload ->> 'customer_name'), '') is null
    or nullif(trim(payload ->> 'customer_email'), '') is null
    or nullif(trim(payload ->> 'customer_phone'), '') is null
    or nullif(trim(payload ->> 'shipping_address'), '') is null then
    raise exception 'Thông tin nhận hàng chưa đầy đủ';
  end if;

  for item in select * from jsonb_array_elements(payload -> 'items') loop
    select * into product_row from public.products
    where id = (item ->> 'product_id')::uuid and status = 'published' for update;
    if not found then raise exception 'Sản phẩm không tồn tại hoặc đã ngừng bán'; end if;

    if nullif(item ->> 'variant_id', '') is not null then
      select * into variant_row from public.product_variants
      where id = (item ->> 'variant_id')::uuid and product_id = product_row.id and status = 'active' for update;
      if not found or variant_row.stock < (item ->> 'quantity')::integer then
        raise exception 'Phân loại % không đủ tồn kho', product_row.name;
      end if;
      calculated_subtotal := calculated_subtotal + variant_row.price * (item ->> 'quantity')::integer;
    else
      if product_row.stock < (item ->> 'quantity')::integer then
        raise exception 'Sản phẩm % không đủ tồn kho', product_row.name;
      end if;
      calculated_subtotal := calculated_subtotal + product_row.price * (item ->> 'quantity')::integer;
    end if;
  end loop;

  if nullif(upper(trim(payload ->> 'coupon_code')), '') is not null then
    select * into coupon_row from public.coupons
    where upper(code) = upper(trim(payload ->> 'coupon_code')) and is_active
      and (starts_at is null or starts_at <= now())
      and (expires_at is null or expires_at > now())
      and (usage_limit is null or used_count < usage_limit)
    for update;
    if not found then raise exception 'Mã giảm giá không hợp lệ hoặc đã hết hạn'; end if;
    if calculated_subtotal < coupon_row.minimum_order then raise exception 'Đơn hàng chưa đạt giá trị tối thiểu của mã giảm giá'; end if;
    if coupon_row.discount_type = 'percentage' then
      calculated_discount := floor(calculated_subtotal * coupon_row.discount_value / 100.0);
      if coupon_row.maximum_discount is not null then calculated_discount := least(calculated_discount, coupon_row.maximum_discount); end if;
    elsif coupon_row.discount_type = 'fixed' then
      calculated_discount := least(coupon_row.discount_value, calculated_subtotal);
    end if;
  end if;

  shipping_fee := case when calculated_subtotal - calculated_discount >= 800000 then 0 else 30000 end;
  if found and coupon_row.discount_type = 'shipping' then shipping_fee := 0; end if;

  insert into public.customers (full_name, email, phone)
  values (trim(payload ->> 'customer_name'), lower(trim(payload ->> 'customer_email')), trim(payload ->> 'customer_phone'))
  on conflict (lower(email)) do update set
    full_name = excluded.full_name, phone = excluded.phone, updated_at = now()
  returning * into new_customer;

  generated_number := 'SM' || to_char(now(), 'YYMMDD') || '-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));
  insert into public.orders (
    order_number, customer_id, customer_name, customer_email, customer_phone, customer_notes,
    subtotal, discount, shipping, total, payment_method, shipping_method, shipping_address,
    coupon_id, coupon_code
  ) values (
    generated_number, new_customer.id, new_customer.full_name, new_customer.email, new_customer.phone,
    coalesce(payload ->> 'customer_notes', ''), calculated_subtotal, calculated_discount, shipping_fee,
    calculated_subtotal - calculated_discount + shipping_fee,
    coalesce(nullif(payload ->> 'payment_method', ''), 'cod'),
    coalesce(nullif(payload ->> 'shipping_method', ''), 'standard'), trim(payload ->> 'shipping_address'),
    coupon_row.id, coupon_row.code
  ) returning * into new_order;

  for item in select * from jsonb_array_elements(payload -> 'items') loop
    select * into product_row from public.products where id = (item ->> 'product_id')::uuid;
    if nullif(item ->> 'variant_id', '') is not null then
      select * into variant_row from public.product_variants where id = (item ->> 'variant_id')::uuid;
      update public.product_variants set stock = stock - (item ->> 'quantity')::integer where id = variant_row.id;
      insert into public.order_items (order_id, product_id, variant_id, product_name, sku, quantity, price, image_url, size, color)
      values (new_order.id, product_row.id, variant_row.id, product_row.name, variant_row.sku,
        (item ->> 'quantity')::integer, variant_row.price, item ->> 'image_url', variant_row.size, variant_row.color);
    else
      update public.products set stock = stock - (item ->> 'quantity')::integer where id = product_row.id;
      insert into public.order_items (order_id, product_id, product_name, sku, quantity, price, image_url, size, color)
      values (new_order.id, product_row.id, product_row.name, product_row.sku,
        (item ->> 'quantity')::integer, product_row.price, item ->> 'image_url', item ->> 'size', item ->> 'color');
    end if;
  end loop;

  insert into public.order_timeline(order_id, status, note) values (new_order.id, 'pending', 'Đơn hàng đã được tiếp nhận');
  update public.customers set total_orders = total_orders + 1, total_spent = total_spent + new_order.total where id = new_customer.id;
  if coupon_row.id is not null then update public.coupons set used_count = used_count + 1 where id = coupon_row.id; end if;

  return jsonb_build_object('id', new_order.id, 'order_number', new_order.order_number, 'total', new_order.total);
end;
$$;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.collections enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;
alter table public.customers enable row level security;
alter table public.customer_addresses enable row level security;
alter table public.coupons enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_timeline enable row level security;
alter table public.reviews enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.site_settings enable row level security;
alter table public.audit_logs enable row level security;
alter table public.stock_movements enable row level security;

create policy "Public reads published products" on public.products for select to anon, authenticated using (status = 'published' or public.is_staff());
create policy "Public reads product images" on public.product_images for select to anon, authenticated using (exists (select 1 from public.products p where p.id = product_id and (p.status = 'published' or public.is_staff())));
create policy "Public reads active variants" on public.product_variants for select to anon, authenticated using (status = 'active' and exists (select 1 from public.products p where p.id = product_id and (p.status = 'published' or public.is_staff())));
create policy "Public reads categories" on public.categories for select to anon, authenticated using (is_active or public.is_staff());
create policy "Public reads collections" on public.collections for select to anon, authenticated using (is_active or public.is_staff());
create policy "Public reads approved reviews" on public.reviews for select to anon, authenticated using (status = 'approved' or public.is_staff());
create policy "Anyone submits reviews" on public.reviews for insert to anon, authenticated with check (status = 'pending');
create policy "Anyone subscribes newsletter" on public.newsletter_subscribers for insert to anon, authenticated with check (true);
create policy "Users read own profile" on public.profiles for select to authenticated using (id = (select auth.uid()) or public.is_staff());
create policy "Users update own profile" on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy "Customers read own record" on public.customers for select to authenticated using (user_id = (select auth.uid()) or public.is_staff());
create policy "Customers read own orders" on public.orders for select to authenticated using (customer_id in (select id from public.customers where user_id = (select auth.uid())) or public.is_staff());
create policy "Customers read own order items" on public.order_items for select to authenticated using (order_id in (select id from public.orders where customer_id in (select id from public.customers where user_id = (select auth.uid()))) or public.is_staff());
create policy "Customers read own order timeline" on public.order_timeline for select to authenticated using (order_id in (select id from public.orders where customer_id in (select id from public.customers where user_id = (select auth.uid()))) or public.is_staff());

create policy "Staff manages products" on public.products for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "Staff manages images" on public.product_images for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "Staff manages variants" on public.product_variants for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "Staff manages categories" on public.categories for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "Staff manages collections" on public.collections for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "Staff manages customers" on public.customers for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "Staff manages addresses" on public.customer_addresses for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "Staff manages coupons" on public.coupons for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "Staff manages orders" on public.orders for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "Staff manages order items" on public.order_items for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "Staff manages timeline" on public.order_timeline for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "Staff manages reviews" on public.reviews for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "Staff manages subscribers" on public.newsletter_subscribers for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "Staff manages settings" on public.site_settings for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "Staff reads audit logs" on public.audit_logs for select to authenticated using (public.is_staff());
create policy "Staff manages stock movements" on public.stock_movements for all to authenticated using (public.is_staff()) with check (public.is_staff());

revoke update on public.profiles from authenticated;
grant update(full_name, phone, avatar_url) on public.profiles to authenticated;

grant execute on function public.create_storefront_order(jsonb) to anon, authenticated;
grant execute on function public.is_staff() to anon, authenticated;

create or replace function public.validate_coupon(coupon_code text, order_subtotal bigint)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  coupon_row public.coupons;
  amount bigint := 0;
begin
  select * into coupon_row from public.coupons
  where upper(code) = upper(trim(coupon_code)) and is_active
    and (starts_at is null or starts_at <= now())
    and (expires_at is null or expires_at > now())
    and (usage_limit is null or used_count < usage_limit);
  if not found then return jsonb_build_object('valid', false, 'error', 'Mã giảm giá không hợp lệ hoặc đã hết hạn'); end if;
  if order_subtotal < coupon_row.minimum_order then
    return jsonb_build_object('valid', false, 'error', 'Đơn hàng chưa đạt giá trị tối thiểu');
  end if;
  if coupon_row.discount_type = 'percentage' then
    amount := floor(order_subtotal * coupon_row.discount_value / 100.0);
    if coupon_row.maximum_discount is not null then amount := least(amount, coupon_row.maximum_discount); end if;
  elsif coupon_row.discount_type = 'fixed' then
    amount := least(coupon_row.discount_value, order_subtotal);
  end if;
  return jsonb_build_object(
    'valid', true, 'discount_amount', amount, 'id', coupon_row.id, 'code', coupon_row.code,
    'discount_type', coupon_row.discount_type, 'discount_value', coupon_row.discount_value,
    'minimum_order', coupon_row.minimum_order, 'maximum_discount', coupon_row.maximum_discount
  );
end;
$$;
grant execute on function public.validate_coupon(text, bigint) to anon, authenticated;

create or replace function public.change_order_status(target_order_id uuid, next_status public.order_status, status_note text default null)
returns void language plpgsql security definer set search_path = '' as $$
declare
  previous_status public.order_status;
  order_item record;
begin
  if not public.is_staff() then raise exception 'Không có quyền quản trị'; end if;
  select status into previous_status from public.orders where id = target_order_id for update;
  if not found then raise exception 'Không tìm thấy đơn hàng'; end if;

  if next_status in ('cancelled', 'returned', 'refunded') and previous_status not in ('cancelled', 'returned', 'refunded') then
    for order_item in select * from public.order_items where order_id = target_order_id loop
      if order_item.variant_id is not null then
        update public.product_variants set stock = stock + order_item.quantity where id = order_item.variant_id;
      elsif order_item.product_id is not null then
        update public.products set stock = stock + order_item.quantity where id = order_item.product_id;
      end if;
    end loop;
  end if;

  update public.orders set status = next_status,
    fulfillment_status = case next_status
      when 'delivered' then 'fulfilled' when 'cancelled' then 'cancelled'
      when 'shipped' then 'shipped' when 'ready_to_ship' then 'ready_to_ship'
      else 'processing' end
  where id = target_order_id;
  insert into public.order_timeline(order_id, status, note, created_by)
  values (target_order_id, next_status, status_note, (select auth.uid()));
end;
$$;
grant execute on function public.change_order_status(uuid, public.order_status, text) to authenticated;

create or replace function public.track_order(order_code text, contact_value text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  order_row public.orders;
  result jsonb;
begin
  select * into order_row from public.orders
  where upper(replace(order_number, '#', '')) = upper(replace(trim(order_code), '#', ''))
    and (
      lower(customer_email) = lower(trim(contact_value))
      or regexp_replace(customer_phone, '[^0-9]', '', 'g') = regexp_replace(contact_value, '[^0-9]', '', 'g')
    );
  if not found then return null; end if;

  result := to_jsonb(order_row);
  result := result || jsonb_build_object(
    'order_items', coalesce((select jsonb_agg(to_jsonb(i)) from public.order_items i where i.order_id = order_row.id), '[]'::jsonb),
    'order_timeline', coalesce((select jsonb_agg(to_jsonb(t) order by t.created_at desc) from public.order_timeline t where t.order_id = order_row.id), '[]'::jsonb)
  );
  return result;
end;
$$;
grant execute on function public.track_order(text, text) to anon, authenticated;

create or replace function public.adjust_inventory(
  target_product_id uuid, target_variant_id uuid, quantity_change integer,
  movement_reason text, movement_kind text default 'adjustment',
  ref_type text default null, ref_id text default null
) returns uuid language plpgsql security definer set search_path = '' as $$
declare before_stock integer; after_stock integer; movement_id uuid;
begin
  if not public.is_staff() then raise exception 'Không có quyền quản lý tồn kho'; end if;
  if target_variant_id is not null then
    select stock into before_stock from public.product_variants where id = target_variant_id and product_id = target_product_id for update;
    if not found then raise exception 'Không tìm thấy biến thể'; end if;
    after_stock := before_stock + quantity_change;
    if after_stock < 0 then raise exception 'Tồn kho không đủ'; end if;
    update public.product_variants set stock = after_stock where id = target_variant_id;
  else
    select stock into before_stock from public.products where id = target_product_id for update;
    if not found then raise exception 'Không tìm thấy sản phẩm'; end if;
    after_stock := before_stock + quantity_change;
    if after_stock < 0 then raise exception 'Tồn kho không đủ'; end if;
    update public.products set stock = after_stock where id = target_product_id;
  end if;
  insert into public.stock_movements(product_id, variant_id, movement_type, quantity, balance_before, balance_after, reason, reference_type, reference_id, created_by)
  values(target_product_id, target_variant_id, movement_kind, quantity_change, before_stock, after_stock, movement_reason, ref_type, ref_id, (select auth.uid()))
  returning id into movement_id;
  return movement_id;
end;
$$;
grant execute on function public.adjust_inventory(uuid, uuid, integer, text, text, text, text) to authenticated;

create or replace function public.edit_stock_movement(target_movement_id uuid, new_quantity integer, new_reason text)
returns void language plpgsql security definer set search_path = '' as $$
declare movement public.stock_movements; difference integer; current_stock integer;
begin
  if not public.is_staff() then raise exception 'Không có quyền quản lý tồn kho'; end if;
  select * into movement from public.stock_movements where id = target_movement_id for update;
  if not found or movement.movement_type <> 'adjustment' then raise exception 'Chỉ được sửa điều chỉnh kho thủ công'; end if;
  difference := new_quantity - movement.quantity;
  if movement.variant_id is not null then
    select stock into current_stock from public.product_variants where id = movement.variant_id for update;
    if current_stock + difference < 0 then raise exception 'Tồn kho không đủ'; end if;
    update public.product_variants set stock = stock + difference where id = movement.variant_id;
  else
    select stock into current_stock from public.products where id = movement.product_id for update;
    if current_stock + difference < 0 then raise exception 'Tồn kho không đủ'; end if;
    update public.products set stock = stock + difference where id = movement.product_id;
  end if;
  update public.stock_movements set quantity = new_quantity, balance_after = balance_before + new_quantity, reason = new_reason where id = target_movement_id;
end;
$$;
grant execute on function public.edit_stock_movement(uuid, integer, text) to authenticated;

create or replace function public.delete_stock_movement(target_movement_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare movement public.stock_movements; current_stock integer;
begin
  if not public.is_staff() then raise exception 'Không có quyền quản lý tồn kho'; end if;
  select * into movement from public.stock_movements where id = target_movement_id for update;
  if not found or movement.movement_type <> 'adjustment' then raise exception 'Chỉ được xóa điều chỉnh kho thủ công'; end if;
  if movement.variant_id is not null then
    select stock into current_stock from public.product_variants where id = movement.variant_id for update;
    if current_stock - movement.quantity < 0 then raise exception 'Không thể hoàn tác vì tồn kho sẽ âm'; end if;
    update public.product_variants set stock = stock - movement.quantity where id = movement.variant_id;
  else
    select stock into current_stock from public.products where id = movement.product_id for update;
    if current_stock - movement.quantity < 0 then raise exception 'Không thể hoàn tác vì tồn kho sẽ âm'; end if;
    update public.products set stock = stock - movement.quantity where id = movement.product_id;
  end if;
  delete from public.stock_movements where id = target_movement_id;
end;
$$;
grant execute on function public.delete_stock_movement(uuid) to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do nothing;

create policy "Public reads product image files" on storage.objects for select to public using (bucket_id = 'product-images');
create policy "Staff uploads product image files" on storage.objects for insert to authenticated with check (bucket_id = 'product-images' and public.is_staff());
create policy "Staff updates product image files" on storage.objects for update to authenticated using (bucket_id = 'product-images' and public.is_staff()) with check (bucket_id = 'product-images' and public.is_staff());
create policy "Staff deletes product image files" on storage.objects for delete to authenticated using (bucket_id = 'product-images' and public.is_staff());

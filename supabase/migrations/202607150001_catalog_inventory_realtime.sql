-- Catalog, inventory and storefront consistency hardening.

-- ---------------------------------------------------------------------------
-- Catalog integrity
-- ---------------------------------------------------------------------------
create unique index if not exists categories_name_unique_ci
  on public.categories (lower(btrim(name)));
create unique index if not exists collections_name_unique_ci
  on public.collections (lower(btrim(name)));

alter table public.customer_addresses add column if not exists building text not null default '';
alter table public.customer_addresses add column if not exists floor text not null default '';
alter table public.customer_addresses add column if not exists apartment text not null default '';
alter table public.customer_addresses add column if not exists postal_code text not null default '';
alter table public.customer_addresses add column if not exists country text not null default 'Việt Nam';
alter table public.order_items add column if not exists cost_price bigint not null default 0 check (cost_price >= 0);

create or replace function public.snapshot_order_item_cost()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.variant_id is not null then
    select cost into new.cost_price from public.product_variants where id = new.variant_id;
  elsif new.product_id is not null then
    select cost_price into new.cost_price from public.products where id = new.product_id;
  end if;
  new.cost_price := coalesce(new.cost_price, 0);
  return new;
end;
$$;
drop trigger if exists order_items_snapshot_cost on public.order_items;
create trigger order_items_snapshot_cost before insert on public.order_items
for each row execute function public.snapshot_order_item_cost();

update public.order_items item set cost_price = case when item.variant_id is null then product.cost_price else coalesce((select variant.cost from public.product_variants variant where variant.id = item.variant_id), product.cost_price) end
from public.products product
where item.product_id = product.id
  and item.cost_price = 0;

alter table public.products add column if not exists category_id uuid
  references public.categories(id) on delete set null;
alter table public.products add column if not exists primary_collection_id uuid
  references public.collections(id) on delete set null;
create index if not exists products_category_id_idx on public.products(category_id);
create index if not exists products_primary_collection_id_idx on public.products(primary_collection_id);

update public.products product
set category_id = category.id,
    category = category.name
from public.categories category
where product.category_id is null
  and (lower(btrim(product.category)) = lower(btrim(category.name))
    or lower(btrim(product.category)) = lower(btrim(category.slug)));

update public.products product
set category_id = category.id,
    category = category.name
from public.categories category
where product.category_id is null
  and nullif(btrim(product.category), '') is not null
  and lower(btrim(category.name)) like '%' || lower(btrim(product.category)) || '%';

update public.products product
set primary_collection_id = collection.id,
    collection = collection.name
from public.collections collection
where product.primary_collection_id is null
  and (lower(btrim(product.collection)) = lower(btrim(collection.name))
    or lower(btrim(product.collection)) = lower(btrim(collection.slug)));

create or replace function public.sync_product_catalog_references()
returns trigger
language plpgsql
set search_path = ''
as $$
declare resolved_category public.categories; resolved_collection public.collections;
begin
  if new.category_id is not null then
    select * into resolved_category from public.categories where id = new.category_id;
    if not found then raise exception 'Danh mục không tồn tại.'; end if;
    new.category := resolved_category.name;
  elsif nullif(btrim(new.category), '') is not null then
    select * into resolved_category from public.categories
    where lower(btrim(name)) = lower(btrim(new.category))
       or lower(btrim(slug)) = lower(btrim(new.category))
    limit 1;
    if found then new.category_id := resolved_category.id; new.category := resolved_category.name; end if;
  else
    new.category_id := null;
    new.category := '';
  end if;

  if new.primary_collection_id is not null then
    select * into resolved_collection from public.collections where id = new.primary_collection_id;
    if not found then raise exception 'Bộ sưu tập không tồn tại.'; end if;
    new.collection := resolved_collection.name;
  elsif nullif(btrim(new.collection), '') is not null then
    select * into resolved_collection from public.collections
    where lower(btrim(name)) = lower(btrim(new.collection))
       or lower(btrim(slug)) = lower(btrim(new.collection))
    limit 1;
    if found then new.primary_collection_id := resolved_collection.id; new.collection := resolved_collection.name; end if;
  else
    new.primary_collection_id := null;
    new.collection := '';
  end if;
  return new;
end;
$$;
drop trigger if exists products_sync_catalog_references on public.products;
create trigger products_sync_catalog_references
before insert or update of category, category_id, collection, primary_collection_id on public.products
for each row execute function public.sync_product_catalog_references();

create or replace function public.sync_category_product_labels()
returns trigger language plpgsql set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    update public.products set category_id = new.id, category = new.name
    where category_id is null and (lower(btrim(category)) = lower(btrim(new.name))
      or lower(btrim(new.name)) like '%' || lower(btrim(category)) || '%');
  elsif old.name is distinct from new.name then
    update public.products set category = new.name where category_id = new.id;
  end if;
  return new;
end;
$$;
drop trigger if exists categories_sync_product_labels on public.categories;
create trigger categories_sync_product_labels after insert or update of name on public.categories
for each row execute function public.sync_category_product_labels();

create or replace function public.sync_collection_product_labels()
returns trigger language plpgsql set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    update public.products set primary_collection_id = new.id, collection = new.name
    where primary_collection_id is null and (lower(btrim(collection)) = lower(btrim(new.name))
      or lower(btrim(collection)) = lower(btrim(new.slug)));
  elsif old.name is distinct from new.name then
    update public.products set collection = new.name where primary_collection_id = new.id;
  end if;
  return new;
end;
$$;
drop trigger if exists collections_sync_product_labels on public.collections;
create trigger collections_sync_product_labels after insert or update of name on public.collections
for each row execute function public.sync_collection_product_labels();

-- Preserve variant IDs so order lines and stock history remain connected when
-- an administrator edits ordinary product information.
create or replace function public.replace_product_relations(
  target_product_id uuid,
  image_payload jsonb,
  variant_payload jsonb
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  item jsonb;
  desired_ids uuid[] := '{}';
  variant_id uuid;
  requested_id uuid;
begin
  if not public.has_role(array['admin','manager','editor']::public.app_role[]) then
    raise exception 'Bạn không có quyền cập nhật sản phẩm.' using errcode = '42501';
  end if;
  if not exists(select 1 from public.products where id = target_product_id for update) then
    raise exception 'Không tìm thấy sản phẩm.' using errcode = 'P0002';
  end if;

  delete from public.product_images where product_id = target_product_id;
  for item in select * from jsonb_array_elements(coalesce(image_payload, '[]'::jsonb)) loop
    if nullif(btrim(item->>'url'), '') is null then continue; end if;
    insert into public.product_images(product_id, url, alt_text, sort_order)
    values(target_product_id, btrim(item->>'url'), coalesce(item->>'altText', ''), coalesce((item->>'sortOrder')::integer, 0));
  end loop;

  for item in select * from jsonb_array_elements(coalesce(variant_payload, '[]'::jsonb)) loop
    if nullif(btrim(item->>'sku'), '') is null then raise exception 'Mỗi biến thể phải có SKU.'; end if;
    requested_id := null;
    begin requested_id := nullif(item->>'id', '')::uuid; exception when invalid_text_representation then requested_id := null; end;
    select id into variant_id from public.product_variants
      where product_id = target_product_id
        and (id = requested_id or lower(sku) = lower(btrim(item->>'sku')))
      order by (id = requested_id) desc limit 1;
    if found then
      update public.product_variants set
        sku = upper(btrim(item->>'sku')), color = coalesce(btrim(item->>'color'), ''),
        size = coalesce(btrim(item->>'size'), ''), price = coalesce((item->>'price')::bigint, 0),
        cost = coalesce((item->>'cost')::bigint, 0), stock = coalesce((item->>'stock')::integer, 0),
        weight = coalesce((item->>'weight')::numeric, 0), image_url = nullif(btrim(item->>'image'), ''),
        status = case when item->>'status' = 'inactive' then 'inactive' else 'active' end
      where id = variant_id;
    else
      insert into public.product_variants(product_id, sku, color, size, price, cost, stock, weight, image_url, status)
      values(target_product_id, upper(btrim(item->>'sku')), coalesce(btrim(item->>'color'), ''),
        coalesce(btrim(item->>'size'), ''), coalesce((item->>'price')::bigint, 0),
        coalesce((item->>'cost')::bigint, 0), coalesce((item->>'stock')::integer, 0),
        coalesce((item->>'weight')::numeric, 0), nullif(btrim(item->>'image'), ''),
        case when item->>'status' = 'inactive' then 'inactive' else 'active' end)
      returning id into variant_id;
    end if;
    desired_ids := array_append(desired_ids, variant_id);
  end loop;
  delete from public.product_variants
  where product_id = target_product_id and not (id = any(desired_ids));
end;
$$;
revoke all on function public.replace_product_relations(uuid, jsonb, jsonb) from public;
grant execute on function public.replace_product_relations(uuid, jsonb, jsonb) to authenticated;

-- ---------------------------------------------------------------------------
-- Inventory ledger integrity
-- ---------------------------------------------------------------------------
create or replace function public.reverse_stock_movement(target_movement_id uuid, reversal_reason text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare original public.stock_movements; reversal_id uuid;
begin
  if not public.has_role(array['admin','manager']::public.app_role[]) then
    raise exception 'Không có quyền quản lý tồn kho' using errcode = '42501';
  end if;
  select * into original from public.stock_movements where id = target_movement_id for update;
  if not found or original.movement_type <> 'adjustment' then
    raise exception 'Chỉ được hoàn tác điều chỉnh kho thủ công.';
  end if;
  if exists(select 1 from public.stock_movements where reference_type = 'adjustment' and reference_id = target_movement_id::text) then
    raise exception 'Điều chỉnh này đã được hoàn tác.';
  end if;
  select public.adjust_inventory(original.product_id, original.variant_id, -original.quantity,
    coalesce(nullif(btrim(reversal_reason), ''), 'Hoàn tác điều chỉnh kho'), 'adjustment',
    'adjustment', target_movement_id::text) into reversal_id;
  return reversal_id;
end;
$$;
revoke all on function public.reverse_stock_movement(uuid, text) from public;
grant execute on function public.reverse_stock_movement(uuid, text) to authenticated;

create or replace function public.refresh_customer_order_aggregates()
returns trigger language plpgsql security definer set search_path = '' as $$
declare affected_customer uuid;
begin
  if tg_op in ('UPDATE', 'DELETE') and old.customer_id is not null then
    affected_customer := old.customer_id;
    update public.customers customer set
      total_orders = (select count(*) from public.orders o where o.customer_id = affected_customer and o.archived_at is null and o.status <> 'cancelled'),
      total_spent = (select coalesce(sum(o.total), 0) from public.orders o where o.customer_id = affected_customer and o.archived_at is null and o.status = 'delivered')
    where customer.id = affected_customer;
  end if;
  if tg_op in ('INSERT', 'UPDATE') and new.customer_id is not null
    and (tg_op = 'INSERT' or new.customer_id is distinct from old.customer_id or new.status is distinct from old.status or new.archived_at is distinct from old.archived_at) then
    affected_customer := new.customer_id;
    update public.customers customer set
      total_orders = (select count(*) from public.orders o where o.customer_id = affected_customer and o.archived_at is null and o.status <> 'cancelled'),
      total_spent = (select coalesce(sum(o.total), 0) from public.orders o where o.customer_id = affected_customer and o.archived_at is null and o.status = 'delivered')
    where customer.id = affected_customer;
  end if;
  return coalesce(new, old);
end;
$$;
drop trigger if exists orders_refresh_customer_aggregates on public.orders;
create trigger orders_refresh_customer_aggregates
after insert or update or delete on public.orders
for each row execute function public.refresh_customer_order_aggregates();

-- ---------------------------------------------------------------------------
-- Coupon and review rules
-- ---------------------------------------------------------------------------
alter table public.coupons add column if not exists per_customer_limit integer not null default 1;
alter table public.coupons drop constraint if exists coupons_percentage_value_check;
alter table public.coupons add constraint coupons_percentage_value_check
  check (discount_type <> 'percentage' or discount_value between 1 and 100);
alter table public.coupons drop constraint if exists coupons_usage_limit_check;
alter table public.coupons add constraint coupons_usage_limit_check
  check (usage_limit is null or usage_limit > 0);
alter table public.coupons drop constraint if exists coupons_per_customer_limit_check;
alter table public.coupons add constraint coupons_per_customer_limit_check
  check (per_customer_limit > 0);
alter table public.coupons drop constraint if exists coupons_date_range_check;
alter table public.coupons add constraint coupons_date_range_check
  check (expires_at is null or starts_at is null or expires_at > starts_at);

create or replace function public.enforce_order_coupon_limit()
returns trigger language plpgsql security definer set search_path = '' as $$
declare coupon public.coupons; customer_usage integer;
begin
  if new.coupon_id is null then return new; end if;
  select * into coupon from public.coupons where id = new.coupon_id for update;
  if not found or not coupon.is_active
    or (coupon.starts_at is not null and coupon.starts_at > now())
    or (coupon.expires_at is not null and coupon.expires_at <= now()) then
    raise exception 'Mã giảm giá không còn hiệu lực.';
  end if;
  if new.subtotal < coupon.minimum_order then raise exception 'Đơn hàng chưa đạt giá trị tối thiểu của mã giảm giá.'; end if;
  if coupon.usage_limit is not null and coupon.used_count >= coupon.usage_limit then raise exception 'Mã giảm giá đã hết lượt sử dụng.'; end if;
  if new.customer_id is not null then
    select count(*) into customer_usage from public.orders
    where customer_id = new.customer_id and coupon_id = new.coupon_id and status <> 'cancelled';
    if customer_usage >= coupon.per_customer_limit then raise exception 'Khách hàng đã dùng hết lượt của mã giảm giá này.'; end if;
  end if;
  return new;
end;
$$;
drop trigger if exists orders_enforce_coupon_limit on public.orders;
create trigger orders_enforce_coupon_limit before insert on public.orders
for each row execute function public.enforce_order_coupon_limit();

create or replace function public.verify_review_purchase()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  new.status := 'pending';
  new.is_featured := false;
  new.is_pinned := false;
  new.admin_reply := null;
  new.verified_purchase := exists(
    select 1 from public.orders o
    join public.order_items i on i.order_id = o.id
    where i.product_id = new.product_id
      and lower(o.customer_email) = lower(new.customer_email)
      and o.status = 'delivered'
  );
  return new;
end;
$$;
drop trigger if exists reviews_verify_purchase on public.reviews;
create trigger reviews_verify_purchase before insert on public.reviews
for each row execute function public.verify_review_purchase();

drop policy if exists "Public reads storefront settings" on public.site_settings;
create policy "Public reads storefront settings" on public.site_settings for select to anon, authenticated
using (key like 'storefront.%');

create or replace function public.subscribe_newsletter(subscriber_email text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if subscriber_email !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$' then raise exception 'Email không hợp lệ.'; end if;
  insert into public.newsletter_subscribers(email, is_active)
  values(lower(btrim(subscriber_email)), true)
  on conflict(email) do update set is_active = true;
end;
$$;
revoke all on function public.subscribe_newsletter(text) from public;
grant execute on function public.subscribe_newsletter(text) to anon, authenticated;

-- Realtime is required for changes made in admin to appear in an already-open
-- storefront tab. Add only tables that are not already publication members.
do $$
declare table_name text;
begin
  foreach table_name in array array['products','product_images','product_variants','categories','collections','site_settings','reviews'] loop
    if not exists(
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = table_name
    ) then
      execute format('alter publication supabase_realtime add table public.%I', table_name);
    end if;
  end loop;
end;
$$;

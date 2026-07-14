-- Production hardening for admin permissions, order lifecycle and business data.

-- ---------------------------------------------------------------------------
-- Role-aware authorization
-- ---------------------------------------------------------------------------
alter table public.profiles add column if not exists is_active boolean not null default true;

create or replace function public.has_role(allowed_roles public.app_role[])
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and is_active
      and role = any(allowed_roles)
  );
$$;

revoke all on function public.has_role(public.app_role[]) from public;
grant execute on function public.has_role(public.app_role[]) to anon, authenticated;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.has_role(array['admin','manager','editor']::public.app_role[]);
$$;

alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists username text;
alter table public.profiles add column if not exists bio text not null default '';
alter table public.profiles add column if not exists preferences jsonb not null default '{"language":"vi","theme":"system","emailNotifications":true,"pushNotifications":false}'::jsonb;
alter table public.profiles add column if not exists is_active boolean not null default true;
alter table public.profiles add column if not exists last_login_at timestamptz;
alter table public.profiles add column if not exists login_count integer not null default 0;
create unique index if not exists profiles_username_unique on public.profiles(lower(username)) where username is not null;
update public.profiles profile
set email = users.email,
    username = coalesce(profile.username, split_part(users.email, '@', 1))
from auth.users users
where users.id = profile.id;
grant update(full_name, phone, avatar_url, email, username, bio, preferences) on public.profiles to authenticated;

create or replace function public.record_admin_login()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles
  set last_login_at = now(), login_count = login_count + 1
  where id = auth.uid()
    and is_active
    and role = any(array['admin','manager','editor']::public.app_role[]);
  if not found then
    raise exception 'Tài khoản không có quyền truy cập quản trị.' using errcode = '42501';
  end if;
end;
$$;
revoke all on function public.record_admin_login() from public;
grant execute on function public.record_admin_login() to authenticated;

drop policy if exists "Staff manages products" on public.products;
drop policy if exists "Staff manages images" on public.product_images;
drop policy if exists "Staff manages variants" on public.product_variants;
drop policy if exists "Staff manages categories" on public.categories;
drop policy if exists "Staff manages collections" on public.collections;
drop policy if exists "Staff manages customers" on public.customers;
drop policy if exists "Staff manages addresses" on public.customer_addresses;
drop policy if exists "Staff manages coupons" on public.coupons;
drop policy if exists "Staff manages orders" on public.orders;
drop policy if exists "Staff manages order items" on public.order_items;
drop policy if exists "Staff manages timeline" on public.order_timeline;
drop policy if exists "Staff manages reviews" on public.reviews;
drop policy if exists "Staff manages subscribers" on public.newsletter_subscribers;
drop policy if exists "Staff manages settings" on public.site_settings;
drop policy if exists "Staff reads audit logs" on public.audit_logs;
drop policy if exists "Staff manages stock movements" on public.stock_movements;

create policy "Catalog staff manages products" on public.products for all to authenticated
  using (public.has_role(array['admin','manager','editor']::public.app_role[]))
  with check (public.has_role(array['admin','manager','editor']::public.app_role[]));
create policy "Catalog staff manages images" on public.product_images for all to authenticated
  using (public.has_role(array['admin','manager','editor']::public.app_role[]))
  with check (public.has_role(array['admin','manager','editor']::public.app_role[]));
create policy "Catalog staff manages variants" on public.product_variants for all to authenticated
  using (public.has_role(array['admin','manager','editor']::public.app_role[]))
  with check (public.has_role(array['admin','manager','editor']::public.app_role[]));
create policy "Catalog staff manages categories" on public.categories for all to authenticated
  using (public.has_role(array['admin','manager','editor']::public.app_role[]))
  with check (public.has_role(array['admin','manager','editor']::public.app_role[]));
create policy "Catalog staff manages collections" on public.collections for all to authenticated
  using (public.has_role(array['admin','manager','editor']::public.app_role[]))
  with check (public.has_role(array['admin','manager','editor']::public.app_role[]));
create policy "Operations staff manages customers" on public.customers for all to authenticated
  using (public.has_role(array['admin','manager']::public.app_role[]))
  with check (public.has_role(array['admin','manager']::public.app_role[]));
create policy "Operations staff manages addresses" on public.customer_addresses for all to authenticated
  using (public.has_role(array['admin','manager']::public.app_role[]))
  with check (public.has_role(array['admin','manager']::public.app_role[]));
create policy "Operations staff manages coupons" on public.coupons for all to authenticated
  using (public.has_role(array['admin','manager']::public.app_role[]))
  with check (public.has_role(array['admin','manager']::public.app_role[]));
create policy "Operations staff manages orders" on public.orders for all to authenticated
  using (public.has_role(array['admin','manager']::public.app_role[]))
  with check (public.has_role(array['admin','manager']::public.app_role[]));
create policy "Operations staff manages order items" on public.order_items for all to authenticated
  using (public.has_role(array['admin','manager']::public.app_role[]))
  with check (public.has_role(array['admin','manager']::public.app_role[]));
create policy "Operations staff manages timeline" on public.order_timeline for all to authenticated
  using (public.has_role(array['admin','manager']::public.app_role[]))
  with check (public.has_role(array['admin','manager']::public.app_role[]));
create policy "Content staff manages reviews" on public.reviews for all to authenticated
  using (public.has_role(array['admin','manager','editor']::public.app_role[]))
  with check (public.has_role(array['admin','manager','editor']::public.app_role[]));
create policy "Content staff manages subscribers" on public.newsletter_subscribers for all to authenticated
  using (public.has_role(array['admin','manager','editor']::public.app_role[]))
  with check (public.has_role(array['admin','manager','editor']::public.app_role[]));
create policy "Content staff reads settings" on public.site_settings for select to authenticated
  using (public.has_role(array['admin','manager','editor']::public.app_role[])
    and (key <> 'admin.settings' or public.has_role(array['admin']::public.app_role[])));
create policy "Content staff inserts settings" on public.site_settings for insert to authenticated
  with check (public.has_role(array['admin','manager','editor']::public.app_role[])
    and (key <> 'admin.settings' or public.has_role(array['admin']::public.app_role[])));
create policy "Content staff updates settings" on public.site_settings for update to authenticated
  using (public.has_role(array['admin','manager','editor']::public.app_role[])
    and (key <> 'admin.settings' or public.has_role(array['admin']::public.app_role[])))
  with check (public.has_role(array['admin','manager','editor']::public.app_role[])
    and (key <> 'admin.settings' or public.has_role(array['admin']::public.app_role[])));
create policy "Admins delete settings" on public.site_settings for delete to authenticated
  using (public.has_role(array['admin']::public.app_role[]));
create policy "Management reads audit logs" on public.audit_logs for select to authenticated
  using (public.has_role(array['admin','manager']::public.app_role[]));
create policy "Operations staff manages stock movements" on public.stock_movements for all to authenticated
  using (public.has_role(array['admin','manager']::public.app_role[]))
  with check (public.has_role(array['admin','manager']::public.app_role[]));

create or replace function public.adjust_inventory(
  target_product_id uuid, target_variant_id uuid, quantity_change integer,
  movement_reason text, movement_kind text default 'adjustment',
  ref_type text default null, ref_id text default null
) returns uuid language plpgsql security definer set search_path = '' as $$
declare before_stock integer; after_stock integer; movement_id uuid;
begin
  if not public.has_role(array['admin','manager']::public.app_role[]) then raise exception 'Không có quyền quản lý tồn kho' using errcode = '42501'; end if;
  if quantity_change = 0 then raise exception 'Số lượng điều chỉnh phải khác 0'; end if;
  if char_length(btrim(movement_reason)) < 2 then raise exception 'Vui lòng nhập lý do điều chỉnh'; end if;
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
  values(target_product_id, target_variant_id, movement_kind, quantity_change, before_stock, after_stock, btrim(movement_reason), ref_type, ref_id, auth.uid())
  returning id into movement_id;
  return movement_id;
end;
$$;

create or replace function public.edit_stock_movement(target_movement_id uuid, new_quantity integer, new_reason text)
returns void language plpgsql security definer set search_path = '' as $$
declare movement public.stock_movements; difference integer; current_stock integer;
begin
  if not public.has_role(array['admin','manager']::public.app_role[]) then raise exception 'Không có quyền quản lý tồn kho' using errcode = '42501'; end if;
  if new_quantity = 0 or char_length(btrim(new_reason)) < 2 then raise exception 'Số lượng và lý do điều chỉnh không hợp lệ'; end if;
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
  update public.stock_movements set quantity = new_quantity, balance_after = balance_before + new_quantity, reason = btrim(new_reason) where id = target_movement_id;
end;
$$;

create or replace function public.delete_stock_movement(target_movement_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare movement public.stock_movements; current_stock integer;
begin
  if not public.has_role(array['admin']::public.app_role[]) then raise exception 'Chỉ quản trị viên được xóa điều chỉnh kho' using errcode = '42501'; end if;
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

create or replace function public.log_order_item_stock_movement()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare current_stock integer;
begin
  if new.variant_id is not null then
    select stock into current_stock from public.product_variants where id = new.variant_id;
  elsif new.product_id is not null then
    select stock into current_stock from public.products where id = new.product_id;
  else
    return new;
  end if;
  insert into public.stock_movements(product_id, variant_id, movement_type, quantity, balance_before, balance_after, reason, reference_type, reference_id)
  values(new.product_id, new.variant_id, 'deduct', -new.quantity, current_stock + new.quantity, current_stock,
    'Xuất kho cho đơn hàng', 'order', new.order_id::text);
  return new;
end;
$$;
drop trigger if exists order_item_stock_movement on public.order_items;
create trigger order_item_stock_movement after insert on public.order_items
for each row execute function public.log_order_item_stock_movement();

create or replace function public.normalize_customer_aggregates()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  select count(*), coalesce(sum(total) filter(where status = 'delivered'), 0)
  into new.total_orders, new.total_spent
  from public.orders
  where customer_id = new.id and archived_at is null and status <> 'cancelled';
  return new;
end;
$$;
drop trigger if exists customers_normalize_aggregates on public.customers;
create trigger customers_normalize_aggregates
before update of total_orders, total_spent on public.customers
for each row execute function public.normalize_customer_aggregates();

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
declare item jsonb;
begin
  if not public.has_role(array['admin','manager','editor']::public.app_role[]) then
    raise exception 'Bạn không có quyền cập nhật sản phẩm.' using errcode = '42501';
  end if;
  if not exists(select 1 from public.products where id = target_product_id) then
    raise exception 'Không tìm thấy sản phẩm.' using errcode = 'P0002';
  end if;
  delete from public.product_images where product_id = target_product_id;
  for item in select * from jsonb_array_elements(coalesce(image_payload, '[]'::jsonb)) loop
    insert into public.product_images(product_id, url, alt_text, sort_order)
    values(target_product_id, item->>'url', coalesce(item->>'altText', ''), coalesce((item->>'sortOrder')::integer, 0));
  end loop;
  delete from public.product_variants where product_id = target_product_id;
  for item in select * from jsonb_array_elements(coalesce(variant_payload, '[]'::jsonb)) loop
    insert into public.product_variants(product_id, sku, color, size, price, cost, stock, weight, image_url, status)
    values(target_product_id, item->>'sku', coalesce(item->>'color', ''), coalesce(item->>'size', ''),
      coalesce((item->>'price')::bigint, 0), coalesce((item->>'cost')::bigint, 0),
      coalesce((item->>'stock')::integer, 0), coalesce((item->>'weight')::numeric, 0),
      nullif(item->>'image', ''), coalesce(item->>'status', 'active'));
  end loop;
end;
$$;
revoke all on function public.replace_product_relations(uuid, jsonb, jsonb) from public;
grant execute on function public.replace_product_relations(uuid, jsonb, jsonb) to authenticated;

-- ---------------------------------------------------------------------------
-- Safe order lifecycle
-- ---------------------------------------------------------------------------
alter table public.orders add column if not exists archived_at timestamptz;
create index if not exists orders_archived_at_idx on public.orders(archived_at) where archived_at is null;

create or replace function public.change_order_status(
  target_order_id uuid,
  next_status public.order_status,
  status_note text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_order public.orders;
  order_item record;
  allowed boolean := false;
  stock_before integer;
begin
  if not public.has_role(array['admin','manager']::public.app_role[]) then
    raise exception 'Bạn không có quyền thay đổi trạng thái đơn hàng.' using errcode = '42501';
  end if;

  select * into current_order
  from public.orders
  where id = target_order_id and archived_at is null
  for update;
  if not found then raise exception 'Không tìm thấy đơn hàng.' using errcode = 'P0002'; end if;
  if current_order.status = next_status then raise exception 'Đơn hàng đã ở trạng thái này.'; end if;

  allowed := case current_order.status
    when 'pending' then next_status in ('confirmed', 'cancelled')
    when 'confirmed' then next_status in ('preparing', 'cancelled')
    when 'preparing' then next_status in ('ready_to_ship', 'cancelled')
    when 'ready_to_ship' then next_status in ('shipped', 'cancelled')
    when 'shipped' then next_status in ('out_for_delivery', 'returned')
    when 'out_for_delivery' then next_status in ('delivered', 'returned')
    when 'delivered' then next_status = 'returned'
    when 'returned' then next_status = 'refunded'
    else false
  end;
  if not allowed then
    raise exception 'Không thể chuyển đơn hàng từ % sang %.', current_order.status, next_status;
  end if;

  if next_status in ('cancelled', 'returned') then
    for order_item in select * from public.order_items where order_id = target_order_id loop
      if order_item.variant_id is not null then
        select stock into stock_before from public.product_variants where id = order_item.variant_id for update;
        update public.product_variants set stock = stock + order_item.quantity where id = order_item.variant_id;
      elsif order_item.product_id is not null then
        select stock into stock_before from public.products where id = order_item.product_id for update;
        update public.products set stock = stock + order_item.quantity where id = order_item.product_id;
      else
        continue;
      end if;
      insert into public.stock_movements(
        product_id, variant_id, movement_type, quantity, balance_before, balance_after,
        reason, reference_type, reference_id, created_by
      ) values (
        order_item.product_id, order_item.variant_id, 'return', order_item.quantity,
        stock_before, stock_before + order_item.quantity,
        case when next_status = 'cancelled' then 'Hoàn kho do hủy đơn' else 'Nhập kho hàng trả' end,
        'order', target_order_id::text, auth.uid()
      );
    end loop;
  end if;

  update public.orders
  set status = next_status,
      fulfillment_status = case next_status
        when 'pending' then 'unfulfilled'
        when 'confirmed' then 'confirmed'
        when 'preparing' then 'processing'
        when 'ready_to_ship' then 'ready_to_ship'
        when 'shipped' then 'shipped'
        when 'out_for_delivery' then 'shipped'
        when 'delivered' then 'fulfilled'
        when 'cancelled' then 'cancelled'
        when 'returned' then 'returned'
        when 'refunded' then 'returned'
      end
  where id = target_order_id;

  if next_status = 'cancelled' and current_order.coupon_id is not null then
    update public.coupons set used_count = greatest(used_count - 1, 0) where id = current_order.coupon_id;
  end if;

  update public.customers c
  set total_orders = (
        select count(*) from public.orders o
        where o.customer_id = c.id and o.archived_at is null and o.status <> 'cancelled'
      ),
      total_spent = (
        select coalesce(sum(o.total), 0) from public.orders o
        where o.customer_id = c.id and o.archived_at is null and o.status = 'delivered'
      )
  where c.id = current_order.customer_id;

  insert into public.order_timeline(order_id, status, note, created_by)
  values (target_order_id, next_status, nullif(btrim(status_note), ''), auth.uid());
  insert into public.audit_logs(actor_id, action, entity_type, entity_id, payload)
  values (auth.uid(), 'order.status_changed', 'order', target_order_id::text,
    jsonb_build_object('from', current_order.status, 'to', next_status, 'note', status_note));
end;
$$;

revoke all on function public.change_order_status(uuid, public.order_status, text) from public;
grant execute on function public.change_order_status(uuid, public.order_status, text) to authenticated;

create or replace function public.change_order_payment_status(
  target_order_id uuid,
  next_status public.payment_status
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  previous_status public.payment_status;
begin
  if not public.has_role(array['admin','manager']::public.app_role[]) then
    raise exception 'Bạn không có quyền cập nhật thanh toán.' using errcode = '42501';
  end if;
  select payment_status into previous_status from public.orders
  where id = target_order_id and archived_at is null for update;
  if not found then raise exception 'Không tìm thấy đơn hàng.' using errcode = 'P0002'; end if;
  if previous_status = next_status then return; end if;
  if previous_status = 'refunded' then raise exception 'Giao dịch đã hoàn tiền không thể mở lại.'; end if;
  update public.orders set payment_status = next_status where id = target_order_id;
  insert into public.audit_logs(actor_id, action, entity_type, entity_id, payload)
  values (auth.uid(), 'order.payment_status_changed', 'order', target_order_id::text,
    jsonb_build_object('from', previous_status, 'to', next_status));
end;
$$;

revoke all on function public.change_order_payment_status(uuid, public.payment_status) from public;
grant execute on function public.change_order_payment_status(uuid, public.payment_status) to authenticated;

create or replace function public.archive_order(target_order_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare current_status public.order_status;
begin
  if not public.has_role(array['admin']::public.app_role[]) then
    raise exception 'Chỉ quản trị viên được lưu trữ đơn hàng.' using errcode = '42501';
  end if;
  select status into current_status from public.orders where id = target_order_id and archived_at is null for update;
  if not found then raise exception 'Không tìm thấy đơn hàng.' using errcode = 'P0002'; end if;
  if current_status not in ('delivered','cancelled','refunded') then
    raise exception 'Chỉ có thể lưu trữ đơn đã giao, đã hủy hoặc đã hoàn tiền.';
  end if;
  update public.orders set archived_at = now() where id = target_order_id;
  insert into public.audit_logs(actor_id, action, entity_type, entity_id, payload)
  values (auth.uid(), 'order.archived', 'order', target_order_id::text, jsonb_build_object('status', current_status));
end;
$$;

revoke all on function public.archive_order(uuid) from public;
grant execute on function public.archive_order(uuid) to authenticated;

-- Existing orders were counted at checkout time. Rebuild customer aggregates to
-- match the production meaning: non-cancelled orders and delivered revenue.
update public.customers c
set total_orders = (
      select count(*) from public.orders o
      where o.customer_id = c.id and o.archived_at is null and o.status <> 'cancelled'
    ),
    total_spent = (
      select coalesce(sum(o.total), 0) from public.orders o
      where o.customer_id = c.id and o.archived_at is null and o.status = 'delivered'
    );

-- ---------------------------------------------------------------------------
-- Shared CMS persistence
-- ---------------------------------------------------------------------------
create or replace function public.get_storefront_setting(setting_key text)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select value from public.site_settings
  where key = setting_key
    and key = any(array[
      'storefront.store', 'storefront.navigation', 'storefront.content',
      'storefront.appearance', 'storefront.banners', 'storefront.collections',
      'storefront.footer', 'storefront.homepage', 'storefront.redirects',
      'storefront.seo'
    ]);
$$;

create or replace function public.update_storefront_setting(setting_key text, setting_value jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.has_role(array['admin','manager','editor']::public.app_role[]) then
    raise exception 'Bạn không có quyền cập nhật website.' using errcode = '42501';
  end if;
  if setting_key <> all(array[
    'storefront.store', 'storefront.navigation', 'storefront.content',
    'storefront.appearance', 'storefront.banners', 'storefront.collections',
    'storefront.footer', 'storefront.homepage', 'storefront.redirects',
    'storefront.seo'
  ]) then
    raise exception 'Cấu hình không được phép cập nhật.';
  end if;
  insert into public.site_settings(key, value, updated_by, updated_at)
  values(setting_key, setting_value, auth.uid(), now())
  on conflict(key) do update
    set value = excluded.value, updated_by = excluded.updated_by, updated_at = now();
  insert into public.audit_logs(actor_id, action, entity_type, entity_id, payload)
  values(auth.uid(), 'storefront.setting_updated', 'site_setting', setting_key, '{}'::jsonb);
  return setting_value;
end;
$$;

revoke all on function public.get_storefront_setting(text) from public;
grant execute on function public.get_storefront_setting(text) to anon, authenticated;
revoke all on function public.update_storefront_setting(text, jsonb) from public;
grant execute on function public.update_storefront_setting(text, jsonb) to authenticated;

create or replace function public.get_admin_setting(setting_key text)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare setting_value jsonb;
begin
  if not public.has_role(array['admin','manager','editor']::public.app_role[]) then
    raise exception 'Bạn không có quyền truy cập cấu hình quản trị.' using errcode = '42501';
  end if;
  if setting_key = 'admin.settings' and not public.has_role(array['admin']::public.app_role[]) then
    raise exception 'Chỉ quản trị viên được xem cấu hình hệ thống.' using errcode = '42501';
  end if;
  if setting_key <> all(array['admin.brands','admin.journal','admin.settings']) then
    raise exception 'Cấu hình không hợp lệ.';
  end if;
  select value into setting_value from public.site_settings where key = setting_key;
  return setting_value;
end;
$$;

create or replace function public.update_admin_setting(setting_key text, setting_value jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.has_role(array['admin','manager','editor']::public.app_role[]) then
    raise exception 'Bạn không có quyền cập nhật cấu hình quản trị.' using errcode = '42501';
  end if;
  if setting_key = 'admin.settings' and not public.has_role(array['admin']::public.app_role[]) then
    raise exception 'Chỉ quản trị viên được cập nhật cấu hình hệ thống.' using errcode = '42501';
  end if;
  if setting_key <> all(array['admin.brands','admin.journal','admin.settings']) then
    raise exception 'Cấu hình không hợp lệ.';
  end if;
  insert into public.site_settings(key, value, updated_by, updated_at)
  values(setting_key, setting_value, auth.uid(), now())
  on conflict(key) do update set value = excluded.value, updated_by = excluded.updated_by, updated_at = now();
  insert into public.audit_logs(actor_id, action, entity_type, entity_id, payload)
  values(auth.uid(), 'admin.setting_updated', 'site_setting', setting_key, '{}'::jsonb);
  return setting_value;
end;
$$;

revoke all on function public.get_admin_setting(text) from public;
grant execute on function public.get_admin_setting(text) to authenticated;
revoke all on function public.update_admin_setting(text, jsonb) from public;
grant execute on function public.update_admin_setting(text, jsonb) to authenticated;

-- ---------------------------------------------------------------------------
-- Business and procurement records
-- ---------------------------------------------------------------------------
create table if not exists public.suppliers (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) >= 2),
  supplier_code text not null unique,
  contact_name text not null default '',
  email text not null default '',
  phone text not null default '',
  whatsapp text not null default '',
  country text not null default 'Việt Nam',
  city text not null default '',
  address text not null default '',
  tax_number text not null default '',
  commercial_registration text not null default '',
  payment_terms text not null default 'net_30',
  currency text not null default 'VND',
  materials_provided text[] not null default '{}',
  total_purchases bigint not null default 0 check (total_purchases >= 0),
  outstanding_balance bigint not null default 0 check (outstanding_balance >= 0),
  status text not null default 'active' check (status in ('active','inactive')),
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.purchase_orders (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references public.suppliers(id) on delete restrict,
  reference text not null unique,
  order_date timestamptz not null default now(),
  expected_arrival timestamptz,
  received_date timestamptz,
  items jsonb not null default '[]'::jsonb,
  subtotal bigint not null default 0 check (subtotal >= 0),
  tax bigint not null default 0 check (tax >= 0),
  shipping bigint not null default 0 check (shipping >= 0),
  total bigint not null default 0 check (total >= 0),
  status text not null default 'draft' check (status in ('draft','sent','partially_received','received','cancelled')),
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid','partial','paid')),
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) >= 2),
  category text not null,
  amount bigint not null check (amount > 0),
  currency text not null default 'VND',
  expense_date timestamptz not null default now(),
  payment_method text not null default 'bank_transfer',
  supplier_id uuid references public.suppliers(id) on delete set null,
  description text not null default '',
  notes text not null default '',
  receipt text,
  reference_id text,
  status text not null default 'pending' check (status in ('paid','pending','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.assets (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) >= 2),
  asset_type text not null default 'other',
  purchase_date timestamptz not null default now(),
  purchase_value bigint not null default 0 check (purchase_value >= 0),
  current_value bigint not null default 0 check (current_value >= 0),
  depreciation numeric(8,2) not null default 0 check (depreciation >= 0),
  depreciation_rate numeric(8,2) not null default 0 check (depreciation_rate between 0 and 100),
  status text not null default 'active' check (status in ('active','sold','written_off')),
  documents text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.liabilities (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) >= 2),
  liability_type text not null default 'other',
  supplier_id uuid references public.suppliers(id) on delete set null,
  amount bigint not null check (amount > 0),
  due_date timestamptz not null,
  status text not null default 'unpaid' check (status in ('unpaid','partial','paid')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.capital_entries (
  id uuid primary key default gen_random_uuid(),
  entry_type text not null check (entry_type in ('increase','withdrawal')),
  owner text not null check (char_length(btrim(owner)) >= 2),
  amount bigint not null check (amount > 0),
  reason text not null default '',
  entry_date timestamptz not null default now(),
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists purchase_orders_supplier_idx on public.purchase_orders(supplier_id, order_date desc);
create index if not exists expenses_date_idx on public.expenses(expense_date desc);
create index if not exists liabilities_due_idx on public.liabilities(due_date) where status <> 'paid';

drop trigger if exists suppliers_updated_at on public.suppliers;
create trigger suppliers_updated_at before update on public.suppliers for each row execute function public.set_updated_at();
drop trigger if exists purchase_orders_updated_at on public.purchase_orders;
create trigger purchase_orders_updated_at before update on public.purchase_orders for each row execute function public.set_updated_at();
drop trigger if exists expenses_updated_at on public.expenses;
create trigger expenses_updated_at before update on public.expenses for each row execute function public.set_updated_at();
drop trigger if exists assets_updated_at on public.assets;
create trigger assets_updated_at before update on public.assets for each row execute function public.set_updated_at();
drop trigger if exists liabilities_updated_at on public.liabilities;
create trigger liabilities_updated_at before update on public.liabilities for each row execute function public.set_updated_at();
drop trigger if exists capital_entries_updated_at on public.capital_entries;
create trigger capital_entries_updated_at before update on public.capital_entries for each row execute function public.set_updated_at();

alter table public.suppliers enable row level security;
alter table public.purchase_orders enable row level security;
alter table public.expenses enable row level security;
alter table public.assets enable row level security;
alter table public.liabilities enable row level security;
alter table public.capital_entries enable row level security;

create policy "Management manages suppliers" on public.suppliers for all to authenticated
  using (public.has_role(array['admin','manager']::public.app_role[]))
  with check (public.has_role(array['admin','manager']::public.app_role[]));
create policy "Management manages purchase orders" on public.purchase_orders for all to authenticated
  using (public.has_role(array['admin','manager']::public.app_role[]))
  with check (public.has_role(array['admin','manager']::public.app_role[]));
create policy "Management manages expenses" on public.expenses for all to authenticated
  using (public.has_role(array['admin','manager']::public.app_role[]))
  with check (public.has_role(array['admin','manager']::public.app_role[]));
create policy "Management manages assets" on public.assets for all to authenticated
  using (public.has_role(array['admin','manager']::public.app_role[]))
  with check (public.has_role(array['admin','manager']::public.app_role[]));
create policy "Management manages liabilities" on public.liabilities for all to authenticated
  using (public.has_role(array['admin','manager']::public.app_role[]))
  with check (public.has_role(array['admin','manager']::public.app_role[]));
create policy "Management manages capital" on public.capital_entries for all to authenticated
  using (public.has_role(array['admin','manager']::public.app_role[]))
  with check (public.has_role(array['admin','manager']::public.app_role[]));

create or replace function public.receive_purchase_order(target_purchase_order_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  purchase_row public.purchase_orders;
  line jsonb;
  target_product uuid;
  received_quantity integer;
  stock_before integer;
begin
  if not public.has_role(array['admin','manager']::public.app_role[]) then
    raise exception 'Bạn không có quyền nhập hàng.' using errcode = '42501';
  end if;
  select * into purchase_row from public.purchase_orders
  where id = target_purchase_order_id for update;
  if not found then raise exception 'Không tìm thấy đơn mua hàng.' using errcode = 'P0002'; end if;
  if purchase_row.status in ('received','cancelled') then
    raise exception 'Đơn mua hàng đã hoàn tất hoặc đã hủy.';
  end if;
  if jsonb_array_length(purchase_row.items) = 0 then raise exception 'Đơn mua hàng chưa có sản phẩm.'; end if;

  for line in select * from jsonb_array_elements(purchase_row.items) loop
    target_product := nullif(line->>'productId', '')::uuid;
    received_quantity := coalesce(nullif(line->>'receivedQty', '')::integer, nullif(line->>'quantity', '')::integer, 0);
    if received_quantity <= 0 then raise exception 'Số lượng nhập phải lớn hơn 0.'; end if;
    if target_product is not null then
      select stock into stock_before from public.products where id = target_product for update;
      if not found then raise exception 'Sản phẩm liên kết không tồn tại.'; end if;
      update public.products set stock = stock + received_quantity where id = target_product;
      insert into public.stock_movements(
        product_id, movement_type, quantity, balance_before, balance_after, reason,
        reference_type, reference_id, created_by
      ) values (
        target_product, 'receive', received_quantity, stock_before, stock_before + received_quantity,
        'Nhập hàng từ ' || purchase_row.reference, 'purchase_receipt', purchase_row.id::text, auth.uid()
      );
    end if;
  end loop;

  update public.purchase_orders
  set status = 'received', received_date = now(),
      items = (
        select jsonb_agg(item || jsonb_build_object('receivedQty', (item->>'quantity')::integer))
        from jsonb_array_elements(purchase_row.items) item
      )
  where id = target_purchase_order_id;
  update public.suppliers
  set total_purchases = total_purchases + purchase_row.total,
      outstanding_balance = outstanding_balance + case when purchase_row.payment_status = 'paid' then 0 else purchase_row.total end
  where id = purchase_row.supplier_id;
  insert into public.audit_logs(actor_id, action, entity_type, entity_id, payload)
  values(auth.uid(), 'purchase_order.received', 'purchase_order', purchase_row.id::text,
    jsonb_build_object('reference', purchase_row.reference, 'total', purchase_row.total));
end;
$$;

revoke all on function public.receive_purchase_order(uuid) from public;
grant execute on function public.receive_purchase_order(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- Shared media library
-- ---------------------------------------------------------------------------
create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null unique,
  file_name text not null,
  original_name text not null,
  alt_text text not null default '',
  mime_type text not null,
  width integer not null default 0,
  height integer not null default 0,
  file_size bigint not null default 0 check (file_size >= 0),
  folder text not null default 'uncategorized',
  tags text[] not null default '{}',
  used_in text[] not null default '{}',
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists media_assets_folder_idx on public.media_assets(folder, created_at desc);
alter table public.media_assets enable row level security;
create policy "Content staff manages media" on public.media_assets for all to authenticated
  using (public.has_role(array['admin','manager','editor']::public.app_role[]))
  with check (public.has_role(array['admin','manager','editor']::public.app_role[]));

insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 10485760, array['image/jpeg','image/png','image/webp','image/avif','application/pdf'])
on conflict(id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Public reads media files" on storage.objects for select to public using (bucket_id = 'media');
create policy "Content staff uploads media files" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and public.has_role(array['admin','manager','editor']::public.app_role[]));
create policy "Content staff updates media files" on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.has_role(array['admin','manager','editor']::public.app_role[]))
  with check (bucket_id = 'media' and public.has_role(array['admin','manager','editor']::public.app_role[]));
create policy "Content staff deletes media files" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.has_role(array['admin','manager','editor']::public.app_role[]));

-- Privacy-conscious first-party analytics. No IP address or customer identity is
-- stored; session identifiers are random browser-local values.
create table if not exists public.analytics_events (
  id bigint generated always as identity primary key,
  event_type text not null check (event_type in ('page_view','product_view','add_to_cart','checkout_start','purchase')),
  session_id uuid not null,
  path text not null default '/',
  device text not null default 'desktop' check (device in ('desktop','tablet','mobile')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists analytics_events_created_idx on public.analytics_events(created_at desc);
create index if not exists analytics_events_session_idx on public.analytics_events(session_id, event_type);
alter table public.analytics_events enable row level security;
drop policy if exists "Storefront records analytics" on public.analytics_events;
drop policy if exists "Storefront records analytics" on public.analytics_events;
create policy "Storefront records analytics" on public.analytics_events for insert to anon, authenticated
  with check (event_type in ('page_view','product_view','add_to_cart','checkout_start','purchase'));
drop policy if exists "Management reads analytics" on public.analytics_events;
drop policy if exists "Management reads analytics" on public.analytics_events;
create policy "Management reads analytics" on public.analytics_events for select to authenticated
  using (public.has_role(array['admin','manager']::public.app_role[]));

-- Shared admin notifications with per-user read/dismiss state.
create table if not exists public.admin_notifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  message text not null default '',
  notification_type text not null check (notification_type in ('order','customer','system','review')),
  link text,
  created_at timestamptz not null default now()
);
create table if not exists public.admin_notification_states (
  notification_id uuid not null references public.admin_notifications(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  read_at timestamptz,
  dismissed_at timestamptz,
  primary key(notification_id, user_id)
);
create index if not exists admin_notifications_created_idx on public.admin_notifications(created_at desc);
alter table public.admin_notifications enable row level security;
alter table public.admin_notification_states enable row level security;
create policy "Staff reads admin notifications" on public.admin_notifications for select to authenticated
  using (public.has_role(array['admin','manager','editor']::public.app_role[]));
create policy "Staff reads own notification state" on public.admin_notification_states for select to authenticated
  using (user_id = auth.uid() and public.has_role(array['admin','manager','editor']::public.app_role[]));
create policy "Staff inserts own notification state" on public.admin_notification_states for insert to authenticated
  with check (user_id = auth.uid() and public.has_role(array['admin','manager','editor']::public.app_role[]));
create policy "Staff updates own notification state" on public.admin_notification_states for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create or replace function public.notify_admin_event()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_table_name = 'orders' then
    insert into public.admin_notifications(title, message, notification_type, link)
    values('Đơn hàng mới ' || new.order_number, 'Tổng tiền: ' || new.total::text || ' ₫', 'order', '/admin/orders/' || new.id::text);
  elsif tg_table_name = 'customers' then
    insert into public.admin_notifications(title, message, notification_type, link)
    values('Khách hàng mới', coalesce(new.full_name, new.email, 'Khách hàng vừa đăng ký.'), 'customer', '/admin/customers/' || new.id::text);
  elsif tg_table_name = 'reviews' then
    insert into public.admin_notifications(title, message, notification_type, link)
    values('Đánh giá mới cần duyệt', coalesce(new.title, 'Khách hàng vừa gửi đánh giá.'), 'review', '/admin/reviews');
  end if;
  return new;
end;
$$;
drop trigger if exists orders_admin_notification on public.orders;
create trigger orders_admin_notification after insert on public.orders for each row execute function public.notify_admin_event();
drop trigger if exists customers_admin_notification on public.customers;
create trigger customers_admin_notification after insert on public.customers for each row execute function public.notify_admin_event();
drop trigger if exists reviews_admin_notification on public.reviews;
create trigger reviews_admin_notification after insert on public.reviews for each row execute function public.notify_admin_event();

create or replace function public.notify_low_stock()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare product_name text;
declare stock_limit integer;
begin
  if tg_table_name = 'product_variants' then
    select name, low_stock_limit into product_name, stock_limit from public.products where id = new.product_id;
    if new.stock <= stock_limit and old.stock > stock_limit then
      insert into public.admin_notifications(title, message, notification_type, link)
      values('Biến thể sắp hết hàng', product_name || ' (' || new.sku || ') chỉ còn ' || new.stock::text || ' sản phẩm.', 'system', '/admin/inventory');
    end if;
  elsif new.stock <= new.low_stock_limit and old.stock > old.low_stock_limit then
    insert into public.admin_notifications(title, message, notification_type, link)
    values('Sản phẩm sắp hết hàng', new.name || ' chỉ còn ' || new.stock::text || ' sản phẩm.', 'system', '/admin/inventory');
  end if;
  return new;
end;
$$;
drop trigger if exists products_low_stock_notification on public.products;
create trigger products_low_stock_notification after update of stock on public.products
for each row execute function public.notify_low_stock();
drop trigger if exists variants_low_stock_notification on public.product_variants;
create trigger variants_low_stock_notification after update of stock on public.product_variants
for each row execute function public.notify_low_stock();

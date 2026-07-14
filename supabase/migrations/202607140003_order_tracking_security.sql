-- Keep customer tracking responses intentionally small and customer-facing.
-- The previous implementation serialized the entire orders row, including
-- internal_notes and unrestricted metadata.
create or replace function public.track_order(order_code text, contact_value text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  order_row public.orders;
begin
  if length(trim(coalesce(order_code, ''))) < 4
     or length(trim(coalesce(contact_value, ''))) < 5 then
    return null;
  end if;

  select * into order_row
  from public.orders
  where upper(replace(order_number, '#', '')) = upper(replace(trim(order_code), '#', ''))
    and (
      lower(customer_email) = lower(trim(contact_value))
      or regexp_replace(customer_phone, '[^0-9]', '', 'g') = regexp_replace(contact_value, '[^0-9]', '', 'g')
    )
  limit 1;

  if not found then return null; end if;

  return jsonb_build_object(
    'id', order_row.id,
    'order_number', order_row.order_number,
    'customer_name', order_row.customer_name,
    'subtotal', order_row.subtotal,
    'discount', order_row.discount,
    'tax', order_row.tax,
    'shipping', order_row.shipping,
    'total', order_row.total,
    'status', order_row.status,
    'payment_status', order_row.payment_status,
    'fulfillment_status', order_row.fulfillment_status,
    'payment_method', order_row.payment_method,
    'shipping_method', order_row.shipping_method,
    'shipping_address', order_row.shipping_address,
    'shipping_company', order_row.shipping_company,
    'tracking_number', order_row.tracking_number,
    'courier_name', order_row.courier_name,
    'coupon_code', order_row.coupon_code,
    'created_at', order_row.created_at,
    'updated_at', order_row.updated_at,
    'metadata', jsonb_strip_nulls(jsonb_build_object(
      'estimatedDeliveryDate', order_row.metadata -> 'estimatedDeliveryDate',
      'customerUpdate', order_row.metadata -> 'customerUpdate',
      'customerUpdatedAt', order_row.metadata -> 'customerUpdatedAt'
    )),
    'order_items', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', item.id,
        'product_id', item.product_id,
        'variant_id', item.variant_id,
        'product_name', item.product_name,
        'sku', item.sku,
        'quantity', item.quantity,
        'price', item.price,
        'total', item.total,
        'image_url', item.image_url,
        'size', item.size,
        'color', item.color
      ) order by item.id)
      from public.order_items item
      where item.order_id = order_row.id
    ), '[]'::jsonb),
    'order_timeline', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', timeline.id,
        'status', timeline.status,
        'note', timeline.note,
        'created_at', timeline.created_at
      ) order by timeline.created_at desc)
      from public.order_timeline timeline
      where timeline.order_id = order_row.id
    ), '[]'::jsonb)
  );
end;
$$;

revoke all on function public.track_order(text, text) from public;
grant execute on function public.track_order(text, text) to anon, authenticated;

-- SECURITY DEFINER functions must never inherit PostgreSQL's default PUBLIC
-- execute privilege. Each function below still performs its own staff check.
revoke all on function public.create_storefront_order(jsonb) from public;
grant execute on function public.create_storefront_order(jsonb) to anon, authenticated;

revoke all on function public.validate_coupon(text, bigint) from public;
grant execute on function public.validate_coupon(text, bigint) to anon, authenticated;

revoke all on function public.change_order_status(uuid, public.order_status, text) from public;
grant execute on function public.change_order_status(uuid, public.order_status, text) to authenticated;

revoke all on function public.adjust_inventory(uuid, uuid, integer, text, text, text, text) from public;
grant execute on function public.adjust_inventory(uuid, uuid, integer, text, text, text, text) to authenticated;

revoke all on function public.edit_stock_movement(uuid, integer, text) from public;
grant execute on function public.edit_stock_movement(uuid, integer, text) to authenticated;

revoke all on function public.delete_stock_movement(uuid) from public;
grant execute on function public.delete_stock_movement(uuid) to authenticated;

-- Public storefront configuration is stored in site_settings, but exposed only
-- through a whitelist so future private settings cannot leak accidentally.
create or replace function public.get_storefront_setting(setting_key text)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select value from public.site_settings
  where key = setting_key
    and key in ('storefront.store', 'storefront.navigation', 'storefront.content');
$$;

create or replace function public.update_storefront_setting(setting_key text, setting_value jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_staff() then raise exception 'Không có quyền cập nhật website'; end if;
  if setting_key not in ('storefront.store', 'storefront.navigation', 'storefront.content') then
    raise exception 'Cấu hình không được phép cập nhật';
  end if;
  insert into public.site_settings(key, value, updated_by, updated_at)
  values(setting_key, setting_value, auth.uid(), now())
  on conflict(key) do update set value = excluded.value, updated_by = excluded.updated_by, updated_at = now();
  return setting_value;
end;
$$;

revoke all on function public.get_storefront_setting(text) from public;
grant execute on function public.get_storefront_setting(text) to anon, authenticated;
revoke all on function public.update_storefront_setting(text, jsonb) from public;
grant execute on function public.update_storefront_setting(text, jsonb) to authenticated;

insert into public.site_settings(key, value) values
('storefront.store', '{"storeName":"Soft Muse","phone":"+84 900 000 000","whatsapp":"+84 900 000 000","email":"hello@softmuse.vn","supportEmail":"support@softmuse.vn","address":"TP. Hồ Chí Minh, Việt Nam","googleMapsUrl":"https://maps.google.com/?q=Ho+Chi+Minh+City+Vietnam","workingHours":"Thứ 2 - Chủ nhật, 9:00 - 21:00","commercialRegistration":"","taxNumber":"","socialMedia":{"instagram":"https://www.instagram.com/softmuse.vn/","facebook":"https://www.facebook.com/softmuse.vn","whatsapp":"https://zalo.me/0900000000","tiktok":"https://www.tiktok.com/@softmuse.vn","pinterest":"https://www.pinterest.com/softmusevn"},"announcementBar":{"enabled":false,"text":"Miễn phí vận chuyển cho đơn hàng từ 800.000 đ","link":"/shop","bgColor":"#1C1C1B","textColor":"#FAF8F5"}}'::jsonb),
('storefront.navigation', '[{"id":"menu-header","location":"header","items":[{"id":"n-home","label":"Trang chủ","url":"/","order":0,"group":"primary","openInNewTab":false,"visibilityRules":["public"]},{"id":"n-shop","label":"Sản phẩm","url":"/shop","order":1,"group":"primary","openInNewTab":false,"visibilityRules":["public"]},{"id":"n-new","label":"Hàng mới","url":"/new-arrivals","order":2,"group":"primary","openInNewTab":false,"visibilityRules":["public"]},{"id":"n-best","label":"Bestseller","url":"/bestsellers","order":3,"group":"primary","openInNewTab":false,"visibilityRules":["public"]},{"id":"n-collections","label":"Bộ sưu tập","url":"/collections","order":4,"group":"secondary","openInNewTab":false,"visibilityRules":["public"]},{"id":"n-sale","label":"Khuyến mãi","url":"/sale","order":5,"group":"secondary","openInNewTab":false,"visibilityRules":["public"]},{"id":"n-about","label":"Giới thiệu","url":"/about","order":6,"group":"secondary","openInNewTab":false,"visibilityRules":["public"]},{"id":"n-contact","label":"Liên hệ","url":"/contact","order":7,"group":"secondary","openInNewTab":false,"visibilityRules":["public"]}]}]'::jsonb),
('storefront.content', '[{"id":"tracking-title","group":"pages","key":"tracking_hero_title","value":"Theo dõi đơn hàng","description":"Tiêu đề trang tra cứu"},{"id":"tracking-label","group":"pages","key":"tracking_hero_label","value":"Soft Muse","description":"Nhãn trang tra cứu"},{"id":"tracking-subtitle","group":"pages","key":"tracking_hero_subtitle","value":"Tra cứu tình trạng đơn hàng bằng mã đơn và số điện thoại hoặc email.","description":"Mô tả trang tra cứu"},{"id":"reviews-label","group":"pages","key":"reviews_hero_label","value":"Cảm nhận khách hàng","description":"Nhãn trang đánh giá"},{"id":"reviews-title","group":"pages","key":"reviews_hero_title","value":"Soft Muse trong những ngày đi làm thật","description":"Tiêu đề trang đánh giá"},{"id":"reviews-subtitle","group":"pages","key":"reviews_hero_subtitle","value":"Những chia sẻ chân thành về phom dáng, chất liệu và trải nghiệm mua sắm.","description":"Mô tả trang đánh giá"}]'::jsonb)
on conflict(key) do nothing;

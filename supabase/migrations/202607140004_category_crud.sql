-- Category operations that preserve product data and enforce staff access.
create or replace function public.update_category_with_products(
  category_id uuid,
  category_payload jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_category public.categories%rowtype;
  updated_category public.categories%rowtype;
  next_name text := btrim(coalesce(category_payload->>'name', ''));
  next_slug text := btrim(coalesce(category_payload->>'slug', ''));
begin
  if not public.is_staff() then
    raise exception 'Bạn không có quyền chỉnh sửa danh mục.' using errcode = '42501';
  end if;

  select * into current_category
  from public.categories
  where id = category_id
  for update;

  if not found then
    raise exception 'Không tìm thấy danh mục.' using errcode = 'P0002';
  end if;
  if next_name = '' then raise exception 'Tên danh mục không được để trống.'; end if;
  if next_slug = '' then raise exception 'Đường dẫn danh mục không được để trống.'; end if;

  update public.categories
  set
    name = next_name,
    slug = next_slug,
    description = coalesce(category_payload->>'description', ''),
    image_url = nullif(category_payload->>'thumbnail', ''),
    banner_url = nullif(category_payload->>'banner', ''),
    is_featured = coalesce((category_payload->>'isFeatured')::boolean, false),
    show_on_homepage = coalesce((category_payload->>'showOnHomepage')::boolean, false),
    show_in_menu = coalesce((category_payload->>'showInMenu')::boolean, true),
    sort_order = coalesce((category_payload->>'sortOrder')::integer, 0),
    is_active = coalesce(category_payload->>'status', 'active') = 'active',
    seo = coalesce(category_payload->'seo', '{}'::jsonb),
    updated_at = now()
  where id = category_id
  returning * into updated_category;

  if current_category.name is distinct from updated_category.name then
    update public.products
    set category = updated_category.name, updated_at = now()
    where category = current_category.name;
  end if;

  return to_jsonb(updated_category);
exception
  when unique_violation then
    raise exception 'Đường dẫn này đã được một danh mục khác sử dụng.';
end;
$$;

create or replace function public.delete_category_safely(category_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  target public.categories%rowtype;
  usage_count integer;
begin
  if not public.is_staff() then
    raise exception 'Bạn không có quyền xóa danh mục.' using errcode = '42501';
  end if;

  select * into target from public.categories where id = category_id for update;
  if not found then raise exception 'Không tìm thấy danh mục.' using errcode = 'P0002'; end if;

  select count(*) into usage_count from public.products where category = target.name;
  if usage_count > 0 then
    raise exception 'Danh mục đang được % sản phẩm sử dụng. Hãy chuyển sản phẩm sang danh mục khác hoặc ẩn danh mục.', usage_count;
  end if;

  delete from public.categories where id = category_id;
  return jsonb_build_object('deleted', true, 'id', category_id);
end;
$$;

revoke all on function public.update_category_with_products(uuid, jsonb) from public;
revoke all on function public.delete_category_safely(uuid) from public;
grant execute on function public.update_category_with_products(uuid, jsonb) to authenticated;
grant execute on function public.delete_category_safely(uuid) to authenticated;

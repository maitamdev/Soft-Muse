import { createClient } from '@/lib/supabase/client';

export type StorefrontSettingKey =
 | 'storefront.appearance'
 | 'storefront.banners'
 | 'storefront.collections'
 | 'storefront.footer'
 | 'storefront.homepage'
 | 'storefront.redirects'
 | 'storefront.seo';

/** Read a shared CMS value. A defensive clone prevents accidental mutations. */
export async function loadStorefrontSetting<T>(key: StorefrontSettingKey, fallback: T): Promise<T> {
 const { data, error } = await createClient().rpc('get_storefront_setting', { setting_key: key });
 if (error) throw new Error(`Không thể tải cấu hình ${key}: ${error.message}`);
 const value = data == null ? fallback : data as T;
 return structuredClone(value);
}

/** Persist CMS state centrally so every admin and storefront sees one version. */
export async function saveStorefrontSetting<T>(key: StorefrontSettingKey, value: T): Promise<T> {
 const { data, error } = await createClient().rpc('update_storefront_setting', {
  setting_key: key,
  setting_value: value,
 });
 if (error) throw new Error(`Không thể lưu cấu hình ${key}: ${error.message}`);
 return structuredClone((data ?? value) as T);
}

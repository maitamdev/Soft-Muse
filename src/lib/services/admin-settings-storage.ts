import { createClient } from '@/lib/supabase/client';

export type AdminSettingKey = 'admin.brands' | 'admin.journal' | 'admin.settings';

export async function loadAdminSetting<T>(key: AdminSettingKey, fallback: T): Promise<T> {
  const { data, error } = await createClient().rpc('get_admin_setting', { setting_key: key });
  if (error) throw new Error(`Không thể tải cấu hình quản trị: ${error.message}`);
  return data == null ? fallback : data as T;
}

export async function saveAdminSetting<T>(key: AdminSettingKey, value: T): Promise<T> {
  const { data, error } = await createClient().rpc('update_admin_setting', {
    setting_key: key,
    setting_value: value,
  });
  if (error) throw new Error(`Không thể lưu cấu hình quản trị: ${error.message}`);
  return (data ?? value) as T;
}

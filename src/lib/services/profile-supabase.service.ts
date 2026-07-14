import type { Profile } from '@/data/mock/profile';
import { eventBus } from '@/lib/events/EventBus';
import { createClient } from '@/lib/supabase/client';

const DEFAULT_PREFERENCES: Profile['preferences'] = {
 language: 'vi', theme: 'system', emailNotifications: true, pushNotifications: false,
};

function roleLabel(role: string) {
 if (role === 'admin') return 'Quản trị viên';
 if (role === 'manager') return 'Quản lý';
 if (role === 'editor') return 'Biên tập viên';
 return 'Khách hàng';
}

export const SupabaseProfileService = {
 async getProfile(): Promise<Profile> {
  const supabase = createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) throw new Error('Phiên đăng nhập đã hết hạn.');
  const { data, error } = await supabase.from('profiles').select('*').eq('id', authData.user.id).single();
  if (error) throw new Error(`Không thể tải hồ sơ: ${error.message}`);
  const preferences = { ...DEFAULT_PREFERENCES, ...((data.preferences as Partial<Profile['preferences']> | null) ?? {}) };
  return {
   id: data.id, name: data.full_name || authData.user.user_metadata.full_name || '',
   username: data.username || authData.user.email?.split('@')[0] || '', email: data.email || authData.user.email || '',
   role: roleLabel(data.role), avatar: data.avatar_url || '', phone: data.phone || '', bio: data.bio || '', preferences,
   sessions: [{ id: 'current', device: typeof navigator === 'undefined' ? 'Trình duyệt hiện tại' : navigator.userAgent,
    location: 'Phiên hiện tại', ip: 'Được bảo vệ', lastActive: new Date().toISOString(), isCurrent: true }],
  };
 },

 async updateProfile(changes: Partial<Profile>): Promise<Profile> {
  const supabase = createClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) throw new Error('Phiên đăng nhập đã hết hạn.');
  if (changes.email && changes.email !== authData.user.email) {
   const { error } = await supabase.auth.updateUser({ email: changes.email });
   if (error) throw new Error(`Không thể cập nhật email: ${error.message}`);
  }
  const row = Object.fromEntries(Object.entries({ full_name: changes.name, username: changes.username,
   email: changes.email, phone: changes.phone, avatar_url: changes.avatar || null, bio: changes.bio,
   preferences: changes.preferences }).filter(([, value]) => value !== undefined));
  if (Object.keys(row).length) {
   const { error } = await supabase.from('profiles').update(row).eq('id', authData.user.id);
   if (error) throw new Error(`Không thể cập nhật hồ sơ: ${error.message}`);
  }
  const profile = await this.getProfile();
  eventBus.emit('profile.updated', profile);
  return profile;
 },

 async updatePreferences(preferences: Partial<Profile['preferences']>) {
  const current = await this.getProfile();
  return this.updateProfile({ preferences: { ...current.preferences, ...preferences } });
 },

 async updatePassword(currentPassword: string, newPassword: string): Promise<void> {
  if (newPassword.length < 8 || !/[A-Za-z]/.test(newPassword) || !/\d/.test(newPassword)) {
   throw new Error('Mật khẩu mới phải có ít nhất 8 ký tự, gồm chữ và số.');
  }
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user?.email) throw new Error('Không xác định được tài khoản hiện tại.');
  const { error: verifyError } = await supabase.auth.signInWithPassword({ email: data.user.email, password: currentPassword });
  if (verifyError) throw new Error('Mật khẩu hiện tại không chính xác.');
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw new Error(`Không thể cập nhật mật khẩu: ${error.message}`);
 },

 async terminateSession(id: string): Promise<void> {
  if (id !== 'current') throw new Error('Không thể quản lý phiên này từ thiết bị hiện tại.');
  const { error } = await createClient().auth.signOut();
  if (error) throw new Error(error.message);
 },
};

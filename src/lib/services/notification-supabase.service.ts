import type { Notification } from '@/data/mock/notifications';
import { createClient } from '@/lib/supabase/client';

type NotificationRow = Record<string, unknown> & {
 admin_notification_states?: Array<{ read_at: string | null; dismissed_at: string | null }>;
};

async function currentUserId() {
 const { data } = await createClient().auth.getUser();
 if (!data.user) throw new Error('Phiên đăng nhập đã hết hạn.');
 return data.user.id;
}

export const SupabaseNotificationService = {
 async getNotifications(): Promise<Notification[]> {
  const { data, error } = await createClient().from('admin_notifications')
   .select('*,admin_notification_states(read_at,dismissed_at)').order('created_at', { ascending: false }).limit(200);
  if (error) throw new Error(`Không thể tải thông báo: ${error.message}`);
  return ((data ?? []) as NotificationRow[]).filter((row) => !row.admin_notification_states?.[0]?.dismissed_at).map((row) => ({
   id: String(row.id), title: String(row.title), message: String(row.message ?? ''),
   type: String(row.notification_type) as Notification['type'], date: String(row.created_at),
   isRead: Boolean(row.admin_notification_states?.[0]?.read_at), link: row.link ? String(row.link) : undefined,
  }));
 },
 async getUnreadCount(): Promise<number> { return (await this.getNotifications()).filter((item) => !item.isRead).length; },
 async markAsRead(id: string): Promise<void> {
  const userId = await currentUserId();
  const { error } = await createClient().from('admin_notification_states').upsert({ notification_id: id, user_id: userId, read_at: new Date().toISOString() }, { onConflict: 'notification_id,user_id' });
  if (error) throw new Error(error.message);
 },
 async markAllAsRead(): Promise<void> {
  const [userId, notifications] = await Promise.all([currentUserId(), this.getNotifications()]);
  if (!notifications.length) return;
  const now = new Date().toISOString();
  const { error } = await createClient().from('admin_notification_states').upsert(notifications.map((item) => ({ notification_id: item.id, user_id: userId, read_at: now })), { onConflict: 'notification_id,user_id' });
  if (error) throw new Error(error.message);
 },
 async deleteNotification(id: string): Promise<void> {
  const userId = await currentUserId();
  const now = new Date().toISOString();
  const { error } = await createClient().from('admin_notification_states').upsert({ notification_id: id, user_id: userId, read_at: now, dismissed_at: now }, { onConflict: 'notification_id,user_id' });
  if (error) throw new Error(error.message);
 },
};

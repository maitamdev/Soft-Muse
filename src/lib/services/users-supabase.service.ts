import type { MockRole, MockStaffMember } from './users.service';
import { createClient } from '@/lib/supabase/client';

type RoleName = 'admin' | 'manager' | 'editor';
export const PERMISSION_MODULES_AR: Record<string, string> = {
 dashboard: 'Bảng điều khiển', analytics: 'Phân tích', products: 'Sản phẩm', inventory: 'Tồn kho',
 orders: 'Đơn hàng', customers: 'Khách hàng', finance: 'Tài chính', marketing: 'Tiếp thị',
 storefront: 'Website', settings: 'Cài đặt', system: 'Hệ thống',
};
const ROLE_TO_ID: Record<RoleName, string> = { admin: 'role_1', manager: 'role_2', editor: 'role_3' };
const ID_TO_ROLE: Record<string, RoleName> = { role_1: 'admin', role_2: 'manager', role_3: 'editor' };
const ROLE_META: Record<RoleName, { name: string; color: string }> = {
 admin: { name: 'Quản trị viên', color: 'purple' }, manager: { name: 'Quản lý cửa hàng', color: 'blue' }, editor: { name: 'Biên tập viên nội dung', color: 'emerald' },
};
const FULL = { read: true, write: true, delete: true };
const RW = { read: true, write: true, delete: false };
const RO = { read: true, write: false, delete: false };
const NONE = { read: false, write: false, delete: false };

async function request<T>(url: string, init?: RequestInit): Promise<T> {
 const response = await fetch(url, { ...init, headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) } });
 const data = await response.json();
 if (!response.ok) throw new Error(data.error ?? 'Không thể xử lý yêu cầu.');
 return data as T;
}

function mapStaff(row: Record<string, unknown>): MockStaffMember {
 const role = String(row.role) as RoleName;
 const meta = ROLE_META[role] ?? ROLE_META.editor;
 return { id: String(row.id), nameAr: String(row.nameAr ?? ''), username: String(row.username ?? ''),
  email: String(row.email ?? ''), phone: row.phone ? String(row.phone) : null, roleId: ROLE_TO_ID[role] ?? 'role_3',
  roleNameAr: meta.name, roleColor: meta.color, avatarUrl: row.avatarUrl ? String(row.avatarUrl) : null,
  lastLoginAt: row.lastLoginAt ? String(row.lastLoginAt) : null, loginCount: Number(row.loginCount ?? 0),
  isSuperAdmin: role === 'admin', status: String(row.status) as MockStaffMember['status'], createdAt: String(row.createdAt),
 };
}

function fixedRoles(staff: MockStaffMember[]): MockRole[] {
 return [
  { id: 'role_1', nameAr: 'Quản trị viên', nameKey: 'admin', descriptionAr: 'Toàn quyền quản trị hệ thống.', color: 'purple', isSystem: true, staffCount: staff.filter((item) => item.roleId === 'role_1').length, permissions: { dashboard: FULL, analytics: FULL, products: FULL, inventory: FULL, orders: FULL, customers: FULL, finance: FULL, marketing: FULL, storefront: FULL, settings: FULL, system: FULL } },
  { id: 'role_2', nameAr: 'Quản lý cửa hàng', nameKey: 'manager', descriptionAr: 'Vận hành bán hàng, kho, khách hàng, tài chính và website; không quản lý tài khoản.', color: 'blue', isSystem: true, staffCount: staff.filter((item) => item.roleId === 'role_2').length, permissions: { dashboard: RW, analytics: RO, products: RW, inventory: RW, orders: RW, customers: RW, finance: RW, marketing: RW, storefront: RW, settings: RW, system: NONE } },
  { id: 'role_3', nameAr: 'Biên tập viên nội dung', nameKey: 'editor', descriptionAr: 'Quản lý danh mục, sản phẩm và nội dung website.', color: 'emerald', isSystem: true, staffCount: staff.filter((item) => item.roleId === 'role_3').length, permissions: { dashboard: RO, analytics: NONE, products: RW, inventory: NONE, orders: NONE, customers: NONE, finance: NONE, marketing: NONE, storefront: RW, settings: NONE, system: NONE } },
 ];
}

export const SupabaseUsersService = {
 async getStaff(): Promise<MockStaffMember[]> { return (await request<Array<Record<string, unknown>>>('/api/admin/users')).map(mapStaff); },
 async getStaffMember(id: string) { return (await this.getStaff()).find((item) => item.id === id); },
 isUsernameTaken(_username: string, _exceptId?: string) { return false; },
 isEmailTaken(_email: string, _exceptId?: string) { return false; },
 async createStaff(data: Omit<MockStaffMember, 'id' | 'loginCount' | 'lastLoginAt' | 'createdAt'>, password: string) {
  await request('/api/admin/users', { method: 'POST', body: JSON.stringify({ ...data, password, role: ID_TO_ROLE[data.roleId] ?? 'editor' }) });
  const staff = await this.getStaff();
  const created = staff.find((item) => item.email.toLowerCase() === data.email.toLowerCase());
  if (!created) throw new Error('Tài khoản đã tạo nhưng không thể tải lại.');
  return created;
 },
 async updateStaff(id: string, data: Partial<MockStaffMember>) {
  await request(`/api/admin/users/${id}`, { method: 'PATCH', body: JSON.stringify({ ...data, role: data.roleId ? ID_TO_ROLE[data.roleId] : undefined }) });
  const updated = (await this.getStaff()).find((item) => item.id === id);
  if (!updated) throw new Error('Không tìm thấy nhân viên sau khi cập nhật.');
  return updated;
 },
 async deleteStaff(id: string) { await request(`/api/admin/users/${id}`, { method: 'DELETE' }); },
 async setPassword(id: string, password: string) { await request(`/api/admin/users/${id}`, { method: 'PATCH', body: JSON.stringify({ password }) }); },
 async changePassword(_id: string, currentPassword: string, newPassword: string) {
  const supabase = createClient(); const { data } = await supabase.auth.getUser();
  if (!data.user?.email) throw new Error('Phiên đăng nhập đã hết hạn.');
  const { error: verifyError } = await supabase.auth.signInWithPassword({ email: data.user.email, password: currentPassword });
  if (verifyError) throw new Error('Mật khẩu hiện tại không chính xác.');
  const { error } = await supabase.auth.updateUser({ password: newPassword }); if (error) throw new Error(error.message);
 },
 async recordLogin(_staffId: string) {},
 async getRoles(): Promise<MockRole[]> { return fixedRoles(await this.getStaff()); },
 async getRole(id: string) { return (await this.getRoles()).find((role) => role.id === id); },
 async createRole(_data: Omit<MockRole, 'id' | 'staffCount' | 'isSystem'>): Promise<MockRole> { throw new Error('Ba vai trò hệ thống được cố định để đồng bộ với RLS và không thể tạo từ giao diện.'); },
 async updateRole(_id: string, _data: Partial<Omit<MockRole, 'id' | 'isSystem' | 'nameKey'>>): Promise<MockRole> { throw new Error('Quyền hệ thống được quản lý bằng migration để luôn đồng bộ với database.'); },
 async deleteRole(_id: string): Promise<void> { throw new Error('Không thể xóa vai trò hệ thống.'); },
};

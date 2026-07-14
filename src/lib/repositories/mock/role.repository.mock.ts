import { BaseMockRepository } from './BaseMockRepository';
import type { Role, RoleCreateDTO, RoleUpdateDTO, PermissionMatrix } from '@/types/administration';
import type { IRoleRepository } from '@/lib/contracts/v2/IAdministrationRepository';
import type { BaseEntity } from '@/types/base';
import { PERMISSION_MODULES } from '@/types/administration';

const makeFullPermissions = () =>
 Object.fromEntries(PERMISSION_MODULES.map(m => [m, { read: true, write: true, delete: true, export: true, approve: true, archive: true, restore: true }]));

const SYSTEM_ROLES: Role[] = [
 { id: 'role_admin', nameAr: 'Quản trị hệ thống', nameKey: 'administrator', descriptionAr: 'Toàn quyền', isSystem: true, permissions: makeFullPermissions(), color: '#4F46E5', createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z', createdBy: 'system', updatedBy: 'system', status: 'active', isArchived: false, deletedAt: null },
 { id: 'role_store_mgr', nameAr: 'Quản lý cửa hàng', nameKey: 'store_manager', descriptionAr: 'Quản lý cửa hàng và đơn hàng', isSystem: true, permissions: makeFullPermissions(), color: '#22C55E', createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z', createdBy: 'system', updatedBy: 'system', status: 'active', isArchived: false, deletedAt: null },
 { id: 'role_inventory', nameAr: 'Quản lý tồn kho', nameKey: 'inventory_manager', descriptionAr: 'Quản lý tồn kho và mua hàng', isSystem: true, permissions: makeFullPermissions(), color: '#F59E0B', createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z', createdBy: 'system', updatedBy: 'system', status: 'active', isArchived: false, deletedAt: null },
 { id: 'role_finance', nameAr: 'Quản lý tài chính', nameKey: 'finance_manager', descriptionAr: 'Quản lý tài chính và báo cáo', isSystem: true, permissions: makeFullPermissions(), color: '#EF4444', createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z', createdBy: 'system', updatedBy: 'system', status: 'active', isArchived: false, deletedAt: null },
 { id: 'role_support', nameAr: 'Hỗ trợ khách hàng', nameKey: 'customer_support', descriptionAr: 'Chăm sóc và hỗ trợ khách hàng', isSystem: true, permissions: makeFullPermissions(), color: '#38BDF8', createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z', createdBy: 'system', updatedBy: 'system', status: 'active', isArchived: false, deletedAt: null },
];

export class MockRoleRepository
 extends BaseMockRepository<Role, RoleCreateDTO, RoleUpdateDTO>
 implements IRoleRepository {

 constructor() { super(SYSTEM_ROLES); }

 protected buildEntity(data: RoleCreateDTO, base: BaseEntity): Role { return { ...base, ...data } as Role; }
 protected mergeUpdate(e: Role, d: RoleUpdateDTO): Role { return { ...e, ...d }; }

 async findByKey(nameKey: string) { return this.items.find(r => r.nameKey === nameKey && !r.deletedAt) ?? null; }
 async getSystemRoles() { return this.items.filter(r => r.isSystem && !r.deletedAt); }
 async updatePermissions(id: string, permissions: PermissionMatrix) { return this.update(id, { permissions } as any); }
 async getStaffCount(_roleId: string) { return 0; }

 async softDelete(id: string) {
 const role = await this.findById(id);
 if (role?.isSystem) throw new Error('Không thể xóa vai trò hệ thống mặc định');
 return super.softDelete(id);
 }
}

import { BaseMockRepository } from './BaseMockRepository';
import type { Role, RoleCreateDTO, RoleUpdateDTO, PermissionMatrix } from '@/types/administration';
import type { IRoleRepository } from '@/lib/contracts/v2/IAdministrationRepository';
import type { BaseEntity } from '@/types/base';
import { PERMISSION_MODULES } from '@/types/administration';

const makeFullPermissions = () =>
  Object.fromEntries(PERMISSION_MODULES.map(m => [m, { read: true, write: true, delete: true, export: true, approve: true, archive: true, restore: true }]));

const SYSTEM_ROLES: Role[] = [
  { id: 'role_admin', nameAr: 'مدير النظام', nameKey: 'administrator', descriptionAr: 'صلاحيات كاملة', isSystem: true, permissions: makeFullPermissions(), color: '#4F46E5', createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z', createdBy: 'system', updatedBy: 'system', status: 'active', isArchived: false, deletedAt: null },
  { id: 'role_store_mgr', nameAr: 'مدير المتجر', nameKey: 'store_manager', descriptionAr: 'إدارة المتجر والطلبات', isSystem: true, permissions: makeFullPermissions(), color: '#22C55E', createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z', createdBy: 'system', updatedBy: 'system', status: 'active', isArchived: false, deletedAt: null },
  { id: 'role_inventory', nameAr: 'مدير المخزون', nameKey: 'inventory_manager', descriptionAr: 'إدارة المخزون والمشتريات', isSystem: true, permissions: makeFullPermissions(), color: '#F59E0B', createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z', createdBy: 'system', updatedBy: 'system', status: 'active', isArchived: false, deletedAt: null },
  { id: 'role_finance', nameAr: 'المدير المالي', nameKey: 'finance_manager', descriptionAr: 'إدارة المالية والتقارير', isSystem: true, permissions: makeFullPermissions(), color: '#EF4444', createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z', createdBy: 'system', updatedBy: 'system', status: 'active', isArchived: false, deletedAt: null },
  { id: 'role_support', nameAr: 'دعم العملاء', nameKey: 'customer_support', descriptionAr: 'خدمة العملاء والدعم', isSystem: true, permissions: makeFullPermissions(), color: '#38BDF8', createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z', createdBy: 'system', updatedBy: 'system', status: 'active', isArchived: false, deletedAt: null },
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
    if (role?.isSystem) throw new Error('لا يمكن حذف الأدوار الأساسية للنظام');
    return super.softDelete(id);
  }
}

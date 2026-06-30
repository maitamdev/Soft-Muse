import { BaseMockRepository } from './BaseMockRepository';
import type { StaffMember, StaffCreateDTO, StaffUpdateDTO, PermissionMatrix } from '@/types/administration';
import type { IStaffRepository } from '@/lib/contracts/v2/IAdministrationRepository';
import type { BaseEntity } from '@/types/base';
import type { PaginatedResult, QueryOptions } from '@/types/query';
import { paginate } from '@/types/query';

const SEED_STAFF: StaffMember[] = [{
  id: 'staff_admin_001',
  nameAr: 'مدير النظام',
  email: 'admin@aura.sa',
  phone: null,
  roleId: 'role_admin',
  avatarUrl: null,
  lastLoginAt: null,
  loginCount: 0,
  isSuperAdmin: true,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  createdBy: 'system',
  updatedBy: 'system',
  status: 'active',
  isArchived: false,
  deletedAt: null,
}];

export class MockStaffRepository
  extends BaseMockRepository<StaffMember, StaffCreateDTO, StaffUpdateDTO>
  implements IStaffRepository {

  constructor() { super(SEED_STAFF); }

  protected buildEntity(data: StaffCreateDTO, base: BaseEntity): StaffMember {
    return { ...base, lastLoginAt: null, loginCount: 0, ...data } as StaffMember;
  }
  protected mergeUpdate(e: StaffMember, d: StaffUpdateDTO): StaffMember { return { ...e, ...d }; }
  protected applySearch(items: StaffMember[], s: string) {
    const q = s.toLowerCase();
    return items.filter(i => i.nameAr.includes(q) || i.email.includes(q));
  }

  async findByEmail(email: string) { return this.items.find(s => s.email === email && !s.deletedAt) ?? null; }
  async getByRole(roleId: string, options?: QueryOptions): Promise<PaginatedResult<StaffMember>> {
    return paginate(this.items.filter(s => s.roleId === roleId && !s.deletedAt), options);
  }
  async getActive() { return this.items.filter(s => s.status === 'active' && !s.deletedAt); }
  async updateRole(id: string, roleId: string) { return this.update(id, { roleId } as any); }
  async recordLogin(id: string, _meta: any) {
    const idx = this.items.findIndex(s => s.id === id);
    if (idx !== -1) this.items[idx] = { ...this.items[idx], lastLoginAt: new Date().toISOString(), loginCount: this.items[idx].loginCount + 1 };
  }
  async getPermissions(_id: string): Promise<PermissionMatrix> { return {}; }
  async hasPermission(_id: string, _module: string, _action: string): Promise<boolean> { return true; }
}

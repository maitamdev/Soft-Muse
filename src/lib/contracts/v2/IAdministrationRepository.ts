import type { Role, RoleCreateDTO, RoleUpdateDTO, StaffMember, StaffCreateDTO, StaffUpdateDTO, ActivityLog, ActivityAction, PermissionMatrix } from '@/types/administration';
import type { PaginatedResult, QueryOptions } from '@/types/query';
import type { IBaseRepository } from './IBaseRepository';

export interface IRoleRepository
 extends IBaseRepository<Role, RoleCreateDTO, RoleUpdateDTO> {
 findByKey(nameKey: string): Promise<Role | null>;
 getSystemRoles(): Promise<Role[]>;
 updatePermissions(id: string, permissions: PermissionMatrix): Promise<Role>;
 getStaffCount(roleId: string): Promise<number>;
}

export interface IStaffRepository
 extends IBaseRepository<StaffMember, StaffCreateDTO, StaffUpdateDTO> {
 findByEmail(email: string): Promise<StaffMember | null>;
 getByRole(roleId: string, options?: QueryOptions): Promise<PaginatedResult<StaffMember>>;
 getActive(): Promise<StaffMember[]>;
 updateRole(id: string, roleId: string): Promise<StaffMember>;
 recordLogin(id: string, metadata: { ip?: string; device?: string; browser?: string }): Promise<void>;
 getPermissions(id: string): Promise<PermissionMatrix>;
 hasPermission(id: string, module: string, action: string): Promise<boolean>;
}

export interface IActivityLogRepository {
 list(options?: QueryOptions & {
 staffId?: string;
 module?: string;
 action?: ActivityAction;
 entityType?: string;
 dateFrom?: string;
 dateTo?: string;
 }): Promise<PaginatedResult<ActivityLog>>;

 create(data: Omit<ActivityLog, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'deletedAt' | 'isArchived' | 'status'>): Promise<ActivityLog>;

 getByEntity(entityType: string, entityId: string): Promise<ActivityLog[]>;
 getByStaff(staffId: string, options?: QueryOptions): Promise<PaginatedResult<ActivityLog>>;
 purgeOlderThan(days: number): Promise<number>; // Returns count of purged records
}

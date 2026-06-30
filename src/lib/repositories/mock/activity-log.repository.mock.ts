import type { ActivityLog, ActivityAction } from '@/types/administration';
import type { IActivityLogRepository } from '@/lib/contracts/v2/IAdministrationRepository';
import type { PaginatedResult, QueryOptions } from '@/types/query';
import { paginate } from '@/types/query';
import { createBaseFields } from '@/lib/utils/base-entity';

export class MockActivityLogRepository implements IActivityLogRepository {
  private logs: ActivityLog[] = [];

  async list(options: QueryOptions & { staffId?: string; module?: string; action?: ActivityAction; entityType?: string; dateFrom?: string; dateTo?: string } = {}): Promise<PaginatedResult<ActivityLog>> {
    let result = [...this.logs];
    if (options.staffId) result = result.filter(l => l.staffId === options.staffId);
    if (options.module) result = result.filter(l => l.module === options.module);
    if (options.action) result = result.filter(l => l.action === options.action);
    if (options.entityType) result = result.filter(l => l.entityType === options.entityType);
    if (options.dateFrom) result = result.filter(l => l.createdAt >= options.dateFrom!);
    if (options.dateTo) result = result.filter(l => l.createdAt <= options.dateTo!);
    if (options.search) { const q = options.search.toLowerCase(); result = result.filter(l => l.entityLabel.toLowerCase().includes(q)); }
    return paginate(result, options);
  }

  async create(data: Omit<ActivityLog, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'deletedAt' | 'isArchived' | 'status'>): Promise<ActivityLog> {
    const log: ActivityLog = { ...createBaseFields(data.staffId), ...data };
    this.logs.unshift(log);
    return log;
  }

  async getByEntity(entityType: string, entityId: string) {
    return this.logs.filter(l => l.entityType === entityType && l.entityId === entityId);
  }

  async getByStaff(staffId: string, options?: QueryOptions): Promise<PaginatedResult<ActivityLog>> {
    return paginate(this.logs.filter(l => l.staffId === staffId), options);
  }

  async purgeOlderThan(days: number): Promise<number> {
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    const before = this.logs.length;
    this.logs = this.logs.filter(l => l.createdAt >= cutoff);
    return before - this.logs.length;
  }
}

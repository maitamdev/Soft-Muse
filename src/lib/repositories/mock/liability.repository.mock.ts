import { BaseMockRepository } from './BaseMockRepository';
import type { Liability, LiabilityCreateDTO, LiabilityUpdateDTO } from '@/types/finance';
import type { ILiabilityRepository } from '@/lib/contracts/v2/IFinanceRepository';
import type { BaseEntity } from '@/types/base';
export class MockLiabilityRepository extends BaseMockRepository<Liability, LiabilityCreateDTO, LiabilityUpdateDTO> implements ILiabilityRepository {
  protected buildEntity(data: LiabilityCreateDTO, base: BaseEntity): Liability { return { ...base, ...data } as Liability; }
  protected mergeUpdate(e: Liability, d: LiabilityUpdateDTO): Liability { return { ...e, ...d }; }
  async getOverdue() { const now = new Date().toISOString().split('T')[0]; return this.items.filter(l => l.dueDate < now && !l.deletedAt); }
  async getTotalOutstanding() { return this.items.filter(l => !l.deletedAt).reduce((s, l) => s + l.outstandingAmount, 0); }
}

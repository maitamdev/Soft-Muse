import { BaseMockRepository } from './BaseMockRepository';
import type { Capital, CapitalCreateDTO, CapitalUpdateDTO } from '@/types/finance';
import type { ICapitalRepository } from '@/lib/contracts/v2/IFinanceRepository';
import type { BaseEntity } from '@/types/base';
export class MockCapitalRepository extends BaseMockRepository<Capital, CapitalCreateDTO, CapitalUpdateDTO> implements ICapitalRepository {
 protected buildEntity(data: CapitalCreateDTO, base: BaseEntity): Capital { return { ...base, ...data } as Capital; }
 protected mergeUpdate(e: Capital, d: CapitalUpdateDTO): Capital { return { ...e, ...d }; }
 async getTotalCapital() { return this.items.filter(c => !c.deletedAt).reduce((s, c) => s + (c.type === 'increase' ? c.amount : -c.amount), 0); }
 async getByType(type: 'increase' | 'withdrawal') { return this.items.filter(c => c.type === type && !c.deletedAt); }
}

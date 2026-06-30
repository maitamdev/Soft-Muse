import { BaseMockRepository } from './BaseMockRepository';
import type { Expense, ExpenseCreateDTO, ExpenseUpdateDTO, ExpenseCategoryType } from '@/types/finance';
import type { IExpenseRepository } from '@/lib/contracts/v2/IFinanceRepository';
import type { BaseEntity } from '@/types/base';
import type { PaginatedResult, QueryOptions } from '@/types/query';
import { paginate } from '@/types/query';
export class MockExpenseRepository extends BaseMockRepository<Expense, ExpenseCreateDTO, ExpenseUpdateDTO> implements IExpenseRepository {
  protected buildEntity(data: ExpenseCreateDTO, base: BaseEntity): Expense { return { ...base, ...data } as Expense; }
  protected mergeUpdate(e: Expense, d: ExpenseUpdateDTO): Expense { return { ...e, ...d }; }
  protected applySearch(items: Expense[], s: string) { const q = s.toLowerCase(); return items.filter(i => i.nameAr.includes(q)); }
  async getByCategory(category: ExpenseCategoryType, options?: QueryOptions): Promise<PaginatedResult<Expense>> { return paginate(this.items.filter(e => e.category === category && !e.deletedAt), options); }
  async getByDateRange(from: string, to: string, options?: QueryOptions): Promise<PaginatedResult<Expense>> { return paginate(this.items.filter(e => e.date >= from && e.date <= to && !e.deletedAt), options); }
  async getTotalByCategory(category: ExpenseCategoryType) { return this.items.filter(e => e.category === category && !e.deletedAt).reduce((s, e) => s + e.totalAmount, 0); }
}

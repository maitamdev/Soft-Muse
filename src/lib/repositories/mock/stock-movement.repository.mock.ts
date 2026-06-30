import type { StockMovement, StockMovementType } from '@/types/inventory';
import type { IStockMovementRepository } from '@/lib/contracts/v2/IInventoryRepository';
import type { PaginatedResult, QueryOptions } from '@/types/query';
import { paginate } from '@/types/query';
import { createBaseFields } from '@/lib/utils/base-entity';
export class MockStockMovementRepository implements IStockMovementRepository {
  private movements: StockMovement[] = [];
  async list(options: QueryOptions & { productId?: string; warehouseId?: string; type?: StockMovementType; dateFrom?: string; dateTo?: string } = {}): Promise<PaginatedResult<StockMovement>> {
    let items = [...this.movements];
    if (options.productId) items = items.filter(m => m.productId === options.productId);
    if (options.warehouseId) items = items.filter(m => m.warehouseId === options.warehouseId);
    if (options.type) items = items.filter(m => m.type === options.type);
    return paginate(items, options);
  }
  async create(data: Omit<StockMovement, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'deletedAt' | 'isArchived' | 'status'>): Promise<StockMovement> {
    const m: StockMovement = { ...createBaseFields(), ...data };
    this.movements.unshift(m);
    return m;
  }
  async getByReference(referenceType: string, referenceId: string) { return this.movements.filter(m => m.referenceType === referenceType && m.referenceId === referenceId); }
}

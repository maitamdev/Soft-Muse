import { BaseMockRepository } from './BaseMockRepository';
import type { InventoryAdjustment, InventoryAdjustmentCreateDTO } from '@/types/inventory';
import type { IInventoryAdjustmentRepository } from '@/lib/contracts/v2/IInventoryRepository';
import type { BaseEntity } from '@/types/base';
export class MockInventoryAdjustmentRepository extends BaseMockRepository<InventoryAdjustment, InventoryAdjustmentCreateDTO, Partial<InventoryAdjustmentCreateDTO>> implements IInventoryAdjustmentRepository {
  protected buildEntity(data: InventoryAdjustmentCreateDTO, base: BaseEntity): InventoryAdjustment { return { ...base, approvedBy: null, ...data } as InventoryAdjustment; }
  protected mergeUpdate(e: InventoryAdjustment, d: Partial<InventoryAdjustmentCreateDTO>): InventoryAdjustment { return { ...e, ...d }; }
  async approve(id: string, approvedBy: string) { return this.update(id, { approvedBy } as any); }
}

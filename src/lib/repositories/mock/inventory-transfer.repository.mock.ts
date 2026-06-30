import { BaseMockRepository } from './BaseMockRepository';
import type { InventoryTransfer, InventoryTransferCreateDTO } from '@/types/inventory';
import type { IInventoryTransferRepository } from '@/lib/contracts/v2/IInventoryRepository';
import type { BaseEntity } from '@/types/base';
export class MockInventoryTransferRepository extends BaseMockRepository<InventoryTransfer, InventoryTransferCreateDTO, Partial<InventoryTransferCreateDTO>> implements IInventoryTransferRepository {
  protected buildEntity(data: InventoryTransferCreateDTO, base: BaseEntity): InventoryTransfer { return { ...base, approvedBy: null, approvedAt: null, completedAt: null, ...data } as InventoryTransfer; }
  protected mergeUpdate(e: InventoryTransfer, d: Partial<InventoryTransferCreateDTO>): InventoryTransfer { return { ...e, ...d }; }
  async approve(id: string, approvedBy: string) { return this.update(id, { status: 'approved' } as any); }
  async complete(id: string) { return this.update(id, { status: 'completed' } as any); }
  async cancel(id: string) { return this.update(id, { status: 'cancelled' } as any); }
}

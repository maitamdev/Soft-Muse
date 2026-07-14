import { BaseMockRepository } from './BaseMockRepository';
import type { PurchaseReceipt, PurchaseReceiptCreateDTO } from '@/types/procurement';
import type { IPurchaseReceiptRepository } from '@/lib/contracts/v2/IProcurementRepository';
import type { BaseEntity } from '@/types/base';
import type { PaginatedResult, QueryOptions } from '@/types/query';
import { paginate } from '@/types/query';
export class MockPurchaseReceiptRepository extends BaseMockRepository<PurchaseReceipt, PurchaseReceiptCreateDTO, never> implements IPurchaseReceiptRepository {
 protected buildEntity(data: PurchaseReceiptCreateDTO, base: BaseEntity): PurchaseReceipt { return { ...base, ...data } as PurchaseReceipt; }
 protected mergeUpdate(e: PurchaseReceipt, _: never): PurchaseReceipt { return e; }
 async getByPO(poId: string) { return this.items.filter(r => r.poId === poId && !r.deletedAt); }
 async getByWarehouse(warehouseId: string, options?: QueryOptions): Promise<PaginatedResult<PurchaseReceipt>> { return paginate(this.items.filter(r => r.warehouseId === warehouseId && !r.deletedAt), options); }
}

import { BaseMockRepository } from './BaseMockRepository';
import type { PurchaseOrder, PurchaseOrderCreateDTO, PurchaseOrderUpdateDTO, POStatus } from '@/types/procurement';
import type { IPurchaseOrderRepository } from '@/lib/contracts/v2/IProcurementRepository';
import type { BaseEntity } from '@/types/base';
import type { PaginatedResult, QueryOptions } from '@/types/query';
import { paginate } from '@/types/query';
export class MockPurchaseOrderRepository extends BaseMockRepository<PurchaseOrder, PurchaseOrderCreateDTO, PurchaseOrderUpdateDTO> implements IPurchaseOrderRepository {
 protected buildEntity(data: PurchaseOrderCreateDTO, base: BaseEntity): PurchaseOrder { return { ...base, approvedBy: null, approvedAt: null, receivedPercent: 0, paidAmount: 0, ...data } as PurchaseOrder; }
 protected mergeUpdate(e: PurchaseOrder, d: PurchaseOrderUpdateDTO): PurchaseOrder { return { ...e, ...d }; }
 async updateStatus(id: string, status: POStatus) { return this.update(id, { status } as any); }
 async getBySupplier(supplierId: string, options?: QueryOptions): Promise<PaginatedResult<PurchaseOrder>> { return paginate(this.items.filter(p => p.supplierId === supplierId && !p.deletedAt), options); }
 async getPending() { return this.items.filter(p => ['approved', 'sent', 'partially_received'].includes(p.status) && !p.deletedAt); }
}

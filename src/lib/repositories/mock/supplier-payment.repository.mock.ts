import { BaseMockRepository } from './BaseMockRepository';
import type { SupplierPayment, SupplierPaymentCreateDTO } from '@/types/procurement';
import type { ISupplierPaymentRepository } from '@/lib/contracts/v2/IProcurementRepository';
import type { BaseEntity } from '@/types/base';
import type { PaginatedResult, QueryOptions } from '@/types/query';
import { paginate } from '@/types/query';
export class MockSupplierPaymentRepository extends BaseMockRepository<SupplierPayment, SupplierPaymentCreateDTO, Partial<SupplierPaymentCreateDTO>> implements ISupplierPaymentRepository {
 protected buildEntity(data: SupplierPaymentCreateDTO, base: BaseEntity): SupplierPayment { return { ...base, ...data } as SupplierPayment; }
 protected mergeUpdate(e: SupplierPayment, d: Partial<SupplierPaymentCreateDTO>): SupplierPayment { return { ...e, ...d }; }
 async getBySupplier(supplierId: string, options?: QueryOptions): Promise<PaginatedResult<SupplierPayment>> { return paginate(this.items.filter(p => p.supplierId === supplierId && !p.deletedAt), options); }
 async getByPO(poId: string) { return this.items.filter(p => p.poId === poId && !p.deletedAt); }
 async getTotalPaid(supplierId: string) { return this.items.filter(p => p.supplierId === supplierId && !p.deletedAt).reduce((s, p) => s + p.amount, 0); }
 async getOutstanding(_supplierId: string) { return 0; }
}

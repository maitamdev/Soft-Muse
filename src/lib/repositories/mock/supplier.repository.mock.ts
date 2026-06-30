import { BaseMockRepository } from './BaseMockRepository';
import type { Supplier, SupplierCreateDTO, SupplierUpdateDTO, PurchaseOrder, SupplierPayment } from '@/types/procurement';
import type { ISupplierRepository } from '@/lib/contracts/v2/IProcurementRepository';
import type { BaseEntity } from '@/types/base';
import type { PaginatedResult, QueryOptions } from '@/types/query';
import { paginate } from '@/types/query';
export class MockSupplierRepository extends BaseMockRepository<Supplier, SupplierCreateDTO, SupplierUpdateDTO> implements ISupplierRepository {
  protected buildEntity(data: SupplierCreateDTO, base: BaseEntity): Supplier { return { ...base, totalPurchases: 0, outstandingBalance: 0, lastOrderDate: null, ...data } as Supplier; }
  protected mergeUpdate(e: Supplier, d: SupplierUpdateDTO): Supplier { return { ...e, ...d }; }
  protected applySearch(items: Supplier[], s: string) { const q = s.toLowerCase(); return items.filter(i => i.nameAr.includes(q) || i.supplierCode.toLowerCase().includes(q)); }
  async duplicate(id: string) { return this.duplicateEntity(id, e => ({ nameAr: `${e.nameAr} (نسخة)`, supplierCode: `${e.supplierCode}-COPY` })); }
  async getOrderHistory(_id: string, options?: QueryOptions): Promise<PaginatedResult<PurchaseOrder>> { return paginate([], options); }
  async getPaymentHistory(_id: string, options?: QueryOptions): Promise<PaginatedResult<SupplierPayment>> { return paginate([], options); }
  async updateStats(_id: string) {}
}

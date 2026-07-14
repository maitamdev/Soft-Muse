import type { Supplier, SupplierCreateDTO, SupplierUpdateDTO, PurchaseOrder, PurchaseOrderCreateDTO, PurchaseOrderUpdateDTO, PurchaseReceipt, PurchaseReceiptCreateDTO, SupplierPayment, SupplierPaymentCreateDTO, POStatus } from '@/types/procurement';
import type { PaginatedResult, QueryOptions } from '@/types/query';
import type { IBaseRepository } from './IBaseRepository';

export interface ISupplierRepository
 extends IBaseRepository<Supplier, SupplierCreateDTO, SupplierUpdateDTO> {
 duplicate(id: string): Promise<Supplier>;
 getOrderHistory(supplierId: string, options?: QueryOptions): Promise<PaginatedResult<PurchaseOrder>>;
 getPaymentHistory(supplierId: string, options?: QueryOptions): Promise<PaginatedResult<SupplierPayment>>;
 updateStats(supplierId: string): Promise<void>; // Recomputes totalPurchases, outstandingBalance
}

export interface IPurchaseOrderRepository
 extends IBaseRepository<PurchaseOrder, PurchaseOrderCreateDTO, PurchaseOrderUpdateDTO> {
 updateStatus(id: string, status: POStatus): Promise<PurchaseOrder>;
 getBySupplier(supplierId: string, options?: QueryOptions): Promise<PaginatedResult<PurchaseOrder>>;
 getPending(): Promise<PurchaseOrder[]>; // Orders awaiting receipt
}

export interface IPurchaseReceiptRepository
 extends IBaseRepository<PurchaseReceipt, PurchaseReceiptCreateDTO, never> {
 getByPO(poId: string): Promise<PurchaseReceipt[]>;
 getByWarehouse(warehouseId: string, options?: QueryOptions): Promise<PaginatedResult<PurchaseReceipt>>;
 // On creation: updates PO receivedQty per item + creates StockMovements + closes PO if fully received
}

export interface ISupplierPaymentRepository
 extends IBaseRepository<SupplierPayment, SupplierPaymentCreateDTO, Partial<SupplierPaymentCreateDTO>> {
 getBySupplier(supplierId: string, options?: QueryOptions): Promise<PaginatedResult<SupplierPayment>>;
 getByPO(poId: string): Promise<SupplierPayment[]>;
 getTotalPaid(supplierId: string): Promise<number>;
 getOutstanding(supplierId: string): Promise<number>;
}

import type { Return, ReturnCreateDTO, ReturnUpdateDTO, ReturnStatus, Refund, RefundCreateDTO, RefundUpdateDTO, RefundStatus } from '@/types/returns';
import type { PaginatedResult, QueryOptions } from '@/types/query';
import type { IBaseRepository } from './IBaseRepository';

export interface IReturnRepository
 extends IBaseRepository<Return, ReturnCreateDTO, ReturnUpdateDTO> {

 getByOrder(orderId: string): Promise<Return[]>;
 getByCustomer(customerId: string, options?: QueryOptions): Promise<PaginatedResult<Return>>;
 getByStatus(returnStatus: ReturnStatus, options?: QueryOptions): Promise<PaginatedResult<Return>>;

 /** Approve — creates StockMovements for restockable items, optionally auto-creates Refund */
 approve(id: string, approvedBy: string): Promise<Return>;

 /** Reject with reason */
 reject(id: string, reason: string, rejectedBy: string): Promise<Return>;

 /** Mark as received at warehouse */
 markReceived(id: string, receivedBy: string): Promise<Return>;

 /** Mark as inspected */
 markInspected(id: string, inspectionNotes: string): Promise<Return>;

 /** Complete the return process */
 complete(id: string): Promise<Return>;
}

export interface IRefundRepository
 extends IBaseRepository<Refund, RefundCreateDTO, RefundUpdateDTO> {

 getByOrder(orderId: string): Promise<Refund[]>;
 getByReturn(returnId: string): Promise<Refund | null>;
 getByCustomer(customerId: string, options?: QueryOptions): Promise<PaginatedResult<Refund>>;
 getByStatus(refundStatus: RefundStatus, options?: QueryOptions): Promise<PaginatedResult<Refund>>;

 /** Process a pending refund */
 process(id: string, processedBy: string, gatewayReference?: string): Promise<Refund>;

 /** Mark as failed */
 markFailed(id: string, reason: string): Promise<Refund>;

 getTotalRefunded(customerId?: string, from?: string, to?: string): Promise<number>;
}

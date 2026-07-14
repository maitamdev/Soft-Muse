import { BaseMockRepository } from './BaseMockRepository';
import type { Refund, RefundCreateDTO, RefundUpdateDTO, RefundStatus } from '@/types/returns';
import type { IRefundRepository } from '@/lib/contracts/v2/IReturnRepository';
import type { BaseEntity } from '@/types/base';
import type { PaginatedResult, QueryOptions } from '@/types/query';
import { paginate } from '@/types/query';
export class MockRefundRepository extends BaseMockRepository<Refund, RefundCreateDTO, RefundUpdateDTO> implements IRefundRepository {
 protected buildEntity(data: RefundCreateDTO, base: BaseEntity): Refund { return { ...base, processedBy: null, processedAt: null, gatewayReference: null, ...data } as Refund; }
 protected mergeUpdate(e: Refund, d: RefundUpdateDTO): Refund { return { ...e, ...d }; }
 async getByOrder(orderId: string) { return this.items.filter(r => r.orderId === orderId && !r.deletedAt); }
 async getByReturn(returnId: string) { return this.items.find(r => r.returnId === returnId && !r.deletedAt) ?? null; }
 async getByCustomer(customerId: string, options?: QueryOptions): Promise<PaginatedResult<Refund>> { return paginate(this.items.filter(r => r.customerId === customerId && !r.deletedAt), options); }
 async getByStatus(refundStatus: RefundStatus, options?: QueryOptions): Promise<PaginatedResult<Refund>> { return paginate(this.items.filter(r => r.refundStatus === refundStatus && !r.deletedAt), options); }
 async process(id: string, processedBy: string, gatewayReference?: string) { return this.update(id, { refundStatus: 'completed', processedBy, processedAt: new Date().toISOString(), gatewayReference: gatewayReference ?? null } as any); }
 async markFailed(id: string, _reason: string) { return this.update(id, { refundStatus: 'failed' } as any); }
 async getTotalRefunded() { return this.items.filter(r => r.refundStatus === 'completed' && !r.deletedAt).reduce((s, r) => s + r.amount, 0); }
}

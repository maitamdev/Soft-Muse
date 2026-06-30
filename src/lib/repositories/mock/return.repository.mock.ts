import { BaseMockRepository } from './BaseMockRepository';
import type { Return, ReturnCreateDTO, ReturnUpdateDTO, ReturnStatus } from '@/types/returns';
import type { IReturnRepository } from '@/lib/contracts/v2/IReturnRepository';
import type { BaseEntity } from '@/types/base';
import type { PaginatedResult, QueryOptions } from '@/types/query';
import { paginate } from '@/types/query';
export class MockReturnRepository extends BaseMockRepository<Return, ReturnCreateDTO, ReturnUpdateDTO> implements IReturnRepository {
  protected buildEntity(data: ReturnCreateDTO, base: BaseEntity): Return { return { ...base, refundId: null, approvedBy: null, approvedAt: null, receivedAt: null, inspectedAt: null, completedAt: null, ...data } as Return; }
  protected mergeUpdate(e: Return, d: ReturnUpdateDTO): Return { return { ...e, ...d }; }
  async getByOrder(orderId: string) { return this.items.filter(r => r.orderId === orderId && !r.deletedAt); }
  async getByCustomer(customerId: string, options?: QueryOptions): Promise<PaginatedResult<Return>> { return paginate(this.items.filter(r => r.customerId === customerId && !r.deletedAt), options); }
  async getByStatus(returnStatus: ReturnStatus, options?: QueryOptions): Promise<PaginatedResult<Return>> { return paginate(this.items.filter(r => r.returnStatus === returnStatus && !r.deletedAt), options); }
  async approve(id: string, approvedBy: string) { return this.update(id, { returnStatus: 'approved', approvedBy, approvedAt: new Date().toISOString() } as any); }
  async reject(id: string, _reason: string, rejectedBy: string) { return this.update(id, { returnStatus: 'rejected', approvedBy: rejectedBy } as any); }
  async markReceived(id: string, _by: string) { return this.update(id, { returnStatus: 'received', receivedAt: new Date().toISOString() } as any); }
  async markInspected(id: string, notes: string) { return this.update(id, { returnStatus: 'inspected', inspectionNotes: notes, inspectedAt: new Date().toISOString() } as any); }
  async complete(id: string) { return this.update(id, { returnStatus: 'completed', completedAt: new Date().toISOString() } as any); }
}

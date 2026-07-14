import { BaseMockRepository } from './BaseMockRepository';
import type { SupportTicket, SupportTicketCreateDTO, SupportMessage, TicketStatus } from '@/types/crm';
import type { ISupportRepository } from '@/lib/contracts/v2/ICrmRepository';
import type { BaseEntity } from '@/types/base';
import type { PaginatedResult, QueryOptions } from '@/types/query';
import { paginate } from '@/types/query';
import { createBaseFields } from '@/lib/utils/base-entity';

export class MockSupportRepository
 extends BaseMockRepository<SupportTicket, SupportTicketCreateDTO, Partial<SupportTicketCreateDTO>>
 implements ISupportRepository {

 protected buildEntity(data: SupportTicketCreateDTO, base: BaseEntity): SupportTicket {
 return { ...base, firstResponseAt: null, resolvedAt: null, closedAt: null, satisfactionRating: null, messages: [], ...data } as SupportTicket;
 }
 protected mergeUpdate(e: SupportTicket, d: Partial<SupportTicketCreateDTO>): SupportTicket { return { ...e, ...d }; }

 async getByCustomer(customerId: string, options?: QueryOptions): Promise<PaginatedResult<SupportTicket>> {
 return paginate(this.items.filter(t => t.customerId === customerId && !t.deletedAt), options);
 }
 async getByStatus(ticketStatus: TicketStatus, options?: QueryOptions): Promise<PaginatedResult<SupportTicket>> {
 return paginate(this.items.filter(t => t.ticketStatus === ticketStatus && !t.deletedAt), options);
 }
 async getByAssignee(staffId: string, options?: QueryOptions): Promise<PaginatedResult<SupportTicket>> {
 return paginate(this.items.filter(t => t.assignedTo === staffId && !t.deletedAt), options);
 }
 async getOpen(options?: QueryOptions): Promise<PaginatedResult<SupportTicket>> {
 return paginate(this.items.filter(t => ['open', 'in_progress'].includes(t.ticketStatus) && !t.deletedAt), options);
 }
 async addMessage(ticketId: string, data: Omit<SupportMessage, 'id' | 'ticketId' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'deletedAt' | 'isArchived' | 'status'>): Promise<SupportMessage> {
 const msg: SupportMessage = { ...createBaseFields(), ticketId, ...data };
 const idx = this.items.findIndex(t => t.id === ticketId);
 if (idx !== -1) this.items[idx] = { ...this.items[idx], messages: [...this.items[idx].messages, msg] };
 return msg;
 }
 async updateStatus(id: string, ticketStatus: TicketStatus, _by: string) {
 return this.update(id, { ticketStatus } as any);
 }
 async assign(id: string, staffId: string) { return this.update(id, { assignedTo: staffId } as any); }
 async resolve(id: string, _by: string) {
 return this.update(id, { ticketStatus: 'resolved', resolvedAt: new Date().toISOString() } as any);
 }
 async close(id: string) {
 return this.update(id, { ticketStatus: 'closed', closedAt: new Date().toISOString() } as any);
 }
}

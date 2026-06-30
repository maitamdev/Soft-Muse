import type { Customer, CustomerCreateDTO, CustomerUpdateDTO, CustomerFilters, CustomerAddress, CustomerGroup, CustomerGroupCreateDTO, Review, SupportTicket, SupportTicketCreateDTO, SupportMessage, TicketStatus } from '@/types/crm';
import type { PaginatedResult, QueryOptions } from '@/types/query';
import type { IBaseRepository } from './IBaseRepository';

export interface ICustomerRepository
  extends IBaseRepository<Customer, CustomerCreateDTO, CustomerUpdateDTO, CustomerFilters> {

  findByEmail(email: string): Promise<Customer | null>;
  getAddresses(customerId: string): Promise<CustomerAddress[]>;
  addAddress(customerId: string, data: Omit<CustomerAddress, 'id' | 'customerId' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'deletedAt' | 'isArchived' | 'status'>): Promise<CustomerAddress>;
  removeAddress(customerId: string, addressId: string): Promise<void>;
  setDefaultAddress(customerId: string, addressId: string): Promise<void>;

  getOrderHistory(customerId: string): Promise<{ orderId: string; total: number; date: string }[]>;
  updateStats(customerId: string): Promise<void>; // Recomputes totalOrders, totalSpent, etc.
  assignGroup(customerId: string, groupId: string): Promise<void>;
  updateLevel(customerId: string, level: string): Promise<void>;
  addTag(customerId: string, tag: string): Promise<void>;
  removeTag(customerId: string, tag: string): Promise<void>;
}

export interface ICustomerGroupRepository
  extends IBaseRepository<CustomerGroup, CustomerGroupCreateDTO, Partial<CustomerGroupCreateDTO>> {
  getMembers(groupId: string, options?: QueryOptions): Promise<PaginatedResult<Customer>>;
  addMember(groupId: string, customerId: string): Promise<void>;
  removeMember(groupId: string, customerId: string): Promise<void>;
  refreshAutoGroup(groupId: string): Promise<void>; // Re-evaluates rules, updates membership
}

export interface IReviewRepository
  extends IBaseRepository<Review, Omit<Review, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'deletedAt' | 'isArchived' | 'helpfulCount'>, Partial<Review>> {

  getByProduct(productId: string, options?: QueryOptions): Promise<PaginatedResult<Review>>;
  getByCustomer(customerId: string): Promise<Review[]>;
  getPending(options?: QueryOptions): Promise<PaginatedResult<Review>>;

  approve(id: string): Promise<Review>;
  reject(id: string): Promise<Review>;
  reply(id: string, replyAr: string, repliedBy: string): Promise<Review>;
  toggleFeatured(id: string): Promise<Review>;
  getAverageRating(productId: string): Promise<number>;
}

export interface ISupportRepository
  extends IBaseRepository<SupportTicket, SupportTicketCreateDTO, Partial<SupportTicketCreateDTO>> {

  getByCustomer(customerId: string, options?: QueryOptions): Promise<PaginatedResult<SupportTicket>>;
  getByStatus(ticketStatus: TicketStatus, options?: QueryOptions): Promise<PaginatedResult<SupportTicket>>;
  getByAssignee(staffId: string, options?: QueryOptions): Promise<PaginatedResult<SupportTicket>>;
  getOpen(options?: QueryOptions): Promise<PaginatedResult<SupportTicket>>;

  addMessage(ticketId: string, data: Omit<SupportMessage, 'id' | 'ticketId' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'deletedAt' | 'isArchived' | 'status'>): Promise<SupportMessage>;
  updateStatus(id: string, ticketStatus: TicketStatus, updatedBy: string): Promise<SupportTicket>;
  assign(id: string, staffId: string): Promise<SupportTicket>;
  resolve(id: string, resolvedBy: string): Promise<SupportTicket>;
  close(id: string): Promise<SupportTicket>;
}

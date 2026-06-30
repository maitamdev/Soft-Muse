import { BaseMockRepository } from './BaseMockRepository';
import type { Order, OrderCreateDTO, OrderStatusUpdateDTO, OrderFilters, PaymentStatus, FulfillmentStatus } from '@/types/order';
import type { IOrderRepository } from '@/lib/contracts/v2/IOrderRepository';
import type { BaseEntity } from '@/types/base';
import type { PaginatedResult, QueryOptions } from '@/types/query';
import { paginate } from '@/types/query';
export class MockOrderRepository extends BaseMockRepository<Order, OrderCreateDTO, OrderStatusUpdateDTO, OrderFilters> implements IOrderRepository {
  protected buildEntity(data: OrderCreateDTO, base: BaseEntity): Order { return { ...base, timeline: [], ...data } as Order; }
  protected mergeUpdate(e: Order, d: OrderStatusUpdateDTO): Order { return { ...e, ...d }; }
  protected applySearch(items: Order[], s: string) { const q = s.toLowerCase(); return items.filter(i => i.orderNumber.toLowerCase().includes(q)); }
  async getByCustomer(customerId: string, options?: QueryOptions): Promise<PaginatedResult<Order>> { return paginate(this.items.filter(o => o.customerId === customerId && !o.deletedAt), options); }
  async getByStatus(fulfillmentStatus: FulfillmentStatus, options?: QueryOptions): Promise<PaginatedResult<Order>> { return paginate(this.items.filter(o => o.fulfillmentStatus === fulfillmentStatus && !o.deletedAt), options); }
  async getByPaymentStatus(paymentStatus: PaymentStatus, options?: QueryOptions): Promise<PaginatedResult<Order>> { return paginate(this.items.filter(o => o.paymentStatus === paymentStatus && !o.deletedAt), options); }
  async getRecent(limit = 10) { return this.items.filter(o => !o.deletedAt).slice(0, limit); }
  async updateStatus(id: string, update: OrderStatusUpdateDTO) { return this.update(id, update); }
  async markAsPaid(id: string, reference?: string) { return this.update(id, { paymentStatus: 'paid', paymentReference: reference ?? null } as any); }
  async markAsShipped(id: string, trackingNumber: string, carrier: string) { return this.update(id, { fulfillmentStatus: 'shipped', trackingNumber, carrier, shippedAt: new Date().toISOString() } as any); }
  async markAsDelivered(id: string) { return this.update(id, { fulfillmentStatus: 'delivered', deliveredAt: new Date().toISOString() } as any); }
  async cancel(id: string, _reason: string) { return this.update(id, { fulfillmentStatus: 'cancelled' } as any); }
  async addTimelineEvent(orderId: string, messageAr: string, type = 'note') { const o = await this.findById(orderId); if (!o) throw new Error('Not found'); const updated = { ...o, timeline: [...o.timeline, { id: crypto.randomUUID(), type, messageAr, createdAt: new Date().toISOString(), createdBy: 'admin' }] } as any; const idx = this.items.findIndex(i => i.id === orderId); this.items[idx] = updated; return updated; }
  async bulkMarkAsPaid(ids: string[]) { await Promise.all(ids.map(id => this.markAsPaid(id))); }
  async bulkUpdateFulfillment(ids: string[], status: FulfillmentStatus) { this.items = this.items.map(o => ids.includes(o.id) ? { ...o, fulfillmentStatus: status } : o); }
  async getRevenueSummary() { return { total: 0, orderCount: 0, averageOrderValue: 0 }; }
}

import type { Order, OrderCreateDTO, OrderStatusUpdateDTO, OrderFilters, PaymentStatus, FulfillmentStatus } from '@/types/order';
import type { PaginatedResult, QueryOptions } from '@/types/query';
import type { IBaseRepository } from './IBaseRepository';

export interface IOrderRepository
  extends IBaseRepository<Order, OrderCreateDTO, OrderStatusUpdateDTO, OrderFilters> {

  getByCustomer(customerId: string, options?: QueryOptions): Promise<PaginatedResult<Order>>;
  getByStatus(fulfillmentStatus: FulfillmentStatus, options?: QueryOptions): Promise<PaginatedResult<Order>>;
  getByPaymentStatus(paymentStatus: PaymentStatus, options?: QueryOptions): Promise<PaginatedResult<Order>>;
  getRecent(limit?: number): Promise<Order[]>;

  updateStatus(id: string, update: OrderStatusUpdateDTO): Promise<Order>;
  markAsPaid(id: string, reference?: string): Promise<Order>;
  markAsShipped(id: string, trackingNumber: string, carrier: string): Promise<Order>;
  markAsDelivered(id: string): Promise<Order>;
  cancel(id: string, reason: string): Promise<Order>;

  addTimelineEvent(orderId: string, messageAr: string, type?: string): Promise<Order>;

  bulkMarkAsPaid(ids: string[]): Promise<void>;
  bulkUpdateFulfillment(ids: string[], status: FulfillmentStatus): Promise<void>;

  getRevenueSummary(from: string, to: string): Promise<{
    total: number;
    orderCount: number;
    averageOrderValue: number;
  }>;
}

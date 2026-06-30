import { Order, OrderStatus } from '@/data/mock/orders';

export interface IOrderRepository {
  getOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  updateOrderStatus(id: string, status: OrderStatus, note?: string): Promise<Order>;
  // ... other order actions ...
}

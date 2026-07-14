import type { BaseEntity, Address } from './base';
import type { PaymentMethod } from './procurement';

export type PaymentStatus =
 | 'unpaid'
 | 'paid'
 | 'partially_paid'
 | 'refunded'
 | 'partially_refunded'
 | 'failed';

export type FulfillmentStatus =
 | 'new'
 | 'confirmed'
 | 'processing'
 | 'ready_to_ship'
 | 'shipped'
 | 'delivered'
 | 'cancelled'
 | 'returned';

export type OrderTimelineType =
 | 'status_change'
 | 'payment'
 | 'shipping'
 | 'note'
 | 'return'
 | 'refund'
 | 'system';

// ─── Order ───────────────────────────────────────────────────────────────────

export interface OrderItem {
 id: string;
 productId: string;
 variantId: string | null;
 nameAr: string; // Snapshot at time of order
 sku: string;
 imageUrl: string;
 options: Record<string, string>; // { "Kích cỡ": "M" }
 quantity: number;
 unitPrice: number;
 totalPrice: number;
 costPrice: number | null; // For profit tracking
}

export interface OrderTimelineEvent {
 id: string;
 type: OrderTimelineType;
 messageAr: string;
 metadata?: Record<string, unknown>;
 createdAt: string;
 createdBy: string;
}

export interface Order extends BaseEntity {
 orderNumber: string; // "ORD-00001"
 customerId: string;
 items: OrderItem[];

 // Pricing
 subtotal: number;
 discountAmount: number;
 couponCode: string | null;
 couponId: string | null;
 giftCardCode: string | null;
 giftCardId: string | null;
 taxAmount: number;
 shippingFee: number;
 total: number;
 currency: string;

 // Addresses
 shippingAddress: Address;
 billingAddress: Address | null;

 // Payment
 paymentStatus: PaymentStatus;
 paymentMethod: PaymentMethod;
 paymentReference: string | null;
 paidAt: string | null;

 // Fulfillment
 fulfillmentStatus: FulfillmentStatus;
 warehouseId: string | null;
 trackingNumber: string | null;
 carrier: string | null;
 shippedAt: string | null;
 deliveredAt: string | null;

 // Metadata
 notes: string | null;
 staffNotes: string | null;
 tags: string[];
 source: 'storefront' | 'admin' | 'import';

 // Timeline
 timeline: OrderTimelineEvent[];
}

// ─── Filters ─────────────────────────────────────────────────────────────────

export interface OrderFilters {
 search?: string;
 fulfillmentStatus?: FulfillmentStatus | 'all';
 paymentStatus?: PaymentStatus | 'all';
 paymentMethod?: PaymentMethod | 'all';
 customerId?: string;
 dateFrom?: string;
 dateTo?: string;
}

// ─── DTOs ────────────────────────────────────────────────────────────────────

export type OrderCreateDTO = Omit<Order,
 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' |
 'deletedAt' | 'isArchived' | 'timeline'
>;

export interface OrderStatusUpdateDTO {
 fulfillmentStatus?: FulfillmentStatus;
 paymentStatus?: PaymentStatus;
 noteAr?: string;
 trackingNumber?: string;
 carrier?: string;
}

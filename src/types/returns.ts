import type { BaseEntity } from './base';
import type { PaymentMethod } from './procurement';

// ─── Return ───────────────────────────────────────────────────────────────────

export type ReturnReason =
  | 'wrong_size'
  | 'wrong_item'
  | 'defective'
  | 'not_as_described'
  | 'changed_mind'
  | 'late_delivery'
  | 'other';

export type ReturnStatus =
  | 'requested'
  | 'approved'
  | 'rejected'
  | 'received'
  | 'inspected'
  | 'completed';

export type ItemCondition = 'new' | 'like_new' | 'good' | 'fair' | 'poor' | 'damaged';

export interface ReturnItem {
  id: string;
  orderItemId: string;
  productId: string;
  variantId: string | null;
  quantityReturned: number;
  condition: ItemCondition;
  isRestockable: boolean;
  inspectionNotes: string | null;
}

export interface Return extends BaseEntity {
  returnNumber: string;          // "RET-00001"
  orderId: string;               // → Order (REQUIRED)
  customerId: string;            // → Customer (REQUIRED)
  warehouseId: string;           // → Warehouse where stock returns (REQUIRED)
  items: ReturnItem[];
  reason: ReturnReason;
  reasonNotes: string | null;
  returnStatus: ReturnStatus;    // Renamed from 'status' to avoid collision with BaseEntity.status
  refundId: string | null;       // → Refund (set when refund created)
  approvedBy: string | null;
  approvedAt: string | null;
  receivedAt: string | null;
  inspectedAt: string | null;
  completedAt: string | null;
  // On approval: triggers StockMovement(type: 'return', warehouseId) for restockable items
  // On approval: auto-creates Refund if settings.orders.autoRefundOnReturn = true
}

// ─── Refund ───────────────────────────────────────────────────────────────────

export type RefundMethod =
  | 'original_payment'
  | 'bank_transfer'
  | 'store_credit'
  | 'gift_card';

export type RefundStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface Refund extends BaseEntity {
  refundNumber: string;          // "REF-00001"
  orderId: string;               // → Order (REQUIRED)
  returnId: string | null;       // → Return (null for manual refunds)
  customerId: string;            // → Customer (REQUIRED)
  amount: number;
  currency: string;
  method: RefundMethod;
  refundStatus: RefundStatus;    // Renamed from 'status' to avoid collision
  reason: string;
  processedBy: string | null;
  processedAt: string | null;
  gatewayReference: string | null;
  notes: string | null;
}

// ─── DTOs ────────────────────────────────────────────────────────────────────

export type ReturnCreateDTO = Omit<Return,
  'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'deletedAt' | 'isArchived' |
  'refundId' | 'approvedBy' | 'approvedAt' | 'receivedAt' | 'inspectedAt' | 'completedAt'
>;

export type ReturnUpdateDTO = Partial<Pick<Return,
  'returnStatus' | 'refundId' | 'approvedBy' | 'approvedAt' |
  'receivedAt' | 'inspectedAt' | 'completedAt' | 'reasonNotes'
>>;

export type RefundCreateDTO = Omit<Refund,
  'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'deletedAt' | 'isArchived' |
  'processedBy' | 'processedAt' | 'gatewayReference'
>;

export type RefundUpdateDTO = Partial<Pick<Refund,
  'refundStatus' | 'processedBy' | 'processedAt' | 'gatewayReference' | 'notes'
>>;

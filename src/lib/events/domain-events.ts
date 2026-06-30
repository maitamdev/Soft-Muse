/**
 * Typed domain event definitions.
 * Every event has a string type constant and a typed payload interface.
 *
 * Usage:
 *   DomainEventBus.emit(EVENTS.ORDER.CREATED, payload, { entityType: 'Order', entityId: order.id });
 *   DomainEventBus.on(EVENTS.ORDER.CREATED, handler);
 */

import type { Order } from '@/types/order';
import type { Product } from '@/types/product';
import type { Return } from '@/types/returns';
import type { Refund } from '@/types/returns';
import type { StockMovement } from '@/types/inventory';
import type { PurchaseReceipt } from '@/types/procurement';
import type { Customer } from '@/types/crm';

// ─── Event Type Constants ─────────────────────────────────────────────────────

export const EVENTS = {
  PRODUCT: {
    CREATED:    'product.created',
    UPDATED:    'product.updated',
    DELETED:    'product.deleted',
    ARCHIVED:   'product.archived',
    PUBLISHED:  'product.published',
    UNPUBLISHED:'product.unpublished',
    DUPLICATED: 'product.duplicated',
    LOW_STOCK:  'product.low_stock',
    OUT_OF_STOCK: 'product.out_of_stock',
  },

  ORDER: {
    CREATED:    'order.created',
    UPDATED:    'order.updated',
    CONFIRMED:  'order.confirmed',
    PAID:       'order.paid',
    SHIPPED:    'order.shipped',
    DELIVERED:  'order.delivered',
    CANCELLED:  'order.cancelled',
    REFUNDED:   'order.refunded',
  },

  INVENTORY: {
    ADJUSTED:          'inventory.adjusted',
    MOVEMENT_RECORDED: 'inventory.movement_recorded',
    TRANSFER_CREATED:  'inventory.transfer_created',
    TRANSFER_APPROVED: 'inventory.transfer_approved',
    TRANSFER_COMPLETED:'inventory.transfer_completed',
    LOW_STOCK_ALERT:   'inventory.low_stock_alert',
  },

  PROCUREMENT: {
    PO_CREATED:        'procurement.po_created',
    PO_APPROVED:       'procurement.po_approved',
    PO_SENT:           'procurement.po_sent',
    RECEIPT_CREATED:   'procurement.receipt_created',   // Triggers inventory update
    PAYMENT_RECORDED:  'procurement.payment_recorded',
  },

  RETURN: {
    REQUESTED:  'return.requested',
    APPROVED:   'return.approved',    // Triggers inventory restore + refund creation
    REJECTED:   'return.rejected',
    RECEIVED:   'return.received',
    COMPLETED:  'return.completed',
  },

  REFUND: {
    CREATED:    'refund.created',
    PROCESSING: 'refund.processing',
    COMPLETED:  'refund.completed',
    FAILED:     'refund.failed',
  },

  CUSTOMER: {
    REGISTERED:   'customer.registered',
    UPDATED:      'customer.updated',
    LEVEL_CHANGED:'customer.level_changed',
    GROUP_CHANGED:'customer.group_changed',
  },

  REVIEW: {
    SUBMITTED:  'review.submitted',
    APPROVED:   'review.approved',
    REJECTED:   'review.rejected',
    REPLIED:    'review.replied',
  },

  FINANCE: {
    EXPENSE_RECORDED: 'finance.expense_recorded',
    ASSET_ADDED:      'finance.asset_added',
    LIABILITY_ADDED:  'finance.liability_added',
    CAPITAL_MOVEMENT: 'finance.capital_movement',
  },

  SETTINGS: {
    UPDATED:    'settings.updated',
  },

  STAFF: {
    LOGGED_IN:  'staff.logged_in',
    LOGGED_OUT: 'staff.logged_out',
    CREATED:    'staff.created',
    ROLE_CHANGED: 'staff.role_changed',
  },
} as const;

// ─── Typed Event Payloads ─────────────────────────────────────────────────────

export interface OrderCreatedPayload { order: Order }
export interface OrderPaidPayload { order: Order; paymentReference: string }
export interface OrderShippedPayload { order: Order; trackingNumber: string; carrier: string }
export interface OrderCancelledPayload { order: Order; reason: string }

export interface ProductPublishedPayload { product: Product }
export interface ProductLowStockPayload { product: Product; currentStock: number; threshold: number; warehouseId: string }

export interface InventoryMovementPayload { movement: StockMovement }
export interface InventoryLowStockAlertPayload { productId: string; warehouseId: string; currentStock: number; threshold: number }

export interface ProcurementReceiptCreatedPayload { receipt: PurchaseReceipt; stockMovementIds: string[] }

export interface ReturnApprovedPayload { return: Return; stockMovementIds: string[]; refundId: string | null }
export interface RefundCompletedPayload { refund: Refund }

export interface CustomerRegisteredPayload { customer: Customer }

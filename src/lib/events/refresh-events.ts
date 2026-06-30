/**
 * Refresh event groups — the EventBus string names each admin surface listens to
 * in order to auto-refresh after a mutation anywhere in the app.
 *
 * These intentionally mirror the raw strings emitted by the `*.service.ts` layer
 * over the simple `eventBus` (not the typed v2 DomainEventBus). Keep this file as
 * the single source of truth so pages never hard-code event names.
 */

export const REFRESH_EVENTS = {
  products: [
    'product.created',
    'product.updated',
    'product.deleted',
    'products.changed',
    'products.bulk_deleted',
    'products.bulk_updated',
    'inventory.adjusted',
  ],
  inventory: [
    'inventory.changed',
    'inventory.movement_recorded',
    'inventory.adjusted',
    'product.updated',
    'product.created',
    'product.deleted',
    'procurement.receipt_created',
  ],
  orders: [
    'order.created',
    'order.updated',
    'order.completed',
    'order.deleted',
    'orders.bulk_deleted',
    'orders.bulk_updated',
  ],
  customers: [
    'customer.created',
    'customer.updated',
    'customer.deleted',
    'order.completed',
    'order.updated',
    'order.deleted',
  ],
  coupons: [
    'coupon.created',
    'coupon.updated',
    'coupon.deleted',
    'coupon.used',
  ],
  finance: [
    'business.changed',
    'finance.changed',
    'inventory.changed',
  ],
  suppliers: [
    'business.changed',
    'procurement.receipt_created',
    'procurement.payment_recorded',
  ],
  website: [
    'website.changed',
  ],
} as const;

/** Everything the main dashboard reacts to (deduped union of all groups). */
export const DASHBOARD_REFRESH_EVENTS: readonly string[] = Array.from(
  new Set([
    ...REFRESH_EVENTS.products,
    ...REFRESH_EVENTS.orders,
    ...REFRESH_EVENTS.customers,
    ...REFRESH_EVENTS.coupons,
    ...REFRESH_EVENTS.finance,
    'review.submitted',
    'review.approved',
    'review.rejected',
  ])
);

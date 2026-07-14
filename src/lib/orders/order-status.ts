/**
 * Unified order-status model — the single source of truth for the order lifecycle
 * shared by the storefront (checkout, tracking) and the admin dashboard.
 *
 * Every surface that needs a status label, badge colour, timeline step or customer
 * notification message reads it from here, so the workflow can never drift between
 * the two surfaces. When Supabase lands these strings become an `order_status`
 * enum + a status-history table — the shape stays identical.
 */
import type { Order, OrderStatus, OrderFulfillmentStatus } from '@/data/mock/orders';

export type AdminBadgeVariant =
 | 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'outline';

export interface OrderStatusMeta {
 key: OrderStatus;
 /** Admin-facing label. */
 label: string;
 /** Customer-facing timeline step title. */
 timelineLabel: string;
 /** Customer-facing step description. */
 description: string;
 /** Admin Badge variant. */
 badge: AdminBadgeVariant;
 /** Message pushed to the customer notification feed when an order enters this status. */
 notification: string;
}

/** The ordered "happy path" every order moves through, used to render the timeline. */
export const ORDER_STATUS_SEQUENCE: OrderStatus[] = [
 'pending',
 'confirmed',
 'preparing',
 'ready_to_ship',
 'shipped',
 'out_for_delivery',
 'delivered',
];

/** The full set of statuses an admin can assign (progress path + exceptions). */
export const WORKFLOW_STATUSES: OrderStatus[] = [...ORDER_STATUS_SEQUENCE,
 'cancelled',
 'returned',
];

/** Statuses that take an order off the happy path. */
export const TERMINAL_STATUSES: OrderStatus[] = ['cancelled', 'returned', 'refunded'];

export const ORDER_STATUS_META: Record<OrderStatus, OrderStatusMeta> = {
 pending: {
 key: 'pending',
 label: '',
 timelineLabel: 'đãĐơn hàng',
 description: 'đếnatelier AURA ',
 badge: 'warning',
 notification: 'đã thành công từ AURA.',
 },
 confirmed: {
 key: 'confirmed',
 label: 'đã',
 timelineLabel: 'đãĐơn hàng',
 description: 'đãKích cỡ ',
 badge: 'info',
 notification: 'đã từatelier AURA, trong.',
 },
 preparing: {
 key: 'preparing',
 label: '',
 timelineLabel: '',
 description: 'trongatelier TP. Hồ Chí Minh',
 badge: 'primary',
 notification: 'trongatelier AURA.',
 },
 ready_to_ship: {
 key: 'ready_to_ship',
 label: 'Vận chuyển',
 timelineLabel: 'Vận chuyển',
 description: 'đãVận chuyển',
 badge: 'primary',
 notification: 'Vận chuyển giao hàng.',
 },
 shipped: {
 key: 'shipped',
 label: 'Đã gửi hàng',
 timelineLabel: 'Đã gửi hàng',
 description: 'Vận chuyểntrong với giao hàng',
 badge: 'info',
 notification: 'đãVận chuyển trong.',
 },
 out_for_delivery: {
 key: 'out_for_delivery',
 label: '',
 timelineLabel: '',
 description: 'giao hàng trong đến',
 badge: 'info',
 notification: 'giao hàng trong.',
 },
 delivered: {
 key: 'delivered',
 label: 'đã',
 timelineLabel: 'đã',
 description: 'đãVận chuyểnthành công đến',
 badge: 'success',
 notification: 'đã thành công. vớiAURA.',
 },
 cancelled: {
 key: 'cancelled',
 label: 'Đã hủy',
 timelineLabel: 'đãHủy',
 description: 'đãHủy nàyĐơn hàng',
 badge: 'danger',
 notification: 'đãHủy.Yêu cầu hỗ trợ vớiAURA.',
 },
 returned: {
 key: 'returned',
 label: '',
 timelineLabel: 'đã',
 description: 'đã nàyĐơn hàng',
 badge: 'neutral',
 notification: 'đã.AURA Thao tác.',
 },
 refunded: {
 key: 'refunded',
 label: '',
 timelineLabel: 'đã',
 description: 'đã nàyĐơn hàng',
 badge: 'neutral',
 notification: 'đã.',
 },
 // Legacy aliases kept so previously-persisted orders never break lookups.
 processing: {
 key: 'processing',
 label: '',
 timelineLabel: '',
 description: 'trongatelier TP. Hồ Chí Minh',
 badge: 'primary',
 notification: 'trongatelier AURA.',
 },
 packed: {
 key: 'packed',
 label: 'Vận chuyển',
 timelineLabel: 'Vận chuyển',
 description: 'đãVận chuyển',
 badge: 'primary',
 notification: 'Vận chuyển.',
 },
 ready: {
 key: 'ready',
 label: 'Vận chuyển',
 timelineLabel: 'Vận chuyển',
 description: 'đãVận chuyển',
 badge: 'primary',
 notification: 'Vận chuyển.',
 },
};

/** Map a workflow status onto the closest legacy `fulfillmentStatus` value. */
const STATUS_TO_FULFILLMENT: Record<OrderStatus, OrderFulfillmentStatus> = {
 pending: 'new',
 confirmed: 'confirmed',
 preparing: 'processing',
 ready_to_ship: 'ready_to_ship',
 shipped: 'shipped',
 out_for_delivery: 'shipped',
 delivered: 'delivered',
 cancelled: 'cancelled',
 returned: 'returned',
 refunded: 'returned',
 processing: 'processing',
 packed: 'ready_to_ship',
 ready: 'ready_to_ship',
};

export function getStatusMeta(status: OrderStatus): OrderStatusMeta {
 return ORDER_STATUS_META[status] ?? ORDER_STATUS_META.pending;
}

export function fulfillmentForStatus(status: OrderStatus): OrderFulfillmentStatus {
 return STATUS_TO_FULFILLMENT[status] ?? 'new';
}

/** Position of a status on the happy path, or -1 if it is off-path (cancelled/returned). */
export function getStatusStepIndex(status: OrderStatus): number {
 const meta = getStatusMeta(status);
 return ORDER_STATUS_SEQUENCE.indexOf(meta.key === status ? status : meta.key);
}

export type TimelineStepState = 'done' | 'current' | 'upcoming';

export interface CustomerTimelineStep {
 key: OrderStatus;
 label: string;
 description: string;
 date: string | null;
 state: TimelineStepState;
}

/**
 * Build the customer-facing shipment timeline for an order: every happy-path step,
 * each marked done / current / upcoming, with the timestamp drawn from the order's
 * own status history when available.
 */
export function buildCustomerTimeline(order: Pick<Order, 'status' | 'timeline'>): CustomerTimelineStep[] {
 const currentMeta = getStatusMeta(order.status);
 const currentKey = currentMeta.key;
 const currentIndex = ORDER_STATUS_SEQUENCE.indexOf(currentKey);
 const isOffPath = currentIndex === -1; // cancelled / returned / refunded

 // Newest-first history → map each happy-path status to its most recent timestamp.
 // Only status/created events count; customer-update & shipping events are skipped.
 const dateForStatus = (key: OrderStatus): string | null => {
 const entry = order.timeline?.find(
 (t) => (!t.type || t.type === 'status' || t.type === 'created') && getStatusMeta(t.status).key === key
 );
 return entry?.timestamp ?? null;
 };

 return ORDER_STATUS_SEQUENCE.map((key, index): CustomerTimelineStep => {
 const meta = ORDER_STATUS_META[key];
 let state: TimelineStepState;
 if (isOffPath) {
 // Steps reached before the order left the happy path stay "done".
 state = dateForStatus(key) ? 'done' : 'upcoming';
 } else if (index < currentIndex) {
 state = 'done';
 } else if (index === currentIndex) {
 state = 'current';
 } else {
 state = 'upcoming';
 }
 return {
 key,
 label: meta.timelineLabel,
 description: meta.description,
 date: dateForStatus(key),
 state,
 };
 });
}

/** Estimated delivery window: 5 business-ish days from creation, formatted in Arabic. */
export function estimateDelivery(order: Pick<Order, 'createdAt' | 'date'>): string {
 const base = new Date(order.createdAt || order.date || Date.now());
 base.setDate(base.getDate() + 5);
 return base.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
}

/** Normalise an order number for tolerant lookup (case/symbol-insensitive). */
export function normalizeOrderNumber(value: string): string {
 return value.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
}

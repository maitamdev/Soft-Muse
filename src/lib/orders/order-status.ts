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

/**
 * Allowed lifecycle transitions. Keeping this in the client as well as in the
 * database lets the UI hide impossible actions while PostgreSQL remains the
 * final authority.
 */
export const ALLOWED_ORDER_TRANSITIONS: Partial<Record<OrderStatus, OrderStatus[]>> = {
 pending: ['confirmed', 'cancelled'],
 confirmed: ['preparing', 'cancelled'],
 preparing: ['ready_to_ship', 'cancelled'],
 ready_to_ship: ['shipped', 'cancelled'],
 shipped: ['out_for_delivery', 'returned'],
 out_for_delivery: ['delivered', 'returned'],
 delivered: ['returned'],
 returned: ['refunded'],
 cancelled: [],
 refunded: [],
 processing: ['ready_to_ship', 'cancelled'],
 packed: ['shipped', 'cancelled'],
 ready: ['shipped', 'cancelled'],
};

export function getAllowedNextStatuses(status: OrderStatus): OrderStatus[] {
 return ALLOWED_ORDER_TRANSITIONS[status] ?? [];
}

export const ORDER_STATUS_META: Record<OrderStatus, OrderStatusMeta> = {
 pending: {
 key: 'pending',
 label: 'Chờ xác nhận',
 timelineLabel: 'Đã tiếp nhận đơn hàng',
 description: 'Soft Muse đã nhận được đơn hàng của bạn.',
 badge: 'warning',
 notification: 'Đơn hàng đã được tiếp nhận thành công.',
 },
 confirmed: {
 key: 'confirmed',
 label: 'Đã xác nhận',
 timelineLabel: 'Đã xác nhận đơn hàng',
 description: 'Sản phẩm và thông tin giao hàng đã được xác nhận.',
 badge: 'info',
 notification: 'Đơn hàng đã được Soft Muse xác nhận.',
 },
 preparing: {
 key: 'preparing',
 label: 'Đang chuẩn bị',
 timelineLabel: 'Đang chuẩn bị hàng',
 description: 'Đơn hàng đang được đóng gói tại Soft Muse.',
 badge: 'primary',
 notification: 'Đơn hàng đang được chuẩn bị.',
 },
 ready_to_ship: {
 key: 'ready_to_ship',
 label: 'Sẵn sàng giao',
 timelineLabel: 'Sẵn sàng bàn giao',
 description: 'Đơn hàng đã đóng gói và sẵn sàng bàn giao cho đơn vị vận chuyển.',
 badge: 'primary',
 notification: 'Đơn hàng đã sẵn sàng để giao.',
 },
 shipped: {
 key: 'shipped',
 label: 'Đã gửi hàng',
 timelineLabel: 'Đã gửi hàng',
 description: 'Đơn hàng đã được bàn giao cho đơn vị vận chuyển.',
 badge: 'info',
 notification: 'Đơn hàng đang trên đường vận chuyển.',
 },
 out_for_delivery: {
 key: 'out_for_delivery',
 label: 'Đang giao hàng',
 timelineLabel: 'Đang giao hàng',
 description: 'Nhân viên giao hàng đang chuyển đơn đến địa chỉ của bạn.',
 badge: 'info',
 notification: 'Đơn hàng đang được giao đến bạn.',
 },
 delivered: {
 key: 'delivered',
 label: 'Đã giao',
 timelineLabel: 'Giao hàng thành công',
 description: 'Đơn hàng đã được giao thành công.',
 badge: 'success',
 notification: 'Giao hàng thành công. Cảm ơn bạn đã chọn Soft Muse.',
 },
 cancelled: {
 key: 'cancelled',
 label: 'Đã hủy',
 timelineLabel: 'Đơn hàng đã hủy',
 description: 'Đơn hàng này đã được hủy.',
 badge: 'danger',
 notification: 'Đơn hàng đã được hủy. Vui lòng liên hệ Soft Muse nếu cần hỗ trợ.',
 },
 returned: {
 key: 'returned',
 label: 'Đã trả hàng',
 timelineLabel: 'Đã nhận hàng trả',
 description: 'Hàng trả đã được tiếp nhận.',
 badge: 'neutral',
 notification: 'Soft Muse đã tiếp nhận hàng trả.',
 },
 refunded: {
 key: 'refunded',
 label: 'Đã hoàn tiền',
 timelineLabel: 'Đã hoàn tiền',
 description: 'Khoản thanh toán đã được hoàn lại.',
 badge: 'neutral',
 notification: 'Đơn hàng đã được hoàn tiền.',
 },
 // Legacy aliases kept so previously-persisted orders never break lookups.
 processing: {
 key: 'processing',
 label: 'Đang chuẩn bị',
 timelineLabel: 'Đang chuẩn bị hàng',
 description: 'Đơn hàng đang được đóng gói tại Soft Muse.',
 badge: 'primary',
 notification: 'Đơn hàng đang được chuẩn bị.',
 },
 packed: {
 key: 'packed',
 label: 'Sẵn sàng giao',
 timelineLabel: 'Sẵn sàng bàn giao',
 description: 'Đơn hàng đã được đóng gói.',
 badge: 'primary',
 notification: 'Đơn hàng đã sẵn sàng để giao.',
 },
 ready: {
 key: 'ready',
 label: 'Sẵn sàng giao',
 timelineLabel: 'Sẵn sàng bàn giao',
 description: 'Đơn hàng đã được đóng gói.',
 badge: 'primary',
 notification: 'Đơn hàng đã sẵn sàng để giao.',
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

/** Estimated delivery window: five days from creation, formatted for Vietnam. */
export function estimateDelivery(order: Pick<Order, 'createdAt' | 'date'>): string {
 const base = new Date(order.createdAt || order.date || Date.now());
 base.setDate(base.getDate() + 5);
 return base.toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' });
}

/** Normalise an order number for tolerant lookup (case/symbol-insensitive). */
export function normalizeOrderNumber(value: string): string {
 return value.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
}

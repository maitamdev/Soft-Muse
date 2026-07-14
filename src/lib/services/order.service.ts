import type { Order, OrderItem, OrderPaymentStatus, OrderStatus } from "@/data/mock/orders";
import type { IOrderRepository } from "@/lib/contracts/IOrderRepository";
import { eventBus } from "@/lib/events/EventBus";
import { fulfillmentForStatus, normalizeOrderNumber } from "@/lib/orders/order-status";
import { createClient } from "@/lib/supabase/client";

export interface OrderFilters {
  search?: string;
  status?: string;
  paymentStatus?: string;
  fulfillmentStatus?: string;
  paymentMethod?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface CreateOrderInput {
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: Array<{ productId: string; productName: string; sku: string; quantity: number; price: number; variantId?: string; image?: string; size?: string; color?: string }>;
  shippingAddress?: string;
  shipping?: number;
  taxRate?: number;
  discount?: number;
  couponCode?: string | null;
  couponId?: string | null;
  discountValue?: number;
  discountType?: "percentage" | "fixed" | "shipping";
  paymentMethod?: string;
  notes?: string;
  source?: "storefront" | "admin";
}

type OrderRow = Record<string, unknown> & {
  order_items?: Array<Record<string, unknown>>;
  order_timeline?: Array<Record<string, unknown>>;
};

const orderSelect = "*, order_items(*), order_timeline(*)";

function mapOrder(row: OrderRow): Order {
  const metadata = (row.metadata as Record<string, unknown> | null) ?? {};
  const items: OrderItem[] = (row.order_items ?? []).map((item) => ({
    id: String(item.id),
    productId: String(item.product_id ?? ""),
    variantId: item.variant_id ? String(item.variant_id) : undefined,
    productName: String(item.product_name ?? ""),
    name: String(item.product_name ?? ""),
    sku: String(item.sku ?? ""),
    quantity: Number(item.quantity ?? 0),
    price: Number(item.price ?? 0),
    total: Number(item.total ?? 0),
    image: item.image_url ? String(item.image_url) : undefined,
    size: item.size ? String(item.size) : undefined,
    color: item.color ? String(item.color) : undefined,
  }));
  const timeline = [...(row.order_timeline ?? [])]
    .sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))
    .map((item) => ({
      status: String(item.status) as OrderStatus,
      timestamp: String(item.created_at),
      adminId: item.created_by ? String(item.created_by) : undefined,
      note: item.note ? String(item.note) : undefined,
      type: "status" as const,
    }));

  return {
    id: String(row.id),
    orderNumber: String(row.order_number),
    customerId: String(row.customer_id ?? ""),
    customerName: String(row.customer_name ?? ""),
    customerEmail: String(row.customer_email ?? ""),
    customerPhone: String(row.customer_phone ?? ""),
    customerNotes: String(row.customer_notes ?? ""),
    items,
    subtotal: Number(row.subtotal ?? 0),
    discount: Number(row.discount ?? 0),
    tax: Number(row.tax ?? 0),
    shipping: Number(row.shipping ?? 0),
    total: Number(row.total ?? 0),
    status: String(row.status) as OrderStatus,
    paymentStatus: String(row.payment_status) as OrderPaymentStatus,
    fulfillmentStatus: String(row.fulfillment_status) as Order["fulfillmentStatus"],
    paymentMethod: String(row.payment_method ?? "cod"),
    shippingMethod: String(row.shipping_method ?? "standard"),
    shippingAddress: String(row.shipping_address ?? ""),
    shippingCompany: row.shipping_company ? String(row.shipping_company) : undefined,
    trackingNumber: row.tracking_number ? String(row.tracking_number) : undefined,
    courierName: row.courier_name ? String(row.courier_name) : undefined,
    estimatedDeliveryDate: metadata.estimatedDeliveryDate ? String(metadata.estimatedDeliveryDate) : undefined,
    customerUpdate: metadata.customerUpdate ? String(metadata.customerUpdate) : undefined,
    customerUpdatedAt: metadata.customerUpdatedAt ? String(metadata.customerUpdatedAt) : undefined,
    internalNotes: (row.internal_notes as Order["internalNotes"]) ?? [],
    timeline,
    couponId: row.coupon_id ? String(row.coupon_id) : null,
    couponCode: row.coupon_code ? String(row.coupon_code) : null,
    date: String(row.created_at),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

class SupabaseOrderRepository implements IOrderRepository {
  async getOrder(id: string): Promise<Order | undefined> {
    const { data, error } = await createClient().from("orders").select(orderSelect).eq("id", id).maybeSingle();
    if (error) throw new Error(`Không thể tải đơn hàng: ${error.message}`);
    return data ? mapOrder(data) : undefined;
  }

  async getOrderByNumber(orderNumber: string, contact?: string): Promise<Order | undefined> {
    if (contact) {
      const { data, error } = await createClient().rpc("track_order", { order_code: orderNumber, contact_value: contact });
      if (error) throw new Error(`Không thể tra cứu đơn hàng: ${error.message}`);
      return data ? mapOrder(data as OrderRow) : undefined;
    }
    const number = normalizeOrderNumber(orderNumber);
    const { data, error } = await createClient().from("orders").select(orderSelect).eq("order_number", number).maybeSingle();
    if (error) throw new Error(`Không thể tra cứu đơn hàng: ${error.message}`);
    return data ? mapOrder(data) : undefined;
  }

  async getOrders(filters?: OrderFilters): Promise<Order[]> {
    let query = createClient().from("orders").select(orderSelect).order("created_at", { ascending: false });
    if (filters?.search) query = query.or(`order_number.ilike.%${filters.search}%,customer_name.ilike.%${filters.search}%`);
    if (filters?.status && filters.status !== "all") query = query.eq("status", filters.status);
    if (filters?.paymentStatus && filters.paymentStatus !== "all") query = query.eq("payment_status", filters.paymentStatus);
    if (filters?.fulfillmentStatus && filters.fulfillmentStatus !== "all") query = query.eq("fulfillment_status", filters.fulfillmentStatus);
    if (filters?.paymentMethod && filters.paymentMethod !== "all") query = query.eq("payment_method", filters.paymentMethod);
    if (filters?.dateFrom) query = query.gte("created_at", filters.dateFrom);
    if (filters?.dateTo) query = query.lte("created_at", filters.dateTo);
    const { data, error } = await query;
    if (error) throw new Error(`Không thể tải đơn hàng: ${error.message}`);
    return (data ?? []).map(mapOrder);
  }

  async createOrder(input: CreateOrderInput): Promise<Order> {
    const { data, error } = await createClient().rpc("create_storefront_order", {
      payload: {
        customer_name: input.customerName,
        customer_email: input.customerEmail,
        customer_phone: input.customerPhone ?? "",
        customer_notes: input.notes ?? "",
        shipping_address: input.shippingAddress ?? "",
        payment_method: input.paymentMethod ?? "cod",
        shipping_method: "standard",
        coupon_code: input.couponCode ?? null,
        items: input.items.map((item) => ({
          product_id: item.productId,
          variant_id: item.variantId ?? null,
          quantity: item.quantity,
          image_url: item.image ?? null,
          size: item.size ?? null,
          color: item.color ?? null,
        })),
      },
    });
    if (error) throw new Error(error.message);
    const result = data as { id: string };
    const order = await this.getOrder(result.id);
    if (!order) {
      return {
        id: result.id,
        orderNumber: String((data as Record<string, unknown>).order_number),
        customerId: "",
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone,
        items: [], subtotal: 0, discount: 0, tax: 0, shipping: 0,
        total: Number((data as Record<string, unknown>).total ?? 0),
        status: "pending", paymentStatus: "unpaid", fulfillmentStatus: "unfulfilled",
        shippingAddress: input.shippingAddress ?? "", timeline: [],
        date: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      };
    }
    eventBus.emit("order.created", order);
    return order;
  }

  async updateOrder(id: string, input: Partial<Order>): Promise<Order> {
    const metadata = { customerUpdate: input.customerUpdate, customerUpdatedAt: input.customerUpdatedAt, estimatedDeliveryDate: input.estimatedDeliveryDate };
    const { error } = await createClient().from("orders").update({
      customer_name: input.customerName,
      customer_email: input.customerEmail,
      customer_phone: input.customerPhone,
      customer_notes: input.customerNotes,
      shipping_address: input.shippingAddress,
      shipping_company: input.shippingCompany,
      tracking_number: input.trackingNumber,
      courier_name: input.courierName,
      internal_notes: input.internalNotes,
      metadata,
    }).eq("id", id);
    if (error) throw new Error(`Không thể cập nhật đơn hàng: ${error.message}`);
    const order = await this.getOrder(id);
    if (!order) throw new Error("Không tìm thấy đơn hàng.");
    eventBus.emit("order.updated", order);
    return order;
  }

  async updateOrderStatus(id: string, status: OrderStatus, note?: string): Promise<Order> {
    const nextStatus: OrderStatus = status === "processing" ? "preparing" : status === "packed" || status === "ready" ? "ready_to_ship" : status;
    const { error } = await createClient().rpc("change_order_status", { target_order_id: id, next_status: nextStatus, status_note: note ?? null });
    if (error) throw new Error(`Không thể đổi trạng thái: ${error.message}`);
    const order = await this.getOrder(id);
    if (!order) throw new Error("Không tìm thấy đơn hàng.");
    eventBus.emit("order.updated", order);
    return order;
  }

  async cancelOrder(id: string, reason?: string) { return this.updateOrderStatus(id, "cancelled", reason || "Đơn hàng đã hủy"); }

  async deleteOrder(id: string): Promise<void> {
    const { error } = await createClient().from("orders").delete().eq("id", id);
    if (error) throw new Error(`Không thể xóa đơn hàng: ${error.message}`);
    eventBus.emit("order.deleted", id);
  }

  async updatePaymentStatus(id: string, paymentStatus: OrderPaymentStatus): Promise<Order> {
    const { error } = await createClient().from("orders").update({ payment_status: paymentStatus }).eq("id", id);
    if (error) throw new Error(error.message);
    const order = await this.getOrder(id);
    if (!order) throw new Error("Không tìm thấy đơn hàng.");
    return order;
  }

  async addInternalNote(id: string, note: string): Promise<Order> {
    const order = await this.getOrder(id);
    if (!order) throw new Error("Không tìm thấy đơn hàng.");
    const internalNotes = [...(order.internalNotes ?? []), { id: crypto.randomUUID(), adminName: "Quản trị", text: note, date: new Date().toISOString() }];
    return this.updateOrder(id, { internalNotes });
  }

  async updateShipping(id: string, data: { shippingCompany?: string; trackingNumber?: string; courierName?: string; estimatedDeliveryDate?: string }) {
    return this.updateOrder(id, data);
  }

  async addCustomerUpdate(id: string, text: string) {
    return this.updateOrder(id, { customerUpdate: text, customerUpdatedAt: new Date().toISOString() });
  }

  async deleteMultiple(ids: string[]): Promise<void> {
    const { error } = await createClient().from("orders").delete().in("id", ids);
    if (error) throw new Error(error.message);
    eventBus.emit("orders.bulk_deleted", ids);
  }

  async markAsPaidMultiple(ids: string[]): Promise<void> {
    const { error } = await createClient().from("orders").update({ payment_status: "paid" }).in("id", ids);
    if (error) throw new Error(error.message);
    eventBus.emit("orders.bulk_updated", ids);
  }
}

export const OrderService = new SupabaseOrderRepository();

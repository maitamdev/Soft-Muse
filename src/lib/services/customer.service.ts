import type { Customer, CustomerAddress, CustomerStatus } from "@/data/mock/customers";
import { createClient } from "@/lib/supabase/client";
import { eventBus } from "@/lib/events/EventBus";

export interface CustomerFilters {
  search?: string;
  status?: string;
  tags?: string;
  registrationDateRange?: { start: string; end: string };
  minOrders?: number;
  minSpent?: number;
}

type CustomerRow = Record<string, unknown> & { customer_addresses?: Array<Record<string, unknown>> };
const select = "*, customer_addresses(*)";

function mapAddress(row: Record<string, unknown>): CustomerAddress {
  return {
    id: String(row.id),
    label: String(row.label ?? "Địa chỉ nhận hàng"),
    fullName: String(row.recipient_name ?? ""),
    phone: String(row.phone ?? ""),
    street: String(row.address_line ?? ""),
    area: String(row.ward ?? ""),
    city: [row.district, row.province].filter(Boolean).join(", "),
    country: "Việt Nam",
    isDefault: Boolean(row.is_default),
  };
}

function mapCustomer(row: CustomerRow): Customer {
  const fullName = String(row.full_name ?? "");
  const names = fullName.split(" ");
  const totalOrders = Number(row.total_orders ?? 0);
  const totalSpent = Number(row.total_spent ?? 0);
  return {
    id: String(row.id),
    customerNumber: String(row.customer_number ?? ""),
    firstName: names.at(-1) ?? "",
    lastName: names.slice(0, -1).join(" "),
    name: fullName,
    fullName,
    email: String(row.email ?? ""),
    phone: String(row.phone ?? ""),
    gender: (row.gender as Customer["gender"]) ?? "unspecified",
    marketingConsent: Boolean(row.marketing_consent),
    status: String(row.status ?? "active") as CustomerStatus,
    lifetimeValue: totalSpent,
    totalSpent,
    averagePurchaseValue: totalOrders ? Math.round(totalSpent / totalOrders) : 0,
    averageOrderValue: totalOrders ? Math.round(totalSpent / totalOrders) : 0,
    totalOrders,
    ordersCount: totalOrders,
    returnedOrdersCount: 0,
    cancelledOrdersCount: 0,
    totalRefunds: 0,
    couponsUsed: 0,
    loyaltyPoints: 0,
    wishlistCount: 0,
    cartItemsCount: 0,
    reviewsCount: 0,
    notes: String(row.notes ?? ""),
    internalNotes: (row.internal_notes as Customer["internalNotes"]) ?? [],
    tags: (row.tags as string[] | null) ?? [],
    segments: [],
    addresses: (row.customer_addresses ?? []).map(mapAddress),
    activities: [],
    registrationDate: String(row.created_at),
    createdAt: String(row.created_at),
  };
}

function toRow(data: Partial<Customer>) {
  return {
    full_name: data.fullName || data.name || `${data.lastName ?? ""} ${data.firstName ?? ""}`.trim(),
    email: data.email?.trim().toLowerCase(),
    phone: data.phone?.trim(),
    status: ["active", "inactive", "blocked"].includes(data.status ?? "") ? data.status : "active",
    notes: data.notes ?? "",
    gender: data.gender ?? "unspecified",
    marketing_consent: data.marketingConsent ?? false,
    tags: data.tags ?? [],
    internal_notes: data.internalNotes ?? [],
  };
}

export const CustomerService = {
  async getCustomers(filters?: CustomerFilters): Promise<Customer[]> {
    let query = createClient().from("customers").select(select).order("created_at", { ascending: false });
    if (filters?.search) query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%,customer_number.ilike.%${filters.search}%`);
    if (filters?.status && filters.status !== "all") query = query.eq("status", filters.status);
    if (filters?.tags) query = query.contains("tags", [filters.tags]);
    if (filters?.minOrders !== undefined) query = query.gte("total_orders", filters.minOrders);
    if (filters?.minSpent !== undefined) query = query.gte("total_spent", filters.minSpent);
    if (filters?.registrationDateRange) query = query.gte("created_at", filters.registrationDateRange.start).lte("created_at", filters.registrationDateRange.end);
    const { data, error } = await query;
    if (error) throw new Error(`Không thể tải khách hàng: ${error.message}`);
    return (data ?? []).map(mapCustomer);
  },

  async getCustomer(id: string): Promise<Customer | undefined> {
    const { data, error } = await createClient().from("customers").select(select).eq("id", id).maybeSingle();
    if (error) throw new Error(error.message);
    return data ? mapCustomer(data) : undefined;
  },

  async createCustomer(input: Partial<Customer>): Promise<Customer> {
    const { data, error } = await createClient().from("customers").insert(toRow(input)).select("id").single();
    if (error) throw new Error(`Không thể tạo khách hàng: ${error.message}`);
    const customer = await this.getCustomer(data.id);
    if (!customer) throw new Error("Không thể tải khách hàng vừa tạo.");
    eventBus.emit("customer.created", customer);
    return customer;
  },

  async updateCustomer(id: string, input: Partial<Customer>): Promise<Customer> {
    const { error } = await createClient().from("customers").update(toRow(input)).eq("id", id);
    if (error) throw new Error(`Không thể cập nhật khách hàng: ${error.message}`);
    const customer = await this.getCustomer(id);
    if (!customer) throw new Error("Không tìm thấy khách hàng.");
    eventBus.emit("customer.updated", customer);
    return customer;
  },

  async deleteMultiple(ids: string[]) {
    const { error } = await createClient().from("customers").delete().in("id", ids);
    if (error) throw new Error(error.message);
    eventBus.emit("customer.deleted", ids);
  },

  async blockCustomer(id: string) { return this.updateCustomer(id, { status: "blocked" }); },
  async activateCustomer(id: string) { return this.updateCustomer(id, { status: "active" }); },

  async addInternalNote(id: string, note: string) {
    const customer = await this.getCustomer(id);
    if (!customer) throw new Error("Không tìm thấy khách hàng.");
    return this.updateCustomer(id, { internalNotes: [...customer.internalNotes, { id: crypto.randomUUID(), adminName: "Quản trị", text: note, date: new Date().toISOString() }] });
  },

  async addTag(id: string, tag: string) {
    const customer = await this.getCustomer(id);
    if (!customer) throw new Error("Không tìm thấy khách hàng.");
    return this.updateCustomer(id, { tags: Array.from(new Set([...customer.tags, tag])) });
  },

  async removeTag(id: string, tag: string) {
    const customer = await this.getCustomer(id);
    if (!customer) throw new Error("Không tìm thấy khách hàng.");
    return this.updateCustomer(id, { tags: customer.tags.filter((item) => item !== tag) });
  },

  async addAddress(customerId: string, address: Omit<CustomerAddress, "id">) {
    if (address.isDefault) await createClient().from("customer_addresses").update({ is_default: false }).eq("customer_id", customerId);
    const { error } = await createClient().from("customer_addresses").insert({
      customer_id: customerId, label: address.label, recipient_name: address.fullName ?? "", phone: address.phone ?? "",
      address_line: address.street, ward: address.area ?? "", district: "", province: address.city, is_default: address.isDefault,
    });
    if (error) throw new Error(error.message);
    const customer = await this.getCustomer(customerId);
    if (!customer) throw new Error("Không tìm thấy khách hàng.");
    return customer;
  },

  async updateAddress(customerId: string, addressId: string, updates: Partial<CustomerAddress>) {
    if (updates.isDefault) await createClient().from("customer_addresses").update({ is_default: false }).eq("customer_id", customerId);
    const { error } = await createClient().from("customer_addresses").update({
      label: updates.label, recipient_name: updates.fullName, phone: updates.phone, address_line: updates.street,
      ward: updates.area, province: updates.city, is_default: updates.isDefault,
    }).eq("id", addressId).eq("customer_id", customerId);
    if (error) throw new Error(error.message);
    const customer = await this.getCustomer(customerId);
    if (!customer) throw new Error("Không tìm thấy khách hàng.");
    return customer;
  },

  async deleteAddress(customerId: string, addressId: string) {
    const { error } = await createClient().from("customer_addresses").delete().eq("id", addressId).eq("customer_id", customerId);
    if (error) throw new Error(error.message);
    const customer = await this.getCustomer(customerId);
    if (!customer) throw new Error("Không tìm thấy khách hàng.");
    return customer;
  },
};

import type { Coupon } from "@/data/mock/coupons";
import { createClient } from "@/lib/supabase/client";
import { eventBus } from "@/lib/events/EventBus";

function mapCoupon(row: Record<string, unknown>): Coupon {
  return {
    id: String(row.id),
    code: String(row.code),
    description: String(row.name ?? ""),
    type: String(row.discount_type) as Coupon["type"],
    discountValue: Number(row.discount_value ?? 0),
    status: row.is_active ? "active" : "disabled",
    usageLimit: row.usage_limit == null ? null : Number(row.usage_limit),
    usageCount: Number(row.used_count ?? 0),
    perCustomerLimit: Number(row.per_customer_limit ?? 1),
    startDate: row.starts_at ? String(row.starts_at) : new Date().toISOString(),
    expirationDate: row.expires_at ? String(row.expires_at) : null,
    minOrderValue: Number(row.minimum_order ?? 0),
    maxDiscountValue: row.maximum_discount == null ? undefined : Number(row.maximum_discount),
    includedCategories: [],
    excludedCategories: [],
    includedProducts: [],
    excludedProducts: [],
  };
}

function toRow(data: Partial<Coupon>) {
  return {
    code: data.code?.trim().toUpperCase(),
    name: data.description || data.code || "Mã ưu đãi",
    discount_type: data.type ?? "percentage",
    discount_value: data.discountValue ?? 0,
    minimum_order: data.minOrderValue ?? 0,
    maximum_discount: data.maxDiscountValue ?? null,
    usage_limit: data.usageLimit ?? null,
    per_customer_limit: data.perCustomerLimit ?? 1,
    starts_at: data.startDate || null,
    expires_at: data.expirationDate || null,
    is_active: data.status !== "disabled" && data.status !== "archived",
  };
}

export const CouponService = {
  async getCoupons(): Promise<Coupon[]> {
    const { data, error } = await createClient().from("coupons").select("*").order("created_at", { ascending: false });
    if (error) throw new Error(`Không thể tải mã giảm giá: ${error.message}`);
    return (data ?? []).map(mapCoupon);
  },

  async getCoupon(id: string): Promise<Coupon | undefined> {
    const { data, error } = await createClient().from("coupons").select("*").eq("id", id).maybeSingle();
    if (error) throw new Error(error.message);
    return data ? mapCoupon(data) : undefined;
  },

  async createCoupon(input: Partial<Coupon>): Promise<Coupon> {
    const { data, error } = await createClient().from("coupons").insert(toRow(input)).select("*").single();
    if (error) throw new Error(`Không thể tạo mã giảm giá: ${error.message}`);
    const coupon = mapCoupon(data);
    eventBus.emit("coupon.changed", coupon);
    return coupon;
  },

  async updateCoupon(id: string, input: Partial<Coupon>): Promise<Coupon> {
    const { data, error } = await createClient().from("coupons").update(toRow(input)).eq("id", id).select("*").single();
    if (error) throw new Error(`Không thể cập nhật mã giảm giá: ${error.message}`);
    const coupon = mapCoupon(data);
    eventBus.emit("coupon.changed", coupon);
    return coupon;
  },

  async deleteCoupon(id: string): Promise<void> {
    const { error } = await createClient().from("coupons").delete().eq("id", id);
    if (error) throw new Error(`Không thể xóa mã giảm giá: ${error.message}`);
    eventBus.emit("coupon.deleted", id);
  },

  async activateCoupon(id: string) { return this.updateCoupon(id, { status: "active" }); },
  async disableCoupon(id: string) { return this.updateCoupon(id, { status: "disabled" }); },
  async incrementUsage(code: string) { return this.getCoupons().then((items) => items.find((item) => item.code === code)); },
  isExpired(coupon: Coupon) { return Boolean(coupon.expirationDate && new Date(coupon.expirationDate) < new Date()); },

  async duplicateCoupon(id: string): Promise<Coupon> {
    const source = await this.getCoupon(id);
    if (!source) throw new Error("Không tìm thấy mã giảm giá.");
    const { id: ignored, ...copy } = source;
    void ignored;
    return this.createCoupon({ ...copy, code: `${source.code}-${Date.now().toString().slice(-4)}`, status: "disabled", usageCount: 0 });
  },

  async calculateDiscount(code: string, orderSubtotal: number): Promise<{ valid: boolean; discountAmount: number; error?: string; coupon?: Coupon }> {
    const { data, error } = await createClient().rpc("validate_coupon", { coupon_code: code, order_subtotal: orderSubtotal });
    if (error) return { valid: false, discountAmount: 0, error: error.message };
    const result = data as Record<string, unknown>;
    if (!result.valid) return { valid: false, discountAmount: 0, error: String(result.error ?? "Mã giảm giá không hợp lệ") };
    const coupon = mapCoupon({
      id: result.id,
      code: result.code,
      name: result.code,
      discount_type: result.discount_type,
      discount_value: result.discount_value,
      minimum_order: result.minimum_order,
      maximum_discount: result.maximum_discount,
      is_active: true,
      used_count: 0,
    });
    return { valid: true, discountAmount: Number(result.discount_amount ?? 0), coupon };
  },
};

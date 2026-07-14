import type { AnalyticsSummary, DeviceData, RevenueData, TopProduct } from "@/data/mock/analytics";
import { createClient } from "@/lib/supabase/client";

function startFor(period: "today" | "week" | "month" | "year") {
  const date = new Date();
  if (period === "today") date.setHours(0, 0, 0, 0);
  if (period === "week") date.setDate(date.getDate() - 7);
  if (period === "month") date.setMonth(date.getMonth() - 11, 1);
  if (period === "year") date.setFullYear(date.getFullYear() - 1);
  return date;
}

export const AnalyticsService = {
  async getSummary(): Promise<AnalyticsSummary> {
    const supabase = createClient();
    const [ordersResult, customersResult] = await Promise.all([
      supabase.from("orders").select("total, status"),
      supabase.from("customers").select("id", { count: "exact", head: true }),
    ]);
    if (ordersResult.error) throw new Error(ordersResult.error.message);
    const orders = (ordersResult.data ?? []) as Array<{ total: number | string; status: string }>;
    return {
      totalRevenue: orders.filter((order) => order.status === "delivered").reduce((sum, order) => sum + Number(order.total), 0),
      totalOrders: orders.length,
      totalCustomers: customersResult.count ?? 0,
      conversionRate: 0,
      revenueGrowth: 0,
      ordersGrowth: 0,
      customersGrowth: 0,
      conversionGrowth: 0,
    };
  },

  async getOverviewStats(period: "today" | "week" | "month" | "year") {
    return this.getRevenueData(period === "today" ? "week" : period === "week" ? "week" : period);
  },

  async getRevenueData(period: "week" | "month" | "year" = "month"): Promise<RevenueData[]> {
    const start = startFor(period);
    const { data, error } = await createClient()
      .from("orders")
      .select("total, created_at, status")
      .gte("created_at", start.toISOString())
      .not("status", "in", "(cancelled,returned,refunded)")
      .order("created_at");
    if (error) throw new Error(error.message);

    const buckets = new Map<string, RevenueData>();
    for (const order of (data ?? []) as Array<{ total: number | string; created_at: string; status: string }>) {
      const date = new Date(order.created_at);
      const key = period === "week"
        ? date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })
        : date.toLocaleDateString("vi-VN", { month: "2-digit", year: "2-digit" });
      const current = buckets.get(key) ?? { name: key, revenue: 0, orders: 0 };
      current.revenue += Number(order.total);
      current.orders += 1;
      buckets.set(key, current);
    }
    return Array.from(buckets.values());
  },

  async getTopProducts(): Promise<TopProduct[]> {
    const { data, error } = await createClient().from("order_items").select("product_id, product_name, quantity, total, image_url");
    if (error) throw new Error(error.message);
    const grouped = new Map<string, TopProduct>();
    for (const item of (data ?? []) as Array<{ product_id: string | null; product_name: string; quantity: number; total: number | string; image_url: string | null }>) {
      const id = String(item.product_id ?? item.product_name);
      const current = grouped.get(id) ?? { id, name: item.product_name, sales: 0, revenue: 0, image: item.image_url ?? "" };
      current.sales += Number(item.quantity);
      current.revenue += Number(item.total);
      grouped.set(id, current);
    }
    return Array.from(grouped.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 10);
  },

  async getDeviceData(): Promise<DeviceData[]> {
    return [];
  },
};

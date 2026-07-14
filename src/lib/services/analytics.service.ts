import type { AnalyticsSummary, DeviceData, RevenueData, TopProduct } from "@/data/mock/analytics";
import { createClient } from "@/lib/supabase/client";

function startFor(period: "today" | "week" | "month" | "year") {
  const date = new Date();
  if (period === "today") date.setHours(0, 0, 0, 0);
  if (period === "week") date.setDate(date.getDate() - 6);
  if (period === "month") date.setDate(date.getDate() - 29);
  if (period === "year") date.setMonth(date.getMonth() - 11, 1);
  return date;
}

const growth = (current: number, previous: number) => previous === 0 ? (current > 0 ? 100 : 0) : Number((((current - previous) / previous) * 100).toFixed(1));

export const AnalyticsService = {
  async getSummary(): Promise<AnalyticsSummary> {
    const supabase = createClient();
    const now = new Date();
    const currentStart = new Date(now); currentStart.setDate(currentStart.getDate() - 30);
    const previousStart = new Date(currentStart); previousStart.setDate(previousStart.getDate() - 30);
    const [ordersResult, customersResult, eventsResult] = await Promise.all([
      supabase.from("orders").select("total,status,created_at").is("archived_at", null),
      supabase.from("customers").select("id,created_at"),
      supabase.from("analytics_events").select("event_type,session_id,created_at").gte("created_at", previousStart.toISOString()),
    ]);
    if (ordersResult.error) throw new Error(ordersResult.error.message);
    if (customersResult.error) throw new Error(customersResult.error.message);
    if (eventsResult.error) throw new Error(eventsResult.error.message);
    const orders = (ordersResult.data ?? []) as Array<{ total: number | string; status: string; created_at: string }>;
    const customers = (customersResult.data ?? []) as Array<{ id: string; created_at: string }>;
    const events = (eventsResult.data ?? []) as Array<{ event_type: string; session_id: string; created_at: string }>;
    const isCurrent = (date: string) => new Date(date) >= currentStart;
    const isPrevious = (date: string) => new Date(date) >= previousStart && new Date(date) < currentStart;
    const currentOrders = orders.filter((order) => isCurrent(order.created_at));
    const previousOrders = orders.filter((order) => isPrevious(order.created_at));
    const currentRevenue = currentOrders.filter((order) => order.status === "delivered").reduce((sum, order) => sum + Number(order.total), 0);
    const previousRevenue = previousOrders.filter((order) => order.status === "delivered").reduce((sum, order) => sum + Number(order.total), 0);
    const conversion = (predicate: (date: string) => boolean) => {
      const relevant = events.filter((event) => predicate(event.created_at));
      const visits = new Set(relevant.filter((event) => event.event_type === "page_view").map((event) => event.session_id)).size;
      const purchases = new Set(relevant.filter((event) => event.event_type === "purchase").map((event) => event.session_id)).size;
      return visits ? Number(((purchases / visits) * 100).toFixed(2)) : 0;
    };
    const currentConversion = conversion(isCurrent);
    const previousConversion = conversion(isPrevious);
    return {
      totalRevenue: orders.filter((order) => order.status === "delivered").reduce((sum, order) => sum + Number(order.total), 0),
      totalOrders: orders.length,
      totalCustomers: customers.length,
      conversionRate: currentConversion,
      revenueGrowth: growth(currentRevenue, previousRevenue),
      ordersGrowth: growth(currentOrders.length, previousOrders.length),
      customersGrowth: growth(customers.filter((item) => isCurrent(item.created_at)).length, customers.filter((item) => isPrevious(item.created_at)).length),
      conversionGrowth: growth(currentConversion, previousConversion),
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
      .eq("status", "delivered")
      .is("archived_at", null)
      .order("created_at");
    if (error) throw new Error(error.message);

    const buckets = new Map<string, RevenueData>();
    for (const order of (data ?? []) as Array<{ total: number | string; created_at: string; status: string }>) {
      const date = new Date(order.created_at);
      const key = period === "week" || period === "month"
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
    const { data, error } = await createClient().from("order_items").select("product_id, product_name, quantity, total, image_url, orders!inner(status,archived_at)").eq("orders.status", "delivered").is("orders.archived_at", null);
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
    const since = new Date(); since.setDate(since.getDate() - 30);
    const { data, error } = await createClient().from("analytics_events").select("device,session_id").eq("event_type", "page_view").gte("created_at", since.toISOString());
    if (error) throw new Error(error.message);
    const sessions = new Map<string, string>();
    for (const event of (data ?? []) as Array<{ device: string; session_id: string }>) sessions.set(event.session_id, event.device);
    const counts = { mobile: 0, tablet: 0, desktop: 0 };
    for (const value of sessions.values()) counts[value as keyof typeof counts] = (counts[value as keyof typeof counts] ?? 0) + 1;
    const total = sessions.size;
    if (!total) return [];
    return [
      { name: "Điện thoại", value: Number(((counts.mobile / total) * 100).toFixed(1)) },
      { name: "Máy tính bảng", value: Number(((counts.tablet / total) * 100).toFixed(1)) },
      { name: "Máy tính", value: Number(((counts.desktop / total) * 100).toFixed(1)) },
    ].filter((item) => item.value > 0);
  },
};

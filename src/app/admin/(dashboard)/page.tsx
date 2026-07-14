"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  IconAlertTriangle,
  IconArrowUpRight,
  IconChartBar,
  IconChecklist,
  IconDiscount2,
  IconPackage,
  IconPlus,
  IconReceipt2,
  IconShoppingBag,
  IconSparkles,
  IconTruckDelivery,
  IconUsers,
  IconWallet,
} from "@tabler/icons-react";
import { RevenueChart } from "@/components/admin/charts/RevenueChart";
import { Badge } from "@/components/admin/design-system/Badge";
import { Button } from "@/components/admin/design-system/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/design-system/Card";
import { useEventSubscribeMany } from "@/hooks/useEventBus";
import { DASHBOARD_REFRESH_EVENTS } from "@/lib/events/refresh-events";
import { AnalyticsService } from "@/lib/services/analytics.service";
import { CustomerService } from "@/lib/services/customer.service";
import { OrderService } from "@/lib/services/order.service";
import { ProductService } from "@/lib/services/product.service";
import { toast } from "sonner";

type DashboardOrder = {
  id: string;
  orderNumber?: string;
  customerName?: string;
  status?: string;
  paymentStatus?: string;
  total?: number;
  date?: string;
  createdAt?: string;
};

type DashboardCustomer = {
  id: string;
  fullName?: string;
  name?: string;
  email?: string;
  totalSpent?: number;
  spent?: number;
  registrationDate?: string;
  createdAt?: string;
};

type DashboardProduct = {
  id: string;
  name: string;
  sku: string;
  stock?: number;
  price?: number;
  costPrice?: number;
};

type DashboardState = {
  revenueData: Record<string, unknown>[];
  orders: DashboardOrder[];
  customers: DashboardCustomer[];
  products: DashboardProduct[];
};

const money = (value = 0) => `${new Intl.NumberFormat("vi-VN").format(value)} đ`;
const number = (value = 0) => new Intl.NumberFormat("vi-VN").format(value);

const statusLabel: Record<string, { label: string; variant: "warning" | "primary" | "info" | "success" | "danger" | "neutral" }> = {
  pending: { label: "Chờ xác nhận", variant: "warning" },
  confirmed: { label: "Đã xác nhận", variant: "info" },
  processing: { label: "Đang xử lý", variant: "primary" },
  preparing: { label: "Đang chuẩn bị", variant: "primary" },
  ready_to_ship: { label: "Sẵn sàng giao", variant: "info" },
  shipped: { label: "Đã gửi hàng", variant: "info" },
  out_for_delivery: { label: "Đang giao", variant: "info" },
  delivered: { label: "Hoàn tất", variant: "success" },
  completed: { label: "Hoàn tất", variant: "success" },
  cancelled: { label: "Đã hủy", variant: "danger" },
  returned: { label: "Hoàn trả", variant: "neutral" },
};

function KpiTile({
  title,
  value,
  helper,
  icon,
  tone = "neutral",
}: {
  title: string;
  value: string;
  helper: string;
  icon: React.ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
}) {
  const tones = {
    neutral: "bg-slate-50 text-slate-700 border-slate-200",
    success: "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    danger: "bg-rose-50 text-rose-700 border-rose-200",
    info: "bg-sky-50 text-sky-700 border-sky-200",
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--admin-text-subtle)]">{title}</p>
            <p className="mt-3 text-2xl font-bold tracking-tight text-[var(--admin-text-base)] tabular-nums">{value}</p>
          </div>
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border ${tones[tone]}`}>
            {icon}
          </div>
        </div>
        <p className="mt-4 text-xs font-medium text-[var(--admin-text-muted)]">{helper}</p>
      </CardContent>
    </Card>
  );
}

function SectionHeader({ title, subtitle, href }: { title: string; subtitle?: string; href?: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <CardTitle className="text-base">{title}</CardTitle>
        {subtitle && <p className="mt-1 text-xs text-[var(--admin-text-muted)]">{subtitle}</p>}
      </div>
      {href && (
        <Link href={href} className="text-xs font-semibold text-[var(--admin-primary)] hover:underline">
          Xem tất cả
        </Link>
      )}
    </div>
  );
}

export default function DashboardHome() {
  const [data, setData] = useState<DashboardState | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [revenueData, orders, customers, products] = await Promise.all([
        AnalyticsService.getRevenueData("month"),
        OrderService.getOrders(),
        CustomerService.getCustomers(),
        ProductService.getProducts(),
      ]);

      setData({
        revenueData: revenueData as unknown as Record<string, unknown>[],
        orders: orders as DashboardOrder[],
        customers: customers as DashboardCustomer[],
        products: products as DashboardProduct[],
      });
    } catch {
      toast.error("Không tải được dữ liệu bảng điều khiển.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEventSubscribeMany(DASHBOARD_REFRESH_EVENTS, load);

  const metrics = useMemo(() => {
    if (!data) return null;
    const paidRevenue = data.orders.reduce((sum, order) => sum + (order.paymentStatus === "paid" ? order.total ?? 0 : 0), 0);
    const pendingOrders = data.orders.filter((order) => ["pending", "confirmed"].includes(order.status ?? "")).length;
    const shippingOrders = data.orders.filter((order) => ["ready_to_ship", "shipped", "out_for_delivery"].includes(order.status ?? "")).length;
    const lowStock = data.products.filter((product) => (product.stock ?? 0) > 0 && (product.stock ?? 0) <= 10);
    const outOfStock = data.products.filter((product) => (product.stock ?? 0) <= 0);
    const inventoryValue = data.products.reduce((sum, product) => sum + (product.stock ?? 0) * (product.costPrice ?? 0), 0);

    return {
      paidRevenue,
      pendingOrders,
      shippingOrders,
      lowStock,
      outOfStock,
      inventoryValue,
      averageOrder: data.orders.length ? paidRevenue / data.orders.length : 0,
    };
  }, [data]);

  if (loading || !data || !metrics) {
    return (
      <div className="space-y-6">
        <div className="h-28 rounded-[var(--admin-radius-2xl)] bg-[var(--admin-bg-elevated)] animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-36 rounded-[var(--admin-radius-xl)] bg-[var(--admin-bg-elevated)] animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2 h-96 rounded-[var(--admin-radius-xl)] bg-[var(--admin-bg-elevated)] animate-pulse" />
          <div className="h-96 rounded-[var(--admin-radius-xl)] bg-[var(--admin-bg-elevated)] animate-pulse" />
        </div>
      </div>
    );
  }

  const recentOrders = data.orders.slice(0, 6);
  const latestCustomers = [...data.customers]
    .sort((a, b) => new Date(b.registrationDate ?? b.createdAt ?? 0).getTime() - new Date(a.registrationDate ?? a.createdAt ?? 0).getTime())
    .slice(0, 5);
  const stockAlerts = [...metrics.outOfStock, ...metrics.lowStock].slice(0, 5);

  return (
    <div className="space-y-6 pb-12">
      <section className="relative overflow-hidden rounded-[var(--admin-radius-2xl)] border border-[#E7DDD0] bg-[#FBF8F3] p-6 md:p-8 shadow-[var(--admin-shadow-sm)]">
        <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-[linear-gradient(135deg,rgba(196,160,122,0.18),rgba(255,255,255,0))] md:block" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E5D6C3] bg-white px-3 py-1 text-xs font-semibold text-[#8F6B4A]">
              <IconSparkles size={15} />
              Dữ liệu trực tiếp từ Supabase
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-[#1C1C1B] md:text-4xl">Bảng điều khiển Soft Muse</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6B6259]">
              Theo dõi doanh thu, đơn hàng, tồn kho và khách hàng theo dữ liệu vận hành thực tế của cửa hàng.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/products/new">
              <Button leftIcon={<IconPlus size={17} />}>Thêm sản phẩm</Button>
            </Link>
            <Link href="/admin/orders">
              <Button variant="secondary" leftIcon={<IconReceipt2 size={17} />}>Xử lý đơn</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiTile title="Doanh thu đã thanh toán" value={money(metrics.paidRevenue)} helper={`Giá trị đơn trung bình ${money(metrics.averageOrder)}`} icon={<IconWallet size={22} />} tone="success" />
        <KpiTile title="Đơn cần xử lý" value={number(metrics.pendingOrders)} helper={`${number(metrics.shippingOrders)} đơn đang vận chuyển`} icon={<IconShoppingBag size={22} />} tone="info" />
        <KpiTile title="Khách hàng" value={number(data.customers.length)} helper="Tổng hồ sơ khách hàng trên hệ thống" icon={<IconUsers size={22} />} tone="neutral" />
        <KpiTile title="Cảnh báo tồn kho" value={number(stockAlerts.length)} helper={`${number(metrics.outOfStock.length)} sản phẩm hết hàng`} icon={<IconAlertTriangle size={22} />} tone={stockAlerts.length ? "warning" : "success"} />
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-2 overflow-hidden">
          <CardHeader className="border-b border-[var(--admin-border-light)] bg-[var(--admin-bg-surface)] p-5">
            <SectionHeader title="Doanh thu theo tháng" subtitle="Tổng hợp trực tiếp từ các đơn hàng" href="/admin/analytics" />
          </CardHeader>
          <CardContent className="h-[360px] p-5">
            <RevenueChart data={data.revenueData} />
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="border-b border-[var(--admin-border-light)] bg-[var(--admin-bg-surface)] p-5">
            <SectionHeader title="Việc cần làm" subtitle="Lối tắt thao tác thường dùng" />
          </CardHeader>
          <CardContent className="space-y-3 p-4">
            {[
              { href: "/admin/products", icon: <IconPackage size={18} />, label: "Quản lý sản phẩm", helper: "Giá, ảnh, size, tồn kho" },
              { href: "/admin/orders", icon: <IconTruckDelivery size={18} />, label: "Xử lý đơn hàng", helper: "Xác nhận và cập nhật giao hàng" },
              { href: "/admin/coupons", icon: <IconDiscount2 size={18} />, label: "Mã giảm giá", helper: "Tạo ưu đãi và chiến dịch" },
              { href: "/admin/collections", icon: <IconChartBar size={18} />, label: "Bộ sưu tập", helper: "Sắp xếp nhóm sản phẩm nổi bật" },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-[var(--admin-radius-lg)] border border-[var(--admin-border-light)] bg-[var(--admin-bg-card)] p-3 transition hover:border-[var(--admin-primary)] hover:bg-[var(--admin-bg-hover)]">
                <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[var(--admin-primary-muted)] text-[var(--admin-primary)]">{item.icon}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-[var(--admin-text-base)]">{item.label}</span>
                  <span className="block truncate text-xs text-[var(--admin-text-muted)]">{item.helper}</span>
                </span>
                <IconArrowUpRight size={16} className="text-[var(--admin-text-subtle)]" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card className="xl:col-span-2 overflow-hidden">
          <CardHeader className="border-b border-[var(--admin-border-light)] bg-[var(--admin-bg-surface)] p-5">
            <SectionHeader title="Đơn hàng gần đây" subtitle="Các đơn mới nhất từ cửa hàng" href="/admin/orders" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-[var(--admin-border-light)]">
              {recentOrders.map((order) => {
                const meta = statusLabel[order.status ?? ""] ?? { label: order.status ?? "Không rõ", variant: "neutral" as const };
                return (
                  <Link key={order.id} href={`/admin/orders/${order.id}`} className="grid grid-cols-1 gap-3 p-4 transition hover:bg-[var(--admin-bg-hover)] md:grid-cols-[1.1fr_1fr_auto] md:items-center">
                    <div>
                      <p className="text-sm font-bold text-[var(--admin-text-base)]">{order.orderNumber ?? order.id}</p>
                      <p className="mt-1 text-xs text-[var(--admin-text-muted)]">{order.customerName ?? "Khách lẻ"}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={meta.variant} size="sm">{meta.label}</Badge>
                      <Badge variant={order.paymentStatus === "paid" ? "success" : "warning"} size="sm">
                        {order.paymentStatus === "paid" ? "Đã thanh toán" : "Chờ thanh toán"}
                      </Badge>
                    </div>
                    <p className="text-sm font-bold tabular-nums text-[var(--admin-text-base)] md:text-right">{money(order.total ?? 0)}</p>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card className="overflow-hidden">
            <CardHeader className="border-b border-[var(--admin-border-light)] bg-[var(--admin-bg-surface)] p-5">
              <SectionHeader title="Tồn kho cần chú ý" subtitle={`Giá trị tồn kho: ${money(metrics.inventoryValue)}`} href="/admin/inventory" />
            </CardHeader>
            <CardContent className="p-0">
              {stockAlerts.length === 0 ? (
                <div className="p-6 text-center">
                  <IconChecklist size={34} className="mx-auto text-emerald-600" />
                  <p className="mt-2 text-sm font-semibold">Tồn kho đang ổn</p>
                </div>
              ) : (
                <div className="divide-y divide-[var(--admin-border-light)]">
                  {stockAlerts.map((product) => (
                    <Link key={product.id} href={`/admin/products/${product.id}`} className="flex items-center justify-between gap-3 p-4 transition hover:bg-[var(--admin-bg-hover)]">
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-[var(--admin-text-base)]">{product.name}</span>
                        <span className="block text-xs font-mono text-[var(--admin-text-muted)]">{product.sku}</span>
                      </span>
                      <Badge variant={(product.stock ?? 0) <= 0 ? "danger" : "warning"} size="sm">
                        {(product.stock ?? 0) <= 0 ? "Hết hàng" : `Còn ${product.stock}`}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="border-b border-[var(--admin-border-light)] bg-[var(--admin-bg-surface)] p-5">
              <SectionHeader title="Khách mới" href="/admin/customers" />
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-[var(--admin-border-light)]">
                {latestCustomers.map((customer) => (
                  <Link key={customer.id} href={`/admin/customers/${customer.id}`} className="flex items-center gap-3 p-4 transition hover:bg-[var(--admin-bg-hover)]">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F1E7DA] text-sm font-bold text-[#8F6B4A]">
                      {(customer.fullName ?? customer.name ?? "K").charAt(0)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{customer.fullName ?? customer.name}</span>
                      <span className="block truncate text-xs text-[var(--admin-text-muted)]">{customer.email}</span>
                    </span>
                    <span className="text-xs font-bold tabular-nums text-[var(--admin-text-muted)]">{money(customer.totalSpent ?? customer.spent ?? 0)}</span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

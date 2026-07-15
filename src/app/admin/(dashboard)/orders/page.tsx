"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminAr } from '@/lib/i18n/admin-ar';
import { OrderService, OrderFilters, CreateOrderInput } from '@/lib/services/order.service';
import { Order, OrderPaymentStatus } from '@/data/mock/orders';
import type { ProductVariant } from '@/data/mock/products';
import { getStatusMeta, WORKFLOW_STATUSES } from '@/lib/orders/order-status';
import { CustomerService } from '@/lib/services/customer.service';
import { ProductService } from '@/lib/services/product.service';
import { CouponService } from '@/lib/services/coupon.service';
import { useEventSubscribeMany } from '@/hooks/useEventBus';
import { REFRESH_EVENTS } from '@/lib/events/refresh-events';
import { usePermissions } from '@/lib/auth/PermissionContext';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

// SaaS UI Components
import { PageHeader, EmptyState } from '@/components/admin/design-system/Layout';
import { Card } from '@/components/admin/design-system/Card';
import { Input } from '@/components/admin/design-system/Input';
import { Button } from '@/components/admin/design-system/Button';
import { Badge } from '@/components/admin/design-system/Badge';
import { DataTable, Column } from '@/components/admin/design-system/DataTable';
import { Modal } from '@/components/admin/design-system/Modal';

// Tabler Icons
import {
 IconSearch,
 IconTrash,
 IconShoppingBag,
 IconCheck,
 IconDownload,
 IconPrinter,
 IconPlus,
 IconX,
} from '@tabler/icons-react';

interface OrderLine { productId: string; variantId?: string; quantity: number; }
const escapeHtml = (value: unknown) => String(value).replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!);
const escapeCsv = (value: unknown) => {
 const raw = String(value);
 const safe = /^[=+\-@\t\r]/.test(raw) ? `'${raw}` : raw;
 return `"${safe.replaceAll('"', '""')}"`;
};

export default function OrdersPage() {
 const router = useRouter();
 const { can } = usePermissions();
 const canWrite = can('orders', 'write');
 const canDelete = can('orders', 'delete');
 const [orders, setOrders] = useState<Order[]>([]);
 const [loading, setLoading] = useState(true);
 const [selectedIds, setSelectedIds] = useState<string[]>([]);
 
 const [filters, setFilters] = useState<OrderFilters>({ search: '', status: 'all', paymentStatus: 'all', paymentMethod: 'all' });

 // --- Create Order modal state ---
 const [createOpen, setCreateOpen] = useState(false);
 const [creating, setCreating] = useState(false);
 const [custList, setCustList] = useState<{ id: string; name: string; email: string; phone?: string }[]>([]);
 const [prodList, setProdList] = useState<{ id: string; name: string; sku: string; price: number; stock: number; variants: ProductVariant[] }[]>([]);
 const [form, setForm] = useState<{ customerId: string; shippingAddress: string; lines: OrderLine[] }>({ customerId: '', shippingAddress: '', lines: [{ productId: '', quantity: 1 }] });

 // Coupon state for the create-order modal
 const [couponCode, setCouponCode] = useState('');
 const [appliedCode, setAppliedCode] = useState<string | null>(null);
 const [couponDiscount, setCouponDiscount] = useState(0);
 const [couponMsg, setCouponMsg] = useState('');
 const [couponLoading, setCouponLoading] = useState(false);

 const openCreate = async () => {
 setForm({ customerId: '', shippingAddress: '', lines: [{ productId: '', quantity: 1 }] });
 setCouponCode(''); setAppliedCode(null); setCouponDiscount(0); setCouponMsg('');
 setCreateOpen(true);
 try {
 const [customers, products] = await Promise.all([CustomerService.getCustomers(), ProductService.getProducts()]);
 setCustList(customers.map(c => ({ id: c.id, name: c.fullName || c.name, email: c.email, phone: c.phone })));
 setProdList(products.filter(p => p.status === 'published' && p.stock > 0).map(p => ({ id: p.id, name: p.name, sku: p.sku, price: p.price, stock: p.stock, variants: p.variants.filter(variant => variant.status !== 'inactive' && variant.stock > 0) })));
 } catch {
 toast.error(adminAr.toasts.unexpectedError);
 }
 };

 const orderTotal = form.lines.reduce((sum, l) => {
 const p = prodList.find(pr => pr.id === l.productId);
 const variant = p?.variants.find(item => item.id === l.variantId);
 return sum + (p ? (variant?.price ?? p.price) * l.quantity : 0);
 }, 0);
 const orderNet = Math.max(0, orderTotal - (appliedCode ? couponDiscount : 0));

 const handleApplyCoupon = async () => {
 const code = couponCode.trim();
 if (!code) { setCouponMsg(''); return; }
 setCouponLoading(true);
 setCouponMsg('');
 try {
 const res = await CouponService.calculateDiscount(code, orderTotal);
 if (!res.valid) {
 setAppliedCode(null);
 setCouponDiscount(0);
 setCouponMsg(res.error || 'Mã giảm giá không hợp lệ.');
 } else {
 setAppliedCode(code.toUpperCase());
 setCouponDiscount(res.discountAmount);
 setCouponMsg('');
 toast.success('Đã áp dụng mã giảm giá.');
 }
 } catch {
 setCouponMsg('Không thể kiểm tra mã giảm giá.');
 } finally {
 setCouponLoading(false);
 }
 };

 const handleCreateOrder = async () => {
 const customer = custList.find(c => c.id === form.customerId);
 const lines = form.lines.filter(l => l.productId && l.quantity > 0);
 if (!customer) { toast.error('Vui lòng chọn khách hàng.'); return; }
 if (lines.length === 0) { toast.error('Vui lòng thêm ít nhất một sản phẩm.'); return; }
 if (lines.some(line => { const product = prodList.find(item => item.id === line.productId); return Boolean(product?.variants.length && !line.variantId); })) { toast.error('Vui lòng chọn biến thể cho tất cả sản phẩm có phân loại.'); return; }
 if (!form.shippingAddress.trim()) { toast.error('Vui lòng nhập địa chỉ giao hàng.'); return; }
 if (new Set(lines.map(line => `${line.productId}:${line.variantId ?? ''}`)).size !== lines.length) { toast.error('Mỗi sản phẩm/biến thể chỉ được thêm một dòng.'); return; }
 setCreating(true);
 try {
 const input: CreateOrderInput = {
 customerId: customer.id,
 customerName: customer.name,
 customerEmail: customer.email,
 customerPhone: customer.phone,
 shippingAddress: form.shippingAddress,
 discount: appliedCode ? couponDiscount : 0,
 couponCode: appliedCode,
 items: lines.map(l => {
 const p = prodList.find(pr => pr.id === l.productId)!;
 const variant = p.variants.find(item => item.id === l.variantId);
 return { productId: p.id, variantId: variant?.id, productName: p.name, sku: variant?.sku ?? p.sku, quantity: l.quantity, price: variant?.price ?? p.price, size: variant?.size };
 }),
 };
 const created = await OrderService.createOrder(input);
 toast.success(`Đã tạo đơn hàng ${created.orderNumber}.`);
 setCreateOpen(false);
 loadOrders();
 } catch (error) {
 toast.error(error instanceof Error ? error.message : adminAr.toasts.unexpectedError);
 } finally {
 setCreating(false);
 }
 };

 useEffect(() => {
 loadOrders();
 }, [filters]);

 useEventSubscribeMany(REFRESH_EVENTS.orders, loadOrders);

 async function loadOrders() {
 setLoading(true);
 try {
 const data = await OrderService.getOrders(filters);
 setOrders(data);
 } catch {
 toast.error(adminAr.toasts.unexpectedError);
 } finally {
 setLoading(false);
 }
 };

 const handleDeleteSelected = async () => {
 if (!confirm(`Lưu trữ ${selectedIds.length} đơn hàng đã chọn? Chỉ đơn đã giao, đã hủy hoặc đã hoàn tiền mới được lưu trữ.`)) return;
 try {
 await OrderService.deleteMultiple(selectedIds);
 toast.success(adminAr.toasts.itemsDeleted);
 setSelectedIds([]);
 loadOrders();
 } catch {
 toast.error(adminAr.toasts.unexpectedError);
 }
 };

 const handleMarkPaidSelected = async () => {
 if (!confirm(`Đánh dấu ${selectedIds.length} đơn hàng là đã thanh toán?`)) return;
 try {
 await OrderService.markAsPaidMultiple(selectedIds);
 toast.success(adminAr.toasts.dataSaved);
 setSelectedIds([]);
 loadOrders();
 } catch {
 toast.error(adminAr.toasts.unexpectedError);
 }
 };

 const handleExportSelected = () => {
 const rows = orders.filter(order => selectedIds.includes(order.id));
 const csv = [['Mã đơn', 'Khách hàng', 'Ngày', 'Tổng tiền', 'Trạng thái'], ...rows.map(order => [order.orderNumber, order.customerName, order.date, String(order.total), getStatusMeta(order.status).label])]
 .map(row => row.map(escapeCsv).join(',')).join('\n');
 const url = URL.createObjectURL(new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' }));
 const link = document.createElement('a');
 link.href = url; link.download = `don-hang-${new Date().toISOString().slice(0, 10)}.csv`; link.click();
 URL.revokeObjectURL(url);
 toast.success('Đã xuất danh sách đơn hàng.');
 };

 const handlePrintSelected = () => {
 const rows = orders.filter(order => selectedIds.includes(order.id));
 const popup = window.open('', '_blank', 'noopener,noreferrer');
 if (!popup) return toast.error('Trình duyệt đang chặn cửa sổ in.');
 popup.document.write(`<html><head><title>Đơn hàng</title><style>body{font-family:Arial;padding:24px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px;text-align:left}</style></head><body><h1>Danh sách đơn hàng</h1><table><thead><tr><th>Mã đơn</th><th>Khách hàng</th><th>Tổng tiền</th><th>Trạng thái</th></tr></thead><tbody>${rows.map(order => `<tr><td>${escapeHtml(order.orderNumber)}</td><td>${escapeHtml(order.customerName)}</td><td>${order.total.toLocaleString('vi-VN')} đ</td><td>${escapeHtml(getStatusMeta(order.status).label)}</td></tr>`).join('')}</tbody></table></body></html>`);
 popup.document.close(); popup.focus(); popup.print();
 };

 const paymentStatusMap: Record<OrderPaymentStatus, { label: string, variant: any }> = {
 paid: { label: 'Đã thanh toán', variant: 'success' },
 unpaid: { label: 'Chưa thanh toán', variant: 'warning' },
 refunded: { label: 'Đã hoàn tiền', variant: 'neutral' },
 partial: { label: 'Thanh toán một phần', variant: 'warning' },
 partially_refunded: { label: 'Hoàn tiền một phần', variant: 'warning' }
 };

 const columns: Column<Order>[] = [
 { 
 header: adminAr.orders.orderNumber, 
 accessor: 'orderNumber', 
 sortable: true,
 render: (val) => <span className="font-semibold text-[var(--admin-text-base)]">{String(val)}</span>
 },
 { header: adminAr.orders.customer, accessor: 'customerName', sortable: true },
 { header: adminAr.orders.date, accessor: 'date', type: 'date', sortable: true },
 { header: adminAr.orders.total, accessor: 'total', type: 'price', sortable: true },
 {
 header: adminAr.orders.status,
 accessor: 'status',
 render: (_, row) => {
 const config = getStatusMeta(row.status);
 return <Badge variant={config.badge}>{config.label}</Badge>;
 }
 },
 { 
 header: adminAr.orders.paymentStatus, 
 accessor: 'paymentStatus', 
 render: (_, row) => {
 const config = paymentStatusMap[row.paymentStatus];
 return <Badge variant={config?.variant || 'neutral'}>{config?.label}</Badge>;
 }
 },
 ];

 return (
 <div className="space-y-6 pb-20"> <PageHeader
 title={adminAr.orders.title}
 description={adminAr.orders.subtitle}
 actions={
 canWrite ? (
 <Button variant="primary" leftIcon={<IconPlus size={18} />} onClick={openCreate}>
 Thêm đơn hàng</Button>
 ) : undefined
 }
 /> <AnimatePresence>
 {selectedIds.length > 0 && (
 <motion.div 
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -10 }}
 className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--admin-bg-elevated)] border border-[var(--admin-border-base)] text-[var(--admin-text-base)] p-3 rounded-[var(--admin-radius-xl)] shadow-[var(--admin-shadow-lg)] sticky top-20 z-20"
 > <div className="flex items-center gap-4"> <Badge variant="primary">{selectedIds.length} </Badge> <div className="hidden sm:block h-4 w-px bg-[var(--admin-border-strong)]" />
 {canWrite && (
 <Button size="sm" variant="ghost" onClick={handleMarkPaidSelected} leftIcon={<IconCheck size={16} />} className="text-[var(--admin-success)] hover:bg-[var(--admin-success)]/10">
 Đã thanh toán
 </Button>
 )}
 <Button size="sm" variant="ghost" onClick={handleExportSelected} leftIcon={<IconDownload size={16} />} className="text-[var(--admin-text-base)] hover:bg-[var(--admin-bg-hover)]">
 Xuất
 </Button> <Button size="sm" variant="ghost" onClick={handlePrintSelected} leftIcon={<IconPrinter size={16} />} className="text-[var(--admin-info)] hover:bg-[var(--admin-info)]/10">
 In
 </Button> </div> <div className="flex items-center gap-2">
 {canDelete && (
 <Button size="sm" variant="danger" leftIcon={<IconTrash size={16} />} onClick={handleDeleteSelected}>
 Xóa mục đã chọn
 </Button>
 )}
 <Button size="sm" variant="ghost" onClick={() => setSelectedIds([])}>
 Hủy
 </Button> </div> </motion.div>
 )}
 </AnimatePresence> <Card className="p-4 flex flex-col gap-4"> <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4"> <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto flex-1"> <Input 
 icon={<IconSearch size={18} />}
 placeholder={adminAr.common.search}
 value={filters.search}
 onChange={(e) => setFilters({ ...filters, search: e.target.value })}
 className="w-full sm:w-64"
 /> <select
 value={filters.status}
 onChange={(e) => setFilters({ ...filters, status: e.target.value })}
 className="h-10 px-3 bg-[var(--admin-bg-base)] border border-[var(--admin-border-base)] rounded-[var(--admin-radius-md)] text-sm outline-none focus:ring-2 focus:ring-[var(--admin-primary)] w-full sm:w-auto"
 > <option value="all">Tất cả trạng thái đơn</option>
 {WORKFLOW_STATUSES.map((key) => (
 <option key={key} value={key}>{getStatusMeta(key).label}</option>
 ))}
 </select> <select 
 value={filters.paymentStatus} 
 onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value })}
 className="h-10 px-3 bg-[var(--admin-bg-base)] border border-[var(--admin-border-base)] rounded-[var(--admin-radius-md)] text-sm outline-none focus:ring-2 focus:ring-[var(--admin-primary)] w-full sm:w-auto"
 > <option value="all">Tất cả trạng thái thanh toán</option>
 {Object.entries(paymentStatusMap).map(([key, val]) => (
 <option key={key} value={key}>{val.label}</option>
 ))}
 </select> <select 
 value={filters.paymentMethod} 
 onChange={(e) => setFilters({ ...filters, paymentMethod: e.target.value })}
 className="h-10 px-3 bg-[var(--admin-bg-base)] border border-[var(--admin-border-base)] rounded-[var(--admin-radius-md)] text-sm outline-none focus:ring-2 focus:ring-[var(--admin-primary)] w-full sm:w-auto"
 > <option value="all">Tất cả phương thức thanh toán</option> <option value="cod">Thanh toán khi nhận hàng</option> <option value="card">Thẻ</option> <option value="bank_transfer">Chuyển khoản ngân hàng</option> </select> </div> </div> <div className="mt-2"> <DataTable
 columns={columns}
 data={orders as any[]}
 isLoading={loading}
 selectable
 selectedIds={selectedIds}
 onSelectionChange={(ids) => setSelectedIds(ids as string[])}
 onRowClick={(row: any) => router.push(`/admin/orders/${row.id}`)}
 emptyState={
 <EmptyState 
 icon={<IconShoppingBag size={24} />}
 title={adminAr.table.noData}
 description="Không tìm thấy đơn hàng phù hợp với bộ lọc."
 action={
 <Button variant="secondary" onClick={() => setFilters({ search: '', status: 'all', paymentStatus: 'all', paymentMethod: 'all' })}>Xóa bộ lọc</Button>
 }
 />
 }
 /> </div> </Card>

 {/* Create Order Modal */}
 <Modal
 isOpen={createOpen}
 onClose={() => setCreateOpen(false)}
 title="Thêm đơn hàng mới"
 size="lg"
 footer={
 <div className="flex items-center justify-between w-full gap-3"> <div className="text-sm">
 {appliedCode && couponDiscount > 0 && (
 <span className="text-[var(--admin-success)] font-medium me-2">Giảm {couponDiscount.toLocaleString('vi-VN')} đ</span>
 )}
 <span className="font-bold text-[var(--admin-text-base)]">
 Tổng cộng: {orderNet.toLocaleString('vi-VN')} đ
 </span> </div> <div className="flex gap-3"> <Button variant="ghost" onClick={() => setCreateOpen(false)}>Hủy</Button> <Button variant="primary" onClick={handleCreateOrder} disabled={creating} isLoading={creating}>Tạo đơn hàng</Button> </div> </div>
 }
 > <div className="space-y-4 py-1"> <div> <label className="block text-sm font-medium text-[var(--admin-text-subtle)] mb-1.5">Khách hàng</label> <select
 value={form.customerId}
 onChange={e => setForm({ ...form, customerId: e.target.value })}
 className="h-10 px-3 w-full bg-[var(--admin-bg-base)] border border-[var(--admin-border-base)] rounded-[var(--admin-radius-md)] text-sm outline-none focus:ring-2 focus:ring-[var(--admin-primary)]"
 > <option value="">— Khách hàng —</option>
 {custList.map(c => <option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
 </select> </div> <div className="space-y-2"> <label className="block text-sm font-medium text-[var(--admin-text-subtle)]">Sản phẩm</label>
 {form.lines.map((line, idx) => (
 <div key={idx} className="flex items-center gap-2"> <select
 value={line.productId}
 onChange={e => {
 const lines = [...form.lines]; lines[idx] = { ...lines[idx], productId: e.target.value, variantId: undefined }; setForm({ ...form, lines });
 }}
 className="h-10 px-3 flex-1 bg-[var(--admin-bg-base)] border border-[var(--admin-border-base)] rounded-[var(--admin-radius-md)] text-sm outline-none focus:ring-2 focus:ring-[var(--admin-primary)]"
 > <option value="">— sản phẩm —</option>
 {prodList.map(p => <option key={p.id} value={p.id}>{p.name} — {p.price.toLocaleString('vi-VN')} đ — tồn {p.stock}</option>)}
 </select> {prodList.find(product => product.id === line.productId)?.variants.length ? <select value={line.variantId ?? ''} onChange={e => { const lines = [...form.lines]; lines[idx] = { ...lines[idx], variantId: e.target.value || undefined }; setForm({ ...form, lines }); }} className="h-10 px-2 w-40 bg-[var(--admin-bg-base)] border border-[var(--admin-border-base)] rounded-[var(--admin-radius-md)] text-sm"><option value="">— biến thể —</option>{prodList.find(product => product.id === line.productId)!.variants.map(variant => <option key={variant.id} value={variant.id}>{variant.size} · tồn {variant.stock}</option>)}</select> : null} <input
 type="number"
 min={1}
 max={prodList.find(product => product.id === line.productId)?.variants.find(variant => variant.id === line.variantId)?.stock ?? prodList.find(product => product.id === line.productId)?.stock}
 value={line.quantity}
 onChange={e => {
 const lines = [...form.lines]; lines[idx] = { ...lines[idx], quantity: Math.max(1, parseInt(e.target.value, 10) || 1) }; setForm({ ...form, lines });
 }}
 className="h-10 px-3 w-20 bg-[var(--admin-bg-base)] border border-[var(--admin-border-base)] rounded-[var(--admin-radius-md)] text-sm text-center outline-none focus:ring-2 focus:ring-[var(--admin-primary)]"
 /> <Button
 variant="ghost"
 size="icon-sm"
 onClick={() => setForm({ ...form, lines: form.lines.filter((_, i) => i !== idx) })}
 disabled={form.lines.length === 1}
 > <IconX size={16} /> </Button> </div>
 ))}
 <Button variant="secondary" size="sm" leftIcon={<IconPlus size={14} />} onClick={() => setForm({ ...form, lines: [...form.lines, { productId: '', quantity: 1 }] })}>
 Thêm sản phẩm</Button> </div> <Input
 label="Địa chỉ giao hàng"
 placeholder="Nhập đầy đủ địa chỉ nhận hàng"
 value={form.shippingAddress}
 onChange={e => setForm({ ...form, shippingAddress: e.target.value })}
 />

 {/* Coupon */}
 <div> <label className="block text-sm font-medium text-[var(--admin-text-subtle)] mb-1.5">Giảm giá</label>
 {appliedCode ? (
 <div className="flex items-center justify-between bg-[var(--admin-success)]/10 border border-[var(--admin-success)]/30 rounded-[var(--admin-radius-md)] px-3 py-2"> <span className="text-sm font-bold text-[var(--admin-success)]">{appliedCode} — {couponDiscount.toLocaleString('vi-VN')} đ</span> <button type="button" onClick={() => { setAppliedCode(null); setCouponDiscount(0); setCouponCode(''); }} className="text-xs text-[var(--admin-text-muted)] hover:text-[var(--admin-danger)] underline">Gỡ mã</button> </div>
 ) : (
 <div className="flex gap-2"> <input
 type="text"
 value={couponCode}
 onChange={e => { setCouponCode(e.target.value); setCouponMsg(''); }}
 placeholder="Nhập mã giảm giá"
 className="h-10 px-3 flex-1 bg-[var(--admin-bg-base)] border border-[var(--admin-border-base)] rounded-[var(--admin-radius-md)] text-sm outline-none focus:ring-2 focus:ring-[var(--admin-primary)] uppercase"
 /> <Button variant="secondary" onClick={handleApplyCoupon} disabled={couponLoading || orderTotal <= 0} isLoading={couponLoading}>Áp dụng</Button> </div>
 )}
 {couponMsg && <p className="text-xs text-[var(--admin-danger)] mt-1">{couponMsg}</p>}
 </div> </div> </Modal> </div>
 );
}

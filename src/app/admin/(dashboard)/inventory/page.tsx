"use client";

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import {
 IconPackage, IconAlertTriangle, IconCircleX, IconCircleCheck,
 IconArrowsExchange, IconAdjustments, IconSearch, IconArrowUpRight,
} from '@tabler/icons-react';
import { ProductService } from '@/lib/services/product.service';
import type { ProductVariant } from '@/data/mock/products';
import { KpiCard } from '@/components/admin/design-system/KpiCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/admin/design-system/Card';
import { Badge } from '@/components/admin/design-system/Badge';
import { Button } from '@/components/admin/design-system/Button';
import { PageHeader } from '@/components/admin/design-system/Layout';
import { Modal } from '@/components/admin/design-system/Modal';
import { Input } from '@/components/admin/design-system/Input';
import { TextArea } from '@/components/admin/design-system/TextArea';
import { InventoryService } from '@/lib/services/inventory.service';
import { useEventSubscribeMany } from '@/hooks/useEventBus';
import { REFRESH_EVENTS } from '@/lib/events/refresh-events';
import { adminAr } from '@/lib/i18n/admin-ar';
import { formatCurrency } from '@/lib/utils/formatters';
import { StaggerContainer, StaggerItem } from '@/components/admin/ui/motion';

interface StockProduct {
 id: string;
 name: string;
 sku: string;
 category: string;
 stock: number;
 costPrice: number;
 lowStockLimit: number;
 variants: ProductVariant[];
 status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export default function InventoryPage() {
 const t = adminAr.inventory;
 const [products, setProducts] = useState<StockProduct[]>([]);
 const [loading, setLoading] = useState(true);
 const [search, setSearch] = useState('');
 const [filter, setFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');
 const [adjustModal, setAdjustModal] = useState<{ open: boolean; product?: StockProduct }>({ open: false });
 const [adjustType, setAdjustType] = useState<'receive' | 'deduct' | 'adjustment'>('receive');
 const [adjustQty, setAdjustQty] = useState('');
 const [adjustReason, setAdjustReason] = useState('');
 const [adjustVariantId, setAdjustVariantId] = useState('');
 const [saving, setSaving] = useState(false);

 const load = useCallback(async () => {
 setLoading(true);
 try {
 const data = await ProductService.getProducts();
 const mapped: StockProduct[] = data.map(p => ({
 id: p.id,
 name: p.name,
 sku: p.sku,
 category: p.category,
 stock: p.stock ?? 0,
 costPrice: (p as any).costPrice ?? 0,
 lowStockLimit: p.lowStockLimit ?? 5,
 variants: p.variants ?? [],
 status: (p.stock ?? 0) <= 0 ? 'out_of_stock' : (p.stock ?? 0) <= (p.lowStockLimit ?? 5) ? 'low_stock' : 'in_stock',
 }));
 setProducts(mapped);
 } catch {
 toast.error('Không thể tải dữ liệu tồn kho.');
 } finally {
 setLoading(false);
 }
 }, []);

 useEffect(() => { load(); }, [load]);

 useEventSubscribeMany(REFRESH_EVENTS.inventory, load);

 const totalValue = products.reduce((acc, p) => acc + p.stock * p.costPrice, 0);
 const inStock = products.filter(p => p.status === 'in_stock').length;
 const lowStock = products.filter(p => p.status === 'low_stock').length;
 const outOfStock = products.filter(p => p.status === 'out_of_stock').length;

 const filtered = products.filter(p => {
 const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
 const matchFilter = filter === 'all' || p.status === filter;
 return matchSearch && matchFilter;
 });

 const handleAdjust = async () => {
 if (!adjustModal.product) return;
 const qty = parseInt(adjustQty, 10);
 if (isNaN(qty) || qty === 0) { toast.error('Số lượng phải là số nguyên khác 0.'); return; }
 if (!adjustReason.trim()) { toast.error('Vui lòng nhập lý do điều chỉnh.'); return; }
 if (adjustModal.product.variants.length && !adjustVariantId) { toast.error('Vui lòng chọn biến thể cần điều chỉnh.'); return; }
 setSaving(true);
 try {
 const signed =
 adjustType === 'receive' ? Math.abs(qty)
 : adjustType === 'deduct' ? -Math.abs(qty)
 : qty;
 await InventoryService.recordMovement({
 productId: adjustModal.product.id,
 variantId: adjustVariantId || undefined,
 type: adjustType,
 quantity: signed,
 reason: adjustReason,
 referenceType: 'adjustment',
 });
 toast.success('Đã cập nhật tồn kho thành công.');
 setAdjustModal({ open: false });
 setAdjustQty('');
 setAdjustReason('');
 setAdjustVariantId('');
 load();
 } catch (error) {
 toast.error(error instanceof Error ? error.message : 'Không thể cập nhật tồn kho.');
 } finally {
 setSaving(false);
 }
 };

 const statusVariant = (s: StockProduct['status']) =>
 s === 'in_stock' ? 'success' : s === 'low_stock' ? 'warning' : 'danger';

 const statusLabel = (s: StockProduct['status']) =>
 s === 'in_stock' ? 'Còn hàng' : s === 'low_stock' ? 'Sắp hết' : 'Hết hàng';

 return (
 <StaggerContainer className="space-y-6 pb-12"> <StaggerItem> <PageHeader
 title={t.title}
 description={t.subtitle}
 actions={
 <div className="flex items-center gap-3"> <Link href="/admin/inventory/stock-movements"> <Button variant="secondary" size="md" leftIcon={<IconArrowsExchange size={18} />}>
 {t.stockMovements}
 </Button> </Link> </div>
 }
 /> </StaggerItem>

 {/* KPI Cards */}
 <StaggerItem className="grid grid-cols-2 xl:grid-cols-5 gap-4"> <KpiCard
 title={t.totalProducts}
 value={products.length}
 icon={<IconPackage stroke={2} />}
 accentColor="blue"
 /> <KpiCard
 title={t.inStock}
 value={inStock}
 icon={<IconCircleCheck stroke={2} />}
 accentColor="emerald"
 /> <KpiCard
 title={t.lowStock}
 value={lowStock}
 icon={<IconAlertTriangle stroke={2} />}
 accentColor="orange"
 /> <KpiCard
 title={t.outOfStock}
 value={outOfStock}
 icon={<IconCircleX stroke={2} />}
 accentColor="pink"
 /> <KpiCard
 title={t.inventoryValue}
 value={formatCurrency(totalValue)}
 icon={<IconPackage stroke={2} />}
 accentColor="purple"
 className="col-span-2 xl:col-span-1"
 /> </StaggerItem>

 {/* Product Stock Table */}
 <StaggerItem> <Card> <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[var(--admin-border-light)] bg-[var(--admin-bg-surface)] pb-4"> <CardTitle>{t.currentStock}</CardTitle> <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
 {/* Search */}
 <div className="relative"> <IconSearch size={16} className="absolute end-3 top-1/2 -translate-y-1/2 text-[var(--admin-text-muted)]" /> <input
 type="text"
 placeholder="Tìm kiếm Tênsản phẩm SKU."
 value={search}
 onChange={e => setSearch(e.target.value)}
 className="h-9 pe-9 ps-3 w-full sm:w-[220px] rounded-[var(--admin-radius-md)] border border-[var(--admin-border-base)] bg-[var(--admin-bg-elevated)] text-sm text-[var(--admin-text-base)] placeholder:text-[var(--admin-text-muted)] focus:outline-none focus:border-[var(--admin-primary)] transition-colors"
 /> </div>
 {/* Filter tabs */}
 <div className="flex gap-1 bg-[var(--admin-bg-elevated)] border border-[var(--admin-border-base)] rounded-[var(--admin-radius-md)] p-1">
 {([['all',''],['in_stock',''],['low_stock',''],['out_of_stock','']] as const).map(([val, label]) => (
 <button
 key={val}
 onClick={() => setFilter(val)}
 className={`px-3 py-1 text-xs font-semibold rounded-[var(--admin-radius-sm)] transition-colors ${
 filter === val
 ? 'bg-[var(--admin-primary)] text-white shadow-sm'
 : 'text-[var(--admin-text-muted)] hover:text-[var(--admin-text-base)]'
 }`}
 >
 {label}
 </button>
 ))}
 </div> </div> </CardHeader> <CardContent className="p-0">
 {loading ? (
 <div className="p-8 flex justify-center"> <div className="w-8 h-8 rounded-full border-4 border-[var(--admin-primary)] border-t-transparent animate-spin" /> </div>
 ) : filtered.length === 0 ? (
 <div className="p-12 text-center"> <IconPackage size={40} className="mx-auto mb-3 text-[var(--admin-text-muted)]" /> <p className="text-sm font-medium text-[var(--admin-text-muted)]">Không có </p> </div>
 ) : (
 <div className="overflow-x-auto"> <table className="w-full text-sm"> <thead> <tr className="border-b border-[var(--admin-border-light)] bg-[var(--admin-bg-surface)]"> <th className="text-left px-4 py-3 text-[var(--admin-text-subtle)] font-semibold text-xs uppercase tracking-wider">{t.productName}</th> <th className="text-left px-4 py-3 text-[var(--admin-text-subtle)] font-semibold text-xs uppercase tracking-wider">{t.sku}</th> <th className="text-left px-4 py-3 text-[var(--admin-text-subtle)] font-semibold text-xs uppercase tracking-wider hidden md:table-cell">{t.category}</th> <th className="text-center px-4 py-3 text-[var(--admin-text-subtle)] font-semibold text-xs uppercase tracking-wider">{t.stockLevel}</th> <th className="text-center px-4 py-3 text-[var(--admin-text-subtle)] font-semibold text-xs uppercase tracking-wider">{t.status}</th> <th className="text-end px-4 py-3 text-[var(--admin-text-subtle)] font-semibold text-xs uppercase tracking-wider">Thao tác</th> </tr> </thead> <tbody className="divide-y divide-[var(--admin-border-light)]">
 {filtered.map(p => (
 <tr key={p.id} className="hover:bg-[var(--admin-bg-hover)] transition-colors group"> <td className="px-4 py-3"> <div className="flex items-center gap-3"> <div className="w-9 h-9 rounded-[var(--admin-radius-md)] bg-[var(--admin-bg-elevated)] border border-[var(--admin-border-base)] flex items-center justify-center shrink-0"> <IconPackage size={16} className="text-[var(--admin-text-muted)]" /> </div> <span className="font-semibold text-[var(--admin-text-base)] group-hover:text-[var(--admin-primary)] transition-colors">{p.name}</span> </div> </td> <td className="px-4 py-3 text-[var(--admin-text-muted)] font-mono text-xs">{p.sku}</td> <td className="px-4 py-3 text-[var(--admin-text-muted)] hidden md:table-cell">{p.category}</td> <td className="px-4 py-3 text-center"> <div className={`inline-flex items-center gap-1.5 font-bold tabular-nums text-base ${
 p.status === 'out_of_stock' ? 'text-[var(--admin-danger)]' :
 p.status === 'low_stock' ? 'text-[var(--admin-warning)]' :
 'text-[var(--admin-success)]'
 }`}>
 {p.stock}
 </div> </td> <td className="px-4 py-3 text-center"> <Badge variant={statusVariant(p.status)} size="sm">
 {statusLabel(p.status)}
 </Badge> </td> <td className="px-4 py-3 text-end"> <Button
 variant="ghost"
 size="sm"
 leftIcon={<IconAdjustments size={14} />}
 onClick={() => { setAdjustModal({ open: true, product: p }); setAdjustType('receive'); setAdjustQty(''); setAdjustReason(''); setAdjustVariantId(''); }}
 >
 tồn kho</Button> </td> </tr>
 ))}
 </tbody> </table> </div>
 )}
 </CardContent> </Card> </StaggerItem>

 {/* Stock Movements shortcut */}
 <StaggerItem> <Link href="/admin/inventory/stock-movements" className="block group"> <div className="flex items-center justify-between p-5 rounded-[var(--admin-radius-2xl)] border border-[var(--admin-border-base)] bg-[var(--admin-bg-surface)] hover:border-[var(--admin-primary)] hover:bg-[var(--admin-primary-muted)] transition-all shadow-[var(--admin-shadow-sm)] hover:shadow-[var(--admin-shadow-md)]"> <div className="flex items-center gap-4"> <div className="w-11 h-11 rounded-[var(--admin-radius-xl)] bg-[var(--admin-bg-elevated)] border border-[var(--admin-border-base)] flex items-center justify-center"> <IconArrowsExchange size={22} className="text-[var(--admin-primary)]" /> </div> <div> <p className="font-bold text-[var(--admin-text-base)] group-hover:text-[var(--admin-primary)] transition-colors">{t.stockMovements}</p> <p className="text-sm text-[var(--admin-text-muted)] mt-0.5">hiển thịNhật ký nhập, xuất và điều chỉnh</p> </div> </div> <IconArrowUpRight size={20} className="text-[var(--admin-text-muted)] group-hover:text-[var(--admin-primary)] transition-colors" /> </div> </Link> </StaggerItem>

 {/* Adjust Modal */}
 <Modal
 isOpen={adjustModal.open}
 onClose={() => setAdjustModal({ open: false })}
 title={`tồn kho —${adjustModal.product?.name ?? ''}`}
 size="sm"
 footer={
 <div className="flex justify-end gap-3"> <Button variant="ghost" onClick={() => setAdjustModal({ open: false })}>Hủy</Button> <Button variant="primary" onClick={handleAdjust} disabled={saving} isLoading={saving}>Lưu </Button> </div>
 }
 > <div className="space-y-4 py-1"> <div> <p className="text-sm text-[var(--admin-text-muted)] mb-1">Tồn kho hiện tại</p> <p className="text-2xl font-bold text-[var(--admin-text-base)] tabular-nums">{adjustModal.product?.stock ?? 0}</p> </div>{adjustModal.product?.variants.length ? <label className="flex flex-col gap-1.5 text-sm font-medium text-[var(--admin-text-subtle)]">Biến thể<select value={adjustVariantId} onChange={(event) => setAdjustVariantId(event.target.value)} className="h-11 border border-[var(--admin-border-base)] bg-[var(--admin-bg-surface)] px-3 text-sm"><option value="">Chọn biến thể</option>{adjustModal.product.variants.map((variant) => <option key={variant.id} value={variant.id}>{variant.color} / {variant.size} · {variant.sku} · tồn {variant.stock}</option>)}</select></label> : null}<div> <p className="text-sm font-medium text-[var(--admin-text-subtle)] mb-1.5">Loại giao dịch</p> <div className="flex gap-1 bg-[var(--admin-bg-elevated)] border border-[var(--admin-border-base)] rounded-[var(--admin-radius-md)] p-1">
 {([['receive','Nhập kho'],['deduct','Xuất kho'],['adjustment','Điều chỉnh']] as const).map(([val, label]) => (
 <button
 key={val}
 type="button"
 onClick={() => setAdjustType(val)}
 className={`flex-1 px-3 py-1.5 text-xs font-semibold rounded-[var(--admin-radius-sm)] transition-colors ${
 adjustType === val
 ? 'bg-[var(--admin-primary)] text-white shadow-sm'
 : 'text-[var(--admin-text-muted)] hover:text-[var(--admin-text-base)]'
 }`}
 >
 {label}
 </button>
 ))}
 </div> </div> <Input
 label={adjustType === 'adjustment' ? t.adjustmentQty : 'Số lượng'}
 type="number"
 placeholder={adjustType === 'adjustment' ? ': +10 -5' : ': 10'}
 value={adjustQty}
 onChange={e => setAdjustQty(e.target.value)}
 /> <TextArea
 label={t.adjustmentReason}
 placeholder="."
 value={adjustReason}
 onChange={e => setAdjustReason(e.target.value)}
 rows={3}
 /> </div> </Modal> </StaggerContainer>
 );
}

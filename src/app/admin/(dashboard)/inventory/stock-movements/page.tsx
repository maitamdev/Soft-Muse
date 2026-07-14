"use client";

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import {
 IconArrowUpRight, IconArrowDownRight, IconArrowsExchange,
 IconAdjustments, IconChevronRight, IconPencil, IconTrash,
} from '@tabler/icons-react';
import { InventoryService, InventoryMovement } from '@/lib/services/inventory.service';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/admin/design-system/Card';
import { Badge } from '@/components/admin/design-system/Badge';
import { Button } from '@/components/admin/design-system/Button';
import { Modal } from '@/components/admin/design-system/Modal';
import { Input } from '@/components/admin/design-system/Input';
import { TextArea } from '@/components/admin/design-system/TextArea';
import { PageHeader } from '@/components/admin/design-system/Layout';
import { DataTable, Column } from '@/components/admin/design-system/DataTable';
import { StaggerContainer, StaggerItem } from '@/components/admin/ui/motion';
import { adminAr } from '@/lib/i18n/admin-ar';

const TYPE_CONFIG: Record<InventoryMovement['type'], { label: string; variant: 'success' | 'danger' | 'primary' | 'warning' }> = {
 receive: { label: '', variant: 'success' },
 deduct: { label: '', variant: 'danger' },
 return: { label: '', variant: 'primary' },
 adjustment: { label: '', variant: 'warning' },
 transfer_in: { label: '', variant: 'success' },
 transfer_out: { label: '', variant: 'danger' },
};

export default function StockMovementsPage() {
 const t = adminAr.inventory;
 const [movements, setMovements] = useState<InventoryMovement[]>([]);
 const [loading, setLoading] = useState(true);
 const [search, setSearch] = useState('');
 const [adjustModal, setAdjustModal] = useState(false);
 const [adjustProductId, setAdjustProductId] = useState('');
 const [adjustQty, setAdjustQty] = useState('');
 const [adjustReason, setAdjustReason] = useState('');
 const [saving, setSaving] = useState(false);
 const [editTarget, setEditTarget] = useState<InventoryMovement | null>(null);
 const [editQty, setEditQty] = useState('');
 const [editReason, setEditReason] = useState('');
 const [deleteTarget, setDeleteTarget] = useState<InventoryMovement | null>(null);

 const load = useCallback(async () => {
 setLoading(true);
 try {
 setMovements(await InventoryService.getMovements());
 } catch {
 toast.error('trong tảiBiến động tồn kho');
 } finally {
 setLoading(false);
 }
 }, []);

 useEffect(() => { load(); }, [load]);

 const handleAdjust = async () => {
 const qty = parseInt(adjustQty, 10);
 if (!adjustProductId.trim()) { toast.error('sản phẩm'); return; }
 if (isNaN(qty)) { toast.error(''); return; }
 if (!adjustReason.trim()) { toast.error('Lý do điều chỉnh'); return; }
 setSaving(true);
 try {
 await InventoryService.adjustStock(adjustProductId, undefined, qty, adjustReason);
 toast.success('đãĐiều chỉnh tồn kho');
 setAdjustModal(false);
 setAdjustProductId(''); setAdjustQty(''); setAdjustReason('');
 load();
 } catch {
 toast.error('trongĐiều chỉnh tồn kho');
 } finally {
 setSaving(false);
 }
 };

 const handleEdit = async () => {
 if (!editTarget) return;
 const qty = parseInt(editQty, 10);
 if (isNaN(qty) || qty === 0) { toast.error(''); return; }
 if (!editReason.trim()) { toast.error(''); return; }
 setSaving(true);
 try {
 await InventoryService.updateMovement(editTarget.id, { quantity: qty, reason: editReason });
 toast.success('đãSửa ');
 setEditTarget(null);
 load();
 } catch {
 toast.error('trongSửa ');
 } finally {
 setSaving(false);
 }
 };

 const handleDelete = async () => {
 if (!deleteTarget) return;
 setSaving(true);
 try {
 await InventoryService.deleteMovement(deleteTarget.id);
 toast.success('đãXóa trênTồn kho');
 setDeleteTarget(null);
 load();
 } catch (e) {
 toast.error(e instanceof Error ? e.message : 'trongXóa ');
 } finally {
 setSaving(false);
 }
 };

 const columns: Column<InventoryMovement>[] = [
 {
 header: 'sản phẩm /',
 accessor: 'productId',
 type: 'custom',
 render: (_, row) => (
 <div className="flex flex-col"> <span className="font-semibold text-[var(--admin-text-base)]">{row.productId}</span>
 {row.variantId && <span className="text-xs text-[var(--admin-text-subtle)] font-mono">{row.variantId}</span>}
 </div>
 ),
 },
 {
 header: '',
 accessor: 'type',
 type: 'custom',
 render: (_, row) => (
 <Badge variant={TYPE_CONFIG[row.type].variant} size="sm">
 {TYPE_CONFIG[row.type].label}
 </Badge>
 ),
 },
 {
 header: 'Số lượng',
 accessor: 'quantity',
 type: 'custom',
 render: (_, row) => (
 <div className={`flex items-center gap-1 font-bold tabular-nums ${row.quantity > 0 ? 'text-[var(--admin-success)]' : 'text-[var(--admin-danger)]'}`}>
 {row.quantity > 0 ? <IconArrowUpRight size={14} /> : <IconArrowDownRight size={14} />}
 {Math.abs(row.quantity)}
 </div>
 ),
 },
 { header: 'Lý do', accessor: 'reason' },
 {
 header: 'Ngày',
 accessor: 'date',
 type: 'custom',
 render: (_, row) => (
 <span className="text-[var(--admin-text-muted)] text-xs">
 {new Date(row.date).toLocaleString('vi-VN')}
 </span>
 ),
 },
 {
 header: '',
 accessor: 'userId',
 type: 'custom',
 render: (_, row) => (
 <span className="text-xs text-[var(--admin-text-subtle)] font-mono">{row.userId}</span>
 ),
 },
 {
 header: 'Thao tác',
 accessor: 'id',
 type: 'custom',
 render: (_, row) => (
 row.type === 'adjustment' ? (
 <div className="flex items-center gap-1"> <Button
 variant="ghost"
 size="sm"
 leftIcon={<IconPencil size={14} />}
 onClick={() => { setEditTarget(row); setEditQty(String(row.quantity)); setEditReason(row.reason); }}
 >
 Sửa
 </Button> <Button
 variant="ghost"
 size="sm"
 leftIcon={<IconTrash size={14} />}
 onClick={() => setDeleteTarget(row)}
 >
 Xóa
 </Button> </div>
 ) : (
 <span className="text-xs text-[var(--admin-text-subtle)]"></span>
 )
 ),
 },
 ];

 const filtered = movements.filter(m =>
 !search ||
 m.productId.toLowerCase().includes(search.toLowerCase()) ||
 m.reason.toLowerCase().includes(search.toLowerCase())
 );

 return (
 <StaggerContainer className="space-y-6 pb-12"> <StaggerItem> <div className="flex items-center gap-2 text-sm text-[var(--admin-text-muted)] mb-2"> <Link href="/admin/inventory" className="hover:text-[var(--admin-primary)] transition-colors">Tồn kho</Link> <IconChevronRight size={14} /> <span className="text-[var(--admin-text-base)] font-medium">{t.stockMovements}</span> </div> <PageHeader
 title={t.stockMovements}
 description={t.stockMovementsSubtitle}
 actions={
 <Button
 variant="primary"
 size="md"
 leftIcon={<IconAdjustments size={18} />}
 onClick={() => { setAdjustModal(true); setAdjustProductId(''); setAdjustQty(''); setAdjustReason(''); }}
 > </Button>
 }
 /> </StaggerItem> <StaggerItem> <Card> <CardHeader className="flex flex-row items-center justify-between border-b border-[var(--admin-border-light)] bg-[var(--admin-bg-surface)] pb-4"> <div className="flex items-center gap-3"> <IconArrowsExchange size={20} className="text-[var(--admin-primary)]" /> <CardTitle>Biến động tồn kho</CardTitle> </div> <span className="text-sm font-medium text-[var(--admin-text-muted)] bg-[var(--admin-bg-elevated)] border border-[var(--admin-border-base)] px-3 py-1 rounded-full">
 {filtered.length} </span> </CardHeader> <CardContent className="p-0"> <DataTable
 columns={columns}
 data={filtered}
 isLoading={loading}
 searchQuery={search}
 onSearchChange={setSearch}
 pageSize={20}
 className="border-0 shadow-none rounded-none [&_th]:bg-[var(--admin-bg-surface)]"
 /> </CardContent> </Card> </StaggerItem>

 {/* Manual Adjustment Modal */}
 <Modal
 isOpen={adjustModal}
 onClose={() => setAdjustModal(false)}
 title="tồn kho"
 size="sm"
 footer={
 <div className="flex justify-end gap-3"> <Button variant="ghost" onClick={() => setAdjustModal(false)}>Hủy</Button> <Button variant="primary" onClick={handleAdjust} disabled={saving} isLoading={saving}>Thao tác</Button> </div>
 }
 > <div className="space-y-4 py-1"> <Input
 label="sản phẩm (Product ID)"
 placeholder=":prod_1"
 value={adjustProductId}
 onChange={e => setAdjustProductId(e.target.value)}
 /> <Input
 label={adminAr.inventory.adjustmentQty}
 type="number"
 placeholder="Thêm, "
 value={adjustQty}
 onChange={e => setAdjustQty(e.target.value)}
 /> <TextArea
 label={adminAr.inventory.adjustmentReason}
 placeholder="Lý do điều chỉnh."
 value={adjustReason}
 onChange={e => setAdjustReason(e.target.value)}
 rows={3}
 /> </div> </Modal>

 {/* Edit Adjustment Modal */}
 <Modal
 isOpen={!!editTarget}
 onClose={() => setEditTarget(null)}
 title="Sửa Điều chỉnh tồn kho"
 size="sm"
 footer={
 <div className="flex justify-end gap-3"> <Button variant="ghost" onClick={() => setEditTarget(null)}>Hủy</Button> <Button variant="primary" onClick={handleEdit} disabled={saving} isLoading={saving}>Lưu Sửa</Button> </div>
 }
 > <div className="space-y-4 py-1"> <div> <p className="text-sm text-[var(--admin-text-muted)] mb-1">sản phẩm</p> <p className="font-semibold text-[var(--admin-text-base)]">{editTarget?.productName ?? editTarget?.productId}</p> </div> <Input
 label={adminAr.inventory.adjustmentQty}
 type="number"
 placeholder="Thêm, "
 value={editQty}
 onChange={e => setEditQty(e.target.value)}
 /> <TextArea
 label={adminAr.inventory.adjustmentReason}
 placeholder="Lý do điều chỉnh."
 value={editReason}
 onChange={e => setEditReason(e.target.value)}
 rows={3}
 /> </div> </Modal>

 {/* Delete Adjustment Confirmation */}
 <Modal
 isOpen={!!deleteTarget}
 onClose={() => setDeleteTarget(null)}
 title="Xóa Điều chỉnh tồn kho"
 size="sm"
 footer={
 <div className="flex justify-end gap-3"> <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Hủy</Button> <Button variant="danger" onClick={handleDelete} disabled={saving} isLoading={saving}>Xóa</Button> </div>
 }
 > <p className="text-sm text-[var(--admin-text-muted)] py-2">
 Xóa này trênTồn kho. Không thể hoàn tác thao tác này.
 </p> </Modal> </StaggerContainer>
 );
}

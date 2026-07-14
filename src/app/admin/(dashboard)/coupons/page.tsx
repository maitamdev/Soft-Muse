"use client";

import React, { useState, useEffect } from 'react';
import { CouponService } from '@/lib/services/coupon.service';
import { Coupon } from '@/data/mock/coupons';
import { useEventSubscribeMany } from '@/hooks/useEventBus';
import { REFRESH_EVENTS } from '@/lib/events/refresh-events';
import { usePermissions } from '@/lib/auth/PermissionContext';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

// SaaS UI Components
import { PageHeader, EmptyState } from '@/components/admin/design-system/Layout';
import { Card } from '@/components/admin/design-system/Card';
import { Button } from '@/components/admin/design-system/Button';
import { Badge } from '@/components/admin/design-system/Badge';
import { Input } from '@/components/admin/design-system/Input';
import { TextArea } from '@/components/admin/design-system/TextArea';
import { Modal } from '@/components/admin/design-system/Modal';
import { DataTable, Column } from '@/components/admin/design-system/DataTable';

// Tabler Icons
import { 
 IconSearch, 
 IconPlus, 
 IconTrash, 
 IconCheck, 
 IconPower, 
 IconPercentage, 
 IconCurrencyDollar, 
 IconTruck, 
 IconCopy, 
 IconEdit,
 IconTicket
} from '@tabler/icons-react';

export default function CouponsPage() {
 const { can } = usePermissions();
 const canWrite = can('marketing', 'write');
 const canDelete = can('marketing', 'delete');
 const [coupons, setCoupons] = useState<Coupon[]>([]);
 const [loading, setLoading] = useState(true);
 const [search, setSearch] = useState('');
 const [selectedIds, setSelectedIds] = useState<string[]>([]);

 // --- Editor modal state ---
 const emptyForm = {
 code: '', description: '', type: 'percentage' as Coupon['type'], discountValue: 0,
 status: 'active' as Coupon['status'], usageLimit: '' as number | '' | string, perCustomerLimit: 1,
 startDate: new Date().toISOString().split('T')[0], expirationDate: '', minOrderValue: 0, maxDiscountValue: '' as number | '' | string,
 };
 const [editorOpen, setEditorOpen] = useState(false);
 const [editingId, setEditingId] = useState<string | null>(null);
 const [form, setForm] = useState(emptyForm);
 const [saving, setSaving] = useState(false);

 const openCreate = () => { setEditingId(null); setForm(emptyForm); setEditorOpen(true); };
 const openEdit = (c: Coupon) => {
 setEditingId(c.id);
 setForm({
 code: c.code, description: c.description, type: c.type, discountValue: c.discountValue,
 status: c.status, usageLimit: c.usageLimit ?? '', perCustomerLimit: c.perCustomerLimit,
 startDate: c.startDate?.split('T')[0] || '', expirationDate: c.expirationDate?.split('T')[0] || '',
 minOrderValue: c.minOrderValue, maxDiscountValue: c.maxDiscountValue ?? '',
 });
 setEditorOpen(true);
 };

 const handleSave = async () => {
 if (!form.code.trim()) { toast.error('Vui lòng nhập mã giảm giá.'); return; }
 if (Number(form.discountValue) <= 0) { toast.error('Giá trị giảm phải lớn hơn 0.'); return; }
 if (form.type === 'percentage' && Number(form.discountValue) > 100) { toast.error('Mức giảm phần trăm không được vượt quá 100%.'); return; }
 if (form.expirationDate && form.startDate && new Date(form.expirationDate) <= new Date(form.startDate)) { toast.error('Ngày hết hạn phải sau ngày bắt đầu.'); return; }
 setSaving(true);
 try {
 const payload: Partial<Coupon> = {
 code: form.code.trim().toUpperCase(),
 description: form.description,
 type: form.type,
 discountValue: Number(form.discountValue) || 0,
 status: form.status,
 usageLimit: form.usageLimit === '' ? null : Number(form.usageLimit),
 perCustomerLimit: Number(form.perCustomerLimit) || 1,
 startDate: form.startDate ? new Date(form.startDate).toISOString() : new Date().toISOString(),
 expirationDate: form.expirationDate ? new Date(form.expirationDate).toISOString() : null,
 minOrderValue: Number(form.minOrderValue) || 0,
 maxDiscountValue: form.maxDiscountValue === '' ? undefined : Number(form.maxDiscountValue),
 };
 if (editingId) {
 await CouponService.updateCoupon(editingId, payload);
 toast.success('Đã cập nhật mã giảm giá.');
 } else {
 await CouponService.createCoupon(payload);
 toast.success('Đã tạo mã giảm giá.');
 }
 setEditorOpen(false);
 loadCoupons();
 } catch (error) {
 toast.error(error instanceof Error ? error.message : 'Không thể lưu mã giảm giá.');
 } finally {
 setSaving(false);
 }
 };

 const loadCoupons = async () => {
 setLoading(true);
 try {
 const data = await CouponService.getCoupons();
 setCoupons(data);
 } catch {
 toast.error('Đã xảy ra lỗi trong tải');
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 loadCoupons();
 }, []);

 useEventSubscribeMany(REFRESH_EVENTS.coupons, loadCoupons);

 const handleDelete = async (id: string) => {
 if (confirm('Xóa vĩnh viễn mã giảm giá này? Các đơn cũ vẫn giữ mã đã áp dụng.')) {
 await CouponService.deleteCoupon(id);
 toast.success('Đã xóa mã giảm giá.');
 loadCoupons();
 }
 };

 const handleDuplicate = async (id: string) => {
 await CouponService.duplicateCoupon(id);
 toast.success('Đã nhân bản mã giảm giá ở trạng thái tắt.');
 loadCoupons();
 };

 const handleToggleStatus = async (coupon: Coupon) => {
 const newStatus = coupon.status === 'active' ? 'disabled' : 'active';
 await CouponService.updateCoupon(coupon.id, { status: newStatus });
 toast.success(newStatus === 'active' ? 'Đã bật mã giảm giá.' : 'Đã tắt mã giảm giá.');
 loadCoupons();
 };

 const handleBulkAction = async (action: 'active' | 'disabled' | 'delete') => {
 if (selectedIds.length === 0) return;
 
 if (action === 'delete') {
 if (!confirm('Xóa ؟')) return;
 await Promise.all(selectedIds.map(id => CouponService.deleteCoupon(id)));
 } else {
 await Promise.all(selectedIds.map(id => CouponService.updateCoupon(id, { status: action })));
 }
 
 toast.success('đã');
 setSelectedIds([]);
 loadCoupons();
 };

 const filtered = coupons.filter(c => c.code.toLowerCase().includes(search.toLowerCase()));

 const columns: Column<Coupon>[] = [
 { 
 header: '', 
 accessor: 'code', 
 render: (_, c) => (
 <div> <div className="font-bold text-[var(--admin-text-base)] font-sans uppercase">{c.code}</div> <div className="text-xs text-[var(--admin-text-muted)] mt-1">{c.description}</div> </div>
 )
 },
 { 
 header: '', 
 accessor: 'type', 
 render: (_, c) => (
 <div className="flex items-center gap-2"> <div className={`p-1.5 rounded-md ${c.type === 'percentage' ? 'bg-[var(--admin-info)]/10 text-[var(--admin-info)]' : c.type === 'fixed' ? 'bg-[var(--admin-success)]/10 text-[var(--admin-success)]' : 'bg-[var(--admin-primary-muted)] text-[var(--admin-primary)]'}`}>
 {c.type === 'percentage' ? <IconPercentage size={16}/> : c.type === 'fixed' ? <IconCurrencyDollar size={16}/> : <IconTruck size={16}/>}
 </div> <span className="font-semibold text-sm text-[var(--admin-text-base)]">
 {c.type === 'percentage' ? `${c.discountValue}%` : c.type === 'fixed' ? `${c.discountValue} ` : 'Vận chuyển '}
 </span> </div>
 )
 },
 { 
 header: '', 
 accessor: 'usageCount', 
 render: (_, c) => (
 <div className="text-sm tabular-nums"> <span className="font-bold text-[var(--admin-text-base)]">{c.usageCount}</span> <span className="text-[var(--admin-text-subtle)] mx-1">/</span> <span className="text-[var(--admin-text-muted)] font-medium">{c.usageLimit || '∞'}</span> </div>
 )
 },
 { 
 header: 'Trạng thái', 
 accessor: 'status', 
 render: (_, c) => (
 <button onClick={(e) => { e.stopPropagation(); handleToggleStatus(c); }}> <Badge variant={c.status === 'active' ? 'success' : 'neutral'}>
 {c.status === 'active' ? 'Đang hoạt động' : 'Đã tắt'}
 </Badge> </button>
 )
 },
 { 
 header: 'Thao tác', 
 accessor: 'id',
 render: (_, c) => (
 <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}> <Button size="sm" variant="ghost" onClick={() => handleDuplicate(c.id)} title="AURA" className="text-[var(--admin-info)]"> <IconCopy size={16} /> </Button> <Button size="sm" variant="ghost" onClick={() => openEdit(c)} title="Sửa" className="text-[var(--admin-text-base)]"> <IconEdit size={16} /> </Button>
 {canDelete && (
 <Button size="sm" variant="ghost" onClick={() => handleDelete(c.id)} title="Xóa" className="text-[var(--admin-danger)]"> <IconTrash size={16} /> </Button>
 )}
 </div>
 )
 }
 ];

 return (
 <div className="space-y-6 max-w-6xl mx-auto pb-20"> <PageHeader 
 title="Mã giảm giá"
 description="Quản lý điều kiện, thời hạn và giới hạn sử dụng mã khuyến mãi."
 actions={
 canWrite ? (
 <Button leftIcon={<IconPlus size={18} />} onClick={openCreate}>
 Thêm mã giảm giá
 </Button>
 ) : undefined
 }
 /> <AnimatePresence>
 {selectedIds.length > 0 && (
 <motion.div 
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -10 }}
 className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--admin-bg-elevated)] border border-[var(--admin-border-base)] text-[var(--admin-text-base)] p-3 rounded-[var(--admin-radius-xl)] shadow-[var(--admin-shadow-lg)] sticky top-20 z-20"
 > <div className="flex items-center gap-4"> <Badge variant="primary">{selectedIds.length} </Badge> <div className="hidden sm:block h-4 w-px bg-[var(--admin-border-strong)]" /> <Button size="sm" variant="ghost" onClick={() => handleBulkAction('active')} leftIcon={<IconCheck size={16} />} className="text-[var(--admin-success)] hover:bg-[var(--admin-success)]/10"> </Button> <Button size="sm" variant="ghost" onClick={() => handleBulkAction('disabled')} leftIcon={<IconPower size={16} />} className="text-[var(--admin-warning)] hover:bg-[var(--admin-warning)]/10"> </Button> </div> <div className="flex items-center gap-2">
 {canDelete && (
 <Button size="sm" variant="danger" leftIcon={<IconTrash size={16} />} onClick={() => handleBulkAction('delete')}>
 Xóa mục đã chọn
 </Button>
 )}
 <Button size="sm" variant="ghost" onClick={() => setSelectedIds([])}>
 Hủy
 </Button> </div> </motion.div>
 )}
 </AnimatePresence> <Card className="p-4 flex flex-col gap-4"> <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4"> <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto flex-1"> <Input 
 icon={<IconSearch size={18} />}
 placeholder="Tìm kiếm."
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 className="w-full sm:w-80"
 /> </div> </div> <div className="mt-2"> <DataTable 
 columns={columns}
 data={filtered as any[]}
 isLoading={loading}
 selectable
 selectedIds={selectedIds}
 onSelectionChange={(ids) => setSelectedIds(ids as string[])}
 emptyState={
 <EmptyState 
 icon={<IconTicket size={24} />}
 title="không"
 description="Không tìm thấy Tìm kiếm."
 action={
 <Button variant="secondary" onClick={() => setSearch('')}>
 Tìm kiếm
 </Button>
 }
 />
 }
 /> </div> </Card>

 {/* Create / Edit Coupon Modal */}
 <Modal
 isOpen={editorOpen}
 onClose={() => setEditorOpen(false)}
 title={editingId ? 'Sửa ' : 'Mới'}
 size="md"
 footer={
 <div className="flex justify-end gap-3"> <Button variant="ghost" onClick={() => setEditorOpen(false)}>Hủy</Button> <Button variant="primary" onClick={handleSave} disabled={saving} isLoading={saving}>
 {editingId ? 'Lưu Sửa' : ''}
 </Button> </div>
 }
 > <div className="space-y-4 py-1"> <div className="grid grid-cols-2 gap-3"> <Input label="Thông tin" placeholder="PROMO2027" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} /> <div> <label className="block text-sm font-medium text-[var(--admin-text-subtle)] mb-1.5">Trạng thái</label> <select
 value={form.status}
 onChange={e => setForm({ ...form, status: e.target.value as Coupon['status'] })}
 className="h-10 px-3 w-full bg-[var(--admin-bg-base)] border border-[var(--admin-border-base)] rounded-[var(--admin-radius-md)] text-sm outline-none focus:ring-2 focus:ring-[var(--admin-primary)]"
 > <option value="active"></option> <option value="disabled"></option> <option value="archived">Đã lưu trữ</option> </select> </div> </div> <TextArea label="Mô tả" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} /> <div className="grid grid-cols-2 gap-3"> <div> <label className="block text-sm font-medium text-[var(--admin-text-subtle)] mb-1.5"></label> <select
 value={form.type}
 onChange={e => setForm({ ...form, type: e.target.value as Coupon['type'] })}
 className="h-10 px-3 w-full bg-[var(--admin-bg-base)] border border-[var(--admin-border-base)] rounded-[var(--admin-radius-md)] text-sm outline-none focus:ring-2 focus:ring-[var(--admin-primary)]"
 > <option value="percentage">%</option> <option value="fixed"></option> <option value="shipping">Vận chuyển </option> </select> </div> <Input label="Giảm giá" type="number" value={form.discountValue} onChange={e => setForm({ ...form, discountValue: Number(e.target.value) })} /> </div> <div className="grid grid-cols-2 gap-3"> <Input label="ngày" type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} /> <Input label="ngày" type="date" value={form.expirationDate} onChange={e => setForm({ ...form, expirationDate: e.target.value })} /> </div> <div className="grid grid-cols-2 gap-3"> <Input label="(= không )" type="number" value={form.usageLimit} onChange={e => setForm({ ...form, usageLimit: e.target.value })} /> <Input label="Khách hàng " type="number" value={form.perCustomerLimit} onChange={e => setForm({ ...form, perCustomerLimit: Number(e.target.value) })} /> </div> <div className="grid grid-cols-2 gap-3"> <Input label="Thông tin" type="number" value={form.minOrderValue} onChange={e => setForm({ ...form, minOrderValue: Number(e.target.value) })} /> <Input label="()" type="number" value={form.maxDiscountValue} onChange={e => setForm({ ...form, maxDiscountValue: e.target.value })} /> </div> </div> </Modal> </div>
 );
}

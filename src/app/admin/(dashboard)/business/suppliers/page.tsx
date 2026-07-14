'use client';

import React, { useEffect, useState } from 'react';
import { create } from 'zustand';
import { businessService } from '@/lib/services/business.service';
import { Supplier } from '@/data/mock/business';
import { formatCurrency } from '@/lib/utils/formatters';
import { DataTable } from '@/components/admin/design-system/DataTable';
import { adminAr } from '@/lib/i18n/admin-ar';
import { useEventSubscribeMany } from '@/hooks/useEventBus';
import { REFRESH_EVENTS } from '@/lib/events/refresh-events';
import { toast } from 'sonner';
import { EntityDeleteDialog, EntityArchiveDialog } from '@/components/admin/crud/EntityDialogs';
import { Button } from '@/components/admin/design-system/Button';
import { useRouter } from 'next/navigation';

interface SuppliersState {
 data: Supplier[];
 isLoading: boolean;
 fetchData: () => Promise<void>;
}

const useSuppliersStore = create<SuppliersState>((set) => ({
 data: [],
 isLoading: true,
 fetchData: async () => {
 try {
 const data = await businessService.getSuppliers();
 set({ data, isLoading: false });
 } catch (e) {
 console.error(e);
 set({ isLoading: false });
 }
 }
}));

export default function SuppliersPage() {
 const { data, isLoading, fetchData } = useSuppliersStore();
 const t = adminAr.business.suppliers;
 const router = useRouter();

 const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean, id: string | null }>({ isOpen: false, id: null });
 const [archiveDialog, setArchiveDialog] = useState<{ isOpen: boolean, id: string | null }>({ isOpen: false, id: null });
 const [isProcessing, setIsProcessing] = useState(false);
 const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

 useEffect(() => {
 fetchData();
 }, [fetchData]);

 useEventSubscribeMany(REFRESH_EVENTS.suppliers, fetchData);

 const handleDuplicate = async (item: Supplier) => {
 const { id, totalPurchases, outstandingBalance, ...rest } = item;
 await businessService.createSupplier({ ...rest, name: `${rest.name} (Bản sao)`, supplierCode: `${rest.supplierCode}-COPY` });
 toast.success('Đã nhân bản thành công');
 fetchData();
 };

 const confirmDelete = async () => {
 if (!deleteDialog.id) return;
 setIsProcessing(true);
 try {
 await businessService.deleteSupplier(deleteDialog.id);
 toast.success('Đã xóa thành công');
 fetchData();
 } catch (e: any) {
 toast.error(e.message || 'Đã xảy ra lỗi');
 } finally {
 setIsProcessing(false);
 setDeleteDialog({ isOpen: false, id: null });
 }
 };

 const confirmArchive = async () => {
 if (!archiveDialog.id) return;
 setIsProcessing(true);
 try {
 await businessService.archiveSupplier(archiveDialog.id);
 toast.success('Đã lưu trữ thành công');
 fetchData();
 } catch (e: any) {
 toast.error(e.message || 'Đã xảy ra lỗi');
 } finally {
 setIsProcessing(false);
 setArchiveDialog({ isOpen: false, id: null });
 }
 };

 return (
 <div className="space-y-6" dir="ltr"> <div className="flex items-center justify-between"> <div> <h1 className="text-2xl font-bold text-[var(--admin-text-base)]">{t.title}</h1> <p className="text-sm text-[var(--admin-text-muted)] mt-1">{t.subtitle}</p> </div> <Button variant="primary" onClick={() => router.push('/admin/business/suppliers/new')}>
 + {t.addSupplier}
 </Button> </div> <div className="animate-in fade-in slide-in-from-bottom-2"> <DataTable<Supplier>
 data={data}
 isLoading={isLoading}
 columns={[
 { accessor: 'supplierCode', header: t.supplierCode },
 { accessor: 'name', header: t.companyName },
 { accessor: 'contactName', header: t.contactPerson },
 { accessor: 'phone', header: t.phone },
 { accessor: 'totalPurchases', header: 'tổng', render: (_, s) => <span className="tabular-nums">{formatCurrency(s.totalPurchases)}</span> },
 { accessor: 'status', header: t.status, render: (_, s) => (
 <span className={`px-2 py-1 rounded-[var(--admin-radius-sm)] text-xs font-medium ${
 s.status === 'active' ? 'bg-[var(--admin-success-muted)] text-[var(--admin-success)]' : 'bg-[var(--admin-bg-hover)] text-[var(--admin-text-muted)]'
 }`}>
 {s.status === 'active' ? adminAr.status.active : adminAr.status.inactive}
 </span>
 )}
 ]}
 selectable
 selectedIds={selectedIds}
 onSelectionChange={setSelectedIds}
 onEdit={(item) => router.push(`/admin/business/suppliers/${item.id}`)}
 onDuplicate={(item) => handleDuplicate(item)}
 onArchive={(item) => setArchiveDialog({ isOpen: true, id: item.id })}
 onDelete={(item) => setDeleteDialog({ isOpen: true, id: item.id })}
 /> </div> <EntityDeleteDialog 
 isOpen={deleteDialog.isOpen} 
 onClose={() => setDeleteDialog({ isOpen: false, id: null })} 
 onConfirm={confirmDelete}
 title="Xóa Nhà cung cấp"
 description="Bạn có chắc muốn Xóa nàyNhà cung cấp vĩnh viễnً؟ Không thể hoàn tác thao tác này Xóa Tất cả."
 isProcessing={isProcessing}
 /> <EntityArchiveDialog 
 isOpen={archiveDialog.isOpen} 
 onClose={() => setArchiveDialog({ isOpen: false, id: null })} 
 onConfirm={confirmArchive}
 title="Lưu trữ Nhà cung cấp"
 description="Bạn có chắc muốn /Lưu trữ nàyNhà cung cấp؟ từHoạt động."
 isProcessing={isProcessing}
 /> </div>
 );
}

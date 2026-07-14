'use client';

import React, { useEffect, useState } from 'react';
import { create } from 'zustand';
import { businessService } from '@/lib/services/business-supabase.service';
import { Asset } from '@/data/mock/business';
import { formatCurrency } from '@/lib/utils/formatters';
import { DataTable } from '@/components/admin/design-system/DataTable';
import { adminAr } from '@/lib/i18n/admin-ar';
import { useEventSubscribeMany } from '@/hooks/useEventBus';
import { REFRESH_EVENTS } from '@/lib/events/refresh-events';
import { toast } from 'sonner';
import { AssetModal } from '@/components/admin/business/AssetModal';
import { EntityDeleteDialog, EntityArchiveDialog } from '@/components/admin/crud/EntityDialogs';
import { Button } from '@/components/admin/design-system/Button';

interface AssetsState {
 data: Asset[];
 isLoading: boolean;
 fetchData: () => Promise<void>;
}

const useAssetsStore = create<AssetsState>((set) => ({
 data: [],
 isLoading: true,
 fetchData: async () => {
 try {
 const data = await businessService.getAssets();
 set({ data, isLoading: false });
 } catch (e) {
 console.error(e);
 set({ isLoading: false });
 }
 }
}));

export default function AssetsPage() {
 const { data, isLoading, fetchData } = useAssetsStore();
 const t = adminAr.business.assets;

 const [isModalOpen, setIsModalOpen] = useState(false);
 const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
 
 const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean, id: string | null }>({ isOpen: false, id: null });
 const [archiveDialog, setArchiveDialog] = useState<{ isOpen: boolean, id: string | null }>({ isOpen: false, id: null });
 const [isProcessing, setIsProcessing] = useState(false);
 const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

 useEffect(() => {
 fetchData();
 }, [fetchData]);

 useEventSubscribeMany(REFRESH_EVENTS.finance, fetchData);

 const handleSave = async (assetData: Omit<Asset, 'id'>) => {
 if (editingAsset) {
 await businessService.updateAsset(editingAsset.id, assetData);
 toast.success('Đã chỉnh sửa thành công', {
 action: { label: 'Hoàn tác', onClick: () => businessService.updateAsset(editingAsset.id, editingAsset).then(fetchData) }
 });
 } else {
 await businessService.createAsset(assetData);
 toast.success('Đã thêm thành công');
 }
 fetchData();
 };

 const handleDuplicate = async (item: Asset) => {
 const { id, ...rest } = item;
 await businessService.createAsset({ ...rest, name: `${rest.name} (Bản sao)` });
 toast.success('Đã nhân bản thành công');
 fetchData();
 };

 const confirmDelete = async () => {
 if (!deleteDialog.id) return;
 setIsProcessing(true);
 try {
 await businessService.deleteAsset(deleteDialog.id);
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
 await businessService.archiveAsset(archiveDialog.id);
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
 <div className="space-y-6" dir="ltr"> <div className="flex items-center justify-between"> <div> <h1 className="text-2xl font-bold text-[var(--admin-text-base)]">{t.title}</h1> <p className="text-sm text-[var(--admin-text-muted)] mt-1">{t.subtitle}</p> </div> <Button 
 variant="primary"
 onClick={() => { setEditingAsset(null); setIsModalOpen(true); }} 
 >
 + {t.addAsset}
 </Button> </div> <div className="animate-in fade-in slide-in-from-bottom-2"> <DataTable<Asset>
 data={data}
 isLoading={isLoading}
 columns={[
 { accessor: 'name', header: t.assetName },
 { accessor: 'type', header: t.type },
 { accessor: 'purchaseDate', header: t.purchaseDate, render: (_, a) => new Date(a.purchaseDate).toLocaleDateString('vi-VN') },
 { accessor: 'currentValue', header: t.currentValue, render: (_, a) => <span className="font-bold tabular-nums">{formatCurrency(a.currentValue)}</span> },
 { accessor: 'status', header: t.status, render: (_, a) => (
 <span className={`px-2 py-1 rounded-[var(--admin-radius-sm)] text-xs font-medium ${
 a.status === 'active' ? 'bg-[var(--admin-success-muted)] text-[var(--admin-success)]' : 
 a.status === 'written_off' ? 'bg-[var(--admin-bg-hover)] text-[var(--admin-text-muted)]' :
 'bg-[var(--admin-warning-muted)] text-[var(--admin-warning)]'
 }`}>
 {a.status === 'active' ? 'Hoạt động' : a.status === 'written_off' ? '/Đã lưu trữ' : 'Đang bảo trì'}
 </span>
 )}
 ]}
 selectable
 selectedIds={selectedIds}
 onSelectionChange={setSelectedIds}
 onEdit={(item) => { setEditingAsset(item); setIsModalOpen(true); }}
 onDuplicate={(item) => handleDuplicate(item)}
 onArchive={(item) => setArchiveDialog({ isOpen: true, id: item.id })}
 onDelete={(item) => setDeleteDialog({ isOpen: true, id: item.id })}
 /> </div> <AssetModal 
 isOpen={isModalOpen} 
 onClose={() => setIsModalOpen(false)} 
 onSave={handleSave} 
 initialData={editingAsset} 
 /> <EntityDeleteDialog 
 isOpen={deleteDialog.isOpen} 
 onClose={() => setDeleteDialog({ isOpen: false, id: null })} 
 onConfirm={confirmDelete}
 title="Xóa "
 description="Bạn có chắc muốn Xóa nàyvĩnh viễnً؟ Không thể hoàn tác thao tác này."
 isProcessing={isProcessing}
 /> <EntityArchiveDialog 
 isOpen={archiveDialog.isOpen} 
 onClose={() => setArchiveDialog({ isOpen: false, id: null })} 
 onConfirm={confirmArchive}
 title="Loại bỏ "
 description="Bạn có chắc muốn Loại bỏ này ؟mục này sẽ bị ẩn khỏi danh sách hoạt động và không bị xóa vĩnh viễnً."
 isProcessing={isProcessing}
 /> </div>
 );
}

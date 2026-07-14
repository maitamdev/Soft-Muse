"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { IconPhoto, IconPlus, IconTrash, IconEdit, IconArchive } from '@tabler/icons-react';
import { CollectionService, Collection } from '@/lib/services/collection.service';
import { EntityDeleteDialog } from '@/components/admin/crud/EntityDialogs';

import { PageHeader, EmptyState } from '@/components/admin/design-system/Layout';
import { Button } from '@/components/admin/design-system/Button';
import { DataTable, Column } from '@/components/admin/design-system/DataTable';
import { Badge } from '@/components/admin/design-system/Badge';

export default function CollectionsPage() {
 const router = useRouter();
 const [collections, setCollections] = useState<Collection[]>([]);
 const [loading, setLoading] = useState(true);
 const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
 const [search, setSearch] = useState('');
 const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });
 const [isBulkDeleting, setIsBulkDeleting] = useState(false);

 const loadCollections = async () => {
 setLoading(true);
 try {
 const data = await CollectionService.getCollections();
 setCollections(data);
 } catch (err) {
 toast.error("Đã xảy ra lỗi tảiBộ sưu tập");
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 loadCollections();
 }, []);

 const handleDeleteSelected = async () => {
 setIsBulkDeleting(true);
 try {
 await Promise.all(selectedIds.map(id => CollectionService.softDelete(String(id))));
 toast.success("đãXóa Bộ sưu tập");
 setSelectedIds([]);
 loadCollections();
 } catch (error) {
 toast.error("Đã xảy ra lỗi Xóa");
 } finally {
 setIsBulkDeleting(false);
 setDeleteDialog({ isOpen: false, id: null });
 }
 };

 const confirmRowDelete = async () => {
 if (!deleteDialog.id) return;
 try {
 await CollectionService.softDelete(deleteDialog.id);
 toast.success("đãXóa Bộ sưu tập");
 loadCollections();
 } catch (error) {
 toast.error("Đã xảy ra lỗi Xóa");
 } finally {
 setDeleteDialog({ isOpen: false, id: null });
 }
 };

 const columns: Column<Collection>[] = [
 {
 header: 'ảnh',
 accessor: 'image',
 type: 'custom',
 render: (_, row) => (
 <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-[var(--admin-radius-sm)] border border-[var(--admin-border-light)] bg-[var(--admin-bg-elevated)]">
 {row.image ? <img src={row.image} alt={row.name} className="h-full w-full object-cover" /> : <IconPhoto size={18} className="text-[var(--admin-text-subtle)]" />}
 </div>
 )
 },
 { header: 'Tên', accessor: 'name', sortable: true },
 {
 header: '',
 accessor: 'type',
 type: 'custom',
 render: (_, row) => (
 <Badge variant={row.type === 'manual' ? 'primary' : 'info'} size="sm">
 {row.type === 'manual' ? 'Thủ công' : 'Tự động'}
 </Badge>
 )
 },
 {
 header: 'Sản phẩm',
 accessor: 'productIds',
 type: 'custom',
 render: (_, row) => (
 <span className="text-sm font-medium text-[var(--admin-text-base)]">
 {row.type === 'manual' ? row.productIds.length : ''}
 </span>
 )
 },
 {
 header: 'Trạng thái',
 accessor: 'status',
 type: 'custom',
 render: (_, row) => (
 <Badge variant={row.status === 'active' ? 'success' : row.status === 'draft' ? 'warning' : 'neutral'} size="sm" animated>
 {row.status === 'active' ? 'Đang hiển thị' : row.status === 'archived' ? 'Đã lưu trữ' : 'Nháp'}
 </Badge>
 )
 },
 {
 header: '',
 accessor: 'id',
 type: 'actions',
 align: 'end',
 render: (_, row) => (
 <div className="flex items-center gap-2 justify-end"> <Button variant="ghost" size="icon-sm" onClick={() => router.push(`/admin/collections/${row.id}`)}> <IconEdit size={16} /> </Button> <Button variant="ghost" size="icon-sm" className="text-[var(--admin-danger)] hover:bg-[var(--admin-danger)]/10" onClick={() => setDeleteDialog({ isOpen: true, id: String(row.id) })}> <IconTrash size={16} /> </Button> </div>
 )
 }
 ];

 const filteredData = collections.filter(c =>
 c.name.toLowerCase().includes(search.toLowerCase()) ||
 c.slug.toLowerCase().includes(search.toLowerCase())
 );

 return (
 <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 fade-in"> <PageHeader
 title="Quản lý Bộ sưu tập"
 description="Bộ sưu tập "
 actions={
 <Button variant="primary" leftIcon={<IconPlus size={18} />} onClick={() => router.push('/admin/collections/new')}>
 Thêm Bộ sưu tập Mới</Button>
 }
 />

 {selectedIds.length > 0 && (
 <div className="bg-[var(--admin-primary-muted)] border border-[var(--admin-primary)]/20 p-3 px-4 flex items-center justify-between rounded-[var(--admin-radius-xl)] shadow-[var(--admin-shadow-sm)]"> <span className="text-sm font-bold text-[var(--admin-primary)]">Đã chọn {selectedIds.length} </span> <Button size="sm" variant="danger" leftIcon={<IconTrash size={16} />} onClick={() => setDeleteDialog({ isOpen: true, id: null })}>
 Xóa mục đã chọn
 </Button> </div>
 )}

 <DataTable
 columns={columns}
 data={filteredData}
 isLoading={loading}
 searchQuery={search}
 onSearchChange={setSearch}
 selectable
 selectedIds={selectedIds}
 onSelectionChange={setSelectedIds}
 pageSize={10}
 emptyState={
 <EmptyState
 icon={<IconArchive size={48} />}
 title="Không có "
 description="Không tìm thấy phù hợp với tìm kiếm."
 action={<Button variant="secondary" onClick={() => router.push('/admin/collections/new')}>Thêm Bộ sưu tập</Button>}
 />
 }
 /> <EntityDeleteDialog
 isOpen={deleteDialog.isOpen}
 onClose={() => setDeleteDialog({ isOpen: false, id: null })}
 onConfirm={deleteDialog.id ? confirmRowDelete : handleDeleteSelected}
 title="Xóa Bộ sưu tập"
 description={
 deleteDialog.id
 ? 'Bạn có chắc muốn Xóa nàyBộ sưu tập vĩnh viễnً؟ Không thể hoàn tác thao tác này.'
 : `Bạn có chắc muốn Xóa ${selectedIds.length} ؟Không thể hoàn tác thao tác này.`
 }
 isProcessing={isBulkDeleting}
 /> </div>
 );
}

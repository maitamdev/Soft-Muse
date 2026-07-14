"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { IconPlus, IconTrash, IconEdit, IconArchive } from '@tabler/icons-react';
import { EntityDeleteDialog } from '@/components/admin/crud/EntityDialogs';
import { ProductService } from '@/lib/services/product.service';
import type { Product } from '@/data/mock/products';
import { useEventSubscribeMany } from '@/hooks/useEventBus';
import { REFRESH_EVENTS } from '@/lib/events/refresh-events';
import { usePermissions } from '@/lib/auth/PermissionContext';

import { PageHeader, EmptyState } from '@/components/admin/design-system/Layout';
import { Button } from '@/components/admin/design-system/Button';
import { DataTable, Column } from '@/components/admin/design-system/DataTable';
import { Badge } from '@/components/admin/design-system/Badge';

export default function ProductsPage() {
 const router = useRouter();
 const { can } = usePermissions();
 const canWrite = can('products', 'write');
 const canDelete = can('products', 'delete');
 const [products, setProducts] = useState<Product[]>([]);
 const [loading, setLoading] = useState(true);
 const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
 const [search, setSearch] = useState('');
 const [seasonFilter, setSeasonFilter] = useState<'all' | 'winter' | 'summer'>('all');
 const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'hidden' | 'archived'>('all');
 const [flagFilter, setFlagFilter] = useState<'all' | 'featured' | 'bestSeller' | 'newArrival'>('all');
 const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });
 const [isBulkDeleting, setIsBulkDeleting] = useState(false);

 const loadProducts = async () => {
 setLoading(true);
 try {
 const data = await ProductService.getProducts();
 setProducts(data);
 } catch {
 toast.error("Đã xảy ra lỗi tảiSản phẩm");
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 loadProducts();
 }, []);

 useEventSubscribeMany(REFRESH_EVENTS.products, loadProducts);

 const handleDeleteSelected = async () => {
 setIsBulkDeleting(true);
 try {
 await Promise.all(selectedIds.map(id => ProductService.deleteProduct(String(id))));
 toast.success("đãXóa Sản phẩm");
 setSelectedIds([]);
 loadProducts();
 } catch {
 toast.error("Đã xảy ra lỗi Xóa");
 } finally {
 setIsBulkDeleting(false);
 setDeleteDialog({ isOpen: false, id: null });
 }
 };

 const confirmRowDelete = async () => {
 if (!deleteDialog.id) return;
 try {
 await ProductService.deleteProduct(deleteDialog.id);
 toast.success("đãXóa sản phẩm");
 loadProducts();
 } catch {
 toast.error("Đã xảy ra lỗi Xóa");
 } finally {
 setDeleteDialog({ isOpen: false, id: null });
 }
 };

 const columns: Column<Product>[] = [
 {
 header: 'ảnh',
 accessor: 'images',
 type: 'custom',
 render: (_, row) => (
 <div className="w-12 h-12 rounded-[var(--admin-radius-sm)] overflow-hidden border border-[var(--admin-border-light)] bg-[var(--admin-bg-elevated)] p-1"> <img
 src={row.images?.[0] || 'https://via.placeholder.com/100'}
 alt=""
 className="w-full h-full object-contain"
 /> </div>
 )
 },
 { header: 'Tên', accessor: 'name', sortable: true },
 { header: 'SKU', accessor: 'sku', sortable: true },
 {
 header: 'Trạng thái',
 accessor: 'status',
 type: 'custom',
 render: (_, row) => (
 <Badge
 variant={row.status === 'published' ? 'success' : row.status === 'draft' ? 'warning' : 'neutral'}
 size="sm"
 animated
 >
 {row.status === 'published' ? 'Đã xuất bản' : row.status === 'draft' ? 'Nháp' : row.status}
 </Badge>
 )
 },
 {
 header: 'Tồn kho',
 accessor: 'stock',
 type: 'custom',
 sortable: true,
 render: (_, row) => (
 <span className={`font-semibold ${row.stock < 10 ? 'text-[var(--admin-danger)]' : 'text-[var(--admin-success)]'}`}>
 {row.stock}
 </span>
 )
 },
 {
 header: 'Giá',
 accessor: 'price',
 type: 'price',
 sortable: true,
 },
 {
 header: '',
 accessor: 'id',
 type: 'actions',
 align: 'end',
 render: (_, row) => (
 <div className="flex items-center gap-2 justify-end"> <Button variant="ghost" size="icon-sm" onClick={() => router.push(`/admin/products/${row.id}`)}> <IconEdit size={16} /> </Button>
 {canDelete && (
 <Button
 variant="ghost"
 size="icon-sm"
 className="text-[var(--admin-danger)] hover:bg-[var(--admin-danger)]/10"
 onClick={() => setDeleteDialog({ isOpen: true, id: row.id })}
 > <IconTrash size={16} /> </Button>
 )}
 </div>
 )
 }
 ];

 const filteredData = products.filter(p => {
 const matchesSearch =
 p.name.toLowerCase().includes(search.toLowerCase()) ||
 p.sku.toLowerCase().includes(search.toLowerCase());
 const matchesSeason = seasonFilter === 'all' || p.season === seasonFilter;
 const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
 const matchesFlag = flagFilter === 'all' || p[flagFilter] === true;
 return matchesSearch && matchesSeason && matchesStatus && matchesFlag;
 });

 return (
 <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 fade-in"> <PageHeader
 title="Sản phẩm"
 description="Quản lý vàSửa sản phẩm"
 actions={
 canWrite ? (
 <Button variant="primary" leftIcon={<IconPlus size={18} />} onClick={() => router.push('/admin/products/new')}>
 Thêm sản phẩm</Button>
 ) : undefined
 }
 /> <div className="flex flex-wrap items-center gap-3"> <select
 value={seasonFilter}
 onChange={(e) => setSeasonFilter(e.target.value as typeof seasonFilter)}
 className="h-10 px-3 border border-[var(--admin-border-base)] rounded-[var(--admin-radius-md)] bg-[var(--admin-bg-surface)] text-sm text-[var(--admin-text-base)] outline-none focus:ring-2 focus:ring-[var(--admin-primary)]"
 > <option value="all">:Cửa hàng ()</option> <option value="winter">Thời trang đông</option> <option value="summer">Thời trang hè</option> </select> <select
 value={statusFilter}
 onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
 className="h-10 px-3 border border-[var(--admin-border-base)] rounded-[var(--admin-radius-md)] bg-[var(--admin-bg-surface)] text-sm text-[var(--admin-text-base)] outline-none focus:ring-2 focus:ring-[var(--admin-primary)]"
 > <option value="all">Trạng thái: </option> <option value="published">Đã xuất bản</option> <option value="draft">Nháp</option> <option value="hidden"></option> <option value="archived">Đã lưu trữ</option> </select> <div className="flex items-center gap-1.5">
 {([
 ['all', ''],
 ['featured', ''],
 ['bestSeller', 'Bán chạy nhất'],
 ['newArrival', 'Hàng mới về'],
 ] as const).map(([value, label]) => (
 <button
 key={value}
 type="button"
 onClick={() => setFlagFilter(value)}
 className={`px-3 h-10 rounded-[var(--admin-radius-md)] text-xs font-semibold transition-colors border ${
 flagFilter === value
 ? 'bg-[var(--admin-primary)] text-white border-[var(--admin-primary)]'
 : 'bg-[var(--admin-bg-surface)] text-[var(--admin-text-muted)] border-[var(--admin-border-base)] hover:text-[var(--admin-text-base)]'
 }`}
 >
 {label}
 </button>
 ))}
 </div> </div>

 {selectedIds.length > 0 && canDelete && (
 <div className="bg-[var(--admin-primary-muted)] border border-[var(--admin-primary)]/20 p-3 px-4 flex items-center justify-between rounded-[var(--admin-radius-xl)] shadow-[var(--admin-shadow-sm)]"> <span className="text-sm font-bold text-[var(--admin-primary)]">
 Đã chọn {selectedIds.length} sản phẩm</span> <Button size="sm" variant="danger" leftIcon={<IconTrash size={16} />} onClick={() => setDeleteDialog({ isOpen: true, id: null })}>
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
 pageSize={15}
 emptyState={
 <EmptyState
 icon={<IconArchive size={48} />}
 title="Không có sản phẩm"
 description="Không tìm thấy sản phẩmphù hợp với tìm kiếm."
 action={
 <Button variant="secondary" onClick={() => router.push('/admin/products/new')}>
 Thêm sản phẩm</Button>
 }
 />
 }
 /> <EntityDeleteDialog
 isOpen={deleteDialog.isOpen}
 onClose={() => setDeleteDialog({ isOpen: false, id: null })}
 onConfirm={deleteDialog.id ? confirmRowDelete : handleDeleteSelected}
 title="Xóa sản phẩm"
 description={
 deleteDialog.id
 ? 'Bạn có chắc muốn Xóa này sản phẩmvĩnh viễnً؟ Không thể hoàn tác thao tác này.'
 : `Bạn có chắc muốn Xóa ${selectedIds.length} sản phẩm؟Không thể hoàn tác thao tác này.`
 }
 isProcessing={isBulkDeleting}
 /> </div>
 );
}

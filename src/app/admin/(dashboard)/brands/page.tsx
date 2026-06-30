"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { IconPlus, IconTrash, IconEdit, IconArchive } from '@tabler/icons-react';
import { BrandService, Brand } from '@/lib/services/brand.service';
import { EntityDeleteDialog } from '@/components/admin/crud/EntityDialogs';

import { PageHeader, EmptyState } from '@/components/admin/design-system/Layout';
import { Button } from '@/components/admin/design-system/Button';
import { DataTable, Column } from '@/components/admin/design-system/DataTable';
import { Badge } from '@/components/admin/design-system/Badge';

export default function BrandsPage() {
  const router = useRouter();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [search, setSearch] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const loadBrands = async () => {
    setLoading(true);
    try {
      const data = await BrandService.getBrands();
      setBrands(data);
    } catch (err) {
      toast.error("حدث خطأ أثناء تحميل العلامات التجارية");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBrands();
  }, []);

  const handleDeleteSelected = async () => {
    setIsBulkDeleting(true);
    try {
      await Promise.all(selectedIds.map(id => BrandService.softDelete(String(id))));
      toast.success("تم حذف العلامات التجارية");
      setSelectedIds([]);
      loadBrands();
    } catch (error) {
      toast.error("حدث خطأ أثناء الحذف");
    } finally {
      setIsBulkDeleting(false);
      setDeleteDialog({ isOpen: false, id: null });
    }
  };

  const confirmRowDelete = async () => {
    if (!deleteDialog.id) return;
    try {
      await BrandService.softDelete(deleteDialog.id);
      toast.success("تم حذف العلامة التجارية");
      loadBrands();
    } catch (error) {
      toast.error("حدث خطأ أثناء الحذف");
    } finally {
      setDeleteDialog({ isOpen: false, id: null });
    }
  };

  const columns: Column<Brand>[] = [
    {
      header: 'الشعار',
      accessor: 'logo',
      type: 'custom',
      render: (_, row) => (
        <div className="w-12 h-12 rounded-[var(--admin-radius-sm)] overflow-hidden border border-[var(--admin-border-light)] bg-[var(--admin-bg-elevated)] p-1">
          <img src={row.logo || 'https://via.placeholder.com/100'} alt="" className="w-full h-full object-contain" />
        </div>
      )
    },
    { header: 'الاسم', accessor: 'name', sortable: true },
    { header: 'الرابط (Slug)', accessor: 'slug' },
    {
      header: 'الحالة',
      accessor: 'status',
      type: 'custom',
      render: (_, row) => (
        <Badge variant={row.status === 'active' ? 'success' : row.status === 'draft' ? 'warning' : 'neutral'} size="sm" animated>
          {row.status}
        </Badge>
      )
    },
    {
      header: '',
      accessor: 'id',
      type: 'actions',
      align: 'end',
      render: (_, row) => (
        <div className="flex items-center gap-2 justify-end">
          <Button variant="ghost" size="icon-sm" onClick={() => router.push(`/admin/brands/${row.id}`)}>
            <IconEdit size={16} />
          </Button>
          <Button variant="ghost" size="icon-sm" className="text-[var(--admin-danger)] hover:bg-[var(--admin-danger)]/10" onClick={() => setDeleteDialog({ isOpen: true, id: String(row.id) })}>
            <IconTrash size={16} />
          </Button>
        </div>
      )
    }
  ];

  const filteredData = brands.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 fade-in">
      <PageHeader
        title="إدارة العلامات التجارية"
        description="أضف وقم بإدارة الماركات والبراندات"
        actions={
          <Button variant="primary" leftIcon={<IconPlus size={18} />} onClick={() => router.push('/admin/brands/new')}>
            إضافة علامة تجارية
          </Button>
        }
      />

      {selectedIds.length > 0 && (
        <div className="bg-[var(--admin-primary-muted)] border border-[var(--admin-primary)]/20 p-3 px-4 flex items-center justify-between rounded-[var(--admin-radius-xl)] shadow-[var(--admin-shadow-sm)]">
          <span className="text-sm font-bold text-[var(--admin-primary)]">تم تحديد {selectedIds.length} علامات تجارية</span>
          <Button size="sm" variant="danger" leftIcon={<IconTrash size={16} />} onClick={() => setDeleteDialog({ isOpen: true, id: null })}>
            حذف المحدد
          </Button>
        </div>
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
            title="لا توجد علامات تجارية"
            description="لم يتم العثور على أي علامات مطابقة لبحثك."
            action={<Button variant="secondary" onClick={() => router.push('/admin/brands/new')}>إضافة علامة</Button>}
          />
        }
      />

      <EntityDeleteDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, id: null })}
        onConfirm={deleteDialog.id ? confirmRowDelete : handleDeleteSelected}
        title="حذف العلامة التجارية"
        description={
          deleteDialog.id
            ? 'هل أنت متأكد من رغبتك في حذف هذه العلامة نهائياً؟ لا يمكن التراجع عن هذا الإجراء.'
            : `هل أنت متأكد من رغبتك في حذف ${selectedIds.length} علامات؟ لا يمكن التراجع عن هذا الإجراء.`
        }
        isProcessing={isBulkDeleting}
      />
    </div>
  );
}

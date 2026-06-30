"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { IconPlus, IconTrash, IconEdit, IconArchive } from '@tabler/icons-react';
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
      toast.error("حدث خطأ أثناء تحميل التشكيلات");
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
      toast.success("تم حذف التشكيلات");
      setSelectedIds([]);
      loadCollections();
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
      await CollectionService.softDelete(deleteDialog.id);
      toast.success("تم حذف التشكيلة");
      loadCollections();
    } catch (error) {
      toast.error("حدث خطأ أثناء الحذف");
    } finally {
      setDeleteDialog({ isOpen: false, id: null });
    }
  };

  const columns: Column<Collection>[] = [
    {
      header: 'صورة',
      accessor: 'image',
      type: 'custom',
      render: (_, row) => (
        <div className="w-12 h-12 rounded-[var(--admin-radius-sm)] overflow-hidden border border-[var(--admin-border-light)] bg-[var(--admin-bg-elevated)]">
          <img src={row.image || 'https://via.placeholder.com/100'} alt="" className="w-full h-full object-cover" />
        </div>
      )
    },
    { header: 'الاسم', accessor: 'name', sortable: true },
    {
      header: 'النوع',
      accessor: 'type',
      type: 'custom',
      render: (_, row) => (
        <Badge variant={row.type === 'manual' ? 'primary' : 'info'} size="sm">
          {row.type === 'manual' ? 'يدوي' : 'تلقائي'}
        </Badge>
      )
    },
    {
      header: 'المنتجات',
      accessor: 'productIds',
      type: 'custom',
      render: (_, row) => (
        <span className="text-sm font-medium text-[var(--admin-text-base)]">
          {row.type === 'manual' ? row.productIds.length : 'تلقائي'}
        </span>
      )
    },
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
          <Button variant="ghost" size="icon-sm" onClick={() => router.push(`/admin/collections/${row.id}`)}>
            <IconEdit size={16} />
          </Button>
          <Button variant="ghost" size="icon-sm" className="text-[var(--admin-danger)] hover:bg-[var(--admin-danger)]/10" onClick={() => setDeleteDialog({ isOpen: true, id: String(row.id) })}>
            <IconTrash size={16} />
          </Button>
        </div>
      )
    }
  ];

  const filteredData = collections.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 fade-in">
      <PageHeader
        title="إدارة التشكيلات"
        description="التشكيلات اليدوية والتلقائية"
        actions={
          <Button variant="primary" leftIcon={<IconPlus size={18} />} onClick={() => router.push('/admin/collections/new')}>
            إضافة تشكيلة جديدة
          </Button>
        }
      />

      {selectedIds.length > 0 && (
        <div className="bg-[var(--admin-primary-muted)] border border-[var(--admin-primary)]/20 p-3 px-4 flex items-center justify-between rounded-[var(--admin-radius-xl)] shadow-[var(--admin-shadow-sm)]">
          <span className="text-sm font-bold text-[var(--admin-primary)]">تم تحديد {selectedIds.length} تشكيلات</span>
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
            title="لا توجد تشكيلات"
            description="لم يتم العثور على أي تشكيلات مطابقة لبحثك."
            action={<Button variant="secondary" onClick={() => router.push('/admin/collections/new')}>إضافة تشكيلة</Button>}
          />
        }
      />

      <EntityDeleteDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, id: null })}
        onConfirm={deleteDialog.id ? confirmRowDelete : handleDeleteSelected}
        title="حذف التشكيلة"
        description={
          deleteDialog.id
            ? 'هل أنت متأكد من رغبتك في حذف هذه التشكيلة نهائياً؟ لا يمكن التراجع عن هذا الإجراء.'
            : `هل أنت متأكد من رغبتك في حذف ${selectedIds.length} تشكيلات؟ لا يمكن التراجع عن هذا الإجراء.`
        }
        isProcessing={isBulkDeleting}
      />
    </div>
  );
}

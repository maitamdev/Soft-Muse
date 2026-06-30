"use client";

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { IconEdit, IconArchive } from '@tabler/icons-react';
import { CategoryService, Category } from '@/lib/services/category.service';

import { PageHeader, EmptyState } from '@/components/admin/design-system/Layout';
import { Button } from '@/components/admin/design-system/Button';
import { DataTable, Column } from '@/components/admin/design-system/DataTable';
import { Badge } from '@/components/admin/design-system/Badge';
import { Modal } from '@/components/admin/design-system/Modal';
import { Input } from '@/components/admin/design-system/Input';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await CategoryService.getCategories();
      setCategories(data);
    } catch (err) {
      toast.error("حدث خطأ أثناء تحميل الأقسام");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const saveEditing = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      await CategoryService.updateCategory(editing.id, editing);
      toast.success("تم حفظ القسم");
      setEditing(null);
      loadCategories();
    } catch (error) {
      toast.error("حدث خطأ أثناء الحفظ");
    } finally {
      setSaving(false);
    }
  };

  const columns: Column<Category>[] = [
    {
      header: 'صورة',
      accessor: 'thumbnail',
      type: 'custom',
      render: (_, row) => (
        <div className="w-12 h-12 rounded-[var(--admin-radius-sm)] overflow-hidden border border-[var(--admin-border-light)] bg-[var(--admin-bg-elevated)]">
          <img src={row.thumbnail || 'https://via.placeholder.com/100'} alt="" className="w-full h-full object-cover" />
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
      header: 'الظهور',
      accessor: 'showOnHomepage',
      type: 'custom',
      render: (_, row) => (
        <div className="flex gap-1">
          {row.isFeatured && <Badge variant="primary" size="sm">مميز</Badge>}
          {row.showOnHomepage && <Badge variant="info" size="sm">الرئيسية</Badge>}
          {row.showInMenu && <Badge variant="outline" size="sm">القائمة</Badge>}
        </div>
      )
    },
    { header: 'الترتيب', accessor: 'sortOrder', sortable: true },
    {
      header: '',
      accessor: 'id',
      type: 'actions',
      align: 'end',
      render: (_, row) => (
        <div className="flex items-center gap-2 justify-end">
          <Button variant="ghost" size="icon-sm" onClick={() => setEditing(row)}>
            <IconEdit size={16} />
          </Button>
        </div>
      )
    }
  ];

  const filteredData = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 fade-in">
      <PageHeader
        title="إدارة الأقسام"
        description="الأقسام الثلاثة الحقيقية لمتجر أورا — تشكيلة الشتاء، تشكيلة الصيف، والمتجر بالكامل. هذه الفئات ثابتة لمطابقة بنية الموقع، ويمكن تعديل ظهورها ووصفها فقط."
      />

      <DataTable
        columns={columns}
        data={filteredData}
        isLoading={loading}
        searchQuery={search}
        onSearchChange={setSearch}
        pageSize={10}
        emptyState={
          <EmptyState
            icon={<IconArchive size={48} />}
            title="لا توجد أقسام"
            description="لم يتم العثور على أي أقسام مطابقة لبحثك."
          />
        }
      />

      <Modal
        isOpen={!!editing}
        onClose={() => setEditing(null)}
        title={editing ? `تعديل: ${editing.name}` : ''}
        footer={
          <div className="flex items-center justify-end gap-3">
            <Button variant="secondary" onClick={() => setEditing(null)}>إلغاء</Button>
            <Button variant="primary" isLoading={saving} onClick={saveEditing}>حفظ</Button>
          </div>
        }
      >
        {editing && (
          <div className="space-y-4">
            <Input
              label="الاسم"
              value={editing.name}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
            />
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--admin-text-muted)]">الوصف</label>
              <textarea
                rows={3}
                value={editing.description}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                className="w-full px-3 py-2 border border-[var(--admin-border-base)] rounded-[var(--admin-radius-md)] bg-transparent outline-none focus:border-[var(--admin-primary)] resize-y text-sm"
              />
            </div>
            <Input
              label="رابط الصورة المصغرة"
              value={editing.thumbnail}
              onChange={(e) => setEditing({ ...editing, thumbnail: e.target.value })}
              className="dir-ltr text-left"
            />
            <Input
              label="الترتيب"
              type="number"
              value={editing.sortOrder}
              onChange={(e) => setEditing({ ...editing, sortOrder: Number(e.target.value) })}
            />
            <div className="space-y-2 pt-2 border-t border-[var(--admin-border-light)]">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={editing.isFeatured} onChange={(e) => setEditing({ ...editing, isFeatured: e.target.checked })} className="w-4 h-4 rounded text-[var(--admin-primary)]" />
                <span className="text-sm text-[var(--admin-text-base)]">قسم مميز</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={editing.showOnHomepage} onChange={(e) => setEditing({ ...editing, showOnHomepage: e.target.checked })} className="w-4 h-4 rounded text-[var(--admin-primary)]" />
                <span className="text-sm text-[var(--admin-text-base)]">يظهر في الصفحة الرئيسية</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={editing.showInMenu} onChange={(e) => setEditing({ ...editing, showInMenu: e.target.checked })} className="w-4 h-4 rounded text-[var(--admin-primary)]" />
                <span className="text-sm text-[var(--admin-text-base)]">يظهر في قائمة التنقل</span>
              </label>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

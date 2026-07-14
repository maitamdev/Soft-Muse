"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { IconCategory2, IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import { Category, CategoryService } from "@/lib/services/category.service";
import { PageHeader, EmptyState } from "@/components/admin/design-system/Layout";
import { Button } from "@/components/admin/design-system/Button";
import { DataTable, Column } from "@/components/admin/design-system/DataTable";
import { Badge } from "@/components/admin/design-system/Badge";
import { Modal } from "@/components/admin/design-system/Modal";
import { Input } from "@/components/admin/design-system/Input";
import { ImageUpload } from "@/components/admin/ui/ImageUpload";

type CategoryDraft = Omit<Category, "id" | "createdAt" | "updatedAt"> & { id?: string };

const emptyDraft = (): CategoryDraft => ({
  name: "", slug: "", description: "", thumbnail: "", banner: "",
  isFeatured: false, showOnHomepage: false, showInMenu: true,
  sortOrder: 0, status: "active", seo: { title: "", description: "" },
});

function toSlug(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D")
    .toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Đã xảy ra lỗi. Vui lòng thử lại.";
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState<CategoryDraft | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<Category | null>(null);
  const [usageCount, setUsageCount] = useState<number | null>(null);
  const [checkingUsage, setCheckingUsage] = useState(false);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try { setCategories(await CategoryService.getCategories()); }
    catch (error) { toast.error(`Không thể tải danh mục: ${errorMessage(error)}`); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void loadCategories(); }, [loadCategories]);

  const openDelete = async (category: Category) => {
    setDeleting(category);
    setUsageCount(null);
    setCheckingUsage(true);
    try { setUsageCount(await CategoryService.getUsageCount(category.name)); }
    catch (error) { toast.error(`Không thể kiểm tra danh mục: ${errorMessage(error)}`); }
    finally { setCheckingUsage(false); }
  };

  const save = async () => {
    if (!draft) return;
    const name = draft.name.trim();
    const slug = draft.slug.trim();
    if (!name) return toast.error("Vui lòng nhập tên danh mục.");
    if (!slug) return toast.error("Vui lòng nhập đường dẫn danh mục.");
    setSaving(true);
    try {
      if (draft.id) await CategoryService.updateCategory(draft.id, { ...draft, name, slug });
      else await CategoryService.createCategory({ ...draft, name, slug });
      toast.success(draft.id ? "Đã cập nhật danh mục và sản phẩm liên quan." : "Đã tạo danh mục mới.");
      setDraft(null);
      await loadCategories();
    } catch (error) { toast.error(errorMessage(error)); }
    finally { setSaving(false); }
  };

  const remove = async () => {
    if (!deleting || (usageCount ?? 0) > 0) return;
    setSaving(true);
    try {
      await CategoryService.hardDelete(deleting.id);
      toast.success("Đã xóa danh mục.");
      setDeleting(null);
      await loadCategories();
    } catch (error) { toast.error(errorMessage(error)); }
    finally { setSaving(false); }
  };

  const hideCategory = async () => {
    if (!deleting) return;
    setSaving(true);
    try {
      await CategoryService.updateCategory(deleting.id, { ...deleting, status: "draft" });
      toast.success("Đã ẩn danh mục khỏi cửa hàng.");
      setDeleting(null);
      await loadCategories();
    } catch (error) { toast.error(errorMessage(error)); }
    finally { setSaving(false); }
  };

  const columns: Column<Category>[] = [
    { header: "Hình ảnh", accessor: "thumbnail", type: "custom", render: (_, row) => (
      <div className="h-14 w-12 overflow-hidden border border-[var(--admin-border-light)] bg-[var(--admin-bg-elevated)]">
        {row.thumbnail ? <img src={row.thumbnail} alt={row.name} className="h-full w-full object-cover" /> : <IconCategory2 className="m-auto h-full text-[var(--admin-text-subtle)]" size={22} />}
      </div>
    )},
    { header: "Tên danh mục", accessor: "name", sortable: true },
    { header: "Đường dẫn", accessor: "slug" },
    { header: "Trạng thái", accessor: "status", type: "custom", render: (_, row) => (
      <Badge variant={row.status === "active" ? "success" : "neutral"} size="sm">{row.status === "active" ? "Đang hiển thị" : "Đang ẩn"}</Badge>
    )},
    { header: "Vị trí", accessor: "sortOrder", sortable: true },
    { header: "Thao tác", accessor: "id", type: "actions", align: "end", render: (_, row) => (
      <div className="flex justify-end gap-1">
        <Button variant="ghost" size="icon-sm" title="Sửa danh mục" aria-label={`Sửa ${row.name}`} onClick={() => setDraft({ ...row })}><IconEdit size={17} /></Button>
        <Button variant="ghost" size="icon-sm" className="text-[var(--admin-danger)]" title="Xóa danh mục" aria-label={`Xóa ${row.name}`} onClick={() => void openDelete(row)}><IconTrash size={17} /></Button>
      </div>
    )},
  ];

  const filtered = useMemo(() => categories.filter(category => `${category.name} ${category.slug}`.toLowerCase().includes(search.toLowerCase())), [categories, search]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6 lg:p-8">
      <PageHeader title="Quản lý danh mục" description="Tổ chức sản phẩm, thứ tự hiển thị và điều hướng cửa hàng." actions={<Button leftIcon={<IconPlus size={18} />} onClick={() => setDraft(emptyDraft())}>Thêm danh mục</Button>} />
      <DataTable columns={columns} data={filtered} isLoading={loading} searchQuery={search} onSearchChange={setSearch} pageSize={10}
        emptyState={<EmptyState icon={<IconCategory2 size={44} />} title="Chưa có danh mục" description="Tạo danh mục đầu tiên để tổ chức sản phẩm của cửa hàng." />} />

      <Modal isOpen={!!draft} onClose={() => setDraft(null)} title={draft?.id ? "Chỉnh sửa danh mục" : "Thêm danh mục"} maxWidth="2xl"
        footer={<div className="flex justify-end gap-3"><Button variant="secondary" onClick={() => setDraft(null)}>Hủy</Button><Button isLoading={saving} onClick={() => void save()}>Lưu danh mục</Button></div>}>
        {draft && <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Tên danh mục" value={draft.name} onChange={event => {
              const name = event.target.value;
              setDraft(current => current ? { ...current, name, slug: current.id ? current.slug : toSlug(name) } : current);
            }} />
            <Input label="Đường dẫn (slug)" value={draft.slug} onChange={event => setDraft({ ...draft, slug: toSlug(event.target.value) })} hint="Ví dụ: ao-so-mi. Dùng trong địa chỉ trang danh mục." />
          </div>
          <div className="space-y-1.5"><label className="text-xs font-semibold text-[var(--admin-text-muted)]">Mô tả</label><textarea rows={4} value={draft.description} onChange={event => setDraft({ ...draft, description: event.target.value })} className="w-full border border-[var(--admin-border-base)] bg-[var(--admin-bg-surface)] p-3 text-sm outline-none focus:border-[var(--admin-primary)]" /></div>
          <div><p className="mb-2 text-xs font-semibold text-[var(--admin-text-muted)]">Ảnh đại diện danh mục</p><ImageUpload label="Tải ảnh danh mục" images={draft.thumbnail ? [draft.thumbnail] : []} onChange={images => setDraft({ ...draft, thumbnail: images[0] ?? "" })} /></div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Thứ tự hiển thị" type="number" min={0} value={draft.sortOrder} onChange={event => setDraft({ ...draft, sortOrder: Number(event.target.value) })} />
            <label className="flex flex-col gap-1 text-xs font-semibold text-[var(--admin-text-muted)]">Trạng thái<select value={draft.status} onChange={event => setDraft({ ...draft, status: event.target.value as CategoryDraft["status"] })} className="h-12 border border-[var(--admin-border-base)] bg-[var(--admin-bg-surface)] px-3 text-sm text-[var(--admin-text-base)]"><option value="active">Đang hiển thị</option><option value="draft">Đang ẩn</option></select></label>
          </div>
          <div className="grid gap-3 border-t border-[var(--admin-border-light)] pt-4 sm:grid-cols-3">
            {[["isFeatured", "Danh mục nổi bật"], ["showOnHomepage", "Hiện ở trang chủ"], ["showInMenu", "Hiện trên menu"]].map(([key, label]) => <label key={key} className="flex cursor-pointer items-center gap-2 text-sm text-[var(--admin-text-base)]"><input type="checkbox" checked={Boolean(draft[key as keyof CategoryDraft])} onChange={event => setDraft({ ...draft, [key]: event.target.checked })} />{label}</label>)}
          </div>
        </div>}
      </Modal>

      <Modal isOpen={!!deleting} onClose={() => setDeleting(null)} title="Xóa danh mục" maxWidth="sm"
        footer={<div className="flex justify-end gap-3"><Button variant="secondary" onClick={() => setDeleting(null)}>Hủy</Button>{(usageCount ?? 0) > 0 ? <Button variant="warning" isLoading={saving} onClick={() => void hideCategory()}>Ẩn danh mục</Button> : <Button variant="danger" isLoading={saving} disabled={checkingUsage} onClick={() => void remove()}>Xóa vĩnh viễn</Button>}</div>}>
        <div className="space-y-3 text-sm text-[var(--admin-text-base)]">
          <p>Bạn đang thao tác với danh mục <strong>{deleting?.name}</strong>.</p>
          {checkingUsage ? <p className="text-[var(--admin-text-muted)]">Đang kiểm tra sản phẩm liên quan...</p> : (usageCount ?? 0) > 0 ? <p className="border border-amber-200 bg-amber-50 p-3 text-amber-800">Danh mục đang được <strong>{usageCount} sản phẩm</strong> sử dụng nên không thể xóa. Bạn có thể ẩn danh mục khỏi cửa hàng.</p> : <p className="border border-red-200 bg-red-50 p-3 text-red-700">Danh mục không có sản phẩm liên quan. Thao tác xóa không thể hoàn tác.</p>}
        </div>
      </Modal>
    </div>
  );
}

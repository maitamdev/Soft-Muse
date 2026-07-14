"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { IconCategory2, IconEdit, IconPackage, IconPlus, IconTrash } from "@tabler/icons-react";
import { Category, CategoryProduct, CategoryService } from "@/lib/services/category.service";
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

const formatMoney = (value: number) => `${new Intl.NumberFormat("vi-VN").format(value)} đ`;

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState<CategoryDraft | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<Category | null>(null);
  const [usageCount, setUsageCount] = useState<number | null>(null);
  const [checkingUsage, setCheckingUsage] = useState(false);
  const [managing, setManaging] = useState<Category | null>(null);
  const [categoryProducts, setCategoryProducts] = useState<CategoryProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());
  const [assignmentSaving, setAssignmentSaving] = useState(false);
  const [removingProductId, setRemovingProductId] = useState<string | null>(null);

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

  const openProductManager = async (category: Category) => {
    setManaging(category);
    setProductSearch("");
    setSelectedProductIds(new Set());
    setProductsLoading(true);
    try { setCategoryProducts(await CategoryService.getProductsForAssignment()); }
    catch (error) { toast.error(`Không thể tải sản phẩm: ${errorMessage(error)}`); }
    finally { setProductsLoading(false); }
  };

  const addSelectedProducts = async () => {
    if (!managing || !selectedProductIds.size) return;
    const ids = Array.from(selectedProductIds);
    setAssignmentSaving(true);
    try {
      await CategoryService.assignProducts(managing.name, ids);
      setCategoryProducts(current => current.map(product => ids.includes(product.id) ? { ...product, category: managing.name } : product));
      setSelectedProductIds(new Set());
      toast.success(`Đã thêm ${ids.length} sản phẩm vào ${managing.name}.`);
    } catch (error) { toast.error(errorMessage(error)); }
    finally { setAssignmentSaving(false); }
  };

  const removeFromCategory = async (product: CategoryProduct) => {
    setRemovingProductId(product.id);
    try {
      await CategoryService.removeProductFromCategory(product.id);
      setCategoryProducts(current => current.map(item => item.id === product.id ? { ...item, category: "" } : item));
      toast.success(`Đã gỡ ${product.name} khỏi danh mục.`);
    } catch (error) { toast.error(errorMessage(error)); }
    finally { setRemovingProductId(null); }
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
        <Button variant="ghost" size="icon-sm" title="Quản lý sản phẩm" aria-label={`Quản lý sản phẩm trong ${row.name}`} onClick={() => void openProductManager(row)}><IconPackage size={17} /></Button>
        <Button variant="ghost" size="icon-sm" title="Sửa danh mục" aria-label={`Sửa ${row.name}`} onClick={() => setDraft({ ...row })}><IconEdit size={17} /></Button>
        <Button variant="ghost" size="icon-sm" className="text-[var(--admin-danger)]" title="Xóa danh mục" aria-label={`Xóa ${row.name}`} onClick={() => void openDelete(row)}><IconTrash size={17} /></Button>
      </div>
    )},
  ];

  const filtered = useMemo(() => categories.filter(category => `${category.name} ${category.slug}`.toLowerCase().includes(search.toLowerCase())), [categories, search]);
  const assignedProducts = useMemo(() => managing ? categoryProducts.filter(product => product.category === managing.name) : [], [categoryProducts, managing]);
  const availableProducts = useMemo(() => {
    const term = productSearch.trim().toLowerCase();
    return managing ? categoryProducts.filter(product => product.category !== managing.name && (!term || `${product.name} ${product.sku} ${product.category}`.toLowerCase().includes(term))) : [];
  }, [categoryProducts, managing, productSearch]);

  const toggleProduct = (id: string) => setSelectedProductIds(current => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

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

      <Modal isOpen={!!managing} onClose={() => setManaging(null)} title={`Sản phẩm trong ${managing?.name ?? "danh mục"}`} maxWidth="4xl"
        footer={<div className="flex flex-col-reverse items-stretch justify-between gap-3 sm:flex-row sm:items-center"><p className="text-xs text-[var(--admin-text-muted)]">Gỡ khỏi danh mục không xóa sản phẩm khỏi cửa hàng.</p><div className="flex justify-end gap-3"><Button variant="secondary" onClick={() => setManaging(null)}>Đóng</Button><Button disabled={!selectedProductIds.size} isLoading={assignmentSaving} leftIcon={<IconPlus size={17} />} onClick={() => void addSelectedProducts()}>Thêm {selectedProductIds.size ? `${selectedProductIds.size} ` : ""}sản phẩm</Button></div></div>}>
        {productsLoading ? <div className="py-20 text-center text-sm text-[var(--admin-text-muted)]">Đang tải danh sách sản phẩm...</div> : <div className="grid gap-8 lg:grid-cols-2">
          <section className="min-w-0">
            <div className="mb-4 flex items-center justify-between gap-3"><div><h3 className="font-bold text-[var(--admin-text-base)]">Đang thuộc danh mục</h3><p className="mt-1 text-xs text-[var(--admin-text-muted)]">{assignedProducts.length} sản phẩm</p></div></div>
            <div className="max-h-[520px] divide-y divide-[var(--admin-border-light)] overflow-y-auto border-y border-[var(--admin-border-base)]">
              {assignedProducts.length ? assignedProducts.map(product => <div key={product.id} className="flex items-center gap-3 py-3">
                <div className="grid h-16 w-12 shrink-0 place-items-center overflow-hidden bg-[var(--admin-bg-elevated)]">{product.image ? <img src={product.image} alt={product.name} className="h-full w-full object-cover" /> : <IconPackage size={20} className="text-[var(--admin-text-subtle)]" />}</div>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-[var(--admin-text-base)]">{product.name}</p><p className="mt-1 text-xs text-[var(--admin-text-muted)]">SKU: {product.sku || "Chưa có"} · Tồn: {product.stock}</p><p className="mt-1 text-xs font-semibold text-[var(--admin-primary)]">{formatMoney(product.price)}</p></div>
                <Button variant="ghost" size="icon-sm" isLoading={removingProductId === product.id} disabled={!!removingProductId} className="text-[var(--admin-danger)]" title="Gỡ khỏi danh mục" aria-label={`Gỡ ${product.name} khỏi danh mục`} onClick={() => void removeFromCategory(product)}><IconTrash size={16} /></Button>
              </div>) : <div className="py-14 text-center"><IconPackage size={30} className="mx-auto text-[var(--admin-text-subtle)]" /><p className="mt-3 text-sm font-semibold text-[var(--admin-text-base)]">Danh mục chưa có sản phẩm</p><p className="mt-1 text-xs text-[var(--admin-text-muted)]">Chọn sản phẩm ở cột bên cạnh để thêm.</p></div>}
            </div>
          </section>

          <section className="min-w-0 border-t border-[var(--admin-border-base)] pt-7 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <div className="mb-4"><h3 className="font-bold text-[var(--admin-text-base)]">Thêm sản phẩm</h3><p className="mt-1 text-xs text-[var(--admin-text-muted)]">Sản phẩm đang ở danh mục khác sẽ được chuyển sang {managing?.name}.</p></div>
            <Input label="Tìm theo tên, SKU hoặc danh mục" value={productSearch} onChange={event => setProductSearch(event.target.value)} />
            <div className="mt-4 max-h-[450px] divide-y divide-[var(--admin-border-light)] overflow-y-auto border-y border-[var(--admin-border-base)]">
              {availableProducts.length ? availableProducts.map(product => <label key={product.id} className="flex cursor-pointer items-center gap-3 py-3 transition-colors hover:bg-[var(--admin-bg-hover)]">
                <input type="checkbox" checked={selectedProductIds.has(product.id)} onChange={() => toggleProduct(product.id)} className="h-4 w-4 shrink-0 accent-[var(--admin-primary)]" />
                <div className="grid h-14 w-11 shrink-0 place-items-center overflow-hidden bg-[var(--admin-bg-elevated)]">{product.image ? <img src={product.image} alt={product.name} className="h-full w-full object-cover" /> : <IconPackage size={18} className="text-[var(--admin-text-subtle)]" />}</div>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-[var(--admin-text-base)]">{product.name}</p><p className="mt-1 truncate text-xs text-[var(--admin-text-muted)]">{product.sku || "Chưa có SKU"}{product.category ? ` · Đang ở: ${product.category}` : " · Chưa phân loại"}</p></div>
                <span className="shrink-0 text-xs font-semibold text-[var(--admin-text-base)]">{formatMoney(product.price)}</span>
              </label>) : <p className="py-12 text-center text-sm text-[var(--admin-text-muted)]">Không tìm thấy sản phẩm phù hợp.</p>}
            </div>
          </section>
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

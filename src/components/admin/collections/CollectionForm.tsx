"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { IconArrowRight, IconDeviceFloppy, IconPackage, IconPlus, IconTrash } from "@tabler/icons-react";
import { Button } from "@/components/admin/design-system/Button";
import { Card } from "@/components/admin/design-system/Card";
import { Input } from "@/components/admin/design-system/Input";
import { ImageUpload } from "@/components/admin/ui/ImageUpload";
import { ProductService } from "@/lib/services/product.service";
import { Collection, CollectionRule, CollectionService } from "@/lib/services/collection.service";
import type { Product } from "@/data/mock/products";

type CollectionDraft = Omit<Collection, "id" | "createdAt" | "updatedAt"> & { id?: string };

const emptyDraft = (): CollectionDraft => ({
  name: "",
  slug: "",
  description: "",
  type: "manual",
  image: "",
  matchType: "any",
  rules: [],
  productIds: [],
  status: "draft",
});

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Đã xảy ra lỗi. Vui lòng thử lại.";
}

export function CollectionForm({ initialData }: { initialData?: Collection }) {
  const router = useRouter();
  const [draft, setDraft] = useState<CollectionDraft>(() => initialData ?? emptyDraft());
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    ProductService.getProducts()
      .then(setProducts)
      .catch((error) => toast.error(`Không thể tải sản phẩm: ${errorMessage(error)}`));
  }, []);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return products;
    return products.filter((product) => `${product.name} ${product.sku} ${product.category}`.toLowerCase().includes(term));
  }, [products, search]);

  const selectedProductIds = new Set(draft.productIds);
  const toggleProduct = (id: string) => {
    setDraft((current) => {
      const next = new Set(current.productIds);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { ...current, productIds: Array.from(next) };
    });
  };

  const handleNameChange = (name: string) => {
    setDraft((current) => {
      const previousAutoSlug = slugify(current.name);
      const shouldUpdateSlug = !current.slug || current.slug === previousAutoSlug;
      return { ...current, name, slug: shouldUpdateSlug ? slugify(name) : current.slug };
    });
  };

  const save = async () => {
    const name = draft.name.trim();
    const slug = slugify(draft.slug);
    if (!name) return toast.error("Vui lòng nhập tên bộ sưu tập.");
    if (!slug) return toast.error("Vui lòng nhập đường dẫn bộ sưu tập.");
    if (draft.type === "automatic" && !draft.rules.length) return toast.error("Bộ sưu tập tự động phải có ít nhất một điều kiện.");
    if (draft.type === "automatic" && draft.rules.some((rule) => !rule.value.trim())) return toast.error("Vui lòng nhập giá trị cho tất cả điều kiện.");

    setSaving(true);
    try {
      const payload = { ...draft, name, slug };
      if (draft.id) await CollectionService.updateCollection(draft.id, payload);
      else await CollectionService.createCollection(payload);
      toast.success(draft.id ? "Đã cập nhật bộ sưu tập." : "Đã tạo bộ sưu tập.");
      router.push("/admin/collections");
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button type="button" variant="ghost" className="px-2" leftIcon={<IconArrowRight size={20} />} onClick={() => router.push("/admin/collections")} />
          <div>
            <h1 className="text-xl font-bold text-[var(--admin-text-base)]">{draft.id ? "Chỉnh sửa bộ sưu tập" : "Thêm bộ sưu tập"}</h1>
            <p className="mt-1 text-sm text-[var(--admin-text-muted)]">Nhóm sản phẩm để dùng cho merchandising, banner và điều hướng.</p>
          </div>
        </div>
        <Button type="button" isLoading={saving} leftIcon={<IconDeviceFloppy size={18} />} onClick={() => void save()}>
          Lưu bộ sưu tập
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card className="space-y-5 p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Tên bộ sưu tập" value={draft.name} onChange={(event) => handleNameChange(event.target.value)} />
            <Input label="Đường dẫn" value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: slugify(event.target.value) })} hint="Ví dụ: office-essentials" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--admin-text-muted)]">Mô tả</label>
            <textarea
              rows={4}
              value={draft.description}
              onChange={(event) => setDraft({ ...draft, description: event.target.value })}
              className="w-full border border-[var(--admin-border-base)] bg-[var(--admin-bg-surface)] p-3 text-sm text-[var(--admin-text-base)] outline-none focus:border-[var(--admin-primary)]"
            />
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold text-[var(--admin-text-muted)]">Ảnh bộ sưu tập</p>
            <ImageUpload label="Tải ảnh bộ sưu tập" images={draft.image ? [draft.image] : []} onChange={(images) => setDraft({ ...draft, image: images[0] ?? "" })} />
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="space-y-4 p-5">
            <h2 className="border-b border-[var(--admin-border-light)] pb-2 text-sm font-bold text-[var(--admin-text-base)]">Cài đặt</h2>
            <label className="flex flex-col gap-1 text-xs font-semibold text-[var(--admin-text-muted)]">
              Trạng thái
              <select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as CollectionDraft["status"] })} className="h-11 border border-[var(--admin-border-base)] bg-[var(--admin-bg-surface)] px-3 text-sm text-[var(--admin-text-base)] outline-none focus:border-[var(--admin-primary)]">
                <option value="draft">Nháp</option>
                <option value="active">Đang hiển thị</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-[var(--admin-text-muted)]">
              Kiểu bộ sưu tập
              <select value={draft.type} onChange={(event) => setDraft({ ...draft, type: event.target.value as CollectionDraft["type"] })} className="h-11 border border-[var(--admin-border-base)] bg-[var(--admin-bg-surface)] px-3 text-sm text-[var(--admin-text-base)] outline-none focus:border-[var(--admin-primary)]">
                <option value="manual">Thủ công</option>
                <option value="automatic">Tự động</option>
              </select>
            </label>
          </Card>

          <Card className="space-y-4 p-5">
            <div className="flex items-center justify-between gap-3 border-b border-[var(--admin-border-light)] pb-2">
              <h2 className="text-sm font-bold text-[var(--admin-text-base)]">Sản phẩm</h2>
              <span className="text-xs font-semibold text-[var(--admin-primary)]">{draft.type === "manual" ? `${draft.productIds.length} đã chọn` : `${draft.rules.length} điều kiện`}</span>
            </div>
            {draft.type === "automatic" ? <AutomaticRules draft={draft} setDraft={setDraft} /> : <>
            <Input label="Tìm sản phẩm" value={search} onChange={(event) => setSearch(event.target.value)} />
            <div className="max-h-[420px] divide-y divide-[var(--admin-border-light)] overflow-y-auto border-y border-[var(--admin-border-base)]">
              {filteredProducts.length ? filteredProducts.map((product) => (
                <label key={product.id} className="flex cursor-pointer items-center gap-3 py-3 hover:bg-[var(--admin-bg-hover)]">
                  <input type="checkbox" checked={selectedProductIds.has(product.id)} onChange={() => toggleProduct(product.id)} className="h-4 w-4 shrink-0 accent-[var(--admin-primary)]" />
                  <div className="grid h-12 w-10 shrink-0 place-items-center overflow-hidden bg-[var(--admin-bg-elevated)]">
                    {product.images?.[0] ? <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" /> : <IconPackage size={18} className="text-[var(--admin-text-subtle)]" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[var(--admin-text-base)]">{product.name}</p>
                    <p className="mt-1 truncate text-xs text-[var(--admin-text-muted)]">{product.sku || "Chưa có SKU"} · {product.category || "Chưa phân loại"}</p>
                  </div>
                </label>
              )) : <p className="py-10 text-center text-sm text-[var(--admin-text-muted)]">Không có sản phẩm phù hợp.</p>}
            </div>
            </>}
          </Card>
        </div>
      </div>
    </div>
  );
}

function AutomaticRules({ draft, setDraft }: { draft: CollectionDraft; setDraft: React.Dispatch<React.SetStateAction<CollectionDraft>> }) {
  const addRule = () => setDraft((current) => ({
    ...current,
    rules: [...current.rules, { field: "tag", operator: "contains", value: "" }],
  }));
  const updateRule = (index: number, updates: Partial<CollectionRule>) => setDraft((current) => ({
    ...current,
    rules: current.rules.map((rule, ruleIndex) => ruleIndex === index ? { ...rule, ...updates } : rule),
  }));
  const removeRule = (index: number) => setDraft((current) => ({ ...current, rules: current.rules.filter((_, ruleIndex) => ruleIndex !== index) }));

  return <div className="space-y-4">
    <label className="flex flex-col gap-1 text-xs font-semibold text-[var(--admin-text-muted)]">
      Cách khớp điều kiện
      <select value={draft.matchType} onChange={(event) => setDraft((current) => ({ ...current, matchType: event.target.value as CollectionDraft["matchType"] }))} className="h-10 border border-[var(--admin-border-base)] bg-[var(--admin-bg-surface)] px-3 text-sm">
        <option value="all">Khớp tất cả điều kiện</option>
        <option value="any">Khớp ít nhất một điều kiện</option>
      </select>
    </label>
    <div className="space-y-3">
      {draft.rules.map((rule, index) => <div key={index} className="grid gap-2 border border-[var(--admin-border-base)] p-3 sm:grid-cols-[1fr_1fr_1fr_auto]">
        <select value={rule.field} onChange={(event) => updateRule(index, { field: event.target.value as CollectionRule["field"] })} className="h-10 border border-[var(--admin-border-base)] bg-[var(--admin-bg-surface)] px-2 text-sm">
          <option value="title">Tên sản phẩm</option><option value="tag">Thẻ</option><option value="price">Giá</option><option value="inventory">Tồn kho</option>
        </select>
        <select value={rule.operator} onChange={(event) => updateRule(index, { operator: event.target.value as CollectionRule["operator"] })} className="h-10 border border-[var(--admin-border-base)] bg-[var(--admin-bg-surface)] px-2 text-sm">
          <option value="equals">Bằng</option><option value="not_equals">Không bằng</option><option value="contains">Có chứa</option><option value="greater_than">Lớn hơn</option><option value="less_than">Nhỏ hơn</option>
        </select>
        <input value={rule.value} type={rule.field === "price" || rule.field === "inventory" ? "number" : "text"} onChange={(event) => updateRule(index, { value: event.target.value })} placeholder="Giá trị" className="h-10 border border-[var(--admin-border-base)] bg-[var(--admin-bg-surface)] px-3 text-sm outline-none focus:border-[var(--admin-primary)]" />
        <Button type="button" variant="ghost" size="icon-sm" className="text-[var(--admin-danger)]" aria-label="Xóa điều kiện" onClick={() => removeRule(index)}><IconTrash size={16} /></Button>
      </div>)}
    </div>
    <Button type="button" variant="secondary" size="sm" leftIcon={<IconPlus size={15} />} onClick={addRule}>Thêm điều kiện</Button>
    <p className="text-xs text-[var(--admin-text-muted)]">Sản phẩm trên website được tự động tính lại theo các điều kiện này.</p>
  </div>;
}

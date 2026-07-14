import { createClient } from "@/lib/supabase/client";
import { eventBus } from "@/lib/events/EventBus";

export interface CategorySEO { title: string; description: string; }
export interface Category {
  id: string; name: string; slug: string; description: string; thumbnail: string; banner: string;
  parentId?: string; isFeatured: boolean; showOnHomepage: boolean; showInMenu: boolean;
  sortOrder: number; status: "active" | "draft" | "archived"; seo: CategorySEO;
  deletedAt?: string; createdAt: string; updatedAt: string;
}

export interface CategoryProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: string;
  image: string;
}

function mapCategoryProduct(row: Record<string, unknown>): CategoryProduct {
  const images = (row.product_images ?? []) as Array<Record<string, unknown>>;
  const firstImage = [...images].sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0))[0];
  return {
    id: String(row.id),
    name: String(row.name ?? ""),
    sku: String(row.sku ?? ""),
    category: String(row.category ?? ""),
    price: Number(row.price ?? 0),
    stock: Number(row.stock ?? 0),
    status: String(row.status ?? "draft"),
    image: String(firstImage?.url ?? ""),
  };
}

function map(row: Record<string, unknown>): Category {
  return {
    id: String(row.id), name: String(row.name), slug: String(row.slug), description: String(row.description ?? ""),
    thumbnail: String(row.image_url ?? ""), banner: String(row.banner_url ?? row.image_url ?? ""),
    isFeatured: Boolean(row.is_featured), showOnHomepage: Boolean(row.show_on_homepage), showInMenu: Boolean(row.show_in_menu),
    sortOrder: Number(row.sort_order ?? 0), status: row.is_active ? "active" : "draft",
    seo: { title: String((row.seo as Record<string, unknown> | null)?.title ?? ""), description: String((row.seo as Record<string, unknown> | null)?.description ?? "") },
    createdAt: String(row.created_at), updatedAt: String(row.updated_at),
  };
}
function row(data: Partial<Category>) {
  return Object.fromEntries(Object.entries({
    name: data.name, slug: data.slug, description: data.description, image_url: data.thumbnail,
    banner_url: data.banner, is_featured: data.isFeatured, show_on_homepage: data.showOnHomepage,
    show_in_menu: data.showInMenu, sort_order: data.sortOrder,
    is_active: data.status ? data.status === "active" : undefined, seo: data.seo,
  }).filter(([, value]) => value !== undefined));
}

export const CategoryService = {
  async getCategories(): Promise<Category[]> { const { data, error } = await createClient().from("categories").select("*").order("sort_order"); if (error) throw new Error(error.message); return (data ?? []).map(map); },
  async getCategory(id: string) { const { data, error } = await createClient().from("categories").select("*").eq("id", id).maybeSingle(); if (error) throw new Error(error.message); return data ? map(data) : null; },
  async createCategory(input: Omit<Category, "id" | "createdAt" | "updatedAt">) { const { data, error } = await createClient().from("categories").insert(row(input)).select("*").single(); if (error) throw new Error(error.message); const category = map(data); eventBus.emit("categories.changed"); return category; },
  async updateCategory(id: string, input: Partial<Category>) {
    const supabase = createClient();
    const { data, error } = await supabase.rpc("update_category_with_products", {
      category_id: id,
      category_payload: input,
    });
    if (error?.code === "PGRST202") {
      const current = await this.getCategory(id);
      const { data: fallbackData, error: updateError } = await supabase.from("categories").update(row(input)).eq("id", id).select("*").single();
      if (updateError) throw new Error(updateError.message);
      if (current && input.name && input.name !== current.name) {
        const { error: productError } = await supabase.from("products").update({ category: input.name }).eq("category", current.name);
        if (productError) throw new Error(`Danh mục đã đổi tên nhưng chưa thể cập nhật sản phẩm: ${productError.message}`);
      }
      const category = map(fallbackData); eventBus.emit("categories.changed"); return category;
    }
    if (error) throw new Error(error.message);
    const category = map(data as Record<string, unknown>); eventBus.emit("categories.changed"); return category;
  },
  async getUsageCount(categoryName: string) {
    const { count, error } = await createClient().from("products").select("id", { count: "exact", head: true }).eq("category", categoryName);
    if (error) throw new Error(error.message);
    return count ?? 0;
  },
  async getProductsForAssignment(): Promise<CategoryProduct[]> {
    const { data, error } = await createClient()
      .from("products")
      .select("id,name,sku,category,price,stock,status,product_images(url,sort_order)")
      .order("name");
    if (error) throw new Error(error.message);
    return ((data ?? []) as Array<Record<string, unknown>>).map(mapCategoryProduct);
  },
  async assignProducts(categoryName: string, productIds: string[]) {
    if (!productIds.length) return;
    const { error } = await createClient().from("products").update({ category: categoryName }).in("id", productIds);
    if (error) throw new Error(error.message);
    eventBus.emit("products.changed");
  },
  async removeProductFromCategory(productId: string) {
    const { error } = await createClient().from("products").update({ category: "" }).eq("id", productId);
    if (error) throw new Error(error.message);
    eventBus.emit("products.changed");
  },
  async softDelete(id: string) { const { error } = await createClient().from("categories").update({ is_active: false }).eq("id", id); if (error) throw new Error(error.message); eventBus.emit("categories.changed"); },
  async restore(id: string) { const { error } = await createClient().from("categories").update({ is_active: true }).eq("id", id); if (error) throw new Error(error.message); eventBus.emit("categories.changed"); },
  async hardDelete(id: string) {
    const supabase = createClient();
    const { error } = await supabase.rpc("delete_category_safely", { category_id: id });
    if (error?.code === "PGRST202") {
      const category = await this.getCategory(id);
      if (!category) throw new Error("Không tìm thấy danh mục.");
      if (await this.getUsageCount(category.name)) throw new Error("Danh mục đang có sản phẩm và không thể xóa.");
      const { error: deleteError } = await supabase.from("categories").delete().eq("id", id);
      if (deleteError) throw new Error(deleteError.message);
      return;
    }
    if (error) throw new Error(error.message);
    eventBus.emit("categories.changed");
  },
};

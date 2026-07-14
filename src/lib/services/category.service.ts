import { createClient } from "@/lib/supabase/client";

export interface CategorySEO { title: string; description: string; }
export interface Category {
  id: string; name: string; slug: string; description: string; thumbnail: string; banner: string;
  parentId?: string; isFeatured: boolean; showOnHomepage: boolean; showInMenu: boolean;
  sortOrder: number; status: "active" | "draft" | "archived"; seo: CategorySEO;
  deletedAt?: string; createdAt: string; updatedAt: string;
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
function row(data: Partial<Category>) { return { name: data.name, slug: data.slug, description: data.description, image_url: data.thumbnail, banner_url: data.banner, is_featured: data.isFeatured, show_on_homepage: data.showOnHomepage, show_in_menu: data.showInMenu, sort_order: data.sortOrder, is_active: data.status === "active", seo: data.seo }; }

export const CategoryService = {
  async getCategories(): Promise<Category[]> { const { data, error } = await createClient().from("categories").select("*").order("sort_order"); if (error) throw new Error(error.message); return (data ?? []).map(map); },
  async getCategory(id: string) { const { data, error } = await createClient().from("categories").select("*").eq("id", id).maybeSingle(); if (error) throw new Error(error.message); return data ? map(data) : null; },
  async createCategory(input: Omit<Category, "id" | "createdAt" | "updatedAt">) { const { data, error } = await createClient().from("categories").insert(row(input)).select("*").single(); if (error) throw new Error(error.message); return map(data); },
  async updateCategory(id: string, input: Partial<Category>) { const { data, error } = await createClient().from("categories").update(row(input)).eq("id", id).select("*").single(); if (error) throw new Error(error.message); return map(data); },
  async softDelete(id: string) { const { error } = await createClient().from("categories").update({ is_active: false }).eq("id", id); if (error) throw new Error(error.message); },
  async restore(id: string) { const { error } = await createClient().from("categories").update({ is_active: true }).eq("id", id); if (error) throw new Error(error.message); },
  async hardDelete(id: string) { const { error } = await createClient().from("categories").delete().eq("id", id); if (error) throw new Error(error.message); },
};

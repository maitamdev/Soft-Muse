import { createClient } from "@/lib/supabase/client";
import { eventBus } from "@/lib/events/EventBus";

export interface CollectionRule { field: "title" | "tag" | "price" | "inventory"; operator: "equals" | "not_equals" | "greater_than" | "less_than" | "contains"; value: string; }
export interface Collection { id: string; name: string; slug: string; description: string; type: "manual" | "automatic"; image: string; matchType: "all" | "any"; rules: CollectionRule[]; productIds: string[]; status: "active" | "draft" | "archived"; deletedAt?: string; createdAt: string; updatedAt: string; }

function map(row: Record<string, unknown>): Collection { return { id: String(row.id), name: String(row.name), slug: String(row.slug), description: String(row.description ?? ""), type: String(row.collection_type ?? "manual") as Collection["type"], image: String(row.image_url ?? ""), matchType: String(row.match_type ?? "any") as Collection["matchType"], rules: (row.rules as CollectionRule[] | null) ?? [], productIds: (row.product_ids as string[] | null) ?? [], status: row.is_active ? "active" : "draft", createdAt: String(row.created_at), updatedAt: String(row.updated_at) }; }
function row(data: Partial<Collection>) { return { name: data.name, slug: data.slug, description: data.description, collection_type: data.type, image_url: data.image, match_type: data.matchType, rules: data.rules, product_ids: data.productIds, is_active: data.status === "active" }; }

export const CollectionService = {
  async getCollections(): Promise<Collection[]> { const { data, error } = await createClient().from("collections").select("*").order("created_at", { ascending: false }); if (error) throw new Error(error.message); return (data ?? []).map(map); },
  async getCollection(id: string) { const { data, error } = await createClient().from("collections").select("*").eq("id", id).maybeSingle(); if (error) throw new Error(error.message); return data ? map(data) : null; },
  async createCollection(input: Omit<Collection, "id" | "createdAt" | "updatedAt">) { const { data, error } = await createClient().from("collections").insert(row(input)).select("*").single(); if (error) throw new Error(error.message); const collection = map(data); eventBus.emit("collections.changed"); return collection; },
  async updateCollection(id: string, input: Partial<Collection>) { const { data, error } = await createClient().from("collections").update(row(input)).eq("id", id).select("*").single(); if (error) throw new Error(error.message); const collection = map(data); eventBus.emit("collections.changed"); return collection; },
  async softDelete(id: string) { const { error } = await createClient().from("collections").update({ is_active: false }).eq("id", id); if (error) throw new Error(error.message); eventBus.emit("collections.changed"); },
  async hardDelete(id: string) { const { error } = await createClient().from("collections").delete().eq("id", id); if (error) throw new Error(error.message); eventBus.emit("collections.changed"); },
};

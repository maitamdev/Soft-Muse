import type { Product, ProductStatus } from "@/data/mock/products";
import type { IProductRepository } from "@/lib/contracts/IProductRepository";
import { eventBus } from "@/lib/events/EventBus";
import { createClient } from "@/lib/supabase/client";
import { mapProductRow, productSelect, productToRow } from "@/lib/supabase/product-mapper";

export interface ProductFilters {
  search?: string;
  category?: string;
  collection?: string;
  season?: string;
  status?: string;
  stockStatus?: "in_stock" | "low_stock" | "out_of_stock" | "all";
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

class SupabaseProductRepository implements IProductRepository {
  getProfitMargin(price: number, costPrice: number): number {
    if (price <= 0) return 0;
    return Number((((price - Math.max(0, costPrice)) / price) * 100).toFixed(2));
  }

  getDiscountPercentage(price: number, comparePrice: number): number {
    if (price <= 0 || comparePrice <= price) return 0;
    return Number((((comparePrice - price) / comparePrice) * 100).toFixed(0));
  }

  getStockStatus(stock: number, lowStockLimit: number) {
    if (stock <= 0) return "out_of_stock" as const;
    if (stock <= lowStockLimit) return "low_stock" as const;
    return "in_stock" as const;
  }

  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    const supabase = createClient();
    let query = supabase.from("products").select(productSelect).order("created_at", { ascending: false });

    if (filters?.search) query = query.or(`name.ilike.%${filters.search}%,sku.ilike.%${filters.search}%`);
    if (filters?.category && filters.category !== "all") query = query.eq("category", filters.category);
    if (filters?.collection && filters.collection !== "all") query = query.eq("collection", filters.collection);
    if (filters?.season && filters.season !== "all") query = query.eq("season", filters.season);
    if (filters?.status && filters.status !== "all") query = query.eq("status", filters.status);
    if (filters?.featured !== undefined) query = query.eq("featured", filters.featured);
    if (filters?.minPrice !== undefined) query = query.gte("price", filters.minPrice);
    if (filters?.maxPrice !== undefined) query = query.lte("price", filters.maxPrice);

    const { data, error } = await query;
    if (error) throw new Error(`Không thể tải sản phẩm: ${error.message}`);
    let products = ((data ?? []) as Array<Record<string, unknown>>).map((row) => mapProductRow(row));
    if (filters?.stockStatus && filters.stockStatus !== "all") {
      products = products.filter(
        (product: Product) => this.getStockStatus(product.stock, product.lowStockLimit) === filters.stockStatus,
      );
    }
    return products;
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const { data, error } = await createClient().from("products").select(productSelect).eq("id", id).maybeSingle();
    if (error) throw new Error(`Không thể tải sản phẩm: ${error.message}`);
    return data ? mapProductRow(data) : undefined;
  }

  async createProduct(input: Omit<Product, "id">): Promise<Product> {
    const supabase = createClient();
    const { data, error } = await supabase.from("products").insert(productToRow(input)).select("id").single();
    if (error) throw new Error(`Không thể tạo sản phẩm: ${error.message}`);

    try {
      await this.replaceRelations(data.id, input);
    } catch (relationError) {
      await supabase.from("products").delete().eq("id", data.id);
      throw relationError;
    }

    const product = await this.getProduct(data.id);
    if (!product) throw new Error("Sản phẩm vừa tạo không thể tải lại.");
    eventBus.emit("products.changed");
    return product;
  }

  async updateProduct(id: string, input: Partial<Product>): Promise<Product> {
    const supabase = createClient();
    const current = await this.getProduct(id);
    if (!current) throw new Error("Không tìm thấy sản phẩm.");
    const merged = { ...current, ...input } as Product;
    const { error } = await supabase.from("products").update(productToRow(merged)).eq("id", id);
    if (error) throw new Error(`Không thể cập nhật sản phẩm: ${error.message}`);
    await this.replaceRelations(id, merged);
    const product = await this.getProduct(id);
    if (!product) throw new Error("Không thể tải sản phẩm sau khi cập nhật.");
    eventBus.emit("products.changed");
    return product;
  }

  private async replaceRelations(productId: string, product: Partial<Product>) {
    const supabase = createClient();
    const { error } = await supabase.rpc("replace_product_relations", {
      target_product_id: productId,
      image_payload: (product.images ?? []).map((url, sortOrder) => ({ url, altText: product.name ?? "", sortOrder })),
      variant_payload: (product.variants ?? []).map((variant) => ({
        sku: variant.sku, color: variant.color, size: variant.size, price: variant.price,
        cost: variant.cost ?? 0, stock: variant.stock, weight: variant.weight ?? 0,
        image: variant.image ?? null, status: variant.status ?? "active",
      })),
    });
    if (error) throw new Error(`Không thể lưu ảnh và biến thể: ${error.message}`);
  }

  async deleteProduct(id: string): Promise<void> {
    const { error } = await createClient().from("products").update({ status: "archived" }).eq("id", id);
    if (error) throw new Error(`Không thể lưu trữ sản phẩm: ${error.message}`);
    eventBus.emit("products.changed");
  }

  async duplicateProduct(id: string): Promise<Product> {
    const source = await this.getProduct(id);
    if (!source) throw new Error("Không tìm thấy sản phẩm.");
    const suffix = Date.now().toString().slice(-6);
    const { id: _id, ...copy } = source;
    return this.createProduct({ ...copy, name: `${source.name} (Bản sao)`, slug: `${source.slug}-${suffix}`, sku: `${source.sku}-${suffix}`, status: "draft" });
  }

  async deleteMultiple(ids: string[]): Promise<void> {
    const { error } = await createClient().from("products").update({ status: "archived" }).in("id", ids);
    if (error) throw new Error(`Không thể lưu trữ sản phẩm: ${error.message}`);
    eventBus.emit("products.changed");
  }

  async bulkUpdateStatus(ids: string[], status: ProductStatus): Promise<void> {
    const safeStatus = ["draft", "published", "hidden", "archived"].includes(status) ? status : "draft";
    const { error } = await createClient().from("products").update({ status: safeStatus }).in("id", ids);
    if (error) throw new Error(`Không thể cập nhật trạng thái: ${error.message}`);
    eventBus.emit("products.changed");
  }

  async bulkUpdateCategory(ids: string[], category: string): Promise<void> {
    const { error } = await createClient().from("products").update({ category }).in("id", ids);
    if (error) throw new Error(`Không thể cập nhật danh mục: ${error.message}`);
    eventBus.emit("products.changed");
  }
}

export const ProductService = new SupabaseProductRepository();

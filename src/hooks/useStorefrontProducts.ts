"use client";

import { useCallback, useEffect, useState } from "react";
import type { Product } from "@/data/mock/products";
import { ProductService } from "@/lib/services/product.service";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export function useStorefrontProducts(): Product[] {
  const [products, setProducts] = useState<Product[]>([]);

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    try {
      setProducts(await ProductService.getProducts({ status: "published" }));
    } catch (error) {
      console.error(error);
      setProducts([]);
    }
  }, []);

  useEffect(() => {
    void load();
    if (!isSupabaseConfigured) return;

    const channel = createClient()
      .channel("storefront-products")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "product_images" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "product_variants" }, load)
      .subscribe();

    return () => {
      void createClient().removeChannel(channel);
    };
  }, [load]);

  return products;
}

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

    const supabase = createClient();
    const channel = supabase.channel(`storefront-products:${crypto.randomUUID()}`);

    channel.on("postgres_changes", { event: "*", schema: "public", table: "products" }, load);
    channel.on("postgres_changes", { event: "*", schema: "public", table: "product_images" }, load);
    channel.on("postgres_changes", { event: "*", schema: "public", table: "product_variants" }, load);
    channel.subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [load]);

  return products;
}

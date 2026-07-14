"use client";

import { useCallback, useEffect, useState } from "react";
import type { Product } from "@/data/mock/products";
import { ProductService } from "@/lib/services/product.service";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { useEventSubscribeMany } from "@/hooks/useEventBus";

export function useStorefrontProductsState(): { products: Product[]; loading: boolean; loadedSuccessfully: boolean } {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadedSuccessfully, setLoadedSuccessfully] = useState(false);

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    try {
      const now = Date.now();
      const published = await ProductService.getProducts({ status: "published" });
      setProducts(published.filter((product) =>
        (!product.publishAt || new Date(product.publishAt).getTime() <= now)
        && (!product.hideAt || new Date(product.hideAt).getTime() > now),
      ));
      setLoadedSuccessfully(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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

    const refreshWhenVisible = () => { if (document.visibilityState === "visible") void load(); };
    window.addEventListener("focus", load);
    document.addEventListener("visibilitychange", refreshWhenVisible);

    return () => {
      window.removeEventListener("focus", load);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
      void supabase.removeChannel(channel);
    };
  }, [load]);

  useEventSubscribeMany(["products.changed", "inventory.changed"], load);

  return { products, loading, loadedSuccessfully };
}

export function useStorefrontProducts(): Product[] {
  return useStorefrontProductsState().products;
}

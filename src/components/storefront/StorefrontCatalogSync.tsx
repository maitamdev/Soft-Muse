"use client";

import { useEffect } from "react";
import { useStorefrontProductsState } from "@/hooks/useStorefrontProducts";
import { useStore } from "@/context/StoreContext";

export function StorefrontCatalogSync() {
  const { products, loading, loadedSuccessfully } = useStorefrontProductsState();
  const { syncCatalog } = useStore();
  useEffect(() => {
    if (!loading && loadedSuccessfully) syncCatalog(products);
  }, [loading, loadedSuccessfully, products, syncCatalog]);
  return null;
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { Category, CategoryService } from "@/lib/services/category.service";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export function useStorefrontCategories(): Category[] {
  const [categories, setCategories] = useState<Category[]>([]);

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    try {
      const data = await CategoryService.getCategories();
      setCategories(data.filter((category) => category.status === "active"));
    } catch (error) {
      console.error(error);
      setCategories([]);
    }
  }, []);

  useEffect(() => {
    void load();
    if (!isSupabaseConfigured) return;

    const supabase = createClient();
    const channel = supabase.channel(`storefront-categories:${crypto.randomUUID()}`);

    channel.on("postgres_changes", { event: "*", schema: "public", table: "categories" }, load);
    channel.subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [load]);

  return categories;
}

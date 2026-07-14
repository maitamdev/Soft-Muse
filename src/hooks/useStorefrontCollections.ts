"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { CollectionDisplayService, type MerchandisedCollection } from "@/lib/services/storefront/collection-display.service";
import { useEventSubscribeMany } from "@/hooks/useEventBus";

export function useStorefrontCollections(): MerchandisedCollection[] {
  const [collections, setCollections] = useState<MerchandisedCollection[]>([]);

  const load = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    try {
      const data = await CollectionDisplayService.getMerchandised();
      setCollections(data.filter((collection) => collection.status === "active" && collection.display.visible));
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    void load();
    if (!isSupabaseConfigured) return;
    const supabase = createClient();
    const channel = supabase.channel(`storefront-collections:${crypto.randomUUID()}`);
    channel.on("postgres_changes", { event: "*", schema: "public", table: "collections" }, load);
    channel.on("postgres_changes", { event: "*", schema: "public", table: "site_settings", filter: "key=eq.storefront.collections" }, load);
    channel.subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [load]);

  useEventSubscribeMany(["collections.changed", "storefront.collections.updated", "storefront.collections.reordered"], load);
  return collections;
}

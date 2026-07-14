"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { eventBus } from "@/lib/events/EventBus";

export function StorefrontRealtimeBridge() {
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const supabase = createClient();
    const channel = supabase.channel(`storefront-settings:${crypto.randomUUID()}`);
    channel.on("postgres_changes", { event: "*", schema: "public", table: "site_settings" }, () => {
      eventBus.emit("website.changed");
    });
    channel.on("postgres_changes", { event: "*", schema: "public", table: "reviews" }, () => {
      eventBus.emit("reviews.changed");
    });
    channel.subscribe();
    const refresh = () => eventBus.emit("website.changed");
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      void supabase.removeChannel(channel);
    };
  }, []);
  return null;
}

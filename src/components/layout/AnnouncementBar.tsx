"use client";

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { StoreService, AnnouncementBarSettings } from '@/lib/services/storefront/store.service';
import { useEventSubscribeMany } from '@/hooks/useEventBus';

/**
 * AnnouncementBar — full-width banner above the Navbar.
 * Controlled entirely by StoreService.announcementBar (set in the admin
 * Store Settings page). Hides itself when disabled or when text is empty.
 */
export function AnnouncementBar() {
  const [bar, setBar] = useState<AnnouncementBarSettings | null>(
    () => StoreService.getInfoSync().announcementBar ?? null
  );

  const load = useCallback(async () => {
    try {
      const info = await StoreService.getInfo();
      setBar(info.announcementBar ?? null);
    } catch {
      // keep null — bar stays hidden
    }
  }, []);

  // Initial value is seeded synchronously above; only live CMS edits need a re-fetch.
  useEventSubscribeMany(['website.changed'], load);

  if (!bar?.enabled || !bar.text.trim()) return null;

  const inner = (
    <span className="font-sans text-xs font-medium tracking-wide">
      {bar.text}
    </span>
  );

  return (
    <div
      role="banner"
      className="w-full text-center py-2.5 px-4"
      style={{
        backgroundColor: bar.bgColor   || '#1C1C1B',
        color:           bar.textColor || '#FAF8F5',
      }}
    >
      {bar.link ? (
        <Link href={bar.link} className="hover:underline underline-offset-4 transition-opacity hover:opacity-80">
          {inner}
        </Link>
      ) : inner}
    </div>
  );
}

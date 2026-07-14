"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { analytics } from '@/utils/analytics';

export function AnalyticsTracker() {
 const pathname = usePathname();
 useEffect(() => { analytics.trackPageView(pathname || '/'); }, [pathname]);
 return null;
}

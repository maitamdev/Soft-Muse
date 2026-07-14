import React from "react";
import { WebsiteManagerTabs } from "@/components/admin/storefront/WebsiteManagerTabs";

// Website Manager — single workspace that consolidates every storefront-editing
// surface (home, pages, collections merchandising, banners, navigation, media,
// SEO, redirects, appearance, footer, store settings) behind one tabbed shell.
export default function WebsiteManagerLayout({ children }: { children: React.ReactNode }) {
 return (
 <div className="space-y-4"> <WebsiteManagerTabs /> <div>{children}</div> </div>
 );
}

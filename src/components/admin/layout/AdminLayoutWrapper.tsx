"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { IconLock } from "@tabler/icons-react";
import { Sidebar } from "../navigation/Sidebar";
import { Topbar } from "../navigation/Topbar";
import { CommandPalette } from "../navigation/CommandPalette";
import { Toaster } from "sonner";
import { GeistSans } from "geist/font/sans";
import { PermissionProvider, usePermissions, moduleForPath } from "@/lib/auth/PermissionContext";
import "@/styles/admin-theme.css";

/** Blocks rendering of a page the effective role has no read access to. */
function PageGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { canAccessModule, loaded, effectiveRole } = usePermissions();
  const mod = moduleForPath(pathname);

  if (loaded && !canAccessModule(mod)) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-24 gap-4">
        <div className="w-16 h-16 rounded-full bg-[var(--admin-danger-muted)] text-[var(--admin-danger)] flex items-center justify-center">
          <IconLock size={30} />
        </div>
        <h2 className="text-xl font-bold text-[var(--admin-text-base)]">لا تملك صلاحية الوصول</h2>
        <p className="text-sm text-[var(--admin-text-muted)] max-w-sm">
          دورك الحالي ({effectiveRole?.nameAr ?? '—'}) لا يملك صلاحية عرض هذه الصفحة. تواصل مع مسؤول النظام.
        </p>
      </div>
    );
  }
  return <>{children}</>;
}

export function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <PermissionProvider>
    <div className={`admin-theme ${GeistSans.variable} flex h-screen overflow-hidden antialiased`}>
        <CommandPalette />

        {/* Sidebar */}
        <Sidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />

        {/* Main */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[var(--admin-bg-base)]">
          <Topbar setIsMobileOpen={setIsMobileOpen} />
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-screen-2xl mx-auto p-4 md:p-6">
              <PageGuard>{children}</PageGuard>
            </div>
          </main>
        </div>

        <Toaster
          position="top-left"
          richColors
          dir="rtl"
          toastOptions={{
            style: {
              background: "var(--admin-bg-card)",
              border: "1px solid var(--admin-border-base)",
              color: "var(--admin-text-base)",
              fontFamily: "var(--font-inter), sans-serif",
            },
          }}
        />
      </div>
    </PermissionProvider>
  );
}

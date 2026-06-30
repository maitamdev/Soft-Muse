"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconBell, IconMenu2, IconSearch, IconChevronLeft,
  IconUser, IconSettings, IconLogout,
} from "@tabler/icons-react";
import { NotificationService } from "@/lib/services/notification.service";
import { AuthService, AuthenticatedUser } from "@/lib/services/auth.service";
import { usePermissions } from "@/lib/auth/PermissionContext";
import { ThemeToggle } from "../design-system/ThemeToggle";
import { Button } from "../design-system/Button";
import { adminAr } from "@/lib/i18n/admin-ar";

export function Topbar({ setIsMobileOpen }: { setIsMobileOpen: (v: boolean) => void }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user } = usePermissions();
  const profileRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const avatarUrl = user?.avatarUrl || "https://api.dicebear.com/7.x/notionists/svg?seed=Admin";

  useEffect(() => {
    const fetch = async () => setUnreadCount(await NotificationService.getUnreadCount());
    fetch();
    const interval = setInterval(fetch, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await AuthService.signOut();
    window.location.href = "/admin/login";
  };

  const paths = pathname.split('/').filter(p => p);
  const breadcrumbs = paths.map((path, idx) => {
    const isLast = idx === paths.length - 1;
    let name = path;
    if (path === 'admin') name = 'الرئيسية';
    else if ((adminAr.sidebar as Record<string, string>)[path]) name = (adminAr.sidebar as Record<string, string>)[path];
    return { name, isLast };
  });

  return (
    <header className="h-[72px] bg-[var(--admin-bg-surface)]/80 backdrop-blur-md border-b border-[var(--admin-border-base)] flex items-center justify-between px-6 sticky top-0 z-30 transition-colors">

      <div className="flex items-center gap-4 w-1/3">
        <Button variant="ghost" size="icon-sm" onClick={() => setIsMobileOpen(true)} className="md:hidden shrink-0 text-[var(--admin-text-muted)]">
          <IconMenu2 size={20} />
        </Button>
        <div className="hidden md:flex items-center gap-1.5 text-sm font-medium">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <span className={crumb.isLast ? "text-[var(--admin-text-base)]" : "text-[var(--admin-text-subtle)]"}>
                {crumb.name}
              </span>
              {!crumb.isLast && <IconChevronLeft size={16} className="text-[var(--admin-border-strong)]" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Command Palette trigger */}
      <div className="w-1/3 flex justify-center">
        <button
          onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }))}
          className="w-full max-w-md flex items-center justify-between gap-3 h-10 px-4 rounded-[var(--admin-radius-full)] bg-[var(--admin-bg-elevated)] border border-[var(--admin-border-base)] text-[var(--admin-text-subtle)] hover:border-[var(--admin-primary)] hover:bg-[var(--admin-bg-surface)] hover:text-[var(--admin-text-base)] hover:shadow-[var(--admin-shadow-sm)] transition-all duration-200 group"
        >
          <div className="flex items-center gap-2">
            <IconSearch size={18} className="text-[var(--admin-text-muted)] group-hover:text-[var(--admin-primary)] transition-colors" />
            <span className="text-sm font-medium">بحث في لوحة التحكم...</span>
          </div>
          <div className="hidden sm:flex items-center gap-1">
            <kbd className="text-[10px] font-sans font-medium bg-[var(--admin-bg-base)] border border-[var(--admin-border-base)] text-[var(--admin-text-muted)] rounded-[4px] px-1.5 py-0.5 leading-none shadow-sm">Ctrl</kbd>
            <kbd className="text-[10px] font-sans font-medium bg-[var(--admin-bg-base)] border border-[var(--admin-border-base)] text-[var(--admin-text-muted)] rounded-[4px] px-1.5 py-0.5 leading-none shadow-sm">K</kbd>
          </div>
        </button>
      </div>

      {/* Right side */}
      <div className="flex items-center justify-end gap-2 w-1/3">
        <ThemeToggle />

        <Link href="/admin/notifications">
          <Button variant="ghost" size="icon" className="relative text-[var(--admin-text-muted)] hover:text-[var(--admin-text-base)] rounded-full">
            <IconBell size={20} />
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.span
                  key="badge"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute top-1.5 right-1.5 w-4 h-4 bg-[var(--admin-danger)] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[var(--admin-bg-surface)] shadow-sm"
                >
                  {unreadCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </Link>

        <div className="w-px h-6 bg-[var(--admin-border-light)] mx-2 hidden sm:block" />

        {/* Profile menu */}
        <div className="relative hidden sm:block" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(v => !v)}
            className="flex items-center gap-3 p-1.5 pe-4 rounded-[var(--admin-radius-full)] hover:bg-[var(--admin-bg-elevated)] transition-colors border border-transparent hover:border-[var(--admin-border-base)] group"
          >
            <div className="relative">
              <img
                src={avatarUrl}
                alt={user?.name ?? "Admin"}
                className="w-8 h-8 rounded-full bg-[var(--admin-primary-muted)]"
              />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[var(--admin-success)] border-2 border-[var(--admin-bg-surface)] rounded-full" />
            </div>
            <div className="text-start">
              <p className="text-sm font-semibold text-[var(--admin-text-base)] leading-none group-hover:text-[var(--admin-primary)] transition-colors">{user?.name ?? "Admin"}</p>
            </div>
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute end-0 mt-2 w-52 bg-[var(--admin-bg-surface)] border border-[var(--admin-border-base)] rounded-[var(--admin-radius-xl)] shadow-[var(--admin-shadow-lg)] overflow-hidden z-50"
              >
                <div className="p-3 border-b border-[var(--admin-border-light)]">
                  <p className="text-sm font-semibold text-[var(--admin-text-base)]">{user?.name ?? "Admin User"}</p>
                  <p className="text-xs text-[var(--admin-text-subtle)] truncate">{user?.email ?? "admin@aura.com"}</p>
                </div>
                <div className="p-1.5">
                  <Link
                    href="/admin/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-[var(--admin-radius-md)] text-sm text-[var(--admin-text-muted)] hover:text-[var(--admin-text-base)] hover:bg-[var(--admin-bg-active)] transition-colors"
                  >
                    <IconUser size={16} />
                    {adminAr.sidebar.profile}
                  </Link>
                  <Link
                    href="/admin/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-[var(--admin-radius-md)] text-sm text-[var(--admin-text-muted)] hover:text-[var(--admin-text-base)] hover:bg-[var(--admin-bg-active)] transition-colors"
                  >
                    <IconSettings size={16} />
                    {adminAr.sidebar.settings}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[var(--admin-radius-md)] text-sm text-[var(--admin-danger)] hover:bg-[var(--admin-danger-muted)] transition-colors"
                  >
                    <IconLogout size={16} />
                    {adminAr.sidebar.logout}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { Button, type ButtonProps } from "./Button";
import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";

/* ── PageHeader ─────────────────────────────── */
export interface PageHeaderProps {
 title: string;
 description?: string;
 actions?: React.ReactNode;
 className?: string;
 badge?: React.ReactNode;
 backLink?: string;
}

export function PageHeader({ title, description, actions, className, badge, backLink }: PageHeaderProps) {
 return (
 <motion.div
 initial={{ opacity: 0, y: -6 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.25 }}
 className={cn("flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-5", className)}
 > <div className="space-y-1 min-w-0"> <div className="flex items-center gap-2.5 flex-wrap">
 {backLink && (
 <Link href={backLink}> <Button variant="ghost" size="icon-sm" className="me-1" leftIcon={<IconArrowRight size={18} />} aria-label="Back" /> </Link>
 )}
 <h1 className="text-xl font-bold text-[var(--admin-text-base)] tracking-tight">{title}</h1>
 {badge}
 </div>
 {description && (
 <p className="text-sm text-[var(--admin-text-muted)]">{description}</p>
 )}
 </div>
 {actions && (
 <div className="flex items-center gap-2 shrink-0 flex-wrap">
 {actions}
 </div>
 )}
 </motion.div>
 );
}

/* ── SectionHeader ──────────────────────────── */
export interface SectionHeaderProps {
 title: string;
 subtitle?: string;
 action?: React.ReactNode;
 className?: string;
}

export function SectionHeader({ title, subtitle, action, className }: SectionHeaderProps) {
 return (
 <div className={cn("flex items-start justify-between gap-3 mb-4", className)}> <div> <h2 className="text-base font-semibold text-[var(--admin-text-base)]">{title}</h2>
 {subtitle && <p className="text-xs text-[var(--admin-text-muted)] mt-0.5">{subtitle}</p>}
 </div>
 {action && <div className="shrink-0">{action}</div>}
 </div>
 );
}

/* ── EmptyState ─────────────────────────────── */
export interface EmptyStateProps {
 icon?: React.ReactNode;
 title: string;
 description?: string;
 action?: React.ReactNode;
 className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
 return (
 <motion.div
 initial={{ opacity: 0, scale: 0.97 }}
 animate={{ opacity: 1, scale: 1 }}
 className={cn("flex flex-col items-center justify-center text-center py-16 px-6 gap-4", className)}
 >
 {icon && (
 <div className="w-14 h-14 rounded-[var(--admin-radius-xl)] bg-[var(--admin-bg-elevated)] flex items-center justify-center text-[var(--admin-text-subtle)]">
 {icon}
 </div>
 )}
 <div className="space-y-1"> <h3 className="text-base font-semibold text-[var(--admin-text-base)]">{title}</h3>
 {description && <p className="text-sm text-[var(--admin-text-muted)] max-w-xs">{description}</p>}
 </div>
 {action}
 </motion.div>
 );
}

/* ── Skeleton ───────────────────────────────── */
export function Skeleton({ className }: { className?: string }) {
 return (
 <div
 className={cn(
 "animate-pulse rounded-[var(--admin-radius-md)] bg-[var(--admin-bg-elevated)]",
 className
 )}
 />
 );
}

/* ── Tabs ───────────────────────────────────── */
interface Tab {
 key: string;
 label: string;
 count?: number;
 icon?: React.ReactNode;
}

export function Tabs({
 tabs,
 active,
 onChange,
 className,
}: {
 tabs: Tab[];
 active: string;
 onChange: (key: string) => void;
 className?: string;
}) {
 return (
 <div className={cn("flex items-center gap-0.5 bg-[var(--admin-bg-elevated)] p-1 rounded-[var(--admin-radius-lg)]", className)}>
 {tabs.map((tab) => (
 <button
 key={tab.key}
 onClick={() => onChange(tab.key)}
 className={cn(
 "flex items-center gap-2 px-4 py-2 rounded-[var(--admin-radius-md)] text-sm font-medium transition-all duration-150 whitespace-nowrap",
 active === tab.key
 ? "bg-[var(--admin-bg-card)] text-[var(--admin-text-base)] shadow-[var(--admin-shadow-sm)]"
 : "text-[var(--admin-text-muted)] hover:text-[var(--admin-text-base)]"
 )}
 >
 {tab.icon}
 {tab.label}
 {tab.count !== undefined && (
 <span className={cn(
 "px-1.5 py-0.5 rounded text-[10px] font-bold tabular-nums",
 active === tab.key
 ? "bg-[var(--admin-primary-muted)] text-[var(--admin-primary)]"
 : "bg-[var(--admin-border-base)] text-[var(--admin-text-subtle)]"
 )}>
 {tab.count}
 </span>
 )}
 </button>
 ))}
 </div>
 );
}

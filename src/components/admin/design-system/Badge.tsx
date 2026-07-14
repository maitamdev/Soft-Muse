"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";

const badgeVariants = cva(
 "inline-flex items-center justify-center rounded-full font-medium transition-colors border",
 {
 variants: {
 variant: {
 default: "bg-[var(--admin-bg-elevated)] text-[var(--admin-text-base)] border-[var(--admin-border-base)]",
 primary: "bg-[var(--admin-primary-muted)] text-[var(--admin-primary)] border-[var(--admin-primary-muted)]",
 success: "bg-[var(--admin-success-muted)] text-[var(--admin-success)] border-[var(--admin-success-muted)]",
 warning: "bg-[var(--admin-warning-muted)] text-[var(--admin-warning)] border-[var(--admin-warning-muted)]",
 danger: "bg-[var(--admin-danger-muted)] text-[var(--admin-danger)] border-[var(--admin-danger-muted)]",
 info: "bg-[var(--admin-info-muted)] text-[var(--admin-info)] border-[var(--admin-info-muted)]",
 neutral: "bg-[var(--admin-border-light)] text-[var(--admin-text-muted)] border-[var(--admin-border-light)]",
 outline: "bg-transparent text-[var(--admin-text-base)] border-[var(--admin-border-strong)]",
 },
 size: {
 sm: "px-2.5 py-0.5 text-[11px]",
 md: "px-3 py-1 text-xs",
 lg: "px-4 py-1.5 text-sm",
 },
 },
 defaultVariants: {
 variant: "default",
 size: "md",
 },
 }
);

export interface BadgeProps
 extends Omit<React.HTMLAttributes<HTMLSpanElement>, "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "style">,
 VariantProps<typeof badgeVariants> {
 animated?: boolean;
 dot?: boolean;
}

export function Badge({ className, variant, size, animated = true, dot, children, ...props }: BadgeProps) {
 const content = (
 <>
 {dot && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80 me-1.5 shrink-0" />}
 {children}
 </>
 );

 if (!animated) {
 return (
 <span className={cn(badgeVariants({ variant, size }), className)} { ...props}>
 {content}
 </span>
 );
 }

 return (
 <motion.span
 initial={{ opacity: 0, scale: 0.9 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ duration: 0.2, ease: "easeOut" }}
 className={cn(badgeVariants({ variant, size }), className)}
 { ...props}
 >
 {content}
 </motion.span>
 );
}

export function statusVariant(status: string): BadgeProps["variant"] {
 const s = status.toLowerCase();
 if (['active', 'published', 'paid', 'delivered', 'completed', 'success', 'in_stock'].includes(s)) return 'success';
 if (['draft', 'pending', 'processing', 'warning', 'low_stock'].includes(s)) return 'warning';
 if (['inactive', 'cancelled', 'rejected', 'failed', 'danger', 'out_of_stock'].includes(s)) return 'danger';
 if (['archived', 'neutral'].includes(s)) return 'neutral';
 if (['shipped', 'info'].includes(s)) return 'info';
 return 'default';
}

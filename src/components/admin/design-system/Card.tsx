"use client";

import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/utils/cn";

/* ── Card ───────────────────────────────────── */
export interface CardProps extends HTMLMotionProps<"div"> {
  hoverEffect?: boolean;
  glass?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverEffect = false, glass = false, children, ...props }, ref) => (
    <motion.div
      ref={ref}
      whileHover={hoverEffect ? { y: -3, boxShadow: "var(--admin-shadow-lg)" } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={cn(
        "rounded-[var(--admin-radius-xl)] border border-[var(--admin-border-base)]",
        "bg-[var(--admin-bg-card)] shadow-[var(--admin-shadow-sm)]",
        glass && "backdrop-blur-md bg-[var(--admin-bg-card)]/80",
        hoverEffect && "transition-shadow duration-300 cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
);
Card.displayName = "Card";

/* ── CardHeader ─────────────────────────────── */
export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-1 p-5 pb-0", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

/* ── CardTitle ──────────────────────────────── */
export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        "text-sm font-semibold text-[var(--admin-text-base)] tracking-tight",
        className
      )}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

/* ── CardDescription ────────────────────────── */
export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-xs text-[var(--admin-text-muted)]", className)} {...props} />
  )
);
CardDescription.displayName = "CardDescription";

/* ── CardContent ────────────────────────────── */
export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-5", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

/* ── CardFooter ─────────────────────────────── */
export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-3 px-5 py-4 border-t border-[var(--admin-border-light)]",
        className
      )}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

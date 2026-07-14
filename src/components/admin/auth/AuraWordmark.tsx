"use client";

import React from "react";
import { cn } from "@/utils/cn";

interface AuraWordmarkProps {
 size?: "sm" | "lg";
 className?: string;
}

/**
 * AURA brand lockup: a gradient monogram + serif wordmark. The serif (the brand's
 * own display face) against the admin sans is the one luxury cue, used with restraint.
 */
export function AuraWordmark({ size = "sm", className }: AuraWordmarkProps) {
 const lg = size === "lg";

 return (
 <div className={cn("flex items-center gap-3", className)}> <span
 aria-hidden
 className={cn(
 "flex items-center justify-center rounded-[var(--admin-radius-lg)] font-bold text-white shadow-[var(--admin-shadow-md)]",
 lg ? "h-12 w-12 text-xl" : "h-10 w-10 text-lg"
 )}
 style={{
 background:
 "linear-gradient(135deg, var(--admin-primary) 0%, var(--admin-accent) 100%)",
 fontFamily: "var(--font-el-messiri), serif",
 }}
 > </span> <span className="flex flex-col leading-none"> <span
 className={cn(
 "font-bold tracking-[0.22em] text-[var(--admin-text-base)]",
 lg ? "text-2xl" : "text-xl"
 )}
 style={{ fontFamily: "var(--font-el-messiri), serif" }}
 >
 AURA
 </span> <span
 className={cn(
 "mt-1 font-medium tracking-wide text-[var(--admin-text-subtle)]",
 lg ? "text-xs" : "text-[11px]"
 )}
 >
 AURA
 </span> </span> </div>
 );
}

"use client";

import React from "react";
import { motion } from "framer-motion";
import { IconTrendingUp, IconTrendingDown } from "@tabler/icons-react";
import { cn } from "@/utils/cn";
import { IconContainer, IconColor } from "../ui/IconContainer";

// A simple animated counter
function AnimatedCounter({ value }: { value: string | number }) {
 // Simple version: just animate opacity/y when value changes
 return (
 <motion.span
 key={value}
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.4, type: "spring", bounce: 0 }}
 >
 {value}
 </motion.span>
 );
}

export interface KpiCardProps {
 title: string;
 value: string | number;
 icon: React.ReactNode;
 trend?: { value: number; label: string; isPositive: boolean };
 className?: string;
 accentColor?: IconColor;
}

export function KpiCard({ title, value, icon, trend, className, accentColor = "primary" }: KpiCardProps) {
 const ref = React.useRef(null);
 
 return (
 <motion.div
 ref={ref}
 whileHover="hover"
 initial="initial"
 animate="animate"
 className={cn(
 "relative rounded-[var(--admin-radius-lg)] bg-[var(--admin-bg-card)]",
 "p-5 flex flex-col gap-4 group border border-[var(--admin-border-base)]",
 "transition-shadow duration-200 shadow-[var(--admin-shadow-sm)] hover:shadow-[var(--admin-shadow-md)]",
 className
 )}
 >
 <div className="flex items-start justify-between"> <IconContainer
 icon={icon}
 color={accentColor}
 size="lg"
 isAnimated={false}
 className="transition-transform duration-200 group-hover:scale-105"
 />
 
 {trend && (
 <div className="flex flex-col items-end gap-1"> <div className={cn(
 "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full",
 trend.isPositive
 ? "bg-[var(--admin-success-muted)] text-[var(--admin-success)]"
 : "bg-[var(--admin-danger-muted)] text-[var(--admin-danger)]"
 )}>
 {trend.isPositive
 ? <IconTrendingUp size={14} stroke={2.5} />
 : <IconTrendingDown size={14} stroke={2.5} />}
 {trend.value}%
 </div> </div>
 )}
 </div> <div className="space-y-1"> <p className="text-xs font-semibold text-[var(--admin-text-muted)]">{title}</p> <div className="text-3xl font-bold text-[var(--admin-text-base)] tabular-nums admin-text-number"> <AnimatedCounter value={value} /> </div>
 {trend && (
 <p className="text-xs font-medium text-[var(--admin-text-muted)]">{trend.label}</p>
 )}
 </div>
 </motion.div>
 );
}

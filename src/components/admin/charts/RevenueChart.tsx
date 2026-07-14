"use client";

import React, { useState, useEffect } from "react";
import {
 ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
 CartesianGrid, Tooltip,
} from "recharts";
import { formatCurrency } from "@/lib/utils/formatters";

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) {
 if (!active || !payload?.length) return null;
 return (
 <div className="bg-[var(--admin-bg-surface)] border border-[var(--admin-border-strong)] rounded-[var(--admin-radius-lg)] px-4 py-3 shadow-[var(--admin-shadow-lg)] min-w-[160px] animate-in fade-in zoom-in-95 duration-200"> <p className="text-sm font-semibold text-[var(--admin-text-subtle)] mb-2">{label}</p>
 {payload.map((entry, i) => (
 <div key={i} className="flex items-center gap-2"> <div 
 className="w-2.5 h-2.5 rounded-full" 
 style={{ backgroundColor: entry.color || "var(--admin-primary)" }} 
 /> <p className="text-base font-bold text-[var(--admin-text-base)] tabular-nums">
 {formatCurrency(entry.value ?? 0)}
 </p> </div>
 ))}
 </div>
 );
}

export function RevenueChart({ data }: { data: Record<string, unknown>[] }) {
 const [mounted, setMounted] = useState(false);

 useEffect(() => {
 setMounted(true);
 }, []);

 if (!mounted) return <div className="h-full w-full bg-[var(--admin-bg-elevated)] animate-pulse rounded-[var(--admin-radius-lg)]" />;

 return (
 <div className="h-full w-full min-h-[300px]"> <ResponsiveContainer width="100%" height="100%"> <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}> <defs> <linearGradient id="adminGradientRevenue" x1="0" y1="0" x2="0" y2="1"> <stop offset="5%" stopColor="var(--admin-primary)" stopOpacity={0.3} /> <stop offset="95%" stopColor="var(--admin-primary)" stopOpacity={0} /> </linearGradient> <linearGradient id="adminGradientStroke" x1="0" y1="0" x2="1" y2="0"> <stop offset="0%" stopColor="var(--admin-primary)" /> <stop offset="100%" stopColor="var(--admin-accent)" /> </linearGradient> </defs> <CartesianGrid
 strokeDasharray="3 3"
 vertical={false}
 stroke="var(--admin-border-base)"
 /> <XAxis
 dataKey="name"
 axisLine={false}
 tickLine={false}
 tick={{ fill: "var(--admin-text-muted)", fontSize: 12, fontWeight: 500 }}
 dy={12}
 /> <YAxis
 axisLine={false}
 tickLine={false}
 tick={{ fill: "var(--admin-text-muted)", fontSize: 12, fontWeight: 500 }}
 tickFormatter={(v) => `${Math.round(v / 1000)}k`}
 dx={-10}
 /> <Tooltip
 content={<CustomTooltip />}
 cursor={{ stroke: "var(--admin-border-strong)", strokeWidth: 1, strokeDasharray: "4 4" }}
 isAnimationActive={true}
 animationDuration={300}
 /> <Area
 type="monotone" // smooth curve
 dataKey="revenue"
 stroke="url(#adminGradientStroke)"
 strokeWidth={3}
 fill="url(#adminGradientRevenue)"
 dot={{ r: 0 }}
 activeDot={{ r: 6, fill: "var(--admin-primary)", stroke: "var(--admin-bg-surface)", strokeWidth: 2 }}
 animationDuration={1500}
 animationEasing="ease-out"
 /> </AreaChart> </ResponsiveContainer> </div>
 );
}

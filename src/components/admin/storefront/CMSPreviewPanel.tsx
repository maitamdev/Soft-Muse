"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconDeviceDesktop, IconDeviceMobile, IconDeviceTablet } from "@tabler/icons-react";
import { cn } from "@/utils/cn";

export type DeviceView = "desktop" | "tablet" | "mobile";

interface CMSPreviewPanelProps {
 children: React.ReactNode;
 view: DeviceView;
 onViewChange: (view: DeviceView) => void;
 title?: string;
 isUpdating?: boolean;
}

export function CMSPreviewPanel({
 children,
 view,
 onViewChange,
 title = "Live Preview",
 isUpdating = false,
}: CMSPreviewPanelProps) {
 return (
 <div className="flex flex-col h-full bg-[var(--admin-bg-base)] border-l border-[var(--admin-border-base)] overflow-hidden rounded-l-[var(--admin-radius-2xl)]">
 {/* Top Bar */}
 <div className="h-[60px] shrink-0 border-b border-[var(--admin-border-light)] bg-[var(--admin-bg-surface)] px-4 flex items-center justify-between z-10"> <div className="flex items-center gap-3"> <div className="flex gap-1.5"> <div className="w-3 h-3 rounded-full bg-red-400" /> <div className="w-3 h-3 rounded-full bg-yellow-400" /> <div className="w-3 h-3 rounded-full bg-green-400" /> </div> <span className="text-sm font-bold text-[var(--admin-text-base)] ml-2">{title}</span> <AnimatePresence>
 {isUpdating && (
 <motion.span
 initial={{ opacity: 0, scale: 0.8 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.8 }}
 className="text-[10px] font-semibold text-[var(--admin-primary)] bg-[var(--admin-primary-muted)] px-2 py-0.5 rounded-full"
 >
 Updating.
 </motion.span>
 )}
 </AnimatePresence> </div> <div className="flex items-center bg-[var(--admin-bg-elevated)] p-1 rounded-[var(--admin-radius-lg)] border border-[var(--admin-border-base)]"> <button
 onClick={() => onViewChange("desktop")}
 className={cn(
 "p-1.5 rounded-[var(--admin-radius-md)] transition-all",
 view === "desktop"
 ? "bg-[var(--admin-bg-surface)] text-[var(--admin-text-base)] shadow-sm"
 : "text-[var(--admin-text-muted)] hover:text-[var(--admin-text-base)] hover:bg-[var(--admin-bg-hover)]"
 )}
 > <IconDeviceDesktop size={18} /> </button> <button
 onClick={() => onViewChange("tablet")}
 className={cn(
 "p-1.5 rounded-[var(--admin-radius-md)] transition-all",
 view === "tablet"
 ? "bg-[var(--admin-bg-surface)] text-[var(--admin-text-base)] shadow-sm"
 : "text-[var(--admin-text-muted)] hover:text-[var(--admin-text-base)] hover:bg-[var(--admin-bg-hover)]"
 )}
 > <IconDeviceTablet size={18} /> </button> <button
 onClick={() => onViewChange("mobile")}
 className={cn(
 "p-1.5 rounded-[var(--admin-radius-md)] transition-all",
 view === "mobile"
 ? "bg-[var(--admin-bg-surface)] text-[var(--admin-text-base)] shadow-sm"
 : "text-[var(--admin-text-muted)] hover:text-[var(--admin-text-base)] hover:bg-[var(--admin-bg-hover)]"
 )}
 > <IconDeviceMobile size={18} /> </button> </div> </div>

 {/* Preview Area */}
 <div className="flex-1 overflow-hidden bg-slate-50 dark:bg-zinc-950 flex items-center justify-center p-4 md:p-8"> <motion.div
 layout
 initial={false}
 animate={{
 width: view === "desktop" ? "100%" : view === "tablet" ? "768px" : "375px",
 height: view === "desktop" ? "100%" : view === "tablet" ? "1024px" : "812px",
 }}
 transition={{ type: "spring", stiffness: 300, damping: 30 }}
 className={cn(
 "bg-white dark:bg-black overflow-y-auto relative custom-scrollbar",
 view !== "desktop" && "rounded-[40px] shadow-2xl border-[12px] border-slate-800 dark:border-zinc-800",
 view === "desktop" && "rounded-[var(--admin-radius-xl)] shadow-lg border border-[var(--admin-border-light)]"
 )}
 >
 {/* Internal Preview Content Container */}
 <div className="min-h-full flex flex-col relative">
 {children}
 </div> </motion.div> </div> </div>
 );
}

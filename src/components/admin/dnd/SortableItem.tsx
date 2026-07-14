"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IconGripVertical } from "@tabler/icons-react";
import { cn } from "@/utils/cn";

interface SortableItemProps {
 id: string;
 children: React.ReactNode;
 className?: string;
 handleClassName?: string;
}

export function SortableItem({ id, children, className, handleClassName }: SortableItemProps) {
 const {
 attributes,
 listeners,
 setNodeRef,
 transform,
 transition,
 isDragging,
 } = useSortable({ id });

 const style = {
 transform: CSS.Transform.toString(transform),
 transition,
 zIndex: isDragging ? 50 : "auto",
 };

 return (
 <div
 ref={setNodeRef}
 style={style}
 className={cn(
 "flex items-start gap-3 bg-[var(--admin-bg-surface)] border border-[var(--admin-border-base)] rounded-[var(--admin-radius-lg)] p-3 relative",
 isDragging && "shadow-xl border-[var(--admin-primary)] opacity-90 scale-[1.02]",
 className
 )}
 >
 {/* Drag Handle */}
 <div
 { ...attributes}
 { ...listeners}
 className={cn(
 "cursor-grab active:cursor-grabbing p-1 -ml-1 text-[var(--admin-text-subtle)] hover:text-[var(--admin-text-base)] transition-colors mt-0.5",
 handleClassName
 )}
 > <IconGripVertical size={20} /> </div>
 
 {/* Content */}
 <div className="flex-1 min-w-0">
 {children}
 </div> </div>
 );
}

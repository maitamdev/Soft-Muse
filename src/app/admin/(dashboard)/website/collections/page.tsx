"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
 IconEye, IconEyeOff, IconStar, IconStarFilled, IconStack2,
 IconInfoCircle, IconArrowRight,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { Badge } from "@/components/admin/design-system/Badge";
import { SortableList } from "@/components/admin/dnd/SortableList";
import { SortableItem } from "@/components/admin/dnd/SortableItem";
import { FadeIn } from "@/components/admin/ui/motion";
import {
 CollectionDisplayService,
 MerchandisedCollection,
} from "@/lib/services/storefront/collection-display.service";
import { adminAr } from "@/lib/i18n/admin-ar";
import { cn } from "@/utils/cn";

const t = adminAr.storefront.collections;

export default function WebsiteCollectionsManager() {
 const [items, setItems] = useState<MerchandisedCollection[]>([]);
 const [loading, setLoading] = useState(true);

 async function load() {
 try {
 const data = await CollectionDisplayService.getMerchandised();
 setItems(data);
 } catch {
 toast.error(adminAr.toasts.unexpectedError);
 } finally {
 setLoading(false);
 }
 }

 useEffect(() => {
 load();
 }, []);

 const handleReorder = async (next: MerchandisedCollection[]) => {
 setItems(next);
 try {
 await CollectionDisplayService.reorder(next.map((c) => c.id));
 toast.success(adminAr.toasts.dataSaved);
 } catch {
 toast.error(adminAr.toasts.unexpectedError);
 load();
 }
 };

 const toggleVisibility = async (c: MerchandisedCollection) => {
 const visible = !c.display.visible;
 setItems((prev) =>
 prev.map((x) => (x.id === c.id ? { ...x, display: { ...x.display, visible } } : x))
 );
 await CollectionDisplayService.setVisibility(c.id, visible);
 };

 const toggleFeatured = async (c: MerchandisedCollection) => {
 const featured = !c.display.featured;
 setItems((prev) =>
 prev.map((x) => (x.id === c.id ? { ...x, display: { ...x.display, featured } } : x))
 );
 await CollectionDisplayService.setFeatured(c.id, featured);
 };

 return (
 <FadeIn className="space-y-5 max-w-4xl mx-auto"> <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3"> <div> <h2 className="text-lg font-bold text-[var(--admin-text-base)]">{t.title}</h2> <p className="text-sm font-medium text-[var(--admin-text-muted)] mt-1">{t.subtitle}</p> </div> <Link
 href="/admin/collections"
 className="shrink-0 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--admin-primary)] hover:underline"
 >
 {t.manageData}
 <IconArrowRight size={15} /> </Link> </div> <div className="flex items-start gap-2 text-xs font-medium text-[var(--admin-text-muted)] bg-[var(--admin-bg-elevated)] border border-[var(--admin-border-light)] rounded-[var(--admin-radius-lg)] px-3 py-2.5"> <IconInfoCircle size={16} className="shrink-0 mt-px text-[var(--admin-primary)]" /> <span>{t.dragToReorder} — {t.featuredHint}</span> </div>

 {loading ? (
 <div className="p-8 text-center text-[var(--admin-text-muted)] animate-pulse">
 {adminAr.table.loading}
 </div>
 ) : items.length === 0 ? (
 <div className="p-10 text-center text-[var(--admin-text-muted)] font-medium border border-dashed border-[var(--admin-border-base)] rounded-[var(--admin-radius-xl)]"> <IconStack2 size={36} className="mx-auto mb-3 text-[var(--admin-text-subtle)]" />
 {t.empty}
 </div>
 ) : (
 <SortableList
 items={items}
 keyExtractor={(c) => c.id}
 onReorder={handleReorder}
 renderItem={(c) => (
 <SortableItem id={c.id} key={c.id}> <div className="flex items-center gap-3"> <div className="w-12 h-12 rounded-[var(--admin-radius-md)] overflow-hidden bg-[var(--admin-bg-elevated)] shrink-0 flex items-center justify-center">
 {c.image ? (
 <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
 ) : (
 <IconStack2 size={20} className="text-[var(--admin-text-subtle)]" />
 )}
 </div> <div className="flex-1 min-w-0"> <div className="flex items-center gap-2"> <p className="text-sm font-bold text-[var(--admin-text-base)] truncate">{c.name}</p>
 {c.display.featured && (
 <Badge variant="warning" size="sm">{t.featured}</Badge>
 )}
 </div> <p className="text-xs font-medium text-[var(--admin-text-subtle)] mt-0.5">
 {c.display.visible ? t.visible : t.hidden} · {c.productIds.length} sản phẩm</p> </div> <div className="flex items-center gap-1 shrink-0"> <button
 onClick={() => toggleFeatured(c)}
 title={t.featured}
 className={cn(
 "p-2 rounded-[var(--admin-radius-md)] transition-colors",
 c.display.featured
 ? "text-[var(--admin-warning)] bg-[var(--admin-warning-muted)]"
 : "text-[var(--admin-text-subtle)] hover:text-[var(--admin-text-base)] hover:bg-[var(--admin-bg-active)]"
 )}
 >
 {c.display.featured ? <IconStarFilled size={18} /> : <IconStar size={18} />}
 </button> <button
 onClick={() => toggleVisibility(c)}
 title={c.display.visible ? t.hidden : t.visible}
 className={cn(
 "p-2 rounded-[var(--admin-radius-md)] transition-colors",
 c.display.visible
 ? "text-[var(--admin-success)] bg-[var(--admin-success-muted)]"
 : "text-[var(--admin-text-subtle)] hover:text-[var(--admin-text-base)] hover:bg-[var(--admin-bg-active)]"
 )}
 >
 {c.display.visible ? <IconEye size={18} /> : <IconEyeOff size={18} />}
 </button> </div> </div> </SortableItem>
 )}
 />
 )}
 </FadeIn>
 );
}

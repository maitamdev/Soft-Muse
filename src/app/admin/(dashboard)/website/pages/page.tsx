"use client";

import React, { useState, useEffect } from "react";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { toast } from "sonner";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/admin/ui/motion";
import { ContentService, ContentBlock } from "@/lib/services/storefront/content.service";

export default function ContentManager() {
 const [content, setContent] = useState<ContentBlock[]>([]);
 const [loading, setLoading] = useState(true);
 const [savingId, setSavingId] = useState<string | null>(null);
 const [group, setGroup] = useState<ContentBlock['group']>('order_tracking');


 async function loadContent() {
 setLoading(true);
 try {
 const data = await ContentService.getContentByGroup(group);
 setContent(data);
 } catch (e) {
 toast.error("trong tải");
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 loadContent();
 }, [group]);

 const handleUpdate = async (id: string, newValue: string) => {
 setSavingId(id);
 try {
 await ContentService.updateContent(id, newValue);
 toast.success("Content saved");
 } catch (e) {
 toast.error("Failed to save content");
 } finally {
 setSavingId(null);
 }
 };

 return (
 <FadeIn className="space-y-6 max-w-5xl mx-auto">
 {/* Group tabs */}
 <div className="flex gap-2 overflow-x-auto pb-2 border-b border-[var(--admin-border-light)] custom-scrollbar">
 {[
 { id: 'order_tracking', label: 'Theo dõi đơn hàng' },
 { id: 'general', label: '' },
 { id: 'pages', label: '' },
 { id: 'emails', label: '' },
 ].map(tab => (
 <button
 key={tab.id}
 onClick={() => setGroup(tab.id as any)}
 className={`px-4 py-2 rounded-t-[var(--admin-radius-md)] text-sm font-bold transition-colors whitespace-nowrap ${
 group === tab.id
 ? "bg-[var(--admin-bg-surface)] text-[var(--admin-primary)] border-t-2 border-[var(--admin-primary)] shadow-sm"
 : "text-[var(--admin-text-muted)] hover:text-[var(--admin-text-base)] hover:bg-[var(--admin-bg-hover)]"
 }`}
 >
 {tab.label}
 </button>
 ))}
 </div> <div className="bg-[var(--admin-bg-surface)] rounded-[var(--admin-radius-xl)] border border-[var(--admin-border-base)] overflow-hidden">
 {loading ? (
 <div className="p-8 text-center text-[var(--admin-text-muted)] animate-pulse">Đang tải.</div>
 ) : (
 <StaggerContainer className="divide-y divide-[var(--admin-border-light)]">
 {content.map(block => (
 <StaggerItem key={block.id} className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6"> <div> <h3 className="font-bold text-[var(--admin-text-base)] text-sm">{block.description}</h3> <code className="text-xs text-[var(--admin-text-subtle)] mt-1 inline-block bg-[var(--admin-bg-elevated)] px-2 py-1 rounded">
 {block.key}
 </code> </div> <div className="md:col-span-2 space-y-3 flex flex-col items-end">
 {block.group === 'pages' ? (
 <textarea
 defaultValue={block.value}
 className="w-full min-h-[120px] bg-[var(--admin-bg-base)] border border-[var(--admin-border-base)] rounded-[var(--admin-radius-md)] p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] transition-all custom-scrollbar"
 onBlur={(e) => {
 if (e.target.value !== block.value) {
 handleUpdate(block.id, e.target.value);
 }
 }}
 />
 ) : (
 <input
 type="text"
 defaultValue={block.value}
 className="w-full bg-[var(--admin-bg-base)] border border-[var(--admin-border-base)] rounded-[var(--admin-radius-md)] p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] transition-all"
 onBlur={(e) => {
 if (e.target.value !== block.value) {
 handleUpdate(block.id, e.target.value);
 }
 }}
 />
 )}
 {savingId === block.id && <span className="text-xs text-[var(--admin-primary)] font-semibold flex items-center gap-1"><IconDeviceFloppy size={14} /> Lưu.</span>}
 </div> </StaggerItem>
 ))}
 {content.length === 0 && (
 <div className="p-8 text-center text-[var(--admin-text-muted)] font-medium">
 không trong nàyDanh mục </div>
 )}
 </StaggerContainer>
 )}
 </div> </FadeIn>
 );
}

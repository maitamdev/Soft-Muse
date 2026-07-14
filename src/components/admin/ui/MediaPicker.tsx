"use client";

import React, { useState, useEffect, useRef } from 'react';
import { SupabaseMediaService as MediaService, type MediaFilters } from '@/lib/services/media-supabase.service';
import { Media } from '@/data/mock/media';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

// SaaS UI Components
import { Input } from '@/components/admin/design-system/Input';
import { Button } from '@/components/admin/design-system/Button';

// Tabler Icons
import { 
 IconX, 
 IconSearch, 
 IconUpload, 
 IconFolder, 
 IconPhoto, 
 IconFile, 
 IconCheck 
} from '@tabler/icons-react';

interface MediaPickerProps {
 open: boolean;
 onClose: () => void;
 onSelect: (media: Media | Media[]) => void;
 multiple?: boolean;
 allowedTypes?: string[];
}

export function MediaPicker({ open, onClose, onSelect, multiple = false, allowedTypes }: MediaPickerProps) {
 const uploadRef = useRef<HTMLInputElement>(null);
 const [mediaItems, setMediaItems] = useState<Media[]>([]);
 const [folders, setFolders] = useState<string[]>([]);
 const [loading, setLoading] = useState(true);
 const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
 
 const [filters, setFilters] = useState<MediaFilters>({
 search: '',
 folder: 'all'
 });

 useEffect(() => {
 if (open) {
 loadMedia();
 loadFolders();
 }
 }, [open, filters]);

 async function loadMedia() {
 setLoading(true);
 try {
 const data = await MediaService.getMedia(filters);
 // Filter by allowed types if provided
 let finalData = data;
 if (allowedTypes && allowedTypes.length > 0) {
 finalData = data.filter(m => allowedTypes.some(type => m.mimeType.includes(type)));
 }
 setMediaItems(finalData);
 } catch (error) {
 toast.error(error instanceof Error ? error.message : 'Không thể tải thư viện media.');
 } finally {
 setLoading(false);
 }
 }

 async function loadFolders() {
 try {
 const f = await MediaService.getFolders();
 setFolders(f);
 } catch (error) {
 toast.error(error instanceof Error ? error.message : 'Không thể tải thư mục.');
 }
 }

 const handleSelect = (media: Media) => {
 if (multiple) {
 const newSet = new Set(selectedIds);
 if (newSet.has(media.id)) {
 newSet.delete(media.id);
 } else {
 newSet.add(media.id);
 }
 setSelectedIds(newSet);
 } else {
 setSelectedIds(new Set([media.id]));
 }
 };

 const handleConfirm = () => {
 if (selectedIds.size === 0) return;
 
 if (multiple) {
 const selected = mediaItems.filter(m => selectedIds.has(m.id));
 onSelect(selected);
 } else {
 const selected = mediaItems.find(m => selectedIds.has(m.id));
 if (selected) onSelect(selected);
 }
 
 setSelectedIds(new Set());
 onClose();
 };

 const handleUpload = async (files: FileList | null) => {
 if (!files?.length) return;
 setLoading(true);
 try {
 for (const file of Array.from(files)) await MediaService.uploadMedia(file, { folder: filters.folder !== 'all' ? filters.folder : 'uncategorized' });
 toast.success(`Đã tải lên ${files.length} tệp.`);
 await loadMedia();
 } catch (error) {
 toast.error(error instanceof Error ? error.message : 'Tải tệp thất bại.');
 setLoading(false);
 } finally {
 if (uploadRef.current) uploadRef.current.value = '';
 }
 };

 return (
 <AnimatePresence>
 {open && (
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4"> <input ref={uploadRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif,application/pdf" multiple={multiple} className="sr-only" onChange={(event) => void handleUpload(event.target.files)} /> <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 transition={{ duration: 0.15 }}
 className="absolute inset-0 bg-[var(--admin-bg-base)]/80 backdrop-blur-sm"
 onClick={onClose}
 /> <motion.div 
 initial={{ opacity: 0, scale: 0.95, y: 10 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95, y: 10 }}
 transition={{ duration: 0.2, type: 'spring', bounce: 0 }}
 className="relative bg-[var(--admin-bg-elevated)] rounded-[var(--admin-radius-xl)] shadow-[var(--admin-shadow-xl)] border border-[var(--admin-border-base)] w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden"
 style={{ fontFamily: 'var(--font-inter), sans-serif' }}
 >
 {/* Header */}
 <div className="flex justify-between items-center px-6 py-5 border-b border-[var(--admin-border-light)] bg-[var(--admin-bg-elevated)]"> <h2 className="text-xl font-bold font-serif flex items-center gap-2 text-[var(--admin-text-base)]"> <IconPhoto size={24} /> Thư viện media
 </h2> <button onClick={onClose} className="p-1.5 text-[var(--admin-text-muted)] hover:text-[var(--admin-danger)] hover:bg-[var(--admin-danger)]/10 rounded-[var(--admin-radius-sm)] transition-colors"> <IconX size={20} stroke={2} /> </button> </div>

 {/* Toolbar */}
 <div className="px-6 py-4 border-b border-[var(--admin-border-light)] bg-[var(--admin-bg-base)] flex flex-wrap gap-4 items-center justify-between"> <div className="flex gap-4 flex-1"> <div className="w-64 max-w-full"> <Input 
 icon={<IconSearch size={18} />}
 placeholder="Tìm theo tên hoặc mô tả"
 value={filters.search}
 onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
 /> </div> <select
 value={filters.folder}
 onChange={e => setFilters(prev => ({ ...prev, folder: e.target.value }))}
 className="px-4 py-2 border border-[var(--admin-border-base)] bg-[var(--admin-bg-base)] rounded-[var(--admin-radius-md)] text-sm outline-none focus:border-[var(--admin-primary)] focus:ring-1 focus:ring-[var(--admin-primary)] min-w-[150px] text-[var(--admin-text-base)]"
 > <option value="all">Tất cả thư mục</option>
 {folders.map(f => (
 <option key={f} value={f}>{f}</option>
 ))}
 </select> </div> <Button 
 onClick={() => uploadRef.current?.click()}
 leftIcon={<IconUpload size={18} />}
 >
 Tải tệp lên
 </Button> </div>

 {/* Grid Content */}
 <div className="flex-1 overflow-y-auto p-6 bg-[var(--admin-bg-subtle)] relative">
 {loading ? (
 <div className="flex justify-center items-center h-full"> <div className="w-8 h-8 border-4 border-[var(--admin-primary)] border-t-transparent rounded-full animate-spin"></div> </div>
 ) : mediaItems.length === 0 ? (
 <div className="flex flex-col items-center justify-center h-full text-[var(--admin-text-muted)]"> <IconFile size={48} className="mb-4 text-[var(--admin-border-strong)]" stroke={1.5} /> <p>Không tìm thấy tệp phù hợp.</p> </div>
 ) : (
 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
 {mediaItems.map(media => {
 const isSelected = selectedIds.has(media.id);
 return (
 <div 
 key={media.id} 
 onClick={() => handleSelect(media)}
 className={`relative group bg-[var(--admin-bg-base)] rounded-[var(--admin-radius-lg)] border-2 cursor-pointer overflow-hidden transition-all ${isSelected ? 'border-[var(--admin-primary)] shadow-md shadow-[var(--admin-primary)]/10' : 'border-[var(--admin-border-light)] hover:border-[var(--admin-border-strong)]'}`}
 > <div className="aspect-square bg-[var(--admin-bg-elevated)] relative">
 {media.mimeType.includes('image') ? (
 <img src={media.thumbnail || media.url} alt={media.alt} className="w-full h-full object-cover" />
 ) : (
 <div className="w-full h-full flex items-center justify-center"> <IconFile size={40} className="text-[var(--admin-text-subtle)]" stroke={1} /> </div>
 )}
 
 {/* Selection Overlay */}
 <div className={`absolute top-2 right-2 w-5 h-5 rounded-[var(--admin-radius-sm)] border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-[var(--admin-primary)] border-[var(--admin-primary)] text-[var(--admin-bg-base)]' : 'border-[var(--admin-border-strong)] bg-[var(--admin-bg-base)]/50 opacity-0 group-hover:opacity-100'}`}>
 {isSelected && <IconCheck size={14} stroke={3} />}
 </div> </div> <div className="p-2 border-t border-[var(--admin-border-light)] bg-[var(--admin-bg-base)]"> <p className="text-xs font-semibold text-[var(--admin-text-base)] truncate" title={media.originalName}>{media.originalName}</p> <p className="text-[10px] text-[var(--admin-text-muted)] font-medium flex items-center gap-1 mt-0.5"><IconFolder size={10} /> {media.folder}</p> </div> </div>
 );
 })}
 </div>
 )}
 </div>

 {/* Footer */}
 <div className="px-6 py-4 border-t border-[var(--admin-border-light)] bg-[var(--admin-bg-elevated)] flex justify-between items-center z-10"> <p className="text-sm font-medium text-[var(--admin-text-muted)]">
 {selectedIds.size > 0 ? `Đã chọn ${selectedIds.size} ` : ''}
 </p> <div className="flex gap-3"> <Button variant="secondary" onClick={onClose}>Hủy</Button> <Button 
 onClick={handleConfirm}
 disabled={selectedIds.size === 0}
 >Chọn tệp</Button> </div> </div> </motion.div> </div>
 )}
 </AnimatePresence>
 );
}

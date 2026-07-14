"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
 IconUpload, IconCamera, IconTrash, IconRotateClockwise, 
 IconRefresh, IconZoomIn, IconZoomOut, IconSparkles, 
 IconCheck, IconX, IconLoader2 
} from '@tabler/icons-react';
import { Modal } from '@/components/admin/design-system/Modal';
import { Button } from '@/components/admin/design-system/Button';
import { toast } from 'sonner';

interface AvatarUploadProps {
 value: string;
 name: string;
 onChange: (url: string) => void;
}

const PRESET_AVATARS = [
 'https://api.dicebear.com/7.x/notionists/svg?seed=Admin',
 'https://api.dicebear.com/7.x/notionists/svg?seed=Salah',
 'https://api.dicebear.com/7.x/notionists/svg?seed=Aura',
 'https://api.dicebear.com/7.x/notionists/svg?seed=Jane',
 'https://api.dicebear.com/7.x/notionists/svg?seed=Bob',
 'https://api.dicebear.com/7.x/notionists/svg?seed=Alice',
 'https://api.dicebear.com/7.x/notionists/svg?seed=Charlie',
 'https://api.dicebear.com/7.x/notionists/svg?seed=David',
];

export function AvatarUpload({ value, name, onChange }: AvatarUploadProps) {
 const [dragOver, setDragOver] = useState(false);
 const [presetsOpen, setPresetsOpen] = useState(false);
 const [cropperOpen, setCropperOpen] = useState(false);
 const [loading, setLoading] = useState(false);
 
 // Cropper State
 const [imgSrc, setImgSrc] = useState<string>('');
 const [zoom, setZoom] = useState<number>(1);
 const [rotation, setRotation] = useState<number>(0);
 const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
 const [isDragging, setIsDragging] = useState<boolean>(false);
 const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

 const fileInputRef = useRef<HTMLInputElement>(null);
 const cropperImgRef = useRef<HTMLImageElement>(null);

 // Fallback initials if no avatar is set
 const getInitials = () => {
 if (!name) return 'A';
 return name.trim().split('').map(n => n[0]).slice(0, 2).join('').toUpperCase();
 };

 // Handle local file selection
 const processFile = (file: File) => {
 // 1. Validation size (Max 5 MB)
 if (file.size > 5 * 1024 * 1024) {
 toast.error('Hình ảnh. 5.');
 return;
 }
 
 // 2. Format validation
 const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
 if (!allowedTypes.includes(file.type)) {
 toast.error('không.mã:JPG, JPEG, PNG, WEBP');
 return;
 }

 const reader = new FileReader();
 reader.onload = () => {
 const dataUrl = reader.result as string;
 
 // 3. Corrupted image validation
 const img = new Image();
 img.onload = () => {
 setImgSrc(dataUrl);
 setZoom(1);
 setRotation(0);
 setOffset({ x: 0, y: 0 });
 setCropperOpen(true);
 };
 img.onerror = () => {
 toast.error('ảnh.');
 };
 img.src = dataUrl;
 };
 reader.readAsDataURL(file);
 };

 const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 if (e.target.files && e.target.files[0]) {
 processFile(e.target.files[0]);
 }
 };

 // Drag and Drop handlers
 const handleDragOver = (e: React.DragEvent) => {
 e.preventDefault();
 setDragOver(true);
 };

 const handleDragLeave = () => {
 setDragOver(false);
 };

 const handleDrop = (e: React.DragEvent) => {
 e.preventDefault();
 setDragOver(false);
 if (e.dataTransfer.files && e.dataTransfer.files[0]) {
 processFile(e.dataTransfer.files[0]);
 }
 };

 // Pan (drag) image handler inside cropping circle
 const handleMouseDown = (e: React.MouseEvent) => {
 e.preventDefault();
 setIsDragging(true);
 setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
 };

 const handleMouseMove = (e: React.MouseEvent) => {
 if (!isDragging) return;
 setOffset({
 x: e.clientX - dragStart.x,
 y: e.clientY - dragStart.y
 });
 };

 const handleMouseUpOrLeave = () => {
 setIsDragging(false);
 };

 // Reset Cropper Parameters
 const handleReset = () => {
 setZoom(1);
 setRotation(0);
 setOffset({ x: 0, y: 0 });
 };

 // Rotate Image (optional +90 deg clockwise)
 const handleRotate = () => {
 setRotation(r => (r + 90) % 360);
 };

 // Process canvas cropping and compression to 500x500 px JPEG
 const handleSaveCrop = async () => {
 if (loading) return; // Prevent double submit
 setLoading(true);

 try {
 const img = new Image();
 img.src = imgSrc;
 await new Promise((resolve, reject) => {
 img.onload = resolve;
 img.onerror = reject;
 });

 const canvas = document.createElement('canvas');
 canvas.width = 500;
 canvas.height = 500;
 const ctx = canvas.getContext('2d');

 if (!ctx) throw new Error('Could not get canvas context');

 // 1. Fill white background for compression formats
 ctx.fillStyle = '#ffffff';
 ctx.fillRect(0, 0, 500, 500);

 // 2. Translate coordinates system to canvas center
 ctx.translate(250, 250);

 // 3. Apply Rotation transform
 ctx.rotate((rotation * Math.PI) / 180);

 // 4. Apply Scale factor
 const viewportToCanvasRatio = 500 / 250;
 ctx.scale(zoom * viewportToCanvasRatio, zoom * viewportToCanvasRatio);

 // 5. Apply Pan Offset
 ctx.translate(offset.x / zoom, offset.y / zoom);

 // Calculate object-contain fit layout in viewport coordinates
 const imgRatio = img.naturalWidth / img.naturalHeight;
 let drawW = 250;
 let drawH = 250;
 if (imgRatio > 1) {
 drawH = 250 / imgRatio;
 } else {
 drawW = 250 * imgRatio;
 }

 // Draw the image centered
 ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);

 // 6. Output compressed data URL (around 0.8 quality Jpeg)
 const compressedUrl = canvas.toDataURL('image/jpeg', 0.8);
 
 // Trigger update
 onChange(compressedUrl);
 setCropperOpen(false);
 toast.success('đãẢnh đại diện thành công');
 } catch {
 toast.error('Đã xảy ra lỗi Hình ảnh.');
 } finally {
 setLoading(false);
 }
 };

 return (
 <div className="space-y-4">
 {/* Upload/Drop Area */}
 <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-[var(--admin-radius-xl)] bg-[var(--admin-bg-base)] border border-[var(--admin-border-base)]"> <div 
 onDragOver={handleDragOver}
 onDragLeave={handleDragLeave}
 onDrop={handleDrop}
 onClick={() => fileInputRef.current?.click()}
 className={`relative w-24 h-24 rounded-full border-2 border-dashed flex items-center justify-center shrink-0 cursor-pointer overflow-hidden transition-all group ${
 dragOver 
 ? 'border-[var(--admin-primary)] bg-[var(--admin-primary-muted)] shadow-[var(--admin-shadow-md)]' 
 : 'border-[var(--admin-border-strong)] bg-[var(--admin-bg-elevated)] hover:border-[var(--admin-primary)] hover:bg-[var(--admin-bg-hover)]'
 }`}
 >
 {value ? (
 <> <img src={value} alt={name} className="w-full h-full object-cover transition-opacity group-hover:opacity-40" /> <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 text-white"> <IconCamera size={20} stroke={2} /> <span className="text-[9px] font-semibold">Hình ảnh</span> </div> </>
 ) : (
 <div className="flex flex-col items-center justify-center gap-1 text-[var(--admin-text-subtle)] group-hover:text-[var(--admin-primary)]"> <span className="text-xl font-bold font-sans tracking-tight">{getInitials()}</span> <IconUpload size={16} stroke={2.5} className="mt-0.5" /> </div>
 )}
 {dragOver && (
 <div className="absolute inset-0 bg-[var(--admin-primary-muted)]/80 flex items-center justify-center text-[var(--admin-primary)] font-bold text-xs">
 !</div>
 )}
 </div> <div className="flex-1 text-center sm:text-left space-y-2.5"> <div> <h4 className="text-sm font-bold text-[var(--admin-text-base)]">Ảnh đại diện</h4> <p className="text-xs text-[var(--admin-text-muted)] mt-1 font-medium">từ.JPG, PNG, WEBP 5.</p> </div> <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2"> <Button 
 type="button" 
 variant="primary" 
 size="sm" 
 leftIcon={<IconUpload size={14} />}
 onClick={() => fileInputRef.current?.click()}
 >
 ảnh từ</Button> <Button 
 type="button" 
 variant="secondary" 
 size="sm"
 leftIcon={<IconSparkles size={14} />}
 onClick={() => setPresetsOpen(true)}
 > </Button>

 {value && (
 <Button 
 type="button" 
 variant="ghost" 
 size="sm"
 className="text-[var(--admin-danger)] hover:bg-[var(--admin-danger-muted)]"
 leftIcon={<IconTrash size={14} />}
 onClick={() => {
 onChange('');
 toast.success('đãẢnh đại diện');
 }}
 > </Button>
 )}
 </div> </div> </div>

 {/* Hidden input file selection */}
 <input 
 type="file" 
 ref={fileInputRef} 
 onChange={handleFileChange} 
 accept="image/png, image/jpeg, image/jpg, image/webp" 
 className="hidden" 
 />

 {/* Presets Selection Modal */}
 <Modal
 isOpen={presetsOpen}
 onClose={() => setPresetsOpen(false)}
 title="AURA"
 size="md"
 > <div className="py-4"> <p className="text-sm text-[var(--admin-text-muted)] mb-5">:</p> <div className="grid grid-cols-4 gap-4">
 {PRESET_AVATARS.map((url, idx) => (
 <button
 key={idx}
 type="button"
 onClick={() => {
 onChange(url);
 setPresetsOpen(false);
 toast.success('đãHình ảnh');
 }}
 className={`aspect-square rounded-full overflow-hidden border-2 bg-[var(--admin-bg-elevated)] p-1.5 transition-all hover:scale-105 active:scale-95 ${
 value === url 
 ? 'border-[var(--admin-primary)] shadow-[var(--admin-shadow-md)] bg-[var(--admin-primary-muted)]/20' 
 : 'border-[var(--admin-border-base)] hover:border-[var(--admin-border-strong)]'
 }`}
 > <img src={url} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" /> </button>
 ))}
 </div> <div className="flex justify-end mt-6"> <Button variant="ghost" size="md" onClick={() => setPresetsOpen(false)}>Hủy</Button> </div> </div> </Modal>

 {/* Image Crop/Zoom/Rotation Modal */}
 <Modal
 isOpen={cropperOpen}
 onClose={() => setCropperOpen(false)}
 title="Sửa Ảnh đại diện"
 size="lg"
 footer={
 <div className="flex justify-end gap-3"> <Button variant="ghost" onClick={() => setCropperOpen(false)} disabled={loading}>Hủy</Button> <Button 
 variant="primary" 
 onClick={handleSaveCrop} 
 disabled={loading} 
 isLoading={loading}
 leftIcon={loading ? <IconLoader2 size={16} className="animate-spin" /> : <IconCheck size={16} />}
 >
 Lưu Hình ảnh</Button> </div>
 }
 > <div className="py-4 space-y-6"> <p className="text-sm text-[var(--admin-text-muted)]">Hình ảnh:</p> <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
 {/* Viewport Cropper Container */}
 <div 
 onMouseMove={handleMouseMove}
 onMouseUp={handleMouseUpOrLeave}
 onMouseLeave={handleMouseUpOrLeave}
 className="relative w-[250px] h-[250px] rounded-full border-4 border-[var(--admin-border-strong)] shadow-[var(--admin-shadow-md)] overflow-hidden bg-black/60 cursor-move shrink-0 flex items-center justify-center select-none"
 > <img
 ref={cropperImgRef}
 src={imgSrc}
 alt="Crop preview"
 onMouseDown={handleMouseDown}
 style={{
 transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom}) rotate(${rotation}deg)`,
 transformOrigin: 'center center',
 pointerEvents: 'auto',
 }}
 className="max-w-full max-h-full object-contain pointer-events-none select-none transition-transform duration-75"
 />
 {/* Outer cropping mask highlight helper */}
 <div className="absolute inset-0 rounded-full border border-[var(--admin-primary)]/50 pointer-events-none shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]" /> </div>

 {/* Side tools & Live Preview */}
 <div className="flex-1 w-full space-y-5">
 {/* Live Preview circle */}
 <div className="flex items-center gap-4 p-3.5 rounded-[var(--admin-radius-xl)] bg-[var(--admin-bg-elevated)] border border-[var(--admin-border-base)]"> <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[var(--admin-border-strong)] bg-black/40 shrink-0 select-none"> <img
 src={imgSrc}
 alt="Live preview"
 style={{
 transform: `translate(${offset.x * (64 / 250)}px, ${offset.y * (64 / 250)}px) scale(${zoom}) rotate(${rotation}deg)`,
 transformOrigin: 'center center',
 }}
 className="w-full h-full object-contain pointer-events-none"
 /> </div> <div> <h5 className="text-xs font-bold text-[var(--admin-text-base)]"></h5> <p className="text-[10px] text-[var(--admin-text-muted)] mt-0.5">trong.</p> </div> </div>

 {/* Zoom sliders */}
 <div className="space-y-2"> <div className="flex items-center justify-between text-xs text-[var(--admin-text-muted)] font-medium"> <span className="flex items-center gap-1"><IconZoomOut size={14} /> </span> <span>{(zoom * 100).toFixed(0)}%</span> <span className="flex items-center gap-1"><IconZoomIn size={14} /> </span> </div> <input 
 type="range"
 min="1"
 max="3"
 step="0.05"
 value={zoom}
 onChange={(e) => setZoom(parseFloat(e.target.value))}
 className="w-full h-1.5 bg-[var(--admin-border-base)] rounded-lg appearance-none cursor-pointer accent-[var(--admin-primary)] outline-none focus:outline-none"
 /> </div>

 {/* Adjustments row */}
 <div className="flex flex-wrap gap-2 pt-2 border-t border-[var(--admin-border-light)]"> <Button
 type="button"
 variant="secondary"
 size="sm"
 leftIcon={<IconRotateClockwise size={14} />}
 onClick={handleRotate}
 >
 90°
 </Button> <Button
 type="button"
 variant="secondary"
 size="sm"
 leftIcon={<IconRefresh size={14} />}
 onClick={handleReset}
 > </Button> </div> </div> </div> </div> </Modal> </div>
 );
}

"use client";

import React, { useState, useEffect } from "react";
import { IconDeviceFloppy, IconSpeakerphone } from "@tabler/icons-react";
import { toast } from "sonner";
import { Button } from "@/components/admin/design-system/Button";
import { FadeIn } from "@/components/admin/ui/motion";
import { StoreService, StoreInfo, AnnouncementBarSettings } from "@/lib/services/storefront/store.service";

export default function StoreInfoManager() {
 const [info, setInfo] = useState<StoreInfo | null>(null);
 const [loading, setLoading] = useState(true);
 const [saving, setSaving] = useState(false);

 useEffect(() => {
 StoreService.getInfo()
.then(setInfo)
.catch(() => toast.error("tảiCửa hàng"))
.finally(() => setLoading(false));
 }, []);

 const updateInfo = <K extends keyof StoreInfo>(key: K, value: StoreInfo[K]) => {
 if (info) setInfo({ ...info, [key]: value });
 };

 const updateSocial = (key: keyof StoreInfo['socialMedia'], value: string) => {
 if (info) setInfo({ ...info, socialMedia: { ...info.socialMedia, [key]: value } });
 };

 const updateBar = (key: keyof AnnouncementBarSettings, value: AnnouncementBarSettings[keyof AnnouncementBarSettings]) => {
 if (info) setInfo({ ...info, announcementBar: { ...info.announcementBar, [key]: value } });
 };

 const saveInfo = async () => {
 if (!info) return;
 setSaving(true);
 try {
 await StoreService.updateInfo(info);
 toast.success("đãLưu Cửa hàng thành công");
 } catch {
 toast.error("Lưu");
 } finally {
 setSaving(false);
 }
 };

 if (loading || !info) {
 return <div className="p-8 animate-pulse text-[var(--admin-text-muted)]">.</div>;
 }

 const inputCls = "w-full bg-[var(--admin-bg-base)] border border-[var(--admin-border-base)] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)]";

 return (
 <FadeIn className="max-w-4xl mx-auto space-y-6"> <div className="flex items-center justify-end"> <Button
 variant="primary"
 size="md"
 leftIcon={<IconDeviceFloppy size={18} />}
 onClick={saveInfo}
 loading={saving}
 >
 Lưu </Button> </div>

 {/* ── Announcement Bar ──────────────────────────────── */}
 <div className="bg-[var(--admin-bg-surface)] rounded-[var(--admin-radius-xl)] border border-[var(--admin-border-base)] overflow-hidden"> <div className="p-6 border-b border-[var(--admin-border-light)] flex items-center gap-2"> <IconSpeakerphone size={18} className="text-[var(--admin-primary)]" /> <h2 className="text-lg font-bold text-[var(--admin-text-base)]"></h2> </div> <div className="p-6 space-y-4">

 {/* Enable toggle */}
 <label className="flex items-center gap-3 cursor-pointer"> <input
 type="checkbox"
 checked={info.announcementBar.enabled}
 onChange={e => updateBar('enabled', e.target.checked)}
 className="w-4 h-4 rounded text-[var(--admin-primary)]"
 /> <span className="text-sm font-bold text-[var(--admin-text-base)]"></span> </label>

 {/* Preview */}
 {info.announcementBar.enabled && (
 <div
 className="w-full text-center py-2.5 px-4 rounded text-xs font-medium"
 style={{
 backgroundColor: info.announcementBar.bgColor || '#1C1C1B',
 color: info.announcementBar.textColor || '#FAF8F5',
 }}
 >
 {info.announcementBar.text || ''}
 </div>
 )}

 <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> <div className="md:col-span-2"> <label className="block text-sm font-bold text-[var(--admin-text-base)] mb-1"></label> <input
 type="text"
 value={info.announcementBar.text}
 onChange={e => updateBar('text', e.target.value)}
 placeholder="Vận chuyển Tất cả Việt Nam trênĐơn hàng 500đ"
 className={inputCls}
 /> </div> <div> <label className="block text-sm font-bold text-[var(--admin-text-base)] mb-1">()</label> <input
 type="text"
 value={info.announcementBar.link}
 onChange={e => updateBar('link', e.target.value)}
 placeholder="/shop"
 className={inputCls}
 dir="ltr"
 /> </div> <div className="grid grid-cols-2 gap-4"> <div> <label className="block text-sm font-bold text-[var(--admin-text-base)] mb-1">màu</label> <div className="flex items-center gap-2"> <input
 type="color"
 value={info.announcementBar.bgColor || '#1C1C1B'}
 onChange={e => updateBar('bgColor', e.target.value)}
 className="w-10 h-10 rounded border border-[var(--admin-border-base)] cursor-pointer p-0.5"
 /> <input
 type="text"
 value={info.announcementBar.bgColor}
 onChange={e => updateBar('bgColor', e.target.value)}
 className="flex-1 bg-[var(--admin-bg-base)] border border-[var(--admin-border-base)] rounded-md px-2 py-2 text-xs focus:outline-none"
 dir="ltr"
 /> </div> </div> <div> <label className="block text-sm font-bold text-[var(--admin-text-base)] mb-1">màu</label> <div className="flex items-center gap-2"> <input
 type="color"
 value={info.announcementBar.textColor || '#FAF8F5'}
 onChange={e => updateBar('textColor', e.target.value)}
 className="w-10 h-10 rounded border border-[var(--admin-border-base)] cursor-pointer p-0.5"
 /> <input
 type="text"
 value={info.announcementBar.textColor}
 onChange={e => updateBar('textColor', e.target.value)}
 className="flex-1 bg-[var(--admin-bg-base)] border border-[var(--admin-border-base)] rounded-md px-2 py-2 text-xs focus:outline-none"
 dir="ltr"
 /> </div> </div> </div> </div> </div> </div>

 {/* ── Contact Info ──────────────────────────────────── */}
 <div className="bg-[var(--admin-bg-surface)] rounded-[var(--admin-radius-xl)] border border-[var(--admin-border-base)] overflow-hidden"> <div className="p-6 border-b border-[var(--admin-border-light)]"> <h2 className="text-lg font-bold text-[var(--admin-text-base)] mb-4"></h2> <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> <div> <label className="block text-sm font-bold text-[var(--admin-text-base)] mb-1.5">Têncửa hàng</label> <input
 type="text"
 value={info.storeName}
 onChange={e => updateInfo('storeName', e.target.value)}
 className={inputCls}
 /> </div> <div> <label className="block text-sm font-bold text-[var(--admin-text-base)] mb-1.5">Số điện thoại</label> <input
 type="text"
 value={info.phone}
 onChange={e => updateInfo('phone', e.target.value)}
 className={inputCls}
 dir="ltr"
 /> </div> <div> <label className="block text-sm font-bold text-[var(--admin-text-base)] mb-1.5">Mã WhatsApp</label> <input
 type="text"
 value={info.whatsapp}
 onChange={e => updateInfo('whatsapp', e.target.value)}
 className={inputCls}
 dir="ltr"
 /> </div> <div> <label className="block text-sm font-bold text-[var(--admin-text-base)] mb-1.5">Email </label> <input
 type="email"
 value={info.email}
 onChange={e => updateInfo('email', e.target.value)}
 className={inputCls}
 dir="ltr"
 /> </div> <div> <label className="block text-sm font-bold text-[var(--admin-text-base)] mb-1.5"></label> <input
 type="text"
 value={info.workingHours}
 onChange={e => updateInfo('workingHours', e.target.value)}
 className={inputCls}
 /> </div> <div> <label className="block text-sm font-bold text-[var(--admin-text-base)] mb-1.5">Google Maps</label> <input
 type="text"
 value={info.googleMapsUrl}
 onChange={e => updateInfo('googleMapsUrl', e.target.value)}
 className={inputCls}
 dir="ltr"
 /> </div> </div> </div> <div className="p-6 border-b border-[var(--admin-border-light)]"> <h2 className="text-lg font-bold text-[var(--admin-text-base)] mb-4">vàVị trí</h2> <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> <div> <label className="block text-sm font-bold text-[var(--admin-text-base)] mb-1.5">Đăng ký kinh doanh</label> <input
 type="text"
 value={info.commercialRegistration}
 onChange={e => updateInfo('commercialRegistration', e.target.value)}
 className={inputCls}
 /> </div> <div> <label className="block text-sm font-bold text-[var(--admin-text-base)] mb-1.5">Mã số thuế</label> <input
 type="text"
 value={info.taxNumber}
 onChange={e => updateInfo('taxNumber', e.target.value)}
 className={inputCls}
 /> </div> <div className="md:col-span-2"> <label className="block text-sm font-bold text-[var(--admin-text-base)] mb-1.5">Địa chỉ </label> <input
 type="text"
 value={info.address}
 onChange={e => updateInfo('address', e.target.value)}
 className={inputCls}
 /> </div> </div> </div> <div className="p-6"> <h2 className="text-lg font-bold text-[var(--admin-text-base)] mb-4"></h2> <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {(Object.keys(info.socialMedia) as Array<keyof typeof info.socialMedia>).map(key => (
 <div key={key}> <label className="block text-sm font-bold text-[var(--admin-text-base)] mb-1.5 capitalize">{key}</label> <input
 type="text"
 value={info.socialMedia[key]}
 onChange={e => updateSocial(key, e.target.value)}
 className={inputCls}
 dir="ltr"
 /> </div>
 ))}
 </div> </div> </div> </FadeIn>
 );
}

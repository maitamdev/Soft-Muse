"use client";

import React, { useState, useEffect } from 'react';
import { adminAr } from '@/lib/i18n/admin-ar';
import { SupabaseSettingsService as SettingsService } from '@/lib/services/settings-supabase.service';
import { Settings } from '@/data/mock/settings';
import { ImageUpload } from '@/components/admin/ui/ImageUpload';
import { toast } from 'sonner';

// SaaS UI Components
import { PageHeader, Skeleton } from '@/components/admin/design-system/Layout';
import { Card } from '@/components/admin/design-system/Card';
import { Button } from '@/components/admin/design-system/Button';
import { Input } from '@/components/admin/design-system/Input';

// Tabler Icons
import { 
 IconBuildingStore, 
 IconWorld, 
 IconCreditCard, 
 IconDeviceFloppy 
} from '@tabler/icons-react';

export default function SettingsPage() {
 const [settings, setSettings] = useState<Settings | null>(null);
 const [loading, setLoading] = useState(true);
 const [saving, setSaving] = useState(false);
 const [activeTab, setActiveTab] = useState<'store' | 'seo' | 'payment'>('store');

 const loadSettings = async () => {
 setLoading(true);
 try {
 const data = await SettingsService.getSettings();
 setSettings(data);
 } catch {
 toast.error(adminAr.toasts.unexpectedError);
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 loadSettings();
 }, []);

 const handleSave = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!settings) return;
 setSaving(true);
 try {
 await SettingsService.updateSettings(settings);
 toast.success(adminAr.toasts.dataSaved);
 } catch {
 toast.error(adminAr.toasts.unexpectedError);
 } finally {
 setSaving(false);
 }
 };

 if (loading || !settings) {
 return (
 <div className="space-y-6 max-w-6xl mx-auto"> <div className="flex items-center justify-between mb-8"> <div className="space-y-2"> <Skeleton className="h-8 w-48" /> <Skeleton className="h-4 w-72" /> </div> <Skeleton className="h-10 w-32" /> </div> <div className="flex gap-4 border-b border-[var(--admin-border-light)] pb-4"> <Skeleton className="h-10 w-32" /> <Skeleton className="h-10 w-32" /> <Skeleton className="h-10 w-32" /> </div> <div className="grid grid-cols-2 gap-6"> <Skeleton className="h-20" /> <Skeleton className="h-20" /> </div> </div>
 );
 }

 const tabs = [
 { id: 'store', label: adminAr.settings.tabs.store, icon: IconBuildingStore },
 { id: 'seo', label: adminAr.settings.tabs.seo, icon: IconWorld },
 { id: 'payment', label: adminAr.settings.tabs.payment, icon: IconCreditCard },
 ];

 return (
 <div className="max-w-6xl mx-auto space-y-6 pb-20"> <PageHeader 
 title={adminAr.settings.title}
 description={adminAr.settings.subtitle}
 actions={
 <Button 
 onClick={handleSave}
 isLoading={saving}
 leftIcon={<IconDeviceFloppy size={18} />}
 >
 {saving ? adminAr.table.loading : adminAr.common.save}
 </Button>
 }
 /> <Card className="flex flex-col md:flex-row min-h-[600px] overflow-hidden">
 
 {/* Tabs Sidebar */}
 <div className="w-full md:w-64 border-b md:border-b-0 md:border-l border-[var(--admin-border-light)] bg-[var(--admin-bg-elevated)] p-4"> <nav className="space-y-1">
 {tabs.map(tab => {
 const Icon = tab.icon;
 const isActive = activeTab === tab.id;
 return (
 <button
 key={tab.id}
 onClick={() => setActiveTab(tab.id as 'store' | 'seo' | 'payment')}
 className={`w-full flex items-center gap-3 px-4 py-3 rounded-[var(--admin-radius-md)] transition-all text-sm font-semibold ${
 isActive 
 ? 'bg-[var(--admin-bg-base)] text-[var(--admin-primary)] border border-[var(--admin-border-base)] shadow-sm' 
 : 'text-[var(--admin-text-muted)] hover:bg-[var(--admin-bg-hover)] hover:text-[var(--admin-text-base)]'
 }`}
 > <Icon size={18} className={isActive ? 'text-[var(--admin-primary)]' : 'text-[var(--admin-text-subtle)]'} stroke={isActive ? 2 : 1.5} />
 {tab.label}
 </button>
 );
 })}
 </nav> </div>

 {/* Form Content */}
 <div className="flex-1 p-6 md:p-8 bg-[var(--admin-bg-base)]"> <form onSubmit={handleSave} className="space-y-8 max-w-2xl">
 
 {activeTab === 'store' && (
 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"> <div className="border-b border-[var(--admin-border-light)] pb-4"> <h3 className="text-xl font-bold text-[var(--admin-text-base)]">{adminAr.settings.tabs.store}</h3> <p className="text-sm text-[var(--admin-text-muted)] mt-1">Thông tin cơ bản.</p> </div> <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> <div> <label className="block text-sm font-medium mb-1.5 text-[var(--admin-text-base)]">{adminAr.settings.store.name}</label> <Input type="text" value={settings.store.storeName} onChange={(e) => setSettings({ ...settings, store: { ...settings.store, storeName: e.target.value}})} /> </div> <div> <label className="block text-sm font-medium mb-1.5 text-[var(--admin-text-base)]">{adminAr.settings.store.email}</label> <Input type="email" value={settings.store.storeEmail} onChange={(e) => setSettings({ ...settings, store: { ...settings.store, storeEmail: e.target.value}})} /> </div> <div> <label className="block text-sm font-medium mb-1.5 text-[var(--admin-text-base)]">{adminAr.settings.store.phone}</label> <Input type="text" value={settings.store.storePhone} onChange={(e) => setSettings({ ...settings, store: { ...settings.store, storePhone: e.target.value}})} /> </div> <div> <label className="block text-sm font-medium mb-1.5 text-[var(--admin-text-base)]">{adminAr.settings.store.currency}</label> <select value={settings.store.currency} onChange={(e) => setSettings({ ...settings, store: { ...settings.store, currency: e.target.value}})} className="w-full px-4 py-2 bg-[var(--admin-bg-base)] border border-[var(--admin-border-base)] rounded-[var(--admin-radius-md)] outline-none focus:border-[var(--admin-primary)] focus:ring-1 focus:ring-[var(--admin-primary)] text-sm"> <option value="VND">Việt Nam (VND)</option> <option value="USD">(USD)</option> </select> </div> <div className="md:col-span-2"> <label className="block text-sm font-medium mb-1.5 text-[var(--admin-text-base)]">{adminAr.settings.store.address}</label> <textarea rows={2} value={settings.store.address} onChange={(e) => setSettings({ ...settings, store: { ...settings.store, address: e.target.value}})} className="w-full px-4 py-2 bg-[var(--admin-bg-base)] border border-[var(--admin-border-base)] rounded-[var(--admin-radius-md)] outline-none focus:border-[var(--admin-primary)] focus:ring-1 focus:ring-[var(--admin-primary)] text-sm resize-y" /> </div> <div className="space-y-2"> <label className="block text-sm font-medium mb-1.5 text-[var(--admin-text-base)]">{adminAr.settings.store.logo}</label> <ImageUpload 
 multiple={false} 
 images={settings.store.logo ? [settings.store.logo] : []} 
 onChange={(images) => setSettings({ ...settings, store: { ...settings.store, logo: images[0] || ''}})} 
 /> </div> <div className="space-y-2"> <label className="block text-sm font-medium mb-1.5 text-[var(--admin-text-base)]">{adminAr.settings.store.favicon}</label> <ImageUpload 
 multiple={false} 
 images={settings.store.favicon ? [settings.store.favicon] : []} 
 onChange={(images) => setSettings({ ...settings, store: { ...settings.store, favicon: images[0] || ''}})} 
 /> </div> </div> </div>
 )}

 {activeTab === 'seo' && (
 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"> <div className="border-b border-[var(--admin-border-light)] pb-4"> <h3 className="text-xl font-bold text-[var(--admin-text-base)]">{adminAr.settings.tabs.seo}</h3> <p className="text-sm text-[var(--admin-text-muted)] mt-1">Cửa hàng trongCông cụ tìm kiếm.</p> </div> <div className="space-y-6"> <div> <label className="block text-sm font-medium mb-1.5 text-[var(--admin-text-base)]">{adminAr.settings.seo.metaTitle}</label> <Input type="text" value={settings.seo.metaTitle} onChange={(e) => setSettings({ ...settings, seo: { ...settings.seo, metaTitle: e.target.value}})} /> <p className="text-xs text-[var(--admin-text-muted)] mt-1.5">không 60.</p> </div> <div> <label className="block text-sm font-medium mb-1.5 text-[var(--admin-text-base)]">{adminAr.settings.seo.metaDescription}</label> <textarea rows={3} value={settings.seo.metaDescription} onChange={(e) => setSettings({ ...settings, seo: { ...settings.seo, metaDescription: e.target.value}})} className="w-full px-4 py-2 bg-[var(--admin-bg-base)] border border-[var(--admin-border-base)] rounded-[var(--admin-radius-md)] outline-none focus:border-[var(--admin-primary)] focus:ring-1 focus:ring-[var(--admin-primary)] text-sm resize-y" /> <p className="text-xs text-[var(--admin-text-muted)] mt-1.5">không 160.</p> </div> <div> <label className="block text-sm font-medium mb-1.5 text-[var(--admin-text-base)]">{adminAr.settings.seo.metaKeywords}</label> <Input type="text" value={settings.seo.metaKeywords} onChange={(e) => setSettings({ ...settings, seo: { ...settings.seo, metaKeywords: e.target.value}})} placeholder=", :,," /> </div> <div className="space-y-2 max-w-sm"> <label className="block text-sm font-medium mb-1.5 text-[var(--admin-text-base)]">{adminAr.settings.seo.ogImage}</label> <ImageUpload 
 multiple={false} 
 images={settings.seo.ogImage ? [settings.seo.ogImage] : []} 
 onChange={(images) => setSettings({ ...settings, seo: { ...settings.seo, ogImage: images[0] || ''}})} 
 /> <p className="text-xs text-[var(--admin-text-muted)] mt-1.5">Hình ảnhCửa hàng (1200x630 ).</p> </div> </div> </div>
 )}

 {activeTab === 'payment' && (
 <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"> <div className="border-b border-[var(--admin-border-light)] pb-4"> <h3 className="text-xl font-bold text-[var(--admin-text-base)]">{adminAr.settings.tabs.payment}</h3> <p className="text-sm text-[var(--admin-text-muted)] mt-1">Thanh toán và thuế.</p> </div> <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> <div> <label className="block text-sm font-medium mb-1.5 text-[var(--admin-text-base)]">{adminAr.settings.payment.currencyFormat}</label> <Input type="text" value={settings.payment.currencyFormat} onChange={(e) => setSettings({ ...settings, payment: { ...settings.payment, currencyFormat: e.target.value}})} placeholder=":{value} " /> </div> <div> <label className="block text-sm font-medium mb-1.5 text-[var(--admin-text-base)]">{adminAr.settings.payment.taxRate}</label> <div className="relative"> <Input type="number" min={0} max={100} value={settings.payment.taxRate} onChange={(e) => setSettings({ ...settings, payment: { ...settings.payment, taxRate: Number(e.target.value)}})} /> <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--admin-text-muted)] font-medium">%</span> </div> </div> </div> <div className="space-y-4 pt-6 border-t border-[var(--admin-border-light)]"> <h4 className="font-semibold text-[var(--admin-text-base)] mb-4"></h4> <label className="flex items-center justify-between p-4 border border-[var(--admin-border-base)] rounded-[var(--admin-radius-lg)] bg-[var(--admin-bg-elevated)] cursor-pointer hover:border-[var(--admin-primary)] transition-colors group"> <div> <span className="font-bold text-[var(--admin-text-base)] block mb-1">Stripe</span> <span className="text-xs text-[var(--admin-text-muted)] font-medium"></span> </div> <div className={`w-12 h-7 rounded-full relative transition-colors ${settings.payment.enableStripe ? 'bg-[var(--admin-success)]' : 'bg-[var(--admin-border-strong)]'}`}> <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform shadow-sm ${settings.payment.enableStripe ? '-translate-x-6' : 'translate-x-1'}`}></div> </div> <input type="checkbox" className="hidden" checked={settings.payment.enableStripe} onChange={(e) => setSettings({ ...settings, payment: { ...settings.payment, enableStripe: e.target.checked}})} /> </label> <label className="flex items-center justify-between p-4 border border-[var(--admin-border-base)] rounded-[var(--admin-radius-lg)] bg-[var(--admin-bg-elevated)] cursor-pointer hover:border-[var(--admin-primary)] transition-colors group"> <div> <span className="font-bold text-[var(--admin-text-base)] block mb-1">PayPal</span> <span className="text-xs text-[var(--admin-text-muted)] font-medium"></span> </div> <div className={`w-12 h-7 rounded-full relative transition-colors ${settings.payment.enablePaypal ? 'bg-[var(--admin-success)]' : 'bg-[var(--admin-border-strong)]'}`}> <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform shadow-sm ${settings.payment.enablePaypal ? '-translate-x-6' : 'translate-x-1'}`}></div> </div> <input type="checkbox" className="hidden" checked={settings.payment.enablePaypal} onChange={(e) => setSettings({ ...settings, payment: { ...settings.payment, enablePaypal: e.target.checked}})} /> </label> <label className="flex items-center justify-between p-4 border border-[var(--admin-border-base)] rounded-[var(--admin-radius-lg)] bg-[var(--admin-bg-elevated)] cursor-pointer hover:border-[var(--admin-primary)] transition-colors group"> <div> <span className="font-bold text-[var(--admin-text-base)] block mb-1">(COD)</span> <span className="text-xs text-[var(--admin-text-muted)] font-medium">mãĐơn hàng</span> </div> <div className={`w-12 h-7 rounded-full relative transition-colors ${settings.payment.enableCOD ? 'bg-[var(--admin-success)]' : 'bg-[var(--admin-border-strong)]'}`}> <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform shadow-sm ${settings.payment.enableCOD ? '-translate-x-6' : 'translate-x-1'}`}></div> </div> <input type="checkbox" className="hidden" checked={settings.payment.enableCOD} onChange={(e) => setSettings({ ...settings, payment: { ...settings.payment, enableCOD: e.target.checked}})} /> </label> </div> </div>
 )}

 </form> </div> </Card> </div>
 );
}

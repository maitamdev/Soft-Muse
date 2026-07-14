'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ProductService } from '@/lib/services/product.service';
import { CategoryService } from '@/lib/services/category.service';
import { CollectionService } from '@/lib/services/collection.service';
import { BrandService } from '@/lib/services/brand.service';
import { Product, ProductStatus, ProductVariant } from '@/data/mock/products';
import { formatCurrency } from '@/lib/utils/formatters';
import { useProtectedAutosave } from '@/hooks/useProtectedAutosave';
import { toast } from 'sonner';
import { IconArrowRight, IconDeviceFloppy, IconCloud, IconCloudOff, IconRefresh, IconEye, IconCalendar, IconPlus, IconTrash, IconPhoto, IconHistory } from '@tabler/icons-react';
import { ActivityTimeline } from '@/components/admin/ActivityTimeline';
import { getTimelineForEntity } from '@/data/mock/timeline';
import { MediaLibraryModal } from '@/components/admin/MediaLibraryModal';

export default function ProductEditorPage({ params }: { params: Promise<{ id: string }> }) {
 const router = useRouter();
 const resolvedParams = use(params);
 const id = resolvedParams.id;
 const isNew = id === 'new';

 const [initialLoading, setInitialLoading] = useState(true);
 const [activeTab, setActiveTab] = useState<'general' | 'costing' | 'variants' | 'timeline' | 'revisions'>('general');
 const [showMediaLib, setShowMediaLib] = useState(false);
 const [showPreview, setShowPreview] = useState(false);

 const [productData, setProductData] = useState<Product | null>(null);

 // Dynamic metadata options (single source of truth → Category/Collection/Brand services)
 const [categoryNames, setCategoryNames] = useState<string[]>([]);
 const [collectionNames, setCollectionNames] = useState<string[]>([]);
 const [brandNames, setBrandNames] = useState<string[]>([]);

 useEffect(() => {
 CategoryService.getCategories().then(list => setCategoryNames(list.map(c => c.name)));
 CollectionService.getCollections().then(list => setCollectionNames(list.map(c => c.name)));
 BrandService.getBrands().then(list => setBrandNames(list.map(b => b.name)));
 }, []);

 // Keep the product's current value selectable even if it predates the managed lists.
 const withCurrent = (names: string[], current: string) =>
 current && !names.includes(current) ? [current, ...names] : names;

 const [manualSaving, setManualSaving] = useState(false);

 const { data, updateData, status, isDirty } = useProtectedAutosave<Product | null>(productData, {
 debounceMs: 1500,
 onSave: async (currentData) => {
 if (!currentData || isNew) return;
 try {
 await ProductService.updateProduct(currentData.id, currentData);
 } catch (err) {
 // Surface the reason (duplicate SKU/slug, invalid discount, no image, …)
 // instead of failing silently; rethrow so the autosave status shows error.
 toast.error(err instanceof Error ? err.message : 'Lưu ');
 throw err;
 }
 }
 });

 useEffect(() => {
 if (isNew) {
 const empty: Product = {
 id: '', name: '', slug: '', shortDescription: '', description: '',
 category: '', collection: '', season: '', brand: '', tags: [],
 price: 0, comparePrice: 0, costPrice: 0, sku: '', barcode: '',
 stock: 0, lowStockLimit: 5, material: '', weight: 0, variants: [],
 featured: false, bestSeller: false, newArrival: false,
 status: 'draft', revisions: [], images: [],
 seo: { metaTitle: '', metaDescription: '', keywords: '', canonicalUrl: '', ogTitle: '', ogDescription: '' },
 stats: { views: 0, orders: 0, revenue: 0, wishlistCount: 0, cartCount: 0, reviewsCount: 0 },
 costing: { fabric: 0, accessories: 0, manufacturing: 0, printing: 0, packaging: 0, photography: 0, shipping: 0, marketing: 0, taxes: 0, marketplaceFees: 0, otherExpenses: 0 }
 };
 setProductData(empty);
 setInitialLoading(false);
 } else {
 ProductService.getProduct(id).then(res => {
 if (res) {
 setProductData(res);
 updateData(res);
 }
 setInitialLoading(false);
 });
 }
 }, [id, isNew]);

 const handleManualSave = async () => {
 if (!data) return;
 setManualSaving(true);
 try {
 if (isNew) {
 const created = await ProductService.createProduct(data);
 toast.success('Đã tạo sản phẩm thành công');
 router.push(`/admin/products/${created.id}`);
 } else {
 await ProductService.updateProduct(data.id, data);
 toast.success('đãLưu thành công');
 }
 } catch (err) {
 toast.error(err instanceof Error ? err.message : 'Lưu sản phẩm');
 } finally {
 setManualSaving(false);
 }
 };

 const handleCostingChange = (field: keyof Product['costing'], value: number) => {
 updateData((prev) => {
 if (!prev) return prev;
 const newCosting = { ...prev.costing, [field]: value };
 const totalCost = Object.values(newCosting).reduce((acc, val) => acc + (val || 0), 0);
 return { ...prev, costing: newCosting, costPrice: totalCost };
 });
 };

 // --- Variant CRUD (persisted through the autosave → ProductService.updateProduct) ---
 const addVariant = () => {
 updateData((prev) => {
 if (!prev) return prev;
 const newVariant: ProductVariant = {
 id: `var_${Date.now()}`,
 sku: `${prev.sku || 'SKU'}-${prev.variants.length + 1}`,
 color: '',
 size: '',
 price: prev.price,
 stock: 0,
 status: 'active',
 };
 return { ...prev, variants: [...prev.variants, newVariant] };
 });
 };

 const updateVariant = (id: string, patch: Partial<ProductVariant>) => {
 updateData((prev) =>
 prev ? { ...prev, variants: prev.variants.map((v) => (v.id === id ? { ...v, ...patch } : v)) } : prev
 );
 };

 const removeVariant = (id: string) => {
 updateData((prev) =>
 prev ? { ...prev, variants: prev.variants.filter((v) => v.id !== id) } : prev
 );
 };

 if (initialLoading) {
 return <div className="p-8 text-center text-[var(--admin-text-muted)]">Đang tải.</div>;
 }

 if (!data) {
 return <div className="p-8 text-center text-[var(--admin-danger)]">trên sản phẩm.</div>;
 }

 const margin = ProductService.getProfitMargin(data.price, data.costPrice);
 const netProfit = data.price - data.costPrice;
 const roi = data.costPrice > 0 ? ((netProfit / data.costPrice) * 100).toFixed(2) : 0;

 const cardClass = "bg-[var(--admin-bg-card)] p-6 rounded-[var(--admin-radius-xl)] border border-[var(--admin-border-base)] shadow-[var(--admin-shadow-sm)]";
 const inputClass = "w-full border border-[var(--admin-border-base)] bg-[var(--admin-bg-base)] text-[var(--admin-text-base)] rounded-[var(--admin-radius-md)] px-4 py-2 outline-none focus:border-[var(--admin-primary)] transition-colors";
 const labelClass = "block text-sm font-medium text-[var(--admin-text-muted)] mb-1";

 return (
 <div className="max-w-6xl mx-auto space-y-6 pb-24" dir="ltr">
 {/* Header & Autosave Status */}
 <div className="sticky top-0 z-40 bg-[var(--admin-bg-surface)]/90 backdrop-blur-md border-b border-[var(--admin-border-base)] pb-4 pt-2 -mx-4 px-4 sm:-mx-8 sm:px-8"> <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"> <div className="flex items-center gap-4"> <button onClick={() => router.push('/admin/products')} className="p-2 hover:bg-[var(--admin-bg-hover)] rounded-full transition-colors text-[var(--admin-text-muted)] hover:text-[var(--admin-text-base)]"> <IconArrowRight size={20} /> </button> <div> <h1 className="text-2xl font-bold text-[var(--admin-text-base)]">{isNew ? 'Thêm sản phẩm mới' : data.name || 'mã'}</h1> <div className="flex items-center gap-3 mt-1 text-sm"> <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
 data.status === 'published'
 ? 'bg-[var(--admin-success-muted)] text-[var(--admin-success)]'
 : 'bg-[var(--admin-warning-muted)] text-[var(--admin-warning)]'
 }`}>
 {data.status === 'published' ? 'Đã xuất bản' : data.status === 'draft' ? 'Nháp' : data.status}
 </span>
 {!isNew && (
 <div className="flex items-center gap-1.5 text-[var(--admin-text-subtle)] font-mono text-xs">
 {status === 'saving' && <><IconRefresh size={12} className="animate-spin" /> Lưu.</>}
 {status === 'saved' && <><IconCloud size={12} className="text-[var(--admin-success)]" /> đãLưu</>}
 {status === 'error' && <><IconCloudOff size={12} className="text-[var(--admin-danger)]" /> Lưu</>}
 {status === 'idle' && !isDirty && <><IconCloud size={12} /> </>}
 {isDirty && status === 'idle' && <><span className="w-2 h-2 rounded-full bg-[var(--admin-warning)]" /> không</>}
 </div>
 )}
 </div> </div> </div> <div className="flex items-center gap-2"> <button className="flex items-center gap-2 px-4 py-2 bg-[var(--admin-bg-elevated)] text-[var(--admin-text-base)] rounded-[var(--admin-radius-md)] text-sm font-medium hover:bg-[var(--admin-bg-hover)] border border-[var(--admin-border-base)]" onClick={() => setShowPreview(true)}> <IconEye size={16} /> Cửa hàng
 </button> <div className="h-8 w-px bg-[var(--admin-border-base)] mx-1" /> <select
 className="bg-[var(--admin-bg-card)] border border-[var(--admin-border-base)] text-[var(--admin-text-base)] rounded-[var(--admin-radius-md)] text-sm px-3 py-2 outline-none focus:border-[var(--admin-primary)] transition-colors"
 value={data.status}
 onChange={(e) => updateData({ status: e.target.value as ProductStatus })}
 > <option value="draft">Nháp</option> <option value="published"></option> <option value="scheduled"></option> <option value="hidden"></option> <option value="archived">Lưu trữ</option> </select> <button onClick={handleManualSave} disabled={manualSaving} className="flex items-center gap-2 px-6 py-2 bg-[var(--admin-primary)] text-white rounded-[var(--admin-radius-md)] text-sm font-medium hover:bg-[var(--admin-primary-hover)] shadow-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
 {manualSaving ? <IconRefresh size={16} className="animate-spin" /> : <IconDeviceFloppy size={16} />}
 {manualSaving ? 'Lưu.' : isNew ? 'sản phẩm' : 'Lưu'}
 </button> </div> </div> </div>

 {/* Scheduler UI */}
 {data.status === 'scheduled' && (
 <div className="bg-[var(--admin-info-muted)] border border-[var(--admin-info)]/20 text-[var(--admin-text-base)] p-4 rounded-[var(--admin-radius-xl)] flex items-center gap-4 animate-in fade-in zoom-in-95"> <IconCalendar size={20} className="text-[var(--admin-info)]" /> <div className="flex-1"> <h4 className="font-semibold text-sm">Lưu trữ</h4> <div className="flex flex-wrap gap-4 mt-2"> <label className="flex items-center gap-2 text-sm">
 trong:<input type="datetime-local" className="bg-[var(--admin-bg-card)] border border-[var(--admin-border-base)] text-[var(--admin-text-base)] rounded px-2 py-1 outline-none text-xs focus:border-[var(--admin-primary)]" value={data.publishAt || ''} onChange={(e) => updateData({ publishAt: e.target.value })} /> </label> <label className="flex items-center gap-2 text-sm">
 trong:<input type="datetime-local" className="bg-[var(--admin-bg-card)] border border-[var(--admin-border-base)] text-[var(--admin-text-base)] rounded px-2 py-1 outline-none text-xs focus:border-[var(--admin-primary)]" value={data.hideAt || ''} onChange={(e) => updateData({ hideAt: e.target.value })} /> </label> </div> </div> </div>
 )}

 {/* Tabs */}
 <div className="flex space-x-reverse space-x-2 border-b border-[var(--admin-border-base)]">
 {[
 { id: 'general', label: '' },
 { id: 'costing', label: '' },
 { id: 'variants', label: '' },
 { id: 'timeline', label: '' },
 { id: 'revisions', label: '(Revisions)' }
 ].map(tab => (
 <button
 key={tab.id}
 onClick={() => setActiveTab(tab.id as any)}
 className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${
 activeTab === tab.id
 ? 'border-[var(--admin-primary)] text-[var(--admin-primary)]'
 : 'border-transparent text-[var(--admin-text-subtle)] hover:text-[var(--admin-text-base)] hover:border-[var(--admin-border-strong)]'
 }`}
 >
 {tab.label}
 </button>
 ))}
 </div> <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"> <div className="lg:col-span-2 space-y-6">

 {/* GENERAL TAB */}
 {activeTab === 'general' && (
 <div className="space-y-6 animate-in fade-in"> <div className={cardClass + " space-y-4"}> <h2 className="text-lg font-bold text-[var(--admin-text-base)]">Thông tin cơ bản</h2> <div> <label className={labelClass}>Tênsản phẩm</label> <input type="text" className={inputClass} value={data.name} onChange={(e) => updateData({ name: e.target.value })} placeholder=":" /> </div> <div> <label className={labelClass}>Mô tả </label> <input type="text" className={inputClass} value={data.shortDescription} onChange={(e) => updateData({ shortDescription: e.target.value })} /> </div> <div> <label className={labelClass}>Mô tả (CMS Rich Text Mock)</label> <textarea className={inputClass + " min-h-[150px]"} value={data.description} onChange={(e) => updateData({ description: e.target.value })} /> </div> </div> <div className={cardClass + " space-y-4"}> <div className="flex items-center justify-between"> <h2 className="text-lg font-bold text-[var(--admin-text-base)]">Hình ảnh vàThư viện media</h2> <button onClick={() => setShowMediaLib(true)} className="text-sm font-medium text-[var(--admin-primary)] hover:underline flex items-center gap-1"> <IconPhoto size={16} /> Thư viện media
 </button> </div>
 {data.images.length > 0 ? (
 <div className="grid grid-cols-4 gap-4">
 {data.images.map((img, idx) => (
 <div key={idx} className="relative aspect-square rounded-[var(--admin-radius-md)] border border-[var(--admin-border-base)] overflow-hidden group"> <img src={img} alt="Product" className="w-full h-full object-cover" /> <button onClick={() => updateData({ images: data.images.filter((_, i) => i !== idx) })} className="absolute top-2 right-2 p-1.5 bg-[var(--admin-bg-card)]/80 text-[var(--admin-danger)] rounded-md opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm shadow-sm hover:bg-[var(--admin-bg-card)]"> <IconTrash size={16} /> </button> </div>
 ))}
 <button onClick={() => setShowMediaLib(true)} className="flex flex-col items-center justify-center aspect-square rounded-[var(--admin-radius-md)] border-2 border-dashed border-[var(--admin-border-strong)] text-[var(--admin-text-subtle)] hover:border-[var(--admin-primary)] hover:text-[var(--admin-primary)] transition-colors bg-[var(--admin-bg-elevated)]"> <IconPlus size={24} className="mb-2" /> <span className="text-xs font-medium">Thêm ảnh</span> </button> </div>
 ) : (
 <div onClick={() => setShowMediaLib(true)} className="flex flex-col items-center justify-center py-12 rounded-[var(--admin-radius-md)] border-2 border-dashed border-[var(--admin-border-strong)] text-[var(--admin-text-subtle)] hover:border-[var(--admin-primary)] hover:text-[var(--admin-primary)] cursor-pointer transition-colors bg-[var(--admin-bg-elevated)]"> <IconPhoto size={48} className="mb-4 opacity-50" /> <p className="font-medium">Thư viện media Hình ảnh</p> </div>
 )}
 </div> </div>
 )}

 {/* COSTING TAB */}
 {activeTab === 'costing' && (
 <div className="space-y-6 animate-in fade-in"> <div className={cardClass}> <h2 className="text-lg font-bold text-[var(--admin-text-base)] mb-6">(ERP Linked)</h2> <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8 p-6 bg-[var(--admin-bg-elevated)] rounded-[var(--admin-radius-xl)] border border-[var(--admin-border-light)]"> <div className="flex flex-col gap-1"> <span className="text-sm font-medium text-[var(--admin-text-subtle)]">tổng</span> <span className="text-2xl font-bold text-[var(--admin-text-base)]">{formatCurrency(data.costPrice)}</span> </div> <div className="flex flex-col gap-1"> <span className="text-sm font-medium text-[var(--admin-text-subtle)]">giá</span> <input type="number" className="text-2xl font-bold text-[var(--admin-primary)] bg-transparent outline-none border-b border-[var(--admin-primary)]/30 focus:border-[var(--admin-primary)] w-full transition-colors" value={data.price} onChange={(e) => updateData({ price: Number(e.target.value) })} /> </div> <div className="flex flex-col gap-1"> <span className="text-sm font-medium text-[var(--admin-text-subtle)]">giá (Giảm giá)</span> <input type="number" className="text-2xl font-bold text-[var(--admin-text-subtle)] line-through bg-transparent outline-none border-b border-[var(--admin-border-base)] focus:border-[var(--admin-border-strong)] w-full transition-colors" value={data.comparePrice} onChange={(e) => updateData({ comparePrice: Number(e.target.value) })} /> </div> <div className="flex flex-col gap-1 mt-4"> <span className="text-sm font-medium text-[var(--admin-text-subtle)]">Lợi nhuận ròng</span> <span className={`text-2xl font-bold ${netProfit > 0 ? 'text-[var(--admin-success)]' : 'text-[var(--admin-danger)]'}`}>{formatCurrency(netProfit)}</span> </div> <div className="flex flex-col gap-1 mt-4"> <span className="text-sm font-medium text-[var(--admin-text-subtle)]">(Margin)</span> <span className={`text-2xl font-bold ${margin >= 40 ? 'text-[var(--admin-success)]' : margin > 20 ? 'text-[var(--admin-warning)]' : 'text-[var(--admin-danger)]'}`}>{margin}%</span> </div> <div className="flex flex-col gap-1 mt-4"> <span className="text-sm font-medium text-[var(--admin-text-subtle)]">trên (ROI)</span> <span className={`text-2xl font-bold ${Number(roi) > 100 ? 'text-[var(--admin-success)]' : 'text-[var(--admin-warning)]'}`}>{roi}%</span> </div> </div> <h3 className="font-semibold text-[var(--admin-text-base)] mb-4"></h3> <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 {[
 { key: 'fabric', label: '' },
 { key: 'accessories', label: '' },
 { key: 'manufacturing', label: 'may đo' },
 { key: 'printing', label: 'In ' },
 { key: 'packaging', label: 'Đónggói ' },
 { key: 'photography', label: '' },
 { key: 'shipping', label: 'Vận chuyển ' },
 { key: 'marketing', label: 'Tùy chỉnh' },
 { key: 'taxes', label: 'Thuế ' },
 { key: 'marketplaceFees', label: '' },
 { key: 'otherExpenses', label: '' },
 ].map(({ key, label }) => (
 <div key={key} className="flex flex-col"> <label className="text-xs font-medium text-[var(--admin-text-muted)] mb-1">{label}</label> <div className="relative"> <input
 type="number"
 className="w-full border border-[var(--admin-border-base)] bg-[var(--admin-bg-base)] text-[var(--admin-text-base)] rounded-[var(--admin-radius-md)] px-4 py-2 outline-none focus:border-[var(--admin-primary)] pr-12 font-mono text-left transition-colors"
 value={data.costing[key as keyof Product['costing']] || 0}
 onChange={(e) => handleCostingChange(key as keyof Product['costing'], Number(e.target.value))}
 /> <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--admin-text-subtle)] text-sm">đ</span> </div> </div>
 ))}
 </div> </div> </div>
 )}

 {/* VARIANTS TAB */}
 {activeTab === 'variants' && (
 <div className="space-y-6 animate-in fade-in"> <div className={cardClass}> <div className="flex items-center justify-between mb-6"> <div> <h2 className="text-lg font-bold text-[var(--admin-text-base)]">(Variant Generator)</h2> <p className="text-sm text-[var(--admin-text-subtle)] mt-1">trên</p> </div> <button onClick={addVariant} className="px-4 py-2 bg-[var(--admin-primary)] text-white text-sm font-medium rounded-[var(--admin-radius-md)] hover:bg-[var(--admin-primary-hover)] transition-colors flex items-center gap-1"> <IconPlus size={16} /> Thêm </button> </div>

 {data.variants.length > 0 ? (
 <div className="overflow-x-auto rounded-[var(--admin-radius-md)] border border-[var(--admin-border-base)]"> <table className="w-full text-left text-sm"> <thead className="bg-[var(--admin-bg-elevated)] text-[var(--admin-text-subtle)] border-b border-[var(--admin-border-base)]"> <tr> <th className="px-3 py-3 font-medium">Kích cỡ</th> <th className="px-3 py-3 font-medium"></th> <th className="px-3 py-3 font-medium">ـ SKU</th> <th className="px-3 py-3 font-medium">Giá</th> <th className="px-3 py-3 font-medium">Tồn kho</th> <th className="px-3 py-3 font-medium">Trạng thái</th> <th className="px-3 py-3 font-medium w-12"></th> </tr> </thead> <tbody>
 {data.variants.map((v) => (
 <tr key={v.id} className="border-b border-[var(--admin-border-light)] last:border-0 hover:bg-[var(--admin-bg-hover)] transition-colors"> <td className="px-3 py-2"> <input type="text" placeholder="M / 40" className="border border-[var(--admin-border-base)] bg-[var(--admin-bg-base)] text-[var(--admin-text-base)] rounded px-2 py-1 w-20 text-xs outline-none focus:border-[var(--admin-primary)] transition-colors" value={v.size} onChange={(e) => updateVariant(v.id, { size: e.target.value })} /> </td> <td className="px-3 py-2"> <div className="flex items-center gap-1.5"> <input type="color" className="w-7 h-7 rounded border border-[var(--admin-border-base)] bg-transparent cursor-pointer p-0.5" value={/^#/.test(v.color) ? v.color : '#000000'} onChange={(e) => updateVariant(v.id, { color: e.target.value })} /> <input type="text" placeholder="Nhập nội dung" className="border border-[var(--admin-border-base)] bg-[var(--admin-bg-base)] text-[var(--admin-text-base)] rounded px-2 py-1 w-20 text-xs outline-none focus:border-[var(--admin-primary)] transition-colors" value={v.color} onChange={(e) => updateVariant(v.id, { color: e.target.value })} /> </div> </td> <td className="px-3 py-2"><input type="text" className="border border-[var(--admin-border-base)] bg-[var(--admin-bg-base)] text-[var(--admin-text-base)] rounded px-2 py-1 w-full min-w-[120px] text-xs font-mono outline-none focus:border-[var(--admin-primary)] transition-colors" value={v.sku} onChange={(e) => updateVariant(v.id, { sku: e.target.value })} /></td> <td className="px-3 py-2"><input type="number" min={0} className="border border-[var(--admin-border-base)] bg-[var(--admin-bg-base)] text-[var(--admin-text-base)] rounded px-2 py-1 w-24 text-xs outline-none focus:border-[var(--admin-primary)] transition-colors" value={v.price} onChange={(e) => updateVariant(v.id, { price: Number(e.target.value) })} /></td> <td className="px-3 py-2"><input type="number" min={0} className="border border-[var(--admin-border-base)] bg-[var(--admin-bg-base)] text-[var(--admin-text-base)] rounded px-2 py-1 w-20 text-xs outline-none focus:border-[var(--admin-primary)] transition-colors" value={v.stock} onChange={(e) => updateVariant(v.id, { stock: Number(e.target.value) })} /></td> <td className="px-3 py-2"> <select className="border border-[var(--admin-border-base)] bg-[var(--admin-bg-base)] text-[var(--admin-text-base)] rounded px-2 py-1 text-xs outline-none focus:border-[var(--admin-primary)] transition-colors" value={v.status ?? 'active'} onChange={(e) => updateVariant(v.id, { status: e.target.value as ProductVariant['status'] })}> <option value="active">Hoạt động</option> <option value="inactive"></option> </select> </td> <td className="px-3 py-2"> <button onClick={() => removeVariant(v.id)} title="Xóa " className="p-1.5 text-[var(--admin-danger)] hover:bg-[var(--admin-danger)]/10 rounded transition-colors"> <IconTrash size={16} /> </button> </td> </tr>
 ))}
 </tbody> </table> </div>
 ) : (
 <div className="py-8 text-center text-[var(--admin-text-subtle)] bg-[var(--admin-bg-elevated)] rounded-[var(--admin-radius-md)] border border-dashed border-[var(--admin-border-base)]">
 Không có.«Thêm » (kích cỡ, màu, ).</div>
 )}
 </div> </div>
 )}

 {/* TIMELINE TAB */}
 {activeTab === 'timeline' && (
 <div className="space-y-6 animate-in fade-in"> <div className={cardClass}> <h2 className="text-lg font-bold text-[var(--admin-text-base)] mb-6">sản phẩm (Audit Log)</h2> <ActivityTimeline events={getTimelineForEntity('product', id)} /> </div> </div>
 )}

 {/* REVISIONS TAB */}
 {activeTab === 'revisions' && (
 <div className="space-y-6 animate-in fade-in"> <div className={cardClass}> <h2 className="text-lg font-bold text-[var(--admin-text-base)] mb-6">(Revisions)</h2>
 {data.revisions && data.revisions.length > 0 ? (
 <div className="space-y-4">
 {data.revisions.map((rev, idx) => (
 <div key={rev.versionId} className="flex items-center justify-between p-4 border border-[var(--admin-border-base)] rounded-[var(--admin-radius-lg)] bg-[var(--admin-bg-elevated)] hover:bg-[var(--admin-bg-card)] transition-colors"> <div className="flex items-center gap-4"> <div className="w-10 h-10 rounded-full bg-[var(--admin-primary-muted)] text-[var(--admin-primary)] flex items-center justify-center"> <IconHistory size={18} /> </div> <div> <p className="font-semibold text-sm text-[var(--admin-text-base)]">{idx === 0 ? '(Bản sao)' : ''}</p> <p className="text-xs text-[var(--admin-text-subtle)] mt-1">{new Date(rev.timestamp).toLocaleString('vi-VN')}</p> </div> </div> <button
 onClick={() => {
 if (confirm('Bạn có chắc muốn nàyBản sao؟')) {
 updateData(rev.snapshot);
 }
 }}
 className="px-4 py-2 bg-[var(--admin-bg-card)] border border-[var(--admin-border-base)] text-[var(--admin-primary)] text-sm font-medium rounded-[var(--admin-radius-md)] hover:border-[var(--admin-primary)] hover:bg-[var(--admin-primary-muted)] transition-colors"
 > </button> </div>
 ))}
 </div>
 ) : (
 <div className="py-8 text-center text-[var(--admin-text-subtle)] bg-[var(--admin-bg-elevated)] rounded-[var(--admin-radius-md)] border border-dashed border-[var(--admin-border-base)]">
 Không có.</div>
 )}
 </div> </div>
 )}

 </div>

 {/* Sidebar Organization / SEO */}
 <div className="space-y-6"> <div className="bg-[var(--admin-bg-card)] p-5 rounded-[var(--admin-radius-xl)] border border-[var(--admin-border-base)] shadow-[var(--admin-shadow-sm)] space-y-4"> <h3 className="font-bold text-[var(--admin-text-base)] border-b border-[var(--admin-border-light)] pb-2">Phân loại </h3> <div> <label className="block text-xs font-medium text-[var(--admin-text-muted)] mb-1">Danh mục (Category)</label> <select className="w-full border border-[var(--admin-border-base)] bg-[var(--admin-bg-base)] text-[var(--admin-text-base)] rounded-[var(--admin-radius-md)] px-3 py-2 outline-none focus:border-[var(--admin-primary)] text-sm transition-colors" value={data.category} onChange={(e) => updateData({ category: e.target.value })}> <option value="">Danh mục.</option>
 {withCurrent(categoryNames, data.category).map((name) => (
 <option key={name} value={name}>{name}</option>
 ))}
 </select> </div> <div> <label className="block text-xs font-medium text-[var(--admin-text-muted)] mb-1">(Collection)</label> <select className="w-full border border-[var(--admin-border-base)] bg-[var(--admin-bg-base)] text-[var(--admin-text-base)] rounded-[var(--admin-radius-md)] px-3 py-2 outline-none focus:border-[var(--admin-primary)] text-sm transition-colors" value={data.collection} onChange={(e) => updateData({ collection: e.target.value })}> <option value="">.</option>
 {withCurrent(collectionNames, data.collection).map((name) => (
 <option key={name} value={name}>{name}</option>
 ))}
 </select> </div> <div> <label className="block text-xs font-medium text-[var(--admin-text-muted)] mb-1">(Brand)</label> <select className="w-full border border-[var(--admin-border-base)] bg-[var(--admin-bg-base)] text-[var(--admin-text-base)] rounded-[var(--admin-radius-md)] px-3 py-2 outline-none focus:border-[var(--admin-primary)] text-sm transition-colors" value={data.brand} onChange={(e) => updateData({ brand: e.target.value })}> <option value="">.</option>
 {withCurrent(brandNames, data.brand).map((name) => (
 <option key={name} value={name}>{name}</option>
 ))}
 </select> </div> <div> <label className="block text-xs font-medium text-[var(--admin-text-muted)] mb-1">(Tags)</label> <input type="text" placeholder="Nhập nội dung" className="w-full border border-[var(--admin-border-base)] bg-[var(--admin-bg-base)] text-[var(--admin-text-base)] rounded-[var(--admin-radius-md)] px-3 py-2 outline-none focus:border-[var(--admin-primary)] text-sm transition-colors" value={data.tags.join(', ')} onChange={(e) => updateData({ tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} /> </div> </div> <div className="bg-[var(--admin-bg-card)] p-5 rounded-[var(--admin-radius-xl)] border border-[var(--admin-border-base)] shadow-[var(--admin-shadow-sm)] space-y-4"> <h3 className="font-bold text-[var(--admin-text-base)] border-b border-[var(--admin-border-light)] pb-2">Công cụ tìm kiếm (SEO)</h3> <div> <label className="block text-xs font-medium text-[var(--admin-text-muted)] mb-1">tiêu đề trang</label> <input type="text" className="w-full border border-[var(--admin-border-base)] bg-[var(--admin-bg-base)] text-[var(--admin-text-base)] rounded-[var(--admin-radius-md)] px-3 py-2 outline-none focus:border-[var(--admin-primary)] text-sm transition-colors" value={data.seo.metaTitle} onChange={(e) => updateData({ seo: { ...data.seo, metaTitle: e.target.value }})} /> </div> <div> <label className="block text-xs font-medium text-[var(--admin-text-muted)] mb-1">mô tả trang</label> <textarea className="w-full border border-[var(--admin-border-base)] bg-[var(--admin-bg-base)] text-[var(--admin-text-base)] rounded-[var(--admin-radius-md)] px-3 py-2 outline-none focus:border-[var(--admin-primary)] text-sm min-h-[80px] transition-colors" value={data.seo.metaDescription} onChange={(e) => updateData({ seo: { ...data.seo, metaDescription: e.target.value }})} /> </div> </div> </div> </div> <MediaLibraryModal
 isOpen={showMediaLib}
 onClose={() => setShowMediaLib(false)}
 onSelect={(media) => {
 updateData({ images: [...data.images, media.url] });
 }}
 /> </div>
 );
}

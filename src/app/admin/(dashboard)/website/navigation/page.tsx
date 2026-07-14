"use client";

import React, { useState, useEffect } from "react";
import {
 IconSitemap, IconPlus, IconTrash, IconEdit, IconDeviceFloppy, IconChevronLeft
} from "@tabler/icons-react";
import { toast } from "sonner";
import { Button } from "@/components/admin/design-system/Button";
import { Input } from "@/components/admin/design-system/Input";
import { CMSPreviewPanel, DeviceView } from "@/components/admin/storefront/CMSPreviewPanel";
import { SortableList } from "@/components/admin/dnd/SortableList";
import { SortableItem } from "@/components/admin/dnd/SortableItem";
import { FadeIn } from "@/components/admin/ui/motion";
import { NavigationService, NavMenu, NavItem } from "@/lib/services/storefront/navigation.service";

type EditingItem = NavItem | null;

const EMPTY_NEW_ITEM: Omit<NavItem, 'id'> = {
 label: '', url: '', order: 0, group: 'primary', openInNewTab: false, visibilityRules: ['public'], badge: ''
};

export default function NavigationManager() {
 const [menus, setMenus] = useState<NavMenu[]>([]);
 const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
 const [loading, setLoading] = useState(true);
 const [saving, setSaving] = useState(false);
 const [view, setView] = useState<DeviceView>("desktop");
 const [editingItem, setEditingItem] = useState<EditingItem>(null);
 const [newItem, setNewItem] = useState<Omit<NavItem, 'id'>>(EMPTY_NEW_ITEM);
 const [showAddForm, setShowAddForm] = useState(false);

 async function loadMenus() {
 try {
 const data = await NavigationService.getMenus();
 setMenus(data);
 if (data.length > 0) setActiveMenuId(data[0].id);
 } catch {
 toast.error("trong tải");
 } finally {
 setLoading(false);
 }
 }

 useEffect(() => { loadMenus(); }, []);

 const activeMenu = menus.find(m => m.id === activeMenuId);

 const saveMenu = async (items: NavItem[]) => {
 if (!activeMenu) return;
 setSaving(true);
 try {
 await NavigationService.updateMenu(activeMenu.id, items);
 setMenus(menus.map(m => m.id === activeMenu.id ? { ...m, items } : m));
 } catch {
 toast.error("trongLưu");
 } finally {
 setSaving(false);
 }
 };

 const handleReorder = async (newItems: NavItem[]) => {
 if (!activeMenu) return;
 const ordered = newItems.map((item, idx) => ({ ...item, order: idx }));
 setMenus(menus.map(m => m.id === activeMenu.id ? { ...m, items: ordered } : m));
 try {
 await NavigationService.updateMenu(activeMenu.id, ordered);
 } catch {
 toast.error("trong");
 loadMenus();
 }
 };

 const handleDeleteItem = async (id: string) => {
 if (!activeMenu) return;
 const updated = activeMenu.items.filter(i => i.id !== id);
 await saveMenu(updated);
 if (editingItem?.id === id) setEditingItem(null);
 toast.success("đãXóa Đường dẫn");
 };

 const handleSaveEdit = async () => {
 if (!activeMenu || !editingItem) return;
 const updated = activeMenu.items.map(i => i.id === editingItem.id ? editingItem : i);
 await saveMenu(updated);
 setEditingItem(null);
 toast.success("đãLưu Sửa");
 };

 const handleAddItem = async () => {
 if (!activeMenu || !newItem.label.trim() || !newItem.url.trim()) {
 toast.error("TênvàĐường dẫn ");
 return;
 }
 const maxOrder = activeMenu.items.reduce((m, i) => Math.max(m, i.order), -1);
 const item: NavItem = { ...newItem, id: `n-${Date.now()}`, order: maxOrder + 1 };
 await saveMenu([...activeMenu.items, item]);
 setNewItem(EMPTY_NEW_ITEM);
 setShowAddForm(false);
 toast.success("Thêm Đường dẫn");
 };

 const LOCATION_LABELS: Record<string, string> = {
 header: '(Header)',
 footer: '(Footer)',
 mega_menu: '',
 };

 const inputCls = "w-full bg-[var(--admin-bg-base)] border border-[var(--admin-border-base)] rounded-[var(--admin-radius-md)] px-3 py-2 text-sm text-[var(--admin-text-base)] outline-none focus:border-[var(--admin-primary)] transition-colors";
 const labelCls = "block text-xs font-semibold text-[var(--admin-text-muted)] mb-1";

 if (loading) return <div className="p-8 animate-pulse text-[var(--admin-text-muted)]">Đang tải.</div>;

 return (
 <FadeIn className="h-[calc(100vh-180px)] min-h-[560px] flex flex-col md:flex-row bg-[var(--admin-bg-base)] rounded-[var(--admin-radius-xl)] overflow-hidden border border-[var(--admin-border-base)]">
 {/* Left Panel */}
 <div className="w-full md:w-[400px] shrink-0 border-e border-[var(--admin-border-base)] flex flex-col h-full bg-[var(--admin-bg-surface)]">
 {editingItem ? (
 /* Item editor panel */
 <div className="flex flex-col h-full"> <div className="p-4 border-b border-[var(--admin-border-light)] flex items-center gap-2"> <button onClick={() => setEditingItem(null)} className="p-1.5 rounded-md hover:bg-[var(--admin-bg-hover)] text-[var(--admin-text-muted)]"> <IconChevronLeft size={18} /> </button> <p className="font-bold text-sm text-[var(--admin-text-base)]">Sửa Đường dẫn</p> </div> <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"> <div> <label className={labelCls}>(Label)</label> <input className={inputCls} value={editingItem.label} onChange={e => setEditingItem({ ...editingItem, label: e.target.value })} /> </div> <div> <label className={labelCls}>Đường dẫn (URL)</label> <input className={inputCls + " dir-ltr text-left"} value={editingItem.url} onChange={e => setEditingItem({ ...editingItem, url: e.target.value })} /> </div> <div> <label className={labelCls}></label> <select className={inputCls} value={editingItem.group} onChange={e => setEditingItem({ ...editingItem, group: e.target.value as 'primary' | 'secondary' })}> <option value="primary">()</option> <option value="secondary">()</option> </select> </div> <div> <label className={labelCls}>(Badge) — </label> <input className={inputCls} value={editingItem.badge || ''} onChange={e => setEditingItem({ ...editingItem, badge: e.target.value })} placeholder=":Mới" /> </div> <label className="flex items-center gap-3 cursor-pointer"> <input type="checkbox" checked={editingItem.openInNewTab} onChange={e => setEditingItem({ ...editingItem, openInNewTab: e.target.checked })} className="w-4 h-4 rounded text-[var(--admin-primary)]" /> <span className="text-sm text-[var(--admin-text-base)]">trongMới</span> </label> </div> <div className="p-4 border-t border-[var(--admin-border-light)] flex gap-2"> <Button variant="secondary" size="sm" onClick={() => setEditingItem(null)} className="flex-1">Hủy</Button> <Button variant="primary" size="sm" isLoading={saving} leftIcon={<IconDeviceFloppy size={15} />} onClick={handleSaveEdit} className="flex-1">Lưu</Button> </div> </div>
 ) : (
 <> <div className="p-4 border-b border-[var(--admin-border-light)] flex items-center justify-between"> <div className="flex items-center gap-2 text-[var(--admin-text-base)]"> <IconSitemap size={20} className="text-[var(--admin-primary)]" /> <h1 className="font-bold">Quản lý </h1> </div> <Button variant="primary" size="sm" leftIcon={<IconPlus size={16} />} onClick={() => setShowAddForm(s => !s)}>
 Thêm </Button> </div>

 {/* Menu location tabs */}
 <div className="p-3 flex gap-2 overflow-x-auto border-b border-[var(--admin-border-light)] bg-[var(--admin-bg-elevated)]">
 {menus.map(menu => (
 <button
 key={menu.id}
 onClick={() => setActiveMenuId(menu.id)}
 className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
 activeMenuId === menu.id
 ? 'bg-[var(--admin-primary)] text-white'
 : 'bg-[var(--admin-bg-surface)] text-[var(--admin-text-muted)] hover:text-[var(--admin-text-base)]'
 }`}
 >
 {LOCATION_LABELS[menu.location] ?? menu.location}
 </button>
 ))}
 </div>

 {/* Add item form */}
 {showAddForm && (
 <div className="p-4 border-b border-[var(--admin-border-light)] bg-[var(--admin-bg-elevated)] space-y-3"> <p className="text-xs font-bold text-[var(--admin-text-base)]">Mới</p> <input className={inputCls} placeholder="(Label)" value={newItem.label} onChange={e => setNewItem({ ...newItem, label: e.target.value })} /> <input className={inputCls + " dir-ltr text-left"} placeholder="/shop" value={newItem.url} onChange={e => setNewItem({ ...newItem, url: e.target.value })} /> <select className={inputCls} value={newItem.group} onChange={e => setNewItem({ ...newItem, group: e.target.value as 'primary' | 'secondary' })}> <option value="primary">()</option> <option value="secondary">()</option> </select> <div className="flex gap-2"> <Button variant="secondary" size="sm" onClick={() => { setShowAddForm(false); setNewItem(EMPTY_NEW_ITEM); }} className="flex-1">Hủy</Button> <Button variant="primary" size="sm" isLoading={saving} onClick={handleAddItem} className="flex-1">Thêm</Button> </div> </div>
 )}

 <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
 {activeMenu && (
 <SortableList
 items={activeMenu.items.sort((a, b) => a.order - b.order)}
 keyExtractor={i => i.id}
 onReorder={handleReorder}
 renderItem={(item) => (
 <SortableItem id={item.id} key={item.id} className="group"> <div className="flex items-center justify-between gap-2"> <div className="min-w-0 flex-1 cursor-pointer" onClick={() => setEditingItem(item)}> <div className="flex items-center gap-1.5 flex-wrap"> <p className="text-sm font-bold text-[var(--admin-text-base)] truncate">{item.label}</p>
 {item.badge && <span className="text-[10px] bg-[var(--admin-danger)]/10 text-[var(--admin-danger)] px-1.5 py-0.5 rounded uppercase">{item.badge}</span>}
 <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${item.group === 'primary' ? 'bg-[var(--admin-primary-muted)] text-[var(--admin-primary)]' : 'bg-[var(--admin-bg-active)] text-[var(--admin-text-muted)]'}`}>
 {item.group === 'primary' ? '' : ''}
 </span> </div> <p className="text-xs text-[var(--admin-text-muted)] mt-0.5 dir-ltr text-left">{item.url}</p> </div> <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"> <button onClick={() => setEditingItem(item)} className="p-1.5 text-[var(--admin-text-subtle)] hover:text-[var(--admin-primary)] rounded hover:bg-[var(--admin-bg-hover)]"> <IconEdit size={15} /> </button> <button onClick={() => handleDeleteItem(item.id)} className="p-1.5 text-[var(--admin-danger-muted)] hover:text-[var(--admin-danger)] rounded hover:bg-[var(--admin-danger)]/10"> <IconTrash size={15} /> </button> </div> </div> </SortableItem>
 )}
 />
 )}
 </div> </>
 )}
 </div>

 {/* Right Panel: Preview */}
 <div className="flex-1 min-w-0 h-full p-4 ps-0"> <CMSPreviewPanel view={view} onViewChange={setView} title="AURA" isUpdating={saving}> <div className="w-full h-full bg-white flex flex-col font-sans" dir="ltr"> <header className="h-20 border-b flex items-center justify-between px-8 gap-4"> <nav className="flex items-center gap-6">
 {activeMenu?.items.filter(i => i.group === 'primary').sort((a, b) => a.order - b.order).map(item => (
 <div key={item.id} className="text-sm font-semibold text-gray-700 hover:text-blue-600 cursor-pointer relative flex items-center gap-1">
 {item.label}
 {item.badge && <span className="absolute -top-3 -right-2 bg-red-500 text-white text-[9px] px-1 rounded">{item.badge}</span>}
 </div>
 ))}
 </nav> <div className="text-2xl font-black tracking-tighter text-gray-900 shrink-0">AURA</div> <nav className="flex items-center gap-6">
 {activeMenu?.items.filter(i => i.group === 'secondary').sort((a, b) => a.order - b.order).map(item => (
 <div key={item.id} className="text-sm font-semibold text-gray-700 hover:text-blue-600 cursor-pointer">
 {item.label}
 </div>
 ))}
 </nav> </header> <div className="flex-1 bg-slate-50 flex items-center justify-center text-slate-300 text-sm">
 trang</div> </div> </CMSPreviewPanel> </div> </FadeIn>
 );
}

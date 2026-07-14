'use client';

import React, { useState, useEffect } from 'react';
import {
 IconSearch,
 IconPackage,
 IconShoppingCart,
 IconUsers,
 IconFileText,
 IconSettings2,
} from '@tabler/icons-react';

interface SearchResult {
 id: string;
 title: string;
 type: string;
 icon: React.ReactNode;
 href: string;
}

export function SpotlightSearch() {
 const [isOpen, setIsOpen] = useState(false);
 const [query, setQuery] = useState('');

 useEffect(() => {
 const handleKeyDown = (e: KeyboardEvent) => {
 if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
 e.preventDefault();
 setIsOpen((prev) => !prev);
 }
 if (e.key === 'Escape') {
 setIsOpen(false);
 }
 };

 window.addEventListener('keydown', handleKeyDown);
 return () => window.removeEventListener('keydown', handleKeyDown);
 }, []);

 if (!isOpen) return null;

 // Mock search results
 const results: SearchResult[] = query ? [
 { id: '1', title: `Product matching "${query}"`, type: 'Products', icon: <IconPackage size={16} />, href: '/admin/products' },
 { id: '2', title: `Order matching "${query}"`, type: 'Orders', icon: <IconShoppingCart size={16} />, href: '/admin/orders' },
 { id: '3', title: `Customer matching "${query}"`, type: 'Customers', icon: <IconUsers size={16} />, href: '/admin/customers' },
 { id: '4', title: `CMS Page matching "${query}"`, type: 'CMS', icon: <IconFileText size={16} />, href: '/admin/cms' },
 ] : [];

 return (
 <> <div
 className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
 onClick={() => setIsOpen(false)}
 /> <div className="fixed left-1/2 top-[15%] z-[101] w-full max-w-2xl -translate-x-1/2 rounded-[var(--admin-radius-xl)] bg-[var(--admin-bg-surface)] shadow-[var(--admin-shadow-float)] border border-[var(--admin-border-base)] overflow-hidden animate-in fade-in zoom-in-95 duration-200"> <div className="flex items-center border-b border-[var(--admin-border-light)] px-4"> <IconSearch className="text-[var(--admin-text-subtle)]" size={20} /> <input
 type="text"
 className="w-full bg-transparent p-4 text-lg outline-none placeholder:text-[var(--admin-text-subtle)] text-[var(--admin-text-base)]"
 placeholder="Tìm kiếm trongCửa hàng. (Products, Orders, Customers, CMS)"
 value={query}
 onChange={(e) => setQuery(e.target.value)}
 autoFocus
 dir="auto"
 /> <kbd className="hidden rounded bg-[var(--admin-bg-elevated)] px-2 py-1 text-xs font-mono text-[var(--admin-text-subtle)] border border-[var(--admin-border-base)] sm:inline-block">
 ESC
 </kbd> </div>

 {query && (
 <div className="max-h-[60vh] overflow-y-auto p-2" dir="ltr">
 {results.length > 0 ? (
 <div className="space-y-1">
 {results.map((result) => (
 <button
 key={result.id}
 className="flex w-full items-center gap-3 rounded-[var(--admin-radius-md)] px-4 py-3 text-left hover:bg-[var(--admin-bg-hover)] transition-colors"
 onClick={() => {
 setIsOpen(false);
 }}
 > <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--admin-radius-md)] bg-[var(--admin-primary-muted)] text-[var(--admin-primary)]">
 {result.icon}
 </div> <div className="flex flex-col"> <span className="font-medium text-[var(--admin-text-base)]">{result.title}</span> <span className="text-xs text-[var(--admin-text-subtle)]">{result.type}</span> </div> </button>
 ))}
 </div>
 ) : (
 <div className="p-8 text-center text-[var(--admin-text-subtle)]">
 Không có ـ &quot;{query}&quot;
 </div>
 )}
 </div>
 )}

 {!query && (
 <div className="p-4 bg-[var(--admin-bg-base)] border-t border-[var(--admin-border-light)] text-xs text-[var(--admin-text-subtle)] flex justify-center gap-6" dir="ltr"> <span className="flex items-center gap-2"><IconPackage size={14} /> Products</span> <span className="flex items-center gap-2"><IconShoppingCart size={14} /> Orders</span> <span className="flex items-center gap-2"><IconUsers size={14} /> Customers</span> <span className="flex items-center gap-2"><IconFileText size={14} /> CMS</span> <span className="flex items-center gap-2"><IconSettings2 size={14} /> Settings</span> </div>
 )}
 </div> </>
 );
}

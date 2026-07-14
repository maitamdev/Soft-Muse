import { eventBus } from '@/lib/events/EventBus';
import { createClient } from '@/lib/supabase/client';

export interface NavItem {
 id: string;
 label: string;
 url: string;
 order: number;
 icon?: string;
 badge?: string;
 openInNewTab: boolean;
 /** 'primary' = left nav group (shop-facing); 'secondary' = right nav group (brand-info) */
 group: 'primary' | 'secondary';
 visibilityRules: ('public' | 'logged_in' | 'guests')[];
 children?: NavItem[];
}

export interface NavMenu {
 id: string;
 location: 'header' | 'footer' | 'mega_menu';
 items: NavItem[];
}

// Soft Muse header navigation — mirrors src/components/layout/Navbar.tsx leftLinks + rightLinks
let mockMenus: NavMenu[] = [
 {
 id: 'menu-header',
 location: 'header',
 items: [
 { id: 'n-home', label: 'Trang chủ', url: '/', order: 0, group: 'primary', openInNewTab: false, visibilityRules: ['public'] },
 { id: 'n-shop', label: 'Sản phẩm', url: '/shop', order: 1, group: 'primary', openInNewTab: false, visibilityRules: ['public'] },
 { id: 'n-new', label: 'Hàng mới', url: '/new-arrivals', order: 2, group: 'primary', openInNewTab: false, visibilityRules: ['public'] },
 { id: 'n-best', label: 'Bestseller', url: '/bestsellers', order: 3, group: 'primary', openInNewTab: false, visibilityRules: ['public'] },
 { id: 'n-collections', label: 'Bộ sưu tập', url: '/collections', order: 4, group: 'secondary', openInNewTab: false, visibilityRules: ['public'] },
 { id: 'n-sale', label: 'Khuyến mãi', url: '/sale', order: 5, group: 'secondary', openInNewTab: false, visibilityRules: ['public'] },
 { id: 'n-about', label: 'Giới thiệu', url: '/about', order: 6, group: 'secondary', openInNewTab: false, visibilityRules: ['public'] },
 { id: 'n-contact', label: 'Liên hệ', url: '/contact', order: 7, group: 'secondary', openInNewTab: false, visibilityRules: ['public'] },
 ]
 }
];

export const NavigationService = {
 async getMenus(): Promise<NavMenu[]> {
 const { data, error } = await createClient().rpc('get_storefront_setting', { setting_key: 'storefront.navigation' });
 if (!error && Array.isArray(data)) mockMenus = data as NavMenu[];
 return [...mockMenus];
 },

 async getMenuByLocation(location: NavMenu['location']): Promise<NavMenu | undefined> {
 return (await this.getMenus()).find(m => m.location === location);
 },

 async updateMenu(id: string, items: NavItem[]): Promise<NavMenu> {
 const idx = mockMenus.findIndex(m => m.id === id);
 if (idx > -1) {
 mockMenus[idx].items = items;
 const { error } = await createClient().rpc('update_storefront_setting', { setting_key: 'storefront.navigation', setting_value: mockMenus });
 if (error) throw new Error(error.message);
 eventBus.emit('website.changed', { area: 'navigation' });
 return mockMenus[idx];
 }
 throw new Error('Menu not found');
 }
};

import { eventBus } from '@/lib/events/EventBus';
import { loadStorefrontSetting, saveStorefrontSetting } from './settings-storage';

export interface FooterColumn {
 id: string;
 title: string;
 links: { id: string; label: string; url: string }[];
 order: number;
}

export interface FooterSettings {
 showNewsletter: boolean;
 newsletterTitle: string;
 newsletterSubtitle: string;
 showSocialIcons: boolean;
 showPaymentIcons: boolean;
 developerCredit: string;
 copyrightText: string;
 columns: FooterColumn[];
}

// Soft Muse footer — mirrors src/components/layout/Footer.tsx navData
let mockFooter: FooterSettings = {
 showNewsletter: true,
 newsletterTitle: 'Bản tin Soft Muse',
 newsletterSubtitle: 'Nhận hàng mới, gợi ý phối đồ và ưu đãi riêng',
 showSocialIcons: true,
 showPaymentIcons: false,
 developerCredit: '',
 copyrightText: '© 2026 Soft Muse',
 columns: [
 {
 id: 'col-shop',
 title: 'Cửa hàng',
 order: 0,
 links: [
 { id: 'l-s1', label: 'Tất cả sản phẩm', url: '/shop' },
 { id: 'l-s2', label: 'Hàng mới', url: '/new-arrivals' },
 { id: 'l-s3', label: 'Bestseller', url: '/bestsellers' },
 { id: 'l-s4', label: 'Khuyến mãi', url: '/sale' },
 ]
 },
 {
 id: 'col-brand',
 title: 'Soft Muse',
 order: 1,
 links: [
 { id: 'l-b1', label: 'Giới thiệu thương hiệu', url: '/about' },
 { id: 'l-b2', label: 'Theo dõi đơn hàng', url: '/tracking' },
 { id: 'l-b3', label: 'Liên hệ với chúng tôi', url: '/contact' },
 ]
 },
 {
 id: 'col-service',
 title: 'Dịch vụ khách hàng',
 order: 2,
 links: [
 { id: 'l-sv1', label: 'Vận chuyển và giao hàng', url: '/shipping' },
 { id: 'l-sv2', label: 'Đổi trả', url: '/returns' },
 { id: 'l-sv3', label: 'Điều khoản', url: '/terms' },
 { id: 'l-sv4', label: 'Chính sách bảo mật', url: '/privacy' },
 ]
 }
 ]
};

export const FooterService = {
 async getSettings(): Promise<FooterSettings> {
 mockFooter = await loadStorefrontSetting('storefront.footer', mockFooter);
 return { ...mockFooter };
 },

 async updateSettings(updates: Partial<FooterSettings>): Promise<FooterSettings> {
 mockFooter = await loadStorefrontSetting('storefront.footer', mockFooter);
 mockFooter = { ...mockFooter, ...updates };
 mockFooter = await saveStorefrontSetting('storefront.footer', mockFooter);
 eventBus.emit('website.changed', { area: 'footer' });
 return { ...mockFooter };
 }
};

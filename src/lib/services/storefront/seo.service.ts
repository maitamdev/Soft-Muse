import { eventBus } from '@/lib/events/EventBus';
import { mockStorage } from '@/lib/storage/mock-storage';

export type SEOPage =
 | 'global' | 'homepage' | 'shop' | 'about'
 | 'winter' | 'summer' | 'contact' | 'tracking'
 | 'reviews' | 'journal';

export interface SEOSettings {
 id: string;
 page: SEOPage;
 title: string;
 description: string;
 keywords: string;
 ogImage: string;
 twitterCard: 'summary' | 'summary_large_image';
 canonical?: string;
 robots: string;
 jsonLd: boolean;
}

const DEFAULT_SEO: SEOSettings[] = [
 {
 id: 'seo-global',
 page: 'global',
 title: 'Soft Muse | Thời trang công sở nữ thanh lịch',
 description: 'Soft Muse mang đến áo sơ mi, áo kiểu, chân váy, váy, quần tây, blazer, set đồ và phụ kiện cho nàng công sở hiện đại.',
 keywords: 'Soft Muse, thời trang công sở nữ, áo sơ mi nữ, blazer nữ, váy công sở',
 ogImage: '/images/campaign/campaign_4.png',
 twitterCard: 'summary_large_image',
 robots: 'index, follow',
 jsonLd: true,
 },
 {
 id: 'seo-homepage',
 page: 'homepage',
 title: 'Soft Muse | Officewear boutique',
 description: 'Khám phá thời trang công sở nữ tối giản, nữ tính và hiện đại từ Soft Muse.',
 keywords: 'Soft Muse, officewear, thời trang nữ đi làm, boutique thời trang',
 ogImage: '/images/campaign/campaign_4.png',
 twitterCard: 'summary_large_image',
 robots: 'index, follow',
 jsonLd: true,
 },
 {
 id: 'seo-shop',
 page: 'shop',
 title: 'Sản phẩm | Soft Muse',
 description: 'Mua áo sơ mi, áo kiểu, chân váy, váy, quần tây, blazer, set đồ và phụ kiện Soft Muse.',
 keywords: 'sản phẩm Soft Muse, áo sơ mi nữ, quần tây nữ, blazer nữ, chân váy công sở',
 ogImage: '/images/campaign/campaign_2.png',
 twitterCard: 'summary_large_image',
 robots: 'index, follow',
 jsonLd: true,
 },
 {
 id: 'seo-about',
 page: 'about',
 title: 'Giới thiệu | Soft Muse',
 description: 'Soft Muse là thương hiệu thời trang công sở nữ thanh lịch, tinh tế và có mức giá hợp lý.',
 keywords: 'giới thiệu Soft Muse, thương hiệu thời trang công sở nữ',
 ogImage: '/images/campaign/campaign_5.png',
 twitterCard: 'summary_large_image',
 robots: 'index, follow',
 jsonLd: true,
 },
 {
 id: 'seo-winter',
 page: 'winter',
 title: 'Blazer và đồ công sở mùa lạnh | Soft Muse',
 description: 'Blazer, quần tây và set đồ công sở thanh lịch cho ngày làm việc se lạnh.',
 keywords: 'blazer nữ, đồ công sở mùa lạnh, Soft Muse',
 ogImage: '/images/campaign/campaign_3.png',
 twitterCard: 'summary_large_image',
 robots: 'index, follow',
 jsonLd: true,
 },
 {
 id: 'seo-summer',
 page: 'summer',
 title: 'Áo sơ mi và váy công sở mùa hè | Soft Muse',
 description: 'Thiết kế nhẹ, mềm và thoáng cho nàng công sở trong những ngày nắng.',
 keywords: 'áo sơ mi nữ, váy công sở mùa hè, Soft Muse',
 ogImage: '/images/campaign/campaign_2.png',
 twitterCard: 'summary_large_image',
 robots: 'index, follow',
 jsonLd: true,
 },
 {
 id: 'seo-contact',
 page: 'contact',
 title: 'Liên hệ | Soft Muse',
 description: 'Liên hệ Soft Muse để được tư vấn size, sản phẩm, đơn hàng và chính sách đổi trả.',
 keywords: 'liên hệ Soft Muse, tư vấn size, hỗ trợ đơn hàng',
 ogImage: '/images/campaign/campaign_1.png',
 twitterCard: 'summary',
 robots: 'index, follow',
 jsonLd: false,
 },
 {
 id: 'seo-tracking',
 page: 'tracking',
 title: 'Theo dõi đơn hàng | Soft Muse',
 description: 'Tra cứu tình trạng đơn hàng Soft Muse bằng mã đơn hoặc số điện thoại.',
 keywords: 'theo dõi đơn hàng Soft Muse, tra cứu đơn hàng',
 ogImage: '/images/campaign/campaign_1.png',
 twitterCard: 'summary',
 robots: 'noindex, nofollow',
 jsonLd: false,
 },
 {
 id: 'seo-reviews',
 page: 'reviews',
 title: 'Đánh giá khách hàng | Soft Muse',
 description: 'Cảm nhận của khách hàng về sản phẩm và trải nghiệm mua sắm tại Soft Muse.',
 keywords: 'đánh giá Soft Muse, khách hàng Soft Muse',
 ogImage: '/images/campaign/campaign_6.png',
 twitterCard: 'summary_large_image',
 robots: 'index, follow',
 jsonLd: true,
 },
 {
 id: 'seo-journal',
 page: 'journal',
 title: 'Soft Muse Journal | Gợi ý phối đồ công sở',
 description: 'Cảm hứng phối đồ, chăm sóc chất liệu và phong cách công sở hiện đại từ Soft Muse.',
 keywords: 'blog thời trang công sở, phối đồ đi làm, Soft Muse',
 ogImage: '/images/campaign/campaign_5.png',
 twitterCard: 'summary_large_image',
 robots: 'index, follow',
 jsonLd: true,
 },
];

let mockSEO: SEOSettings[] = [...DEFAULT_SEO];
mockSEO = mockStorage.read('storefront.seo', mockSEO);

// Backfill any pages added after the first save
for (const def of DEFAULT_SEO) {
 if (!mockSEO.find(s => s.page === def.page)) {
 mockSEO.push({ ...def });
 }
}

const persistSEO = () => mockStorage.write('storefront.seo', mockSEO);

export const SEOService = {
 async getAll(): Promise<SEOSettings[]> {
 return [...mockSEO];
 },

 async getByPage(page: SEOPage): Promise<SEOSettings | undefined> {
 return mockSEO.find(s => s.page === page);
 },

 async update(id: string, updates: Partial<SEOSettings>): Promise<SEOSettings> {
 const idx = mockSEO.findIndex(s => s.id === id);
 if (idx > -1) {
 mockSEO[idx] = { ...mockSEO[idx], ...updates };
 persistSEO();
 eventBus.emit('website.changed', { area: 'seo' });
 return mockSEO[idx];
 }
 const newSettings: SEOSettings = { id, ...updates } as SEOSettings;
 mockSEO.push(newSettings);
 persistSEO();
 eventBus.emit('website.changed', { area: 'seo' });
 return newSettings;
 },

 async upsert(page: SEOPage, updates: Partial<SEOSettings>): Promise<SEOSettings> {
 const idx = mockSEO.findIndex(s => s.page === page);
 if (idx > -1) {
 mockSEO[idx] = { ...mockSEO[idx], ...updates };
 persistSEO();
 eventBus.emit('website.changed', { area: 'seo' });
 return mockSEO[idx];
 }
 const newEntry: SEOSettings = {
 id: `seo-${page}`,
 page,
 title: '',
 description: '',
 keywords: '',
 ogImage: '',
 twitterCard: 'summary_large_image',
 robots: 'index, follow',
 jsonLd: false, ...updates,
 };
 mockSEO.push(newEntry);
 persistSEO();
 eventBus.emit('website.changed', { area: 'seo' });
 return newEntry;
 },

 async getSEOScore(): Promise<{ score: number; brokenLinks: number }> {
 const filled = mockSEO.filter(s => s.title && s.description && s.ogImage).length;
 const score = Math.round((filled / mockSEO.length) * 100);
 return { score, brokenLinks: 0 };
 },
};

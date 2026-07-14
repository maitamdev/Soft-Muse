import { eventBus } from '@/lib/events/EventBus';
import { mockStorage } from '@/lib/storage/mock-storage';

export type HomepageSectionType =
 | 'hero'
 | 'featured_collections'
 | 'featured_products'
 | 'best_sellers'
 | 'new_arrivals'
 | 'seasonal_collection'
 | 'editorial_banner'
 | 'testimonials'
 | 'instagram'
 | 'newsletter'
 | 'custom_html';

/** How product sections resolve their pool of products */
export type ProductSectionSource =
 | 'auto_best_sellers'
 | 'auto_new_arrivals'
 | 'auto_featured'
 | 'auto_summer'
 | 'auto_winter'
 | 'auto_all'
 | 'manual';

export type ProductSectionSort =
 | 'default'
 | 'price_asc'
 | 'price_desc'
 | 'newest'
 | 'random';

export interface HomepageSection {
 id: string;
 type: HomepageSectionType;
 title: string;
 subtitle?: string;
 enabled: boolean;
 order: number;
 settings: Record<string, any>;
}

export interface HeroSlide {
 id: number;
 image: string;
 label: string;
 title: string;
 engTitle: string;
 subtitle: string;
}

/** Default settings per section type — used when adding a new section or restoring defaults */
export const DEFAULT_SECTION_SETTINGS: Record<HomepageSectionType, Record<string, any>> = {
 hero: {
 slides: [] as HeroSlide[],
 ctaText: 'Khám phá bộ sưu tập',
 ctaLink: '/shop',
 secondaryCtaText: 'Câu chuyện thương hiệu',
 secondaryCtaLink: '/about',
 },
 featured_collections: {
 limit: 3,
 layout: 'grid',
 columns: 3,
 source: 'auto_all' as ProductSectionSource,
 sort: 'default' as ProductSectionSort,
 hideOutOfStock: false,
 showDiscountBadge: true,
 showWishlistButton: true,
 manualProductIds: [] as string[],
 },
 featured_products: {
 limit: 4,
 layout: 'grid',
 columns: 4,
 source: 'auto_featured' as ProductSectionSource,
 sort: 'default' as ProductSectionSort,
 hideOutOfStock: false,
 showDiscountBadge: true,
 showWishlistButton: true,
 manualProductIds: [] as string[],
 },
 best_sellers: {
 limit: 4,
 layout: 'grid',
 columns: 4,
 source: 'auto_best_sellers' as ProductSectionSource,
 sort: 'default' as ProductSectionSort,
 hideOutOfStock: false,
 showDiscountBadge: true,
 showWishlistButton: true,
 manualProductIds: [] as string[],
 },
 new_arrivals: {
 limit: 4,
 layout: 'grid',
 columns: 4,
 source: 'auto_new_arrivals' as ProductSectionSource,
 sort: 'default' as ProductSectionSort,
 hideOutOfStock: false,
 showDiscountBadge: true,
 showWishlistButton: true,
 manualProductIds: [] as string[],
 },
 seasonal_collection: {
 season: 'summer',
 limit: 4,
 layout: 'grid',
 columns: 4,
 source: 'auto_summer' as ProductSectionSource,
 sort: 'default' as ProductSectionSort,
 hideOutOfStock: false,
 showDiscountBadge: true,
 showWishlistButton: true,
 manualProductIds: [] as string[],
 },
 editorial_banner: {
 image: '/images/campaign/campaign_4.png',
 title: '',
 subtitle: '',
 ctaText: 'Khám phá bộ sưu tập',
 ctaLink: '/shop',
 textAlign: 'center',
 overlayOpacity: 40,
 },
 testimonials: { limit: 3 },
 instagram: {
 handle: '@softmuse.vn',
 limit: 6,
 gridSize: 3,
 title: 'Soft Muse trên Instagram',
 subtitle: 'Theo dõi chúng tôi',
 },
 newsletter: {
 title: 'Nhận ưu đãi từ Soft Muse',
 subtitle: 'Look công sở mới và mã giảm giá riêng',
 placeholder: 'Email của bạn',
 buttonText: 'Tham gia ngay',
 successMessage: 'Cảm ơn bạn đã tham gia. Chúng tôi sẽ liên hệ sớm.',
 description: 'Nhận thông báo hàng mới, gợi ý phối đồ đi làm và ưu đãi dành riêng cho thành viên.',
 },
 custom_html: { html: '<div></div>' },
};

export const SECTION_TYPE_LABELS_AR: Record<HomepageSectionType, string> = {
 hero: 'Hero section (Hero)',
 featured_collections: 'Bộ sưu tập nổi bật',
 featured_products: 'Sản phẩm nổi bật',
 best_sellers: 'Bán chạy nhất',
 new_arrivals: 'Hàng mới về',
 seasonal_collection: 'Bộ sưu tập theo mùa',
 editorial_banner: 'Banner biên tập',
 testimonials: 'Ý kiến khách hàng',
 instagram: '',
 newsletter: 'Bản tin',
 custom_html: 'HTML Tùy chỉnh',
};

let mockSections: HomepageSection[] = [
 {
 id: 'sec-hero-1',
 type: 'hero',
 title: 'Hero — Soft Muse officewear',
 subtitle: 'Thời trang công sở nữ',
 enabled: true,
 order: 0,
 settings: {
 slides: [
 { id: 1, image: '/images/campaign/campaign_4.png', label: 'SOFT MUSE OFFICEWEAR', title: 'Thanh lịch mỗi ngày, tự tin theo cách của bạn', engTitle: 'MINIMAL LUXURY FOR WORK', subtitle: 'Áo sơ mi, váy, blazer và set đồ công sở nữ trong mức giá dễ tiếp cận.' },
 { id: 2, image: '/images/campaign/campaign_5.png', label: 'NEW ARRIVALS', title: 'Những bản phối nhẹ nhàng cho tuần làm việc mới', engTitle: 'SOFT NEUTRALS', subtitle: 'Tông kem, trắng, hồng đất và đen cho vẻ ngoài tinh tế, hiện đại.' },
 { id: 3, image: '/images/campaign/campaign_6.png', label: 'BESTSELLER EDIT', title: 'Các thiết kế được nàng công sở yêu thích', engTitle: 'WORKDAY ESSENTIALS', subtitle: 'Phom dáng dễ mặc, chất liệu mềm và đường may chỉn chu cho nhịp sống bận rộn.' },
 ] as HeroSlide[],
 ctaText: 'Khám phá bộ sưu tập',
 ctaLink: '/shop',
 secondaryCtaText: 'Câu chuyện thương hiệu',
 secondaryCtaLink: '/about',
 },
 },
 {
 id: 'sec-best-1',
 type: 'best_sellers',
 title: 'Thiết kế được yêu thích nhất',
 subtitle: 'Bộ sưu tập độc quyền',
 enabled: true,
 order: 1,
 settings: { ...DEFAULT_SECTION_SETTINGS.best_sellers },
 },
 {
 id: 'sec-newarrivals-1',
 type: 'new_arrivals',
 title: 'Hàng mới về',
 subtitle: 'Xem trước',
 enabled: true,
 order: 2,
 settings: { ...DEFAULT_SECTION_SETTINGS.new_arrivals },
 },
 {
 id: 'sec-newsletter-1',
 type: 'newsletter',
 title: 'Nhận ưu đãi từ Soft Muse',
 subtitle: 'Hàng mới, mẹo phối đồ và mã giảm giá riêng',
 enabled: false,
 order: 3,
 settings: { ...DEFAULT_SECTION_SETTINGS.newsletter },
 },
];

mockSections = mockStorage.read('storefront.homepage', mockSections);

export const HomepageService = {
 async getSections(): Promise<HomepageSection[]> {
 return this.getSectionsSync();
 },

 /**
 * Synchronous read of the same data `getSections` resolves with. The mock
 * store is already loaded into memory at import time, so components can
 * seed their initial state with this instead of starting empty and
 * populating one tick later via useEffect — the latter causes the entire
 * homepage to pop in after first paint (a large CLS regression).
 */
 getSectionsSync(): HomepageSection[] {
 return [...mockSections].sort((a, b) => a.order - b.order);
 },

 async updateSections(sections: HomepageSection[]): Promise<HomepageSection[]> {
 mockSections = [...sections];
 mockStorage.write('storefront.homepage', mockSections);
 eventBus.emit('website.changed', { area: 'homepage' });
 return this.getSections();
 },

 async addSection(type: HomepageSectionType, title?: string): Promise<HomepageSection> {
 const maxOrder = mockSections.reduce((m, s) => Math.max(m, s.order), -1);
 const section: HomepageSection = {
 id: `sec-${type}-${Date.now()}`,
 type,
 title: title || SECTION_TYPE_LABELS_AR[type],
 subtitle: '',
 enabled: true,
 order: maxOrder + 1,
 settings: { ...DEFAULT_SECTION_SETTINGS[type] },
 };
 mockSections = [...mockSections, section];
 mockStorage.write('storefront.homepage', mockSections);
 eventBus.emit('website.changed', { area: 'homepage' });
 return section;
 },

 async duplicateSection(id: string): Promise<HomepageSection> {
 const original = mockSections.find(s => s.id === id);
 if (!original) throw new Error('Section not found');
 const maxOrder = mockSections.reduce((m, s) => Math.max(m, s.order), -1);
 const copy: HomepageSection = { ...original,
 id: `sec-${original.type}-${Date.now()}`,
 title: `${original.title} (Bản sao)`,
 order: maxOrder + 1,
 settings: JSON.parse(JSON.stringify(original.settings ?? {})),
 };
 mockSections = [...mockSections, copy];
 mockStorage.write('storefront.homepage', mockSections);
 eventBus.emit('website.changed', { area: 'homepage' });
 return copy;
 },

 async updateSection(id: string, updates: Partial<HomepageSection>): Promise<HomepageSection> {
 const idx = mockSections.findIndex(s => s.id === id);
 if (idx > -1) {
 mockSections[idx] = { ...mockSections[idx], ...updates };
 mockStorage.write('storefront.homepage', mockSections);
 eventBus.emit('website.changed', { area: 'homepage' });
 return mockSections[idx];
 }
 throw new Error('Section not found');
 },

 async deleteSection(id: string): Promise<void> {
 mockSections = mockSections.filter(s => s.id !== id);
 mockStorage.write('storefront.homepage', mockSections);
 eventBus.emit('website.changed', { area: 'homepage' });
 },

 getDefaultSettings(type: HomepageSectionType): Record<string, any> {
 return { ...DEFAULT_SECTION_SETTINGS[type] };
 },
};

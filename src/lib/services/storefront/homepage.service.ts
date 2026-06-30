import { eventBus } from '@/lib/events/EventBus';
import { mockStorage } from '@/lib/storage/mock-storage';

export type HomepageSectionType =
  | 'hero' | 'featured_collections' | 'featured_products' | 'best_sellers'
  | 'new_arrivals' | 'testimonials' | 'instagram' | 'newsletter' | 'custom_html';

export interface HomepageSection {
  id: string;
  type: HomepageSectionType;
  title: string;
  subtitle?: string;
  enabled: boolean;
  order: number;
  settings: any;
}

export interface HeroSlide {
  id: number;
  image: string;
  label: string;
  title: string;
  engTitle: string;
  subtitle: string;
}

/** Sensible default settings for each section type, used when adding a new section. */
export const DEFAULT_SECTION_SETTINGS: Record<HomepageSectionType, any> = {
  hero: {
    slides: [] as HeroSlide[],
    ctaText: 'اكتشفي التشكيلة',
    ctaLink: '/shop',
    secondaryCtaText: 'قصتنا الفنية',
    secondaryCtaLink: '/about',
  },
  featured_collections: { limit: 3, layout: 'grid' },
  featured_products: { limit: 4, layout: 'grid' },
  best_sellers: { limit: 4, layout: 'grid' },
  new_arrivals: { limit: 4, layout: 'grid' },
  testimonials: { limit: 3 },
  instagram: { handle: '@aurabrand.eg', limit: 6 },
  newsletter: { title: 'انضمي لصالون أورا البريدي', subtitle: 'دعوات خاصة وتحديثات الأتيلييه' },
  custom_html: { html: '<div></div>' },
};

export const SECTION_TYPE_LABELS_AR: Record<HomepageSectionType, string> = {
  hero: 'قسم البطل (Hero)',
  featured_collections: 'مجموعات مميزة',
  featured_products: 'منتجات مميزة',
  best_sellers: 'الأكثر مبيعاً',
  new_arrivals: 'وصل حديثاً',
  testimonials: 'آراء العملاء',
  instagram: 'إنستغرام',
  newsletter: 'النشرة البريدية',
  custom_html: 'HTML مخصص',
};

// Real AURA homepage sections — mirroring the actual storefront sections rendered in src/app/page.tsx
let mockSections: HomepageSection[] = [
  {
    id: 'sec-hero-1',
    type: 'hero',
    title: 'Hero — أورا كوتور',
    subtitle: 'تصاميم كوتور تُصاغ يدوياً للمرأة المعاصرة',
    enabled: true,
    order: 0,
    settings: {
      slides: [
        {
          id: 1,
          image: '/images/campaign/campaign_4.png',
          label: 'AURA HAUTE COUTURE',
          title: 'أناقة الأثر والمعنى',
          engTitle: 'THE SIGNATURE COUTURE',
          subtitle: 'تصاميم كوتور راقية تُصاغ يدوياً للمرأة المعاصرة التي تقدر تميز التفاصيل وعراقة الصنع الفاخر.'
        },
        {
          id: 2,
          image: '/images/campaign/campaign_5.png',
          label: 'EDITORIAL CAMPAIGN',
          title: 'تفاصيل تروي حضوركِ',
          engTitle: 'LUNA & SILK ESSENCE',
          subtitle: 'أزياء نسائية صممت بهيبة الحضور وقوة الشخصية منسوجة من الكتان الطبيعي البلجيكي والحرير الطبيعي.'
        },
        {
          id: 3,
          image: '/images/campaign/campaign_6.png',
          label: 'THE EDITORIAL SERIES',
          title: 'الفخامة الهادئة والخلود',
          engTitle: 'QUIET LUXURY 2026',
          subtitle: 'خطوط كلاسيكية مبسطة وخامات كشمير إيطالية تنساب بنعومة بالغة لتتجاوز بريق صيحات الموضة المؤقتة.'
        }
      ] as HeroSlide[],
      ctaText: 'اكتشفي التشكيلة',
      ctaLink: '/shop',
      secondaryCtaText: 'قصتنا الفنية',
      secondaryCtaLink: '/about',
    }
  },
  {
    id: 'sec-best-1',
    type: 'best_sellers',
    title: 'القطع الأكثر طلباً',
    subtitle: 'المجموعة الحصرية',
    enabled: true,
    order: 1,
    settings: { limit: 4, layout: 'grid' }
  },
  {
    id: 'sec-newarrivals-1',
    type: 'new_arrivals',
    title: 'وصل حديثاً',
    subtitle: 'نظرة مسبقة',
    enabled: true,
    order: 2,
    settings: { limit: 4, layout: 'grid' }
  },
  {
    id: 'sec-newsletter-1',
    type: 'newsletter',
    title: 'انضمي لصالون أورا البريدي',
    subtitle: 'دعوات خاصة وتحديثات الأتيلييه',
    enabled: false,
    order: 3,
    settings: { title: 'انضمي لصالون أورا البريدي', subtitle: 'دعوات خاصة وتحديثات الأتيلييه' }
  }
];

mockSections = mockStorage.read('storefront.homepage', mockSections);

export const HomepageService = {
  async getSections(): Promise<HomepageSection[]> {
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
    const copy: HomepageSection = {
      ...original,
      id: `sec-${original.type}-${Date.now()}`,
      title: `${original.title} (نسخة)`,
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
  }
};

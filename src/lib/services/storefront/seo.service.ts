import { mockStorage } from '@/lib/storage/mock-storage';

export interface SEOSettings {
  id: string;
  page: 'global' | 'homepage' | 'products' | 'categories' | 'collections';
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  twitterCard: 'summary' | 'summary_large_image';
  canonical?: string;
  robots: string;
  jsonLd: boolean;
}

let mockSEO: SEOSettings[] = [
  {
    id: 'seo-global',
    page: 'global',
    title: 'AURA - Premium Fashion',
    description: 'Discover the latest premium fashion collections at AURA.',
    keywords: 'fashion, premium, aura, clothing',
    ogImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=630&fit=crop',
    twitterCard: 'summary_large_image',
    robots: 'index, follow',
    jsonLd: true
  }
];

mockSEO = mockStorage.read('storefront.seo', mockSEO);
const persistSEO = () => mockStorage.write('storefront.seo', mockSEO);

export const SEOService = {
  async getAll(): Promise<SEOSettings[]> {
    return [...mockSEO];
  },

  async getByPage(page: SEOSettings['page']): Promise<SEOSettings | undefined> {
    return mockSEO.find(s => s.page === page);
  },

  async update(id: string, updates: Partial<SEOSettings>): Promise<SEOSettings> {
    const idx = mockSEO.findIndex(s => s.id === id);
    if (idx > -1) {
      mockSEO[idx] = { ...mockSEO[idx], ...updates };
      persistSEO();
      return mockSEO[idx];
    }
    // If global doesn't exist, create it (mock logic)
    const newSettings = { id, ...updates } as SEOSettings;
    mockSEO.push(newSettings);
    persistSEO();
    return newSettings;
  },
  
  async getSEOScore(): Promise<{ score: number, brokenLinks: number }> {
    return { score: 85, brokenLinks: 2 };
  }
};

import { SEOData, defaultSEOData } from './shared';

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverImage?: string;
  banner?: string;
  season?: string;
  priority: number;
  isFeatured: boolean;
  status: 'published' | 'draft' | 'archived';
  publishDate?: string;
  seo: SEOData;
  productsCount: number;
}

export let mockCollections: Collection[] = [
  {
    id: 'col_1',
    name: 'ربيع وصيف 2027',
    slug: 'spring-summer-2027',
    description: 'أحدث تشكيلات الربيع والصيف بألوان زاهية وتصاميم عصرية تناسب جميع الأذواق.',
    coverImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
    banner: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920',
    season: 'Spring/Summer',
    priority: 1,
    isFeatured: true,
    status: 'published',
    publishDate: '2027-02-01T00:00:00Z',
    productsCount: 42,
    seo: { ...defaultSEOData, metaTitle: 'ربيع وصيف 2027 | AURA', slug: 'spring-summer-2027' }
  },
  {
    id: 'col_2',
    name: 'خريف وشتاء 2027',
    slug: 'autumn-winter-2027',
    description: 'تشكيلة الخريف والشتاء المميزة بخامات دافئة وأنيقة.',
    coverImage: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
    season: 'Autumn/Winter',
    priority: 2,
    isFeatured: false,
    status: 'draft',
    productsCount: 28,
    seo: { ...defaultSEOData, metaTitle: 'خريف وشتاء 2027 | AURA', slug: 'autumn-winter-2027' }
  },
  {
    id: 'col_3',
    name: 'Luxury Collection',
    slug: 'luxury-collection',
    description: 'الإصدار المحدود من القطع الفاخرة.',
    coverImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800',
    priority: 3,
    isFeatured: true,
    status: 'published',
    productsCount: 15,
    seo: { ...defaultSEOData, metaTitle: 'التشكيلة الفاخرة | AURA', slug: 'luxury-collection' }
  }
];

export const updateMockCollections = (newCollections: Collection[]) => {
  mockCollections = newCollections;
};

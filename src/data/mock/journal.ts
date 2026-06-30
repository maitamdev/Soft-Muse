import { SEOData, defaultSEOData } from './shared';
import { mockStorage } from '@/lib/storage/mock-storage';

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Rich Text HTML
  featuredImage: string;
  gallery: string[];
  category: string;
  tags: string[];
  author: string;
  readingTime: number; // in minutes
  status: 'published' | 'draft' | 'archived';
  isFeatured: boolean;
  publishDate: string;
  seo: SEOData;
}

export let mockArticles: Article[] = [
  {
    id: 'art_1',
    title: 'أبرز صيحات الموضة لربيع 2027',
    slug: 'spring-2027-trends',
    excerpt: 'اكتشفي الألوان والتصاميم التي ستسيطر على عالم الموضة في الموسم القادم.',
    content: '<p>محتوى المقال هنا...</p>',
    featuredImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800',
    gallery: [],
    category: 'صيحات الموضة',
    tags: ['ربيع', '2027', 'أزياء'],
    author: 'فريق AURA',
    readingTime: 5,
    status: 'published',
    isFeatured: true,
    publishDate: '2026-06-20T10:00:00Z',
    seo: { ...defaultSEOData, metaTitle: 'صيحات ربيع 2027', slug: 'spring-2027-trends' }
  },
  {
    id: 'art_2',
    title: 'كيف تختارين الفستان المناسب لشكل جسمك',
    slug: 'how-to-choose-the-perfect-dress',
    excerpt: 'دليل شامل لاختيار القصة واللون الأنسب لإبراز جمالك الطبيعي.',
    content: '<p>دليل اختيار الفساتين...</p>',
    featuredImage: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800',
    gallery: [],
    category: 'نصائح أزياء',
    tags: ['فساتين', 'نصائح', 'أناقة'],
    author: 'سارة أحمد',
    readingTime: 8,
    status: 'published',
    isFeatured: false,
    publishDate: '2026-05-15T14:30:00Z',
    seo: { ...defaultSEOData, metaTitle: 'دليل اختيار الفساتين', slug: 'how-to-choose-the-perfect-dress' }
  }
];

mockArticles = mockStorage.read('articles', mockArticles);

export const updateMockArticles = (newArticles: Article[]) => {
  mockArticles = newArticles;
  mockStorage.write('articles', newArticles);
};

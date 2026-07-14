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
 title: 'Thời trang 2027',
 slug: 'spring-2027-trends',
 excerpt: 'Màu sắc thời trang trongMùa.',
 content: '<p>..</p>',
 featuredImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800',
 gallery: [],
 category: 'Thời trang',
 tags: ['', '2027', ''],
 author: 'AURA',
 readingTime: 5,
 status: 'published',
 isFeatured: true,
 publishDate: '2026-06-20T10:00:00Z',
 seo: { ...defaultSEOData, metaTitle: '2027', slug: 'spring-2027-trends' }
 },
 {
 id: 'art_2',
 title: 'mã',
 slug: 'how-to-choose-the-perfect-dress',
 excerpt: 'Phom dáng.',
 content: '<p>Váy..</p>',
 featuredImage: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800',
 gallery: [],
 category: '',
 tags: ['Váy', '', 'Thanh lịch'],
 author: '',
 readingTime: 8,
 status: 'published',
 isFeatured: false,
 publishDate: '2026-05-15T14:30:00Z',
 seo: { ...defaultSEOData, metaTitle: 'Váy', slug: 'how-to-choose-the-perfect-dress' }
 }
];

mockArticles = mockStorage.read('articles', mockArticles);

export const updateMockArticles = (newArticles: Article[]) => {
 mockArticles = newArticles;
 mockStorage.write('articles', newArticles);
};

import { mockStorage } from '@/lib/storage/mock-storage';

export interface Media {
 id: string;
 fileName: string;
 originalName: string;
 alt: string;
 mimeType: string;
 width: number;
 height: number;
 size: number;
 folder: string;
 url: string;
 thumbnail: string;
 uploadedAt: string;
 uploadedBy: string;
 usedIn: string[];
 tags: string[];
}

export let mockMedia: Media[] = [
 {
 id: 'media_1',
 fileName: 'hero-banner-spring.jpg',
 originalName: 'hero_spring_final.jpg',
 alt: 'Bộ sưu tập ',
 mimeType: 'image/jpeg',
 width: 1920,
 height: 1080,
 size: 1540000,
 folder: 'banners',
 url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&q=80',
 thumbnail: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&q=80',
 uploadedAt: '2026-06-01T10:00:00Z',
 uploadedBy: 'Admin',
 usedIn: ['collection_spring'],
 tags: ['spring', 'banner', 'hero']
 },
 {
 id: 'media_2',
 fileName: 'product-dress-red-1.jpg',
 originalName: 'red_dress_front.jpg',
 alt: '-',
 mimeType: 'image/jpeg',
 width: 1080,
 height: 1440,
 size: 850000,
 folder: 'products',
 url: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=1080&q=80',
 thumbnail: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=200&q=80',
 uploadedAt: '2026-06-15T14:30:00Z',
 uploadedBy: 'Admin',
 usedIn: ['prod_1'],
 tags: ['dress', 'red', 'product']
 },
 {
 id: 'media_3',
 fileName: 'category-shoes.jpg',
 originalName: 'shoes_cat_icon.jpg',
 alt: '',
 mimeType: 'image/jpeg',
 width: 800,
 height: 800,
 size: 450000,
 folder: 'categories',
 url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80',
 thumbnail: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200&q=80',
 uploadedAt: '2026-05-20T09:15:00Z',
 uploadedBy: 'Admin',
 usedIn: ['cat_shoes'],
 tags: ['shoes', 'category']
 }
];

mockMedia = mockStorage.read('media', mockMedia);

export const updateMockMedia = (newMedia: Media[]) => {
 mockMedia = newMedia;
 mockStorage.write('media', newMedia);
};

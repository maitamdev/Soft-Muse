import type { BaseEntity, EntitySeo } from './base';

// ─── Article (Journal/Blog) ───────────────────────────────────────────────────

export interface ArticleStats {
 views: number;
 shares: number;
 likes: number;
}

export interface Article extends BaseEntity {
 titleAr: string;
 slug: string;
 contentAr: string; // Rich text HTML
 excerptAr: string;
 coverImageUrl: string;
 authorId: string; // → StaffMember
 publishedAt: string | null;
 tags: string[];
 categoryAr: string | null; // Article category for filtering
 isFeatured: boolean;
 readTimeMinutes: number; // Computed from content length
 seo: EntitySeo;
 stats: ArticleStats;
}

// ─── CMS Page ────────────────────────────────────────────────────────────────

export interface CmsPage extends BaseEntity {
 slug: string; // "about", "privacy-policy", "terms-conditions"
 titleAr: string;
 contentAr: string; // Rich text HTML
 isSystem: boolean; // System pages cannot be deleted
 sortOrder: number;
 seo: EntitySeo;
}

export const SYSTEM_PAGE_SLUGS = [
 'about',
 'privacy-policy',
 'terms-conditions',
 'shipping-policy',
 'returns-policy',
 'faq',
 'contact',
 'size-guide',
] as const;

export type SystemPageSlug = typeof SYSTEM_PAGE_SLUGS[number];

// ─── Media ───────────────────────────────────────────────────────────────────

export type MediaType = 'image' | 'video' | 'document';

export interface MediaUsage {
 entityType: string; // "product", "category", "article"
 entityId: string;
 field: string; // "cover", "gallery[0]"
}

export interface MediaItem extends BaseEntity {
 url: string;
 name: string;
 type: MediaType;
 mimeType: string;
 sizeBytes: number;
 width: number | null;
 height: number | null;
 folderId: string | null;
 altTextAr: string | null;
 tags: string[];
 usedBy: MediaUsage[];

 // Storage metadata (future-ready for Supabase Storage / CDN)
 storagePath: string | null;
 checksum: string | null;
 hash: string | null;
 blurDataURL: string | null;
 dominantColor: string | null;
 metadata: Record<string, unknown> | null;
}

export interface MediaFolder extends BaseEntity {
 nameAr: string;
 slug: string;
 parentId: string | null; // Supports nested folders
 order: number;
}

// ─── DTOs ────────────────────────────────────────────────────────────────────

export type ArticleCreateDTO = Omit<Article,
 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'deletedAt' | 'isArchived' | 'stats'
>;
export type ArticleUpdateDTO = Partial<Omit<ArticleCreateDTO, 'slug'>>;

export type CmsPageCreateDTO = Omit<CmsPage,
 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'deletedAt' | 'isArchived'
>;
export type CmsPageUpdateDTO = Partial<Omit<CmsPageCreateDTO, 'slug' | 'isSystem'>>;

export type MediaItemCreateDTO = Omit<MediaItem,
 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'deletedAt' | 'isArchived' | 'usedBy'
>;

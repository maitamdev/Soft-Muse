import type { BaseEntity, EntitySeo } from './base';

// ─── Product ────────────────────────────────────────────────────────────────

export type Season = 'mùa hè' | 'mùa đông' | '' | '' | 'tất cảmã';
export type ProductStatus = 'active' | 'inactive' | 'draft' | 'published' | 'archived' | 'deleted';

export interface Product extends BaseEntity {
 // Identity
 nameAr: string;
 slug: string;
 sku: string;
 barcode: string;

 // Descriptions
 descriptionAr: string;
 shortDescriptionAr: string;

 // Classification
 categoryId: string;
 collectionId: string | null;
 brandId: string | null;
 season: Season | null;
 tags: string[];

 // Pricing
 price: number;
 comparePrice: number | null;
 costPrice: number;
 costing: ProductCosting;

 // Stock (aggregate — actual levels live in InventoryLevel)
 totalStock: number;
 lowStockLimit: number;

 // Variants
 hasVariants: boolean;

 // Visibility
 isFeatured: boolean;
 isNewArrival: boolean;
 isBestSeller: boolean;
 publishedAt: string | null;
 hiddenAt: string | null;

 // SEO
 seo: EntitySeo;

 // Stats (read-only, computed)
 stats: ProductStats;
}

export interface ProductCosting {
 fabric: number;
 accessories: number;
 manufacturing: number;
 printing: number;
 packaging: number;
 photography: number;
 shipping: number;
 marketing: number;
 taxes: number;
 marketplaceFees: number;
 otherExpenses: number;
 // totalCost is always computed: sum of all above
}

export interface ProductVariant extends BaseEntity {
 productId: string;
 sku: string;
 barcode: string;
 options: Record<string, string>; // { "Kích cỡ": "M", "": "" }
 price: number;
 comparePrice: number | null;
 costPrice: number | null;
 mediaId: string | null;
 isDefault: boolean;
 stock: number; // Per-variant stock override
}

export interface ProductMedia extends BaseEntity {
 productId: string;
 url: string;
 altTextAr: string;
 type: 'image' | 'video';
 isCover: boolean;
 order: number;
 width: number | null;
 height: number | null;
 storagePath: string | null;
 checksum: string | null;
 blurDataURL: string | null;
 dominantColor: string | null;
}

export interface ProductStats {
 views: number;
 orders: number;
 revenue: number;
 wishlistCount: number;
 cartCount: number;
 reviewsCount: number;
 averageRating: number;
}

// ─── Category ────────────────────────────────────────────────────────────────

export interface Category extends BaseEntity {
 nameAr: string;
 slug: string;
 descriptionAr: string;
 thumbnailUrl: string;
 parentId: string | null;
 sortOrder: number;
 isFeatured: boolean;
 showOnHomepage: boolean;
 showInMenu: boolean;
 productCount: number;
 seo: EntitySeo;
}

// ─── Collection ──────────────────────────────────────────────────────────────

export type CollectionType = 'manual' | 'automatic';

export interface CollectionRule {
 field: 'category' | 'brand' | 'tag' | 'price' | 'status' | 'season';
 operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains';
 value: string;
}

export interface Collection extends BaseEntity {
 nameAr: string;
 slug: string;
 descriptionAr: string;
 imageUrl: string;
 type: CollectionType;
 productIds: string[];
 rules: CollectionRule[];
 sortOrder: number;
 isFeatured: boolean;
 seo: EntitySeo;
}

// ─── Brand ───────────────────────────────────────────────────────────────────

export interface Brand extends BaseEntity {
 nameAr: string;
 slug: string;
 descriptionAr: string;
 logoUrl: string;
 bannerUrl: string | null;
 website: string | null;
 sortOrder: number;
 isFeatured: boolean;
 seo: EntitySeo;
}

// ─── DTOs ────────────────────────────────────────────────────────────────────

export type ProductCreateDTO = Omit<Product,
 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' |
 'deletedAt' | 'isArchived' | 'totalStock' | 'stats'
>;

export type ProductUpdateDTO = Partial<ProductCreateDTO>;

export type CategoryCreateDTO = Omit<Category,
 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' |
 'deletedAt' | 'isArchived' | 'productCount'
>;

export type CategoryUpdateDTO = Partial<CategoryCreateDTO>;

export type CollectionCreateDTO = Omit<Collection,
 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' |
 'deletedAt' | 'isArchived'
>;

export type CollectionUpdateDTO = Partial<CollectionCreateDTO>;

export type BrandCreateDTO = Omit<Brand,
 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' |
 'deletedAt' | 'isArchived'
>;

export type BrandUpdateDTO = Partial<BrandCreateDTO>;

// ─── Filters ─────────────────────────────────────────────────────────────────

export interface ProductFilters {
 categoryId?: string;
 collectionId?: string;
 brandId?: string;
 season?: Season;
 status?: ProductStatus;
 stockStatus?: 'in_stock' | 'low_stock' | 'out_of_stock';
 isFeatured?: boolean;
 isNewArrival?: boolean;
 isBestSeller?: boolean;
 minPrice?: number;
 maxPrice?: number;
}

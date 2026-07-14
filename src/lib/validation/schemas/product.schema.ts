import { z } from 'zod';
import { zArabicText, zArabicTextOpt, zUrl, zNonNegativeNumber, zPrice, zSlug, zIdOpt, zTags } from './base.schema';

export const ProductCostingSchema = z.object({
 fabric: zNonNegativeNumber(''),
 accessories: zNonNegativeNumber(''),
 manufacturing: zNonNegativeNumber(''),
 printing: zNonNegativeNumber('In'),
 packaging: zNonNegativeNumber('Đónggói'),
 photography: zNonNegativeNumber(''),
 shipping: zNonNegativeNumber('Vận chuyển'),
 marketing: zNonNegativeNumber(''),
 taxes: zNonNegativeNumber('Thuế'),
 marketplaceFees: zNonNegativeNumber(''),
 otherExpenses: zNonNegativeNumber(''),
});

export const EntitySeoSchema = z.object({
 metaTitleAr: z.string().max(70, 'tiêu đềSEO 70').default(''),
 metaDescriptionAr: z.string().max(160, 'mô tảSEO 160').default(''),
 ogImageUrl: z.string().default(''),
 canonicalUrl: z.string().default(''),
 keywords: z.string().default(''),
 noIndex: z.boolean().default(false),
 noFollow: z.boolean().default(false),
});

export const ProductCreateSchema = z.object({
 nameAr: zArabicText('Tênsản phẩm'),
 slug: zSlug(),
 sku: z.string().min(1, 'SKU '),
 barcode: z.string().default(''),
 descriptionAr: z.string().default(''),
 shortDescriptionAr: z.string().default(''),
 categoryId: z.string().min(1, 'Danh mục '),
 collectionId: zIdOpt(),
 brandId: zIdOpt(),
 season: z.enum(['mùa hè', 'mùa đông', '', '', 'tất cảmã']).nullable().default(null),
 tags: zTags(),
 price: zPrice('giá'),
 comparePrice: zPrice('giá').nullable().default(null),
 costPrice: zNonNegativeNumber('giá').default(0),
 costing: ProductCostingSchema.default({ fabric: 0, accessories: 0, manufacturing: 0, printing: 0, packaging: 0, photography: 0, shipping: 0, marketing: 0, taxes: 0, marketplaceFees: 0, otherExpenses: 0 }),
 lowStockLimit: z.number().int().min(0).default(5),
 hasVariants: z.boolean().default(false),
 isFeatured: z.boolean().default(false),
 isNewArrival: z.boolean().default(false),
 isBestSeller: z.boolean().default(false),
 publishedAt: z.string().datetime().nullable().default(null),
 hiddenAt: z.string().datetime().nullable().default(null),
 seo: EntitySeoSchema.optional(),
});

export const ProductUpdateSchema = ProductCreateSchema.partial();

export const CategoryCreateSchema = z.object({
 nameAr: zArabicText('Têndanh mục'),
 slug: zSlug(),
 descriptionAr: z.string().default(''),
 thumbnailUrl: z.string().default(''),
 parentId: zIdOpt(),
 sortOrder: z.number().int().min(0).default(0),
 isFeatured: z.boolean().default(false),
 showOnHomepage: z.boolean().default(true),
 showInMenu: z.boolean().default(true),
 seo: EntitySeoSchema.optional(),
});

export const CategoryUpdateSchema = CategoryCreateSchema.partial();

export const CollectionCreateSchema = z.object({
 nameAr: zArabicText('mã Bộ sưu tập'),
 slug: zSlug(),
 descriptionAr: z.string().default(''),
 imageUrl: z.string().default(''),
 type: z.enum(['manual', 'automatic']).default('manual'),
 productIds: z.array(z.string()).default([]),
 rules: z.array(z.any()).default([]),
 sortOrder: z.number().int().min(0).default(0),
 isFeatured: z.boolean().default(false),
 seo: EntitySeoSchema.optional(),
});

export const BrandCreateSchema = z.object({
 nameAr: zArabicText('mã '),
 slug: zSlug(),
 descriptionAr: z.string().default(''),
 logoUrl: z.string().default(''),
 bannerUrl: z.string().nullable().default(null),
 website: zUrl(),
 sortOrder: z.number().int().min(0).default(0),
 isFeatured: z.boolean().default(false),
 seo: EntitySeoSchema.optional(),
});

import { z } from 'zod';
import { zArabicText, zArabicTextOpt, zUrl, zNonNegativeNumber, zPrice, zSlug, zIdOpt, zTags } from './base.schema';

export const ProductCostingSchema = z.object({
  fabric:          zNonNegativeNumber('تكلفة القماش'),
  accessories:     zNonNegativeNumber('تكلفة الإكسسوارات'),
  manufacturing:   zNonNegativeNumber('تكلفة التصنيع'),
  printing:        zNonNegativeNumber('تكلفة الطباعة'),
  packaging:       zNonNegativeNumber('تكلفة التغليف'),
  photography:     zNonNegativeNumber('تكلفة التصوير'),
  shipping:        zNonNegativeNumber('تكلفة الشحن'),
  marketing:       zNonNegativeNumber('تكلفة التسويق'),
  taxes:           zNonNegativeNumber('الضرائب'),
  marketplaceFees: zNonNegativeNumber('عمولات المنصات'),
  otherExpenses:   zNonNegativeNumber('مصاريف أخرى'),
});

export const EntitySeoSchema = z.object({
  metaTitleAr:       z.string().max(70, 'عنوان SEO يجب ألا يتجاوز 70 حرفاً').default(''),
  metaDescriptionAr: z.string().max(160, 'وصف SEO يجب ألا يتجاوز 160 حرفاً').default(''),
  ogImageUrl:        z.string().default(''),
  canonicalUrl:      z.string().default(''),
  keywords:          z.string().default(''),
  noIndex:           z.boolean().default(false),
  noFollow:          z.boolean().default(false),
});

export const ProductCreateSchema = z.object({
  nameAr:             zArabicText('اسم المنتج'),
  slug:               zSlug(),
  sku:                z.string().min(1, 'رمز SKU مطلوب'),
  barcode:            z.string().default(''),
  descriptionAr:      z.string().default(''),
  shortDescriptionAr: z.string().default(''),
  categoryId:         z.string().min(1, 'القسم مطلوب'),
  collectionId:       zIdOpt(),
  brandId:            zIdOpt(),
  season:             z.enum(['صيف', 'شتاء', 'ربيع', 'خريف', 'كل المواسم']).nullable().default(null),
  tags:               zTags(),
  price:              zPrice('سعر البيع'),
  comparePrice:       zPrice('سعر المقارنة').nullable().default(null),
  costPrice:          zNonNegativeNumber('سعر التكلفة').default(0),
  costing:            ProductCostingSchema.default({ fabric: 0, accessories: 0, manufacturing: 0, printing: 0, packaging: 0, photography: 0, shipping: 0, marketing: 0, taxes: 0, marketplaceFees: 0, otherExpenses: 0 }),
  lowStockLimit:      z.number().int().min(0).default(5),
  hasVariants:        z.boolean().default(false),
  isFeatured:         z.boolean().default(false),
  isNewArrival:       z.boolean().default(false),
  isBestSeller:       z.boolean().default(false),
  publishedAt:        z.string().datetime().nullable().default(null),
  hiddenAt:           z.string().datetime().nullable().default(null),
  seo:                EntitySeoSchema.optional(),
});

export const ProductUpdateSchema = ProductCreateSchema.partial();

export const CategoryCreateSchema = z.object({
  nameAr:        zArabicText('اسم القسم'),
  slug:          zSlug(),
  descriptionAr: z.string().default(''),
  thumbnailUrl:  z.string().default(''),
  parentId:      zIdOpt(),
  sortOrder:     z.number().int().min(0).default(0),
  isFeatured:    z.boolean().default(false),
  showOnHomepage: z.boolean().default(true),
  showInMenu:    z.boolean().default(true),
  seo:           EntitySeoSchema.optional(),
});

export const CategoryUpdateSchema = CategoryCreateSchema.partial();

export const CollectionCreateSchema = z.object({
  nameAr:        zArabicText('اسم التشكيلة'),
  slug:          zSlug(),
  descriptionAr: z.string().default(''),
  imageUrl:      z.string().default(''),
  type:          z.enum(['manual', 'automatic']).default('manual'),
  productIds:    z.array(z.string()).default([]),
  rules:         z.array(z.any()).default([]),
  sortOrder:     z.number().int().min(0).default(0),
  isFeatured:    z.boolean().default(false),
  seo:           EntitySeoSchema.optional(),
});

export const BrandCreateSchema = z.object({
  nameAr:        zArabicText('اسم العلامة التجارية'),
  slug:          zSlug(),
  descriptionAr: z.string().default(''),
  logoUrl:       z.string().default(''),
  bannerUrl:     z.string().nullable().default(null),
  website:       zUrl(),
  sortOrder:     z.number().int().min(0).default(0),
  isFeatured:    z.boolean().default(false),
  seo:           EntitySeoSchema.optional(),
});

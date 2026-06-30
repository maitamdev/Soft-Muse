import type { Product, ProductCreateDTO, ProductUpdateDTO, ProductFilters, Category, CategoryCreateDTO, CategoryUpdateDTO, Collection, CollectionCreateDTO, CollectionUpdateDTO, Brand, BrandCreateDTO, BrandUpdateDTO, ProductMedia } from '@/types/product';
import type { PaginatedResult } from '@/types/query';
import type { IBaseRepository } from './IBaseRepository';

export interface IProductRepository
  extends IBaseRepository<Product, ProductCreateDTO, ProductUpdateDTO, ProductFilters> {

  /** Duplicate a product — creates new with "نسخة" suffix, resets SKU */
  duplicate(id: string): Promise<Product>;

  /** Set featured products (bulk, ordered) */
  setFeatured(ids: string[]): Promise<void>;

  /** Products with stock at or below threshold */
  getLowStock(threshold?: number, warehouseId?: string): Promise<PaginatedResult<Product>>;

  /** Featured products for storefront */
  getFeatured(limit?: number): Promise<Product[]>;

  /** New arrivals for storefront */
  getNewArrivals(limit?: number): Promise<Product[]>;

  /** Best sellers for storefront */
  getBestSellers(limit?: number): Promise<Product[]>;

  /** Products by category (for storefront category pages) */
  getByCategory(categoryId: string, limit?: number): Promise<PaginatedResult<Product>>;

  /** Products by collection */
  getByCollection(collectionId: string, limit?: number): Promise<PaginatedResult<Product>>;

  /** Bulk status update */
  bulkUpdateStatus(ids: string[], status: Product['status']): Promise<void>;

  /** Bulk category assignment */
  bulkSetCategory(ids: string[], categoryId: string): Promise<void>;

  // Media management
  addMedia(productId: string, media: Omit<ProductMedia, 'id' | 'productId' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'deletedAt' | 'isArchived' | 'status'>): Promise<ProductMedia>;
  removeMedia(productId: string, mediaId: string): Promise<void>;
  reorderMedia(productId: string, orderedIds: string[]): Promise<void>;
  setCoverMedia(productId: string, mediaId: string): Promise<void>;
}

export interface ICategoryRepository
  extends IBaseRepository<Category, CategoryCreateDTO, CategoryUpdateDTO> {
  duplicate(id: string): Promise<Category>;
  reorder(orderedIds: string[]): Promise<void>;
  getForMenu(): Promise<Category[]>;
  getForHomepage(): Promise<Category[]>;
}

export interface ICollectionRepository
  extends IBaseRepository<Collection, CollectionCreateDTO, CollectionUpdateDTO> {
  duplicate(id: string): Promise<Collection>;
  getProducts(collectionId: string): Promise<Product[]>;
  setProducts(collectionId: string, productIds: string[]): Promise<void>;
}

export interface IBrandRepository
  extends IBaseRepository<Brand, BrandCreateDTO, BrandUpdateDTO> {
  duplicate(id: string): Promise<Brand>;
}

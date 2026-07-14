import { BaseMockRepository } from './BaseMockRepository';
import type { Product, ProductCreateDTO, ProductUpdateDTO, ProductFilters } from '@/types/product';
import type { IProductRepository } from '@/lib/contracts/v2/IProductRepository';
import type { BaseEntity } from '@/types/base';
import type { PaginatedResult } from '@/types/query';

export class MockProductRepository
 extends BaseMockRepository<Product, ProductCreateDTO, ProductUpdateDTO, ProductFilters>
 implements IProductRepository {
 protected buildEntity(data: ProductCreateDTO, base: BaseEntity): Product {
 return { ...base, totalStock: 0, stats: { views: 0, orders: 0, revenue: 0, wishlistCount: 0, cartCount: 0, reviewsCount: 0, averageRating: 0 }, ...data } as Product;
 }
 protected mergeUpdate(existing: Product, data: ProductUpdateDTO): Product { return { ...existing, ...data }; }
 protected applySearch(items: Product[], search: string): Product[] {
 const q = search.toLowerCase();
 return items.filter(p => p.nameAr.includes(q) || p.sku.toLowerCase().includes(q));
 }
 async duplicate(id: string) { return this.duplicateEntity(id, e => ({ nameAr: `${e.nameAr} (Bản sao)`, sku: `${e.sku}-COPY`, status: 'draft' as const })); }
 async setFeatured(ids: string[]) { this.items = this.items.map(p => ({ ...p, isFeatured: ids.includes(p.id) })); }
 async getLowStock(threshold = 5): Promise<PaginatedResult<Product>> { return this.list({ filters: {} }); }
 async getFeatured(limit = 8) { return this.items.filter(p => p.isFeatured && !p.deletedAt).slice(0, limit); }
 async getNewArrivals(limit = 8) { return this.items.filter(p => p.isNewArrival && !p.deletedAt).slice(0, limit); }
 async getBestSellers(limit = 8) { return this.items.filter(p => p.isBestSeller && !p.deletedAt).slice(0, limit); }
 async getByCategory(categoryId: string, limit?: number): Promise<PaginatedResult<Product>> { return this.list({ filters: { categoryId } }); }
 async getByCollection(collectionId: string): Promise<PaginatedResult<Product>> { return this.list({ filters: { collectionId } }); }
 async bulkUpdateStatus(ids: string[], status: Product['status']) { this.items = this.items.map(p => ids.includes(p.id) ? { ...p, status } : p); }
 async bulkSetCategory(ids: string[], categoryId: string) { this.items = this.items.map(p => ids.includes(p.id) ? { ...p, categoryId } : p); }
 async addMedia(productId: string, media: any): Promise<any> { throw new Error('Not implemented'); }
 async removeMedia(productId: string, mediaId: string): Promise<void> { throw new Error('Not implemented'); }
 async reorderMedia(productId: string, orderedIds: string[]): Promise<void> { throw new Error('Not implemented'); }
 async setCoverMedia(productId: string, mediaId: string): Promise<void> { throw new Error('Not implemented'); }
}

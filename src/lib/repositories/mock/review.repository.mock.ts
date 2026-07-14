import { BaseMockRepository } from './BaseMockRepository';
import type { Review } from '@/types/crm';
import type { IReviewRepository } from '@/lib/contracts/v2/ICrmRepository';
import type { BaseEntity } from '@/types/base';
import type { PaginatedResult, QueryOptions } from '@/types/query';
import { paginate } from '@/types/query';

type ReviewCreate = Omit<Review, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'deletedAt' | 'isArchived' | 'helpfulCount'>;

export class MockReviewRepository
 extends BaseMockRepository<Review, ReviewCreate, Partial<Review>>
 implements IReviewRepository {

 protected buildEntity(data: ReviewCreate, base: BaseEntity): Review {
 return { ...base, helpfulCount: 0, ...data } as Review;
 }
 protected mergeUpdate(e: Review, d: Partial<Review>): Review { return { ...e, ...d }; }
 protected applySearch(items: Review[], s: string) {
 const q = s.toLowerCase();
 return items.filter(i => i.customerNameAr.includes(q) || i.contentAr.includes(q));
 }

 async getByProduct(productId: string, options?: QueryOptions): Promise<PaginatedResult<Review>> {
 return paginate(this.items.filter(r => r.productId === productId && !r.deletedAt), options);
 }
 async getByCustomer(customerId: string) { return this.items.filter(r => r.customerId === customerId && !r.deletedAt); }
 async getPending(options?: QueryOptions): Promise<PaginatedResult<Review>> {
 return paginate(this.items.filter(r => r.status === 'inactive' && !r.deletedAt), options);
 }
 async approve(id: string) { return this.update(id, { status: 'active' } as any); }
 async reject(id: string) { return this.update(id, { status: 'archived' } as any); }
 async reply(id: string, replyAr: string, repliedBy: string) {
 return this.update(id, { replyAr, repliedBy, repliedAt: new Date().toISOString() } as any);
 }
 async toggleFeatured(id: string) {
 const r = await this.findById(id);
 if (!r) throw new Error('Not found');
 return this.update(id, { isFeatured: !r.isFeatured } as any);
 }
 async getAverageRating(productId: string) {
 const reviews = this.items.filter(r => r.productId === productId && !r.deletedAt);
 return reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
 }
}

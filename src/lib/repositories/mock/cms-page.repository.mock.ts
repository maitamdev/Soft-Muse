import { BaseMockRepository } from './BaseMockRepository';
import type { CmsPage, CmsPageCreateDTO, CmsPageUpdateDTO } from '@/types/cms';
import type { ICmsPageRepository } from '@/lib/contracts/v2/ICmsRepository';
import type { BaseEntity } from '@/types/base';
import type { PaginatedResult, QueryOptions } from '@/types/query';
import { paginate } from '@/types/query';
import { SYSTEM_PAGE_SLUGS } from '@/types/cms';

export class MockCmsPageRepository
 extends BaseMockRepository<CmsPage, CmsPageCreateDTO, CmsPageUpdateDTO>
 implements ICmsPageRepository {

 protected buildEntity(data: CmsPageCreateDTO, base: BaseEntity): CmsPage {
 return { ...base, ...data } as CmsPage;
 }
 protected mergeUpdate(e: CmsPage, d: CmsPageUpdateDTO): CmsPage { return { ...e, ...d }; }
 protected applySearch(items: CmsPage[], s: string) {
 const q = s.toLowerCase();
 return items.filter(i => i.titleAr.includes(q) || i.slug.includes(q));
 }

 async getBySlug(slug: string) { return this.items.find(p => p.slug === slug && !p.deletedAt) ?? null; }
 async getSystemPages() { return this.items.filter(p => p.isSystem && !p.deletedAt); }
 async getCustomPages(options?: QueryOptions): Promise<PaginatedResult<CmsPage>> {
 return paginate(this.items.filter(p => !p.isSystem && !p.deletedAt), options);
 }
 async reorder(orderedIds: string[]) {
 orderedIds.forEach((id, idx) => {
 const i = this.items.findIndex(p => p.id === id);
 if (i !== -1) this.items[i] = { ...this.items[i], sortOrder: idx };
 });
 }

 // Cannot delete system pages
 async softDelete(id: string) {
 const page = await this.findById(id);
 if (page?.isSystem) throw new Error('Không thể xóa ');
 return super.softDelete(id);
 }
}

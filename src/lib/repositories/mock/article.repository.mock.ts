import { BaseMockRepository } from './BaseMockRepository';
import type { Article, ArticleCreateDTO, ArticleUpdateDTO } from '@/types/cms';
import type { IArticleRepository } from '@/lib/contracts/v2/ICmsRepository';
import type { BaseEntity } from '@/types/base';
import type { PaginatedResult, QueryOptions } from '@/types/query';
import { paginate } from '@/types/query';

export class MockArticleRepository
  extends BaseMockRepository<Article, ArticleCreateDTO, ArticleUpdateDTO>
  implements IArticleRepository {

  protected buildEntity(data: ArticleCreateDTO, base: BaseEntity): Article {
    return { ...base, stats: { views: 0, shares: 0, likes: 0 }, ...data } as Article;
  }
  protected mergeUpdate(e: Article, d: ArticleUpdateDTO): Article { return { ...e, ...d }; }
  protected applySearch(items: Article[], s: string) {
    const q = s.toLowerCase();
    return items.filter(i => i.titleAr.includes(q) || i.slug.includes(q));
  }

  async getBySlug(slug: string) { return this.items.find(a => a.slug === slug && !a.deletedAt) ?? null; }
  async getPublished(options?: QueryOptions): Promise<PaginatedResult<Article>> {
    return paginate(this.items.filter(a => a.publishedAt !== null && !a.deletedAt), options);
  }
  async getFeatured(limit = 4) { return this.items.filter(a => a.isFeatured && !a.deletedAt).slice(0, limit); }
  async getByTag(tag: string, options?: QueryOptions): Promise<PaginatedResult<Article>> {
    return paginate(this.items.filter(a => a.tags.includes(tag) && !a.deletedAt), options);
  }
  async publish(id: string) { return this.update(id, { publishedAt: new Date().toISOString(), status: 'published' } as any); }
  async unpublish(id: string) { return this.update(id, { publishedAt: null, status: 'draft' } as any); }
  async incrementViews(id: string) {
    const idx = this.items.findIndex(a => a.id === id);
    if (idx !== -1) this.items[idx] = { ...this.items[idx], stats: { ...this.items[idx].stats, views: this.items[idx].stats.views + 1 } };
  }
}

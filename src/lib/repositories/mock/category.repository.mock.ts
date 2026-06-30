import { BaseMockRepository } from './BaseMockRepository';
import type { Category, CategoryCreateDTO, CategoryUpdateDTO } from '@/types/product';
import type { ICategoryRepository } from '@/lib/contracts/v2/IProductRepository';
import type { BaseEntity } from '@/types/base';
export class MockCategoryRepository extends BaseMockRepository<Category, CategoryCreateDTO, CategoryUpdateDTO> implements ICategoryRepository {
  protected buildEntity(data: CategoryCreateDTO, base: BaseEntity): Category { return { ...base, productCount: 0, ...data } as Category; }
  protected mergeUpdate(e: Category, d: CategoryUpdateDTO): Category { return { ...e, ...d }; }
  protected applySearch(items: Category[], s: string) { const q = s.toLowerCase(); return items.filter(i => i.nameAr.includes(q) || i.slug.includes(q)); }
  async duplicate(id: string) { return this.duplicateEntity(id, e => ({ nameAr: `${e.nameAr} (نسخة)`, slug: `${e.slug}-copy` })); }
  async reorder(orderedIds: string[]) { orderedIds.forEach((id, idx) => { const i = this.items.findIndex(c => c.id === id); if (i !== -1) this.items[i].sortOrder = idx; }); }
  async getForMenu() { return this.items.filter(c => c.showInMenu && !c.deletedAt); }
  async getForHomepage() { return this.items.filter(c => c.showOnHomepage && !c.deletedAt); }
}

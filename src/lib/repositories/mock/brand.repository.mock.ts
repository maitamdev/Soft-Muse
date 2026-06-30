import { BaseMockRepository } from './BaseMockRepository';
import type { Brand, BrandCreateDTO, BrandUpdateDTO } from '@/types/product';
import type { IBrandRepository } from '@/lib/contracts/v2/IProductRepository';
import type { BaseEntity } from '@/types/base';
export class MockBrandRepository extends BaseMockRepository<Brand, BrandCreateDTO, BrandUpdateDTO> implements IBrandRepository {
  protected buildEntity(data: BrandCreateDTO, base: BaseEntity): Brand { return { ...base, ...data } as Brand; }
  protected mergeUpdate(e: Brand, d: BrandUpdateDTO): Brand { return { ...e, ...d }; }
  protected applySearch(items: Brand[], s: string) { const q = s.toLowerCase(); return items.filter(i => i.nameAr.includes(q)); }
  async duplicate(id: string) { return this.duplicateEntity(id, e => ({ nameAr: `${e.nameAr} (نسخة)` })); }
}

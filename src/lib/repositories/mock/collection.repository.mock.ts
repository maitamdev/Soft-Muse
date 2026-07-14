import { BaseMockRepository } from './BaseMockRepository';
import type { Collection, CollectionCreateDTO, CollectionUpdateDTO, Product } from '@/types/product';
import type { ICollectionRepository } from '@/lib/contracts/v2/IProductRepository';
import type { BaseEntity } from '@/types/base';
export class MockCollectionRepository extends BaseMockRepository<Collection, CollectionCreateDTO, CollectionUpdateDTO> implements ICollectionRepository {
 protected buildEntity(data: CollectionCreateDTO, base: BaseEntity): Collection { return { ...base, ...data } as Collection; }
 protected mergeUpdate(e: Collection, d: CollectionUpdateDTO): Collection { return { ...e, ...d }; }
 protected applySearch(items: Collection[], s: string) { const q = s.toLowerCase(); return items.filter(i => i.nameAr.includes(q)); }
 async duplicate(id: string) { return this.duplicateEntity(id, e => ({ nameAr: `${e.nameAr} (Bản sao)` })); }
 async getProducts(_id: string): Promise<Product[]> { return []; }
 async setProducts(id: string, productIds: string[]) { const i = this.items.findIndex(c => c.id === id); if (i !== -1) this.items[i].productIds = productIds; }
}

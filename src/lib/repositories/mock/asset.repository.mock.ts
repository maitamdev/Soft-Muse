import { BaseMockRepository } from './BaseMockRepository';
import type { Asset, AssetCreateDTO, AssetUpdateDTO } from '@/types/finance';
import type { IAssetRepository } from '@/lib/contracts/v2/IFinanceRepository';
import type { BaseEntity } from '@/types/base';
export class MockAssetRepository extends BaseMockRepository<Asset, AssetCreateDTO, AssetUpdateDTO> implements IAssetRepository {
 protected buildEntity(data: AssetCreateDTO, base: BaseEntity): Asset { return { ...base, ...data } as Asset; }
 protected mergeUpdate(e: Asset, d: AssetUpdateDTO): Asset { return { ...e, ...d }; }
 async getTotalValue() { return this.items.filter(a => !a.deletedAt).reduce((s, a) => s + a.currentValue, 0); }
 async getByWarehouse(warehouseId: string) { return this.items.filter(a => a.warehouseId === warehouseId && !a.deletedAt); }
}

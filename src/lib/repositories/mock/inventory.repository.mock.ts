import type { InventoryLevel } from '@/types/inventory';
import type { IInventoryRepository } from '@/lib/contracts/v2/IInventoryRepository';
import type { PaginatedResult, QueryOptions } from '@/types/query';
import { paginate } from '@/types/query';
import { createBaseFields } from '@/lib/utils/base-entity';
export class MockInventoryRepository implements IInventoryRepository {
 private levels: InventoryLevel[] = [];
 async getLevel(productId: string, warehouseId: string) { return this.levels.find(l => l.productId === productId && l.warehouseId === warehouseId) ?? null; }
 async getLevelsByProduct(productId: string) { return this.levels.filter(l => l.productId === productId); }
 async getLevelsByWarehouse(warehouseId: string, options?: QueryOptions): Promise<PaginatedResult<InventoryLevel>> { return paginate(this.levels.filter(l => l.warehouseId === warehouseId), options); }
 async getLowStock(warehouseId?: string, threshold = 5, options?: QueryOptions): Promise<PaginatedResult<InventoryLevel>> { return paginate(this.levels.filter(l => l.quantity <= threshold && (!warehouseId || l.warehouseId === warehouseId)), options); }
 async adjustQuantity(productId: string, warehouseId: string, delta: number) {
 let level = this.levels.find(l => l.productId === productId && l.warehouseId === warehouseId);
 if (!level) { level = { ...createBaseFields(), productId, warehouseId, quantity: 0, reservedQty: 0 }; this.levels.push(level); }
 level.quantity = Math.max(0, level.quantity + delta);
 return level;
 }
 async reserveStock(productId: string, warehouseId: string, quantity: number) { const l = this.levels.find(l => l.productId === productId && l.warehouseId === warehouseId); if (l) l.reservedQty += quantity; }
 async releaseReservation(productId: string, warehouseId: string, quantity: number) { const l = this.levels.find(l => l.productId === productId && l.warehouseId === warehouseId); if (l) l.reservedQty = Math.max(0, l.reservedQty - quantity); }
}

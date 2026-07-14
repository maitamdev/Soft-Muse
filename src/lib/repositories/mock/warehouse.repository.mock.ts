import type { Warehouse, WarehouseCreateDTO, WarehouseUpdateDTO } from '@/types/inventory';
import type { BaseEntity } from '@/types/base';
import type { IWarehouseRepository } from '@/lib/contracts/v2/IInventoryRepository';
import { BaseMockRepository } from './BaseMockRepository';
import { generateId } from '@/lib/utils/uuid';

const DEFAULT_WAREHOUSE: Warehouse = {
 id: 'wh_default_001',
 nameAr: 'Kho chính',
 code: 'WH-001',
 locationAr: 'TP. Hồ Chí Minh',
 type: 'main',
 isDefault: true,
 contactPhone: '',
 address: '',
 managerName: null,
 createdAt: '2026-01-01T00:00:00.000Z',
 updatedAt: '2026-01-01T00:00:00.000Z',
 createdBy: 'system',
 updatedBy: 'system',
 status: 'active',
 isArchived: false,
 deletedAt: null,
};

export class MockWarehouseRepository
 extends BaseMockRepository<Warehouse, WarehouseCreateDTO, WarehouseUpdateDTO>
 implements IWarehouseRepository {

 constructor() {
 super([DEFAULT_WAREHOUSE]);
 }

 protected buildEntity(data: WarehouseCreateDTO, base: BaseEntity): Warehouse {
 return { ...base, ...data };
 }

 protected mergeUpdate(existing: Warehouse, data: WarehouseUpdateDTO): Warehouse {
 return { ...existing, ...data };
 }

 protected applySearch(items: Warehouse[], search: string): Warehouse[] {
 const q = search.toLowerCase();
 return items.filter(w => w.nameAr.includes(q) || w.code.toLowerCase().includes(q) || w.locationAr.includes(q));
 }

 async getDefault(): Promise<Warehouse | null> {
 return this.items.find(w => w.isDefault && w.deletedAt === null) ?? null;
 }

 async setDefault(id: string): Promise<void> {
 this.items = this.items.map(w => ({ ...w, isDefault: w.id === id }));
 }
}

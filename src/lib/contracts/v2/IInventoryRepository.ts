import type { Warehouse, WarehouseCreateDTO, WarehouseUpdateDTO, InventoryLevel, StockMovement, StockMovementType, InventoryTransfer, InventoryTransferCreateDTO, InventoryAdjustment, InventoryAdjustmentCreateDTO } from '@/types/inventory';
import type { PaginatedResult, QueryOptions } from '@/types/query';
import type { IBaseRepository } from './IBaseRepository';

export interface IWarehouseRepository
 extends IBaseRepository<Warehouse, WarehouseCreateDTO, WarehouseUpdateDTO> {
 getDefault(): Promise<Warehouse | null>;
 setDefault(id: string): Promise<void>;
}

export interface IInventoryRepository {
 /** Get stock level for a product in a specific warehouse */
 getLevel(productId: string, warehouseId: string): Promise<InventoryLevel | null>;

 /** Get all stock levels for a product across all warehouses */
 getLevelsByProduct(productId: string): Promise<InventoryLevel[]>;

 /** Get all stock levels for a warehouse */
 getLevelsByWarehouse(warehouseId: string, options?: QueryOptions): Promise<PaginatedResult<InventoryLevel>>;

 /** Get products with stock at or below threshold in a warehouse */
 getLowStock(warehouseId?: string, threshold?: number, options?: QueryOptions): Promise<PaginatedResult<InventoryLevel>>;

 /** Update quantity (used by StockMovement creation) */
 adjustQuantity(productId: string, warehouseId: string, delta: number): Promise<InventoryLevel>;

 /** Reserve stock for a pending order */
 reserveStock(productId: string, warehouseId: string, quantity: number): Promise<void>;

 /** Release reserved stock (order cancelled or fulfilled) */
 releaseReservation(productId: string, warehouseId: string, quantity: number): Promise<void>;
}

export interface IStockMovementRepository {
 list(options?: QueryOptions & {
 productId?: string;
 warehouseId?: string;
 type?: StockMovementType;
 dateFrom?: string;
 dateTo?: string;
 }): Promise<PaginatedResult<StockMovement>>;

 create(data: Omit<StockMovement, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'deletedAt' | 'isArchived' | 'status'>): Promise<StockMovement>;

 getByReference(referenceType: string, referenceId: string): Promise<StockMovement[]>;
}

export interface IInventoryTransferRepository
 extends IBaseRepository<InventoryTransfer, InventoryTransferCreateDTO, Partial<InventoryTransferCreateDTO>> {
 approve(id: string, approvedBy: string): Promise<InventoryTransfer>;
 complete(id: string): Promise<InventoryTransfer>;
 cancel(id: string): Promise<InventoryTransfer>;
}

export interface IInventoryAdjustmentRepository
 extends IBaseRepository<InventoryAdjustment, InventoryAdjustmentCreateDTO, Partial<InventoryAdjustmentCreateDTO>> {
 approve(id: string, approvedBy: string): Promise<InventoryAdjustment>;
}

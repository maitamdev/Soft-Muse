import type { BaseEntity } from './base';

// ─── Warehouse ───────────────────────────────────────────────────────────────

export type WarehouseType = 'main' | 'secondary' | 'returns' | 'consignment';

export interface Warehouse extends BaseEntity {
  nameAr: string;
  code: string;              // "WH-001"
  locationAr: string;
  type: WarehouseType;
  isDefault: boolean;
  contactPhone: string;
  address: string;
  managerName: string | null;
}

// ─── Inventory Level ─────────────────────────────────────────────────────────

export interface InventoryLevel extends BaseEntity {
  productId: string;
  warehouseId: string;       // Required — every inventory record is warehouse-scoped
  quantity: number;
  reservedQty: number;       // Reserved for pending orders
  // availableQty = quantity - reservedQty (computed, never stored)
}

// ─── Stock Movement ──────────────────────────────────────────────────────────

export type StockMovementType =
  | 'receive'        // From purchase receipt
  | 'deduct'         // From order fulfillment
  | 'return'         // From approved return
  | 'transfer_in'    // Arriving from another warehouse
  | 'transfer_out'   // Leaving to another warehouse
  | 'adjustment';    // Manual correction

export type StockMovementReferenceType =
  | 'purchase_receipt'
  | 'order'
  | 'return'
  | 'transfer'
  | 'adjustment'
  | 'initial';

export interface StockMovement extends BaseEntity {
  productId: string;
  variantId: string | null;
  warehouseId: string;       // Required
  type: StockMovementType;
  quantity: number;          // Always positive. Type implies direction.
  balanceBefore: number;
  balanceAfter: number;
  reason: string;
  referenceType: StockMovementReferenceType | null;
  referenceId: string | null;
  notes: string | null;
}

// ─── Inventory Transfer ───────────────────────────────────────────────────────

export type TransferStatus =
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'in_transit'
  | 'completed'
  | 'cancelled';

export interface InventoryTransfer extends BaseEntity {
  transferNumber: string;           // "TRF-00001"
  sourceWarehouseId: string;
  destinationWarehouseId: string;
  status: TransferStatus;
  items: TransferItem[];
  notes: string | null;
  requestedAt: string;
  approvedBy: string | null;
  approvedAt: string | null;
  completedAt: string | null;
}

export interface TransferItem {
  id: string;
  productId: string;
  variantId: string | null;
  quantityRequested: number;
  quantityTransferred: number;
}

// ─── Inventory Adjustment ─────────────────────────────────────────────────────

export interface InventoryAdjustment extends BaseEntity {
  adjustmentNumber: string;         // "ADJ-00001"
  warehouseId: string;              // Required
  reason: string;
  reasonId: string;                 // → AdjustmentReason from settings
  items: AdjustmentItem[];
  notes: string | null;
  approvedBy: string | null;
}

export interface AdjustmentItem {
  id: string;
  productId: string;
  variantId: string | null;
  quantityBefore: number;
  quantityAfter: number;
  difference: number;               // quantityAfter - quantityBefore
}

// ─── DTOs ────────────────────────────────────────────────────────────────────

export type WarehouseCreateDTO = Omit<Warehouse,
  'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'deletedAt' | 'isArchived'
>;
export type WarehouseUpdateDTO = Partial<WarehouseCreateDTO>;

export type InventoryTransferCreateDTO = Omit<InventoryTransfer,
  'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'deletedAt' | 'isArchived' |
  'approvedBy' | 'approvedAt' | 'completedAt'
>;

export type InventoryAdjustmentCreateDTO = Omit<InventoryAdjustment,
  'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'deletedAt' | 'isArchived' |
  'approvedBy'
>;

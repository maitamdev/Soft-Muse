import type { BaseEntity } from './base';

// ─── Permission System ────────────────────────────────────────────────────────

export interface ModulePermissions {
  read: boolean;
  write: boolean;
  delete: boolean;
  export: boolean;
  approve: boolean;
  archive: boolean;
  restore: boolean;
}

export type PermissionMatrix = Record<string, ModulePermissions>;

export const PERMISSION_MODULES = [
  'dashboard',
  'analytics',
  'products',
  'products.categories',
  'products.collections',
  'products.brands',
  'inventory',
  'inventory.warehouses',
  'inventory.movements',
  'inventory.transfers',
  'inventory.adjustments',
  'procurement',
  'procurement.suppliers',
  'procurement.purchase_orders',
  'procurement.receipts',
  'procurement.payments',
  'manufacturing',
  'finance',
  'finance.expenses',
  'finance.assets',
  'finance.liabilities',
  'finance.capital',
  'orders',
  'returns',
  'refunds',
  'crm.customers',
  'crm.groups',
  'crm.reviews',
  'crm.support',
  'marketing.coupons',
  'marketing.gift_cards',
  'cms',
  'storefront',
  'administration',
  'settings',
] as const;

export type PermissionModule = typeof PERMISSION_MODULES[number];

const FULL_PERMISSIONS: ModulePermissions = {
  read: true, write: true, delete: true,
  export: true, approve: true, archive: true, restore: true,
};

const READ_ONLY: ModulePermissions = {
  read: true, write: false, delete: false,
  export: true, approve: false, archive: false, restore: false,
};

// ─── Role ────────────────────────────────────────────────────────────────────

export interface Role extends BaseEntity {
  nameAr: string;
  nameKey: string;           // Internal identifier: 'administrator'
  descriptionAr: string;
  isSystem: boolean;         // System roles cannot be deleted
  permissions: PermissionMatrix;
  color: string;             // Display color for role badge
}

export const DEFAULT_ROLE_KEYS = [
  'administrator',
  'store_manager',
  'inventory_manager',
  'finance_manager',
  'marketing_manager',
  'customer_support',
  'warehouse_employee',
] as const;

export type DefaultRoleKey = typeof DEFAULT_ROLE_KEYS[number];

// ─── Staff Member ─────────────────────────────────────────────────────────────

export interface StaffMember extends BaseEntity {
  nameAr: string;
  email: string;
  phone: string | null;
  roleId: string;            // → Role
  avatarUrl: string | null;
  lastLoginAt: string | null;
  loginCount: number;
  isSuperAdmin: boolean;     // Bypasses permission checks
}

// ─── Activity Log ─────────────────────────────────────────────────────────────

export type ActivityAction =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'archive'
  | 'restore'
  | 'approve'
  | 'reject'
  | 'login'
  | 'logout'
  | 'export'
  | 'bulk_delete'
  | 'bulk_update'
  | 'status_change';

export interface ActivityLog extends BaseEntity {
  staffId: string;
  module: string;
  action: ActivityAction;
  entityType: string;        // "Product", "Order", etc.
  entityId: string;
  entityLabel: string;       // Human-readable: "فستان سهرة حريري"
  changes: Record<string, { before: unknown; after: unknown }> | null;

  // Extended audit metadata (Phase 0 requirement)
  ipAddress: string | null;
  device: string | null;     // "Desktop", "Mobile", "Tablet"
  platform: string | null;   // "Windows", "iOS", "Android"
  browser: string | null;    // "Chrome 120", "Safari 17"
  source: 'web' | 'api' | 'import' | 'system' | null;
  userAgent: string | null;
}

// ─── DTOs ────────────────────────────────────────────────────────────────────

export type RoleCreateDTO = Omit<Role,
  'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'deletedAt' | 'isArchived'
>;
export type RoleUpdateDTO = Partial<Omit<RoleCreateDTO, 'nameKey' | 'isSystem'>>;

export type StaffCreateDTO = Omit<StaffMember,
  'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'deletedAt' | 'isArchived' |
  'lastLoginAt' | 'loginCount'
>;
export type StaffUpdateDTO = Partial<Omit<StaffCreateDTO, 'email'>>;

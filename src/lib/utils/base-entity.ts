import type { BaseEntity, EntityStatus } from '@/types/base';
import { generateId } from './uuid';
import { SYSTEM_USER_ID } from '@/types/organization';

/**
 * Stamps all BaseEntity fields on creation.
 * Mock repositories use this; Supabase will use triggers/defaults.
 */
export function createBaseFields(
  createdBy: string = SYSTEM_USER_ID,
  status: EntityStatus = 'active'
): BaseEntity {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    createdAt: now,
    updatedAt: now,
    createdBy,
    updatedBy: createdBy,
    status,
    isArchived: false,
    deletedAt: null,
  };
}

/**
 * Stamps updatedAt / updatedBy on every write.
 * Supabase will handle this via a trigger.
 */
export function updateBaseFields(
  updatedBy: string = SYSTEM_USER_ID
): Pick<BaseEntity, 'updatedAt' | 'updatedBy'> {
  return {
    updatedAt: new Date().toISOString(),
    updatedBy,
  };
}

/**
 * Soft-delete stamp. Sets deletedAt; never removes the row.
 */
export function softDeleteFields(): Pick<BaseEntity, 'deletedAt' | 'status' | 'updatedAt'> {
  return {
    deletedAt: new Date().toISOString(),
    status: 'deleted',
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Archive stamp.
 */
export function archiveFields(): Pick<BaseEntity, 'isArchived' | 'status' | 'updatedAt'> {
  return {
    isArchived: true,
    status: 'archived',
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Restore from archive.
 */
export function restoreFields(): Pick<BaseEntity, 'isArchived' | 'status' | 'updatedAt'> {
  return {
    isArchived: false,
    status: 'active',
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Type guard — checks whether a value is a non-deleted entity.
 */
export function isActive<T extends BaseEntity>(entity: T): boolean {
  return entity.deletedAt === null && !entity.isArchived;
}

/**
 * Filter helper for mock repositories.
 * Applies includeArchived and includeDeleted filters automatically.
 */
export function applyBaseFilters<T extends BaseEntity>(
  items: T[],
  options: { includeArchived?: boolean; includeDeleted?: boolean } = {}
): T[] {
  return items.filter(item => {
    if (!options.includeDeleted && item.deletedAt !== null) return false;
    if (!options.includeArchived && item.isArchived) return false;
    return true;
  });
}

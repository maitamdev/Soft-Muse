/**
 * Base Entity — every database entity extends this.
 * Maps 1:1 to Supabase row columns.
 * All fields are enforced at the type level; no entity may omit them.
 */
export interface BaseEntity {
  id: string;
  createdAt: string;       // ISO 8601
  updatedAt: string;       // ISO 8601
  createdBy?: string;      // StaffMember.id — 'system' in seeds
  updatedBy?: string;      // StaffMember.id
  status?: EntityStatus | string;
  isArchived?: boolean;
  deletedAt?: string | null; // null = not deleted (soft delete)
}

export type EntityStatus =
  | 'active'
  | 'inactive'
  | 'draft'
  | 'published'
  | 'archived'
  | 'deleted';

/**
 * Generic revision history for any entity.
 * Replaces ProductRevision — every entity can use this.
 */
export interface EntityRevision<T extends BaseEntity = BaseEntity> extends BaseEntity {
  entityType: string;                     // e.g. 'Product'
  entityId: string;                       // ID of the revised entity
  version: number;                        // Incrementing version number
  changesSummaryAr: string;
  changedFields: string[];                // Which fields changed
  snapshot: Partial<T>;                   // Full entity snapshot at this point
  restoredFrom?: string;                  // Revision ID if this was a restore
}

/**
 * SEO fields reused across Product, Category, Article, CMS Page.
 */
export interface EntitySeo {
  metaTitleAr: string;
  metaDescriptionAr: string;
  ogImageUrl: string;
  canonicalUrl: string;
  keywords: string;
  noIndex: boolean;
  noFollow: boolean;
}

/**
 * Address — reused by Store, Customer, Supplier, Warehouse.
 */
export interface Address {
  country: string;
  city: string;
  district: string;
  street: string;
  buildingNo: string;
  apartmentNo?: string;
  postalCode?: string;
  additionalNumber?: string; // Saudi address format
}

/**
 * Money — always store amount + currency together.
 */
export interface Money {
  amount: number;
  currency: string; // ISO 4217: 'EGP', 'USD', 'EUR'
}

/**
 * Organization / Store / Branch placeholders.
 * Current implementation uses a single store.
 * Architecture is multi-store ready without changing any other code.
 *
 * In Supabase: every table will have an organization_id for RLS.
 */
export interface Organization {
  id: string;
  name: string;
  plan: 'starter' | 'professional' | 'enterprise';
  createdAt: string;
  isActive: boolean;
}

export interface Store {
  id: string;
  organizationId: string;
  nameAr: string;
  slug: string;
  domain: string;
  locale: string;
  currency: string;
  timezone: string;
  isActive: boolean;
  createdAt: string;
}

export interface Branch {
  id: string;
  storeId: string;
  nameAr: string;
  addressAr: string;
  phone: string;
  isActive: boolean;
  isDefault: boolean;
  createdAt: string;
}

/**
 * Current context — single store, single org.
 * Used as default values wherever storeId/organizationId is needed.
 */
export const CURRENT_STORE_ID = 'store_aura_001';
export const CURRENT_ORG_ID   = 'org_aura_001';
export const SYSTEM_USER_ID   = 'staff_system';

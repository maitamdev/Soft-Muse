/**
 * Canonical type barrel — import all domain types from here.
 *
 * Usage:
 *   import type { Product, Category, Order } from '@/types';
 *
 * Never import from individual domain files directly in pages or hooks.
 */

export type * from './base';
export type * from './query';
export type * from './currency';
export type * from './feature-flags';
export type * from './organization';
export type * from './settings';
export type * from './product';
export type * from './inventory';
export type * from './procurement';
export type * from './finance';
export type * from './order';
export type * from './returns';
export type * from './crm';
export type * from './marketing';
export type * from './cms';
export type * from './administration';

// Re-export runtime values (non-type exports)
export { paginate } from './query';
export { DEFAULT_CURRENCIES, formatCurrency } from './currency';
export { DEFAULT_FEATURE_FLAGS } from './feature-flags';
export { CURRENT_STORE_ID, CURRENT_ORG_ID, SYSTEM_USER_ID } from './organization';
export { SYSTEM_PAGE_SLUGS } from './cms';
export { PERMISSION_MODULES, DEFAULT_ROLE_KEYS } from './administration';

/**
 * Repository contracts barrel — v2 (canonical, Supabase-ready pattern)
 *
 * Import all contracts from here.
 * The v2/ prefix distinguishes from the legacy contracts in lib/contracts/
 * which are kept for backward compatibility with existing pages.
 */

export type * from './IBaseRepository';
export type * from './IProductRepository';
export type * from './IInventoryRepository';
export type * from './IProcurementRepository';
export type * from './IFinanceRepository';
export type * from './IOrderRepository';
export type * from './IReturnRepository';
export type * from './ICrmRepository';
export type * from './IMarketingRepository';
export type * from './ICmsRepository';
export type * from './IAdministrationRepository';
export type * from './ISettingsRepository';

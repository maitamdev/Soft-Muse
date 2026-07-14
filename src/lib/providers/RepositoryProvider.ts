import type {
 IProductRepository,
 ICategoryRepository,
 ICollectionRepository,
 IBrandRepository,
} from '@/lib/contracts/v2/IProductRepository';
import type {
 IWarehouseRepository,
 IInventoryRepository,
 IStockMovementRepository,
 IInventoryTransferRepository,
 IInventoryAdjustmentRepository,
} from '@/lib/contracts/v2/IInventoryRepository';
import type {
 ISupplierRepository,
 IPurchaseOrderRepository,
 IPurchaseReceiptRepository,
 ISupplierPaymentRepository,
} from '@/lib/contracts/v2/IProcurementRepository';
import type {
 IExpenseRepository,
 IAssetRepository,
 ILiabilityRepository,
 ICapitalRepository,
 IFinancialReportRepository,
} from '@/lib/contracts/v2/IFinanceRepository';
import type { IOrderRepository } from '@/lib/contracts/v2/IOrderRepository';
import type { IReturnRepository, IRefundRepository } from '@/lib/contracts/v2/IReturnRepository';
import type {
 ICustomerRepository,
 ICustomerGroupRepository,
 IReviewRepository,
 ISupportRepository,
} from '@/lib/contracts/v2/ICrmRepository';
import type { ICouponRepository, IGiftCardRepository } from '@/lib/contracts/v2/IMarketingRepository';
import type { IArticleRepository, ICmsPageRepository, IMediaRepository } from '@/lib/contracts/v2/ICmsRepository';
import type {
 IRoleRepository,
 IStaffRepository,
 IActivityLogRepository,
} from '@/lib/contracts/v2/IAdministrationRepository';
import type { ISettingsRepository } from '@/lib/contracts/v2/ISettingsRepository';

// Mock repositories — all imported statically
import { MockProductRepository } from '@/lib/repositories/mock/product.repository.mock';
import { MockCategoryRepository } from '@/lib/repositories/mock/category.repository.mock';
import { MockCollectionRepository } from '@/lib/repositories/mock/collection.repository.mock';
import { MockBrandRepository } from '@/lib/repositories/mock/brand.repository.mock';
import { MockWarehouseRepository } from '@/lib/repositories/mock/warehouse.repository.mock';
import { MockInventoryRepository } from '@/lib/repositories/mock/inventory.repository.mock';
import { MockStockMovementRepository } from '@/lib/repositories/mock/stock-movement.repository.mock';
import { MockInventoryTransferRepository } from '@/lib/repositories/mock/inventory-transfer.repository.mock';
import { MockInventoryAdjustmentRepository } from '@/lib/repositories/mock/inventory-adjustment.repository.mock';
import { MockSupplierRepository } from '@/lib/repositories/mock/supplier.repository.mock';
import { MockPurchaseOrderRepository } from '@/lib/repositories/mock/purchase-order.repository.mock';
import { MockPurchaseReceiptRepository } from '@/lib/repositories/mock/purchase-receipt.repository.mock';
import { MockSupplierPaymentRepository } from '@/lib/repositories/mock/supplier-payment.repository.mock';
import { MockExpenseRepository } from '@/lib/repositories/mock/expense.repository.mock';
import { MockAssetRepository } from '@/lib/repositories/mock/asset.repository.mock';
import { MockLiabilityRepository } from '@/lib/repositories/mock/liability.repository.mock';
import { MockCapitalRepository } from '@/lib/repositories/mock/capital.repository.mock';
import { MockFinancialReportRepository } from '@/lib/repositories/mock/financial-report.repository.mock';
import { MockOrderRepository } from '@/lib/repositories/mock/order.repository.mock';
import { MockReturnRepository } from '@/lib/repositories/mock/return.repository.mock';
import { MockRefundRepository } from '@/lib/repositories/mock/refund.repository.mock';
import { MockCustomerRepository } from '@/lib/repositories/mock/customer.repository.mock';
import { MockCustomerGroupRepository } from '@/lib/repositories/mock/customer-group.repository.mock';
import { MockReviewRepository } from '@/lib/repositories/mock/review.repository.mock';
import { MockSupportRepository } from '@/lib/repositories/mock/support.repository.mock';
import { MockCouponRepository } from '@/lib/repositories/mock/coupon.repository.mock';
import { MockGiftCardRepository } from '@/lib/repositories/mock/gift-card.repository.mock';
import { MockArticleRepository } from '@/lib/repositories/mock/article.repository.mock';
import { MockCmsPageRepository } from '@/lib/repositories/mock/cms-page.repository.mock';
import { MockMediaRepository } from '@/lib/repositories/mock/media.repository.mock';
import { MockRoleRepository } from '@/lib/repositories/mock/role.repository.mock';
import { MockStaffRepository } from '@/lib/repositories/mock/staff.repository.mock';
import { MockActivityLogRepository } from '@/lib/repositories/mock/activity-log.repository.mock';
import { MockSettingsRepository } from '@/lib/repositories/mock/settings.repository.mock';

/**
 * RepositoryProvider — central dependency injection container.
 *
 * Usage: const repo = RepositoryProvider.products();
 *
 * Migration to Supabase:
 * 1. Set featureFlags.enableSupabase = true
 * 2. Implement all interfaces in lib/repositories/supabase/
 * 3. Replace Mock* imports with Supabase* imports below
 * 4. Zero page/service/hook changes required
 *
 * Singleton cache: each repository is instantiated once per app lifetime.
 */

type RepoKey = keyof typeof registry;
const registry = {
 products: () => new MockProductRepository() as unknown as IProductRepository,
 categories: () => new MockCategoryRepository() as ICategoryRepository,
 collections: () => new MockCollectionRepository() as ICollectionRepository,
 brands: () => new MockBrandRepository() as IBrandRepository,
 warehouses: () => new MockWarehouseRepository() as IWarehouseRepository,
 inventory: () => new MockInventoryRepository() as IInventoryRepository,
 stockMovements: () => new MockStockMovementRepository() as IStockMovementRepository,
 inventoryTransfers: () => new MockInventoryTransferRepository() as IInventoryTransferRepository,
 inventoryAdjustments: () => new MockInventoryAdjustmentRepository() as IInventoryAdjustmentRepository,
 suppliers: () => new MockSupplierRepository() as ISupplierRepository,
 purchaseOrders: () => new MockPurchaseOrderRepository() as IPurchaseOrderRepository,
 purchaseReceipts: () => new MockPurchaseReceiptRepository() as IPurchaseReceiptRepository,
 supplierPayments: () => new MockSupplierPaymentRepository() as ISupplierPaymentRepository,
 expenses: () => new MockExpenseRepository() as IExpenseRepository,
 assets: () => new MockAssetRepository() as IAssetRepository,
 liabilities: () => new MockLiabilityRepository() as ILiabilityRepository,
 capital: () => new MockCapitalRepository() as ICapitalRepository,
 financialReports: () => new MockFinancialReportRepository() as IFinancialReportRepository,
 orders: () => new MockOrderRepository() as IOrderRepository,
 returns: () => new MockReturnRepository() as IReturnRepository,
 refunds: () => new MockRefundRepository() as IRefundRepository,
 customers: () => new MockCustomerRepository() as ICustomerRepository,
 customerGroups: () => new MockCustomerGroupRepository() as ICustomerGroupRepository,
 reviews: () => new MockReviewRepository() as IReviewRepository,
 support: () => new MockSupportRepository() as ISupportRepository,
 coupons: () => new MockCouponRepository() as ICouponRepository,
 giftCards: () => new MockGiftCardRepository() as IGiftCardRepository,
 articles: () => new MockArticleRepository() as IArticleRepository,
 cmsPages: () => new MockCmsPageRepository() as ICmsPageRepository,
 media: () => new MockMediaRepository() as IMediaRepository,
 roles: () => new MockRoleRepository() as IRoleRepository,
 staff: () => new MockStaffRepository() as IStaffRepository,
 activityLog: () => new MockActivityLogRepository() as IActivityLogRepository,
 settings: () => new MockSettingsRepository() as ISettingsRepository,
};

const cache = new Map<string, unknown>();

function get<K extends RepoKey>(key: K): ReturnType<typeof registry[K]> {
 if (!cache.has(key)) {
 cache.set(key, registry[key]());
 }
 return cache.get(key) as ReturnType<typeof registry[K]>;
}

export const RepositoryProvider = {
 products: () => get('products'),
 categories: () => get('categories'),
 collections: () => get('collections'),
 brands: () => get('brands'),
 warehouses: () => get('warehouses'),
 inventory: () => get('inventory'),
 stockMovements: () => get('stockMovements'),
 inventoryTransfers: () => get('inventoryTransfers'),
 inventoryAdjustments: () => get('inventoryAdjustments'),
 suppliers: () => get('suppliers'),
 purchaseOrders: () => get('purchaseOrders'),
 purchaseReceipts: () => get('purchaseReceipts'),
 supplierPayments: () => get('supplierPayments'),
 expenses: () => get('expenses'),
 assets: () => get('assets'),
 liabilities: () => get('liabilities'),
 capital: () => get('capital'),
 financialReports: () => get('financialReports'),
 orders: () => get('orders'),
 returns: () => get('returns'),
 refunds: () => get('refunds'),
 customers: () => get('customers'),
 customerGroups: () => get('customerGroups'),
 reviews: () => get('reviews'),
 support: () => get('support'),
 coupons: () => get('coupons'),
 giftCards: () => get('giftCards'),
 articles: () => get('articles'),
 cmsPages: () => get('cmsPages'),
 media: () => get('media'),
 roles: () => get('roles'),
 staff: () => get('staff'),
 activityLog: () => get('activityLog'),
 settings: () => get('settings'),

 /** Flush singleton cache — use in tests or after switching data sources */
 reset(): void { cache.clear(); },
};

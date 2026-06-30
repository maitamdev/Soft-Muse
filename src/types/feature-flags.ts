/**
 * Feature Flags — control module availability without code changes.
 * Default values represent the initial MVP state.
 * Flags are read from SiteSettings.featureFlags in production.
 */
export interface FeatureFlags {
  // Core modules
  enableProducts:        boolean;
  enableInventory:       boolean;
  enableOrders:          boolean;

  // ERP modules
  enableProcurement:     boolean;
  enableManufacturing:   boolean;
  enableFinance:         boolean;
  enableWarehouses:      boolean;

  // Commerce modules
  enableReturns:         boolean;
  enableRefunds:         boolean;
  enableGiftCards:       boolean;
  enableCoupons:         boolean;

  // CRM modules
  enableCRM:             boolean;
  enableCustomerGroups:  boolean;
  enableLoyalty:         boolean;
  enableSupport:         boolean;
  enableReviews:         boolean;

  // Marketing modules
  enableMarketing:       boolean;
  enableEmailCampaigns:  boolean;
  enablePushNotifications: boolean;

  // CMS modules
  enableCMS:             boolean;
  enableBlog:            boolean;
  enableMediaLibrary:    boolean;

  // Storefront
  enableStorefront:      boolean;
  enableHomepageBuilder: boolean;
  enableSEO:             boolean;

  // Administration
  enableRBAC:            boolean;
  enableActivityLog:     boolean;
  enableAuditLog:        boolean;

  // Future
  enableMultiCurrency:   boolean;
  enableMultiWarehouse:  boolean;
  enableMultiStore:      boolean;
  enableSupabase:        boolean;     // Toggle to switch to Supabase repos
  enableAnalytics:       boolean;
}

export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  enableProducts:         true,
  enableInventory:        true,
  enableOrders:           true,
  enableProcurement:      true,
  enableManufacturing:    true,
  enableFinance:          true,
  enableWarehouses:       true,
  enableReturns:          true,
  enableRefunds:          true,
  enableGiftCards:        false,
  enableCoupons:          true,
  enableCRM:              true,
  enableCustomerGroups:   false,
  enableLoyalty:          false,
  enableSupport:          false,
  enableReviews:          true,
  enableMarketing:        true,
  enableEmailCampaigns:   false,
  enablePushNotifications: false,
  enableCMS:              true,
  enableBlog:             true,
  enableMediaLibrary:     true,
  enableStorefront:       true,
  enableHomepageBuilder:  true,
  enableSEO:              true,
  enableRBAC:             true,
  enableActivityLog:      true,
  enableAuditLog:         false,
  enableMultiCurrency:    false,
  enableMultiWarehouse:   false,
  enableMultiStore:       false,
  enableSupabase:         false,     // Flip to true to activate Supabase repos
  enableAnalytics:        true,
};

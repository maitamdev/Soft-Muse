import type { FeatureFlags } from './feature-flags';

/**
 * Master settings object — single source of truth for all site configuration.
 * Version fields allow future migrations.
 */
export interface SiteSettings {
 schemaVersion: number; // Bumped when the shape of settings changes
 settingsVersion: number; // Bumped on every admin save
 lastUpdatedAt: string;
 lastUpdatedBy: string;

 store: StoreSettings;
 branding: BrandingSettings;
 homepage: HomepageSettings;
 navigation: NavigationSettings;
 appearance: AppearanceSettings;
 orders: OrderSystemSettings;
 finance: FinanceSystemSettings;
 marketing: MarketingSystemSettings;
 crm: CrmSystemSettings;
 inventory: InventorySystemSettings;
 procurement: ProcurementSystemSettings;
 administration: AdministrationSystemSettings;
 notifications: NotificationSettings;
 media: MediaSettings;
 featureFlags: FeatureFlags;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export interface WorkingHours {
 dayAr: string;
 dayEn: string;
 openTime: string; // "09:00"
 closeTime: string; // "22:00"
 isClosed: boolean;
}

export interface SocialLink {
 platform: 'instagram' | 'tiktok' | 'snapchat' | 'twitter' | 'facebook' | 'youtube' | 'pinterest';
 url: string;
 isActive: boolean;
}

export interface StoreSettings {
 storeName: string;
 storeNameAr: string;
 tagline: string;
 taglineAr: string;
 logoUrl: string;
 logoDarkUrl: string;
 logoAltText: string;
 faviconUrl: string;
 email: string;
 phone: string;
 whatsapp: string;
 address: StoreAddress;
 workingHours: WorkingHours[];
 socialLinks: SocialLink[];
 defaultLanguage: 'vi' | 'en';
 defaultCurrency: string;
 timezone: string;
 dateFormat: string;
 numberFormat: string;
 vatNumber: string;
 commercialRegistration: string;
}

export interface StoreAddress {
 country: string;
 city: string;
 district: string;
 street: string;
 postalCode: string;
 buildingNo: string;
 additionalNumber: string;
}

// ─── Branding ────────────────────────────────────────────────────────────────

export interface BrandingSettings {
 colors: {
 primary: string;
 primaryDark: string;
 secondary: string;
 accent: string;
 background: string;
 backgroundAlt: string;
 surface: string;
 text: string;
 textMuted: string;
 border: string;
 success: string;
 danger: string;
 warning: string;
 info: string;
 };

 typography: {
 headingFont: string;
 bodyFont: string;
 arabicFont: string;
 englishFont: string;
 baseFontSize: number;
 lineHeight: number;
 };

 borderRadius: {
 none: string;
 small: string;
 medium: string;
 large: string;
 full: string;
 };

 buttons: {
 style: 'sharp' | 'rounded' | 'pill';
 primaryBg: string;
 primaryText: string;
 hoverEffect: 'darken' | 'lighten' | 'scale' | 'glow';
 };

 animations: {
 enabled: boolean;
 speed: 'slow' | 'medium' | 'fast';
 pageFadeIn: boolean;
 hoverScale: boolean;
 cartAnimation: boolean;
 };

 loading: {
 type: 'spinner' | 'skeleton' | 'dots';
 color: string;
 showProgress: boolean;
 };
}

// ─── Homepage ─────────────────────────────────────────────────────────────────

export type HomepageSectionType =
 | 'hero'
 | 'announcement_bar'
 | 'featured_categories'
 | 'featured_collection'
 | 'featured_products'
 | 'new_arrivals'
 | 'best_sellers'
 | 'promotional_banner'
 | 'testimonials'
 | 'instagram_feed'
 | 'newsletter'
 | 'countdown_timer'
 | 'lookbook'
 | 'video_hero'
 | 'size_guide_cta'
 | 'custom_html';

export interface HomepageSection {
 id: string;
 type: HomepageSectionType;
 isEnabled: boolean;
 order: number;
 config: Record<string, unknown>; // Section-specific; validated per type
}

export interface HomepageSettings {
 sections: HomepageSection[];
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export interface NavItem {
 id: string;
 labelAr: string;
 url: string;
 target: '_self' | '_blank';
 isActive: boolean;
 order: number;
 children: NavItem[];
 showOnDesktop: boolean;
 showOnMobile: boolean;
}

export interface FooterColumn {
 id: string;
 titleAr: string;
 items: NavItem[];
 order: number;
}

export interface NavigationSettings {
 header: NavItem[];
 footer: FooterColumn[];
 mobileMenu: NavItem[];
 megaMenuEnabled: boolean;
}

// ─── Appearance ───────────────────────────────────────────────────────────────

export interface AppearanceSettings {
 theme: 'light' | 'dark' | 'auto';
 productLayout: 'grid' | 'list';
 gridColumns: 2 | 3 | 4;
 headerStyle: 'transparent' | 'solid' | 'sticky';
 footerStyle: 'minimal' | 'expanded' | 'full';
 announcementBar: {
 isEnabled: boolean;
 textAr: string;
 backgroundColor: string;
 textColor: string;
 isCloseable: boolean;
 linkUrl: string | null;
 };
 cookieBanner: {
 isEnabled: boolean;
 textAr: string;
 buttonLabelAr: string;
 };
 popup: {
 isEnabled: boolean;
 triggerType: 'time_delay' | 'exit_intent' | 'scroll_percent';
 triggerValue: number;
 imageUrl: string;
 titleAr: string;
 subtitleAr: string;
 showOnce: boolean;
 };
 maintenanceMode: {
 isEnabled: boolean;
 messageAr: string;
 allowedIPs: string[];
 };
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export interface OrderStatusConfig {
 id: string;
 nameAr: string;
 color: string;
 isDefault: boolean;
 isFinal: boolean;
 nextStatuses: string[];
 order: number;
}

export interface OrderSystemSettings {
 orderPrefix: string;
 orderNumberPad: number;
 invoicePrefix: string;
 statuses: OrderStatusConfig[];
 autoConfirmPayment: boolean;
 autoCancelAfterHours: number;
 holdStockOnPending: boolean;
 returnWindowDays: number;
 returnPolicy: string;
 requireReturnReason: boolean;
 refundPolicy: string;
 refundWindowDays: number;
 autoRefundOnReturn: boolean;
 taxRate: number;
 taxIncluded: boolean;
 taxLabelAr: string;
 freeShippingThreshold: number;
 defaultShippingFee: number;
}

// ─── Finance ─────────────────────────────────────────────────────────────────

export interface ExpenseCategoryConfig {
 id: string;
 nameAr: string;
 type: 'operational' | 'manufacturing' | 'shipping' | 'general';
 color: string;
 isActive: boolean;
}

export interface FinanceSystemSettings {
 defaultCurrency: string;
 currencySymbol: string;
 currencyPosition: 'before' | 'after';
 vatEnabled: boolean;
 vatRate: number;
 vatNumber: string;
 fiscalYearStart: string;
 accountingPrefixes: {
 expense: string;
 asset: string;
 liability: string;
 capital: string;
 po: string;
 receipt: string;
 payment: string;
 return: string;
 refund: string;
 };
 expenseCategories: ExpenseCategoryConfig[];
}

// ─── Marketing ───────────────────────────────────────────────────────────────

export interface MarketingSystemSettings {
 coupons: {
 prefix: string;
 autoGenerate: boolean;
 defaultExpiryDays: number;
 allowStacking: boolean;
 };
 giftCards: {
 prefix: string;
 validityDays: number;
 denominations: number[];
 };
 newsletter: {
 isEnabled: boolean;
 provider: 'mailchimp' | 'klaviyo' | 'custom' | 'none';
 apiKey: string;
 listId: string;
 doubleOptIn: boolean;
 };
}

// ─── CRM ──────────────────────────────────────────────────────────────────────

export interface CustomerLevelConfig {
 id: string;
 nameAr: string;
 minSpend: number;
 discountPercent: number;
 color: string;
}

export interface SupportPriorityConfig {
 id: string;
 nameAr: string;
 color: string;
 slaHours: number;
 order: number;
}

export interface CrmSystemSettings {
 customerLevels: CustomerLevelConfig[];
 defaultTags: string[];
 support: {
 priorities: SupportPriorityConfig[];
 defaultPriorityId: string;
 autoAssign: boolean;
 acknowledgmentEmail: boolean;
 };
}

// ─── Inventory ────────────────────────────────────────────────────────────────

export interface AdjustmentReasonConfig {
 id: string;
 nameAr: string;
 type: 'increase' | 'decrease' | 'both';
 isActive: boolean;
}

export interface InventorySystemSettings {
 globalLowStockThreshold: number;
 reserveStockOnOrder: boolean;
 reservationExpiryMinutes: number;
 requireTransferApproval: boolean;
 adjustmentReasons: AdjustmentReasonConfig[];
 barcodeFormat: 'EAN13' | 'EAN8' | 'CODE128' | 'QR';
 barcodePrefix: string;
 skuFormat: string;
 skuSequenceStart: number;
}

// ─── Procurement ──────────────────────────────────────────────────────────────

export interface SupplierCategoryConfig {
 id: string;
 nameAr: string;
 color: string;
}

export interface ProcurementSystemSettings {
 poPrefix: string;
 poNumberPad: number;
 receiptPrefix: string;
 paymentPrefix: string;
 requirePOApproval: boolean;
 poApprovalThreshold: number;
 approverRoleId: string;
 allowPartialReceipt: boolean;
 autoCloseOnFullReceipt: boolean;
 supplierCategories: SupplierCategoryConfig[];
}

// ─── Administration ───────────────────────────────────────────────────────────

export interface AdministrationSystemSettings {
 defaultRoleId: string;
 activityLog: {
 enabled: boolean;
 retentionDays: number;
 logReadActions: boolean;
 };
 sessionTimeoutMinutes: number;
 maxLoginAttempts: number;
 lockoutDurationMinutes: number;
 requireTwoFactor: boolean;
}

// ─── Notifications ────────────────────────────────────────────────────────────

export interface EmailTemplate {
 id: string;
 trigger: string;
 subjectAr: string;
 bodyAr: string;
 isActive: boolean;
}

export interface NotificationSettings {
 adminNotifications: {
 newOrder: boolean;
 lowStock: boolean;
 newReview: boolean;
 newCustomer: boolean;
 newSupportTicket: boolean;
 returnRequested: boolean;
 paymentFailed: boolean;
 };
 emailTemplates: EmailTemplate[];
 whatsapp: {
 enabled: boolean;
 provider: 'twilio' | 'wati' | 'custom';
 };
}

// ─── Media ────────────────────────────────────────────────────────────────────

export interface MediaFolderConfig {
 id: string;
 nameAr: string;
 slug: string;
 order: number;
}

export interface MediaSettings {
 provider: 'local' | 'cloudinary' | 's3' | 'supabase_storage';
 baseUrl: string;
 autoConvertToWebP: boolean;
 quality: number;
 maxFileSizeMB: number;
 allowedFormats: string[];
 defaultFolders: MediaFolderConfig[];
}

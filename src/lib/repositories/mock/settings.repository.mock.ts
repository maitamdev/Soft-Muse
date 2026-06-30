import type { SiteSettings } from '@/types/settings';
import type { ISettingsRepository } from '@/lib/contracts/v2/ISettingsRepository';
import { DEFAULT_FEATURE_FLAGS } from '@/types/feature-flags';

const DEFAULT_SETTINGS: SiteSettings = {
  schemaVersion: 1,
  settingsVersion: 1,
  lastUpdatedAt: new Date().toISOString(),
  lastUpdatedBy: 'system',
  store: {
    storeName: 'AURA',
    storeNameAr: 'أورا',
    tagline: 'Luxury Arabic Fashion',
    taglineAr: 'أزياء عربية راقية',
    logoUrl: '',
    logoDarkUrl: '',
    logoAltText: 'AURA',
    faviconUrl: '',
    email: 'hello@aura.sa',
    phone: '+966500000000',
    whatsapp: '+966500000000',
    address: { country: 'SA', city: 'الرياض', district: '', street: '', postalCode: '', buildingNo: '', additionalNumber: '' },
    workingHours: [],
    socialLinks: [],
    defaultLanguage: 'ar',
    defaultCurrency: 'EGP',
    timezone: 'Asia/Riyadh',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: 'ar-SA',
    vatNumber: '',
    commercialRegistration: '',
  },
  branding: {
    colors: { primary: '#C5A880', primaryDark: '#B89C72', secondary: '#FAF8F5', accent: '#C5A880', background: '#FAF8F5', backgroundAlt: '#FFFFFF', surface: '#FFFFFF', text: '#1C1C1B', textMuted: '#5C5A56', border: '#E5E0D8', success: '#22C55E', danger: '#EF4444', warning: '#F59E0B', info: '#38BDF8' },
    typography: { headingFont: 'El Messiri', bodyFont: 'Alexandria', arabicFont: 'Alexandria', englishFont: 'Inter', baseFontSize: 16, lineHeight: 1.6 },
    borderRadius: { none: '0px', small: '4px', medium: '8px', large: '16px', full: '9999px' },
    buttons: { style: 'rounded', primaryBg: '#C5A880', primaryText: '#FFFFFF', hoverEffect: 'darken' },
    animations: { enabled: true, speed: 'medium', pageFadeIn: true, hoverScale: true, cartAnimation: true },
    loading: { type: 'skeleton', color: '#C5A880', showProgress: true },
  },
  homepage: { sections: [] },
  navigation: { header: [], footer: [], mobileMenu: [], megaMenuEnabled: false },
  appearance: {
    theme: 'light',
    productLayout: 'grid',
    gridColumns: 3,
    headerStyle: 'sticky',
    footerStyle: 'expanded',
    announcementBar: { isEnabled: false, textAr: '', backgroundColor: '#C5A880', textColor: '#FFFFFF', isCloseable: true, linkUrl: null },
    cookieBanner: { isEnabled: false, textAr: 'نستخدم ملفات تعريف الارتباط لتحسين تجربتك.', buttonLabelAr: 'موافق' },
    popup: { isEnabled: false, triggerType: 'time_delay', triggerValue: 5000, imageUrl: '', titleAr: '', subtitleAr: '', showOnce: true },
    maintenanceMode: { isEnabled: false, messageAr: 'الموقع تحت الصيانة', allowedIPs: [] },
  },
  orders: {
    orderPrefix: 'ORD-', orderNumberPad: 5, invoicePrefix: 'INV-',
    statuses: [],
    autoConfirmPayment: true, autoCancelAfterHours: 24, holdStockOnPending: true,
    returnWindowDays: 14, returnPolicy: '', requireReturnReason: true,
    refundPolicy: '', refundWindowDays: 14, autoRefundOnReturn: false,
    taxRate: 0.15, taxIncluded: false, taxLabelAr: 'ضريبة القيمة المضافة (15%)',
    freeShippingThreshold: 0, defaultShippingFee: 0,
  },
  finance: {
    defaultCurrency: 'EGP', currencySymbol: 'ج.م', currencyPosition: 'after',
    vatEnabled: true, vatRate: 0.15, vatNumber: '',
    fiscalYearStart: '01-01',
    accountingPrefixes: { expense: 'EXP-', asset: 'AST-', liability: 'LIA-', capital: 'CAP-', po: 'PO-', receipt: 'GR-', payment: 'SP-', return: 'RET-', refund: 'REF-' },
    expenseCategories: [],
  },
  marketing: {
    coupons: { prefix: 'AURA-', autoGenerate: false, defaultExpiryDays: 30, allowStacking: false },
    giftCards: { prefix: 'GC-', validityDays: 365, denominations: [100, 250, 500, 1000] },
    newsletter: { isEnabled: false, provider: 'none', apiKey: '', listId: '', doubleOptIn: true },
  },
  crm: {
    customerLevels: [],
    defaultTags: [],
    support: { priorities: [], defaultPriorityId: '', autoAssign: false, acknowledgmentEmail: true },
  },
  inventory: {
    globalLowStockThreshold: 5,
    reserveStockOnOrder: true,
    reservationExpiryMinutes: 30,
    requireTransferApproval: false,
    adjustmentReasons: [],
    barcodeFormat: 'EAN13', barcodePrefix: '',
    skuFormat: '{BRAND}-{SEQ}', skuSequenceStart: 1,
  },
  procurement: {
    poPrefix: 'PO-', poNumberPad: 5,
    receiptPrefix: 'GR-', paymentPrefix: 'SP-',
    requirePOApproval: false, poApprovalThreshold: 10000, approverRoleId: '',
    allowPartialReceipt: true, autoCloseOnFullReceipt: true,
    supplierCategories: [],
  },
  administration: {
    defaultRoleId: '',
    activityLog: { enabled: true, retentionDays: 90, logReadActions: false },
    sessionTimeoutMinutes: 480, maxLoginAttempts: 5, lockoutDurationMinutes: 30, requireTwoFactor: false,
  },
  notifications: {
    adminNotifications: { newOrder: true, lowStock: true, newReview: true, newCustomer: false, newSupportTicket: true, returnRequested: true, paymentFailed: true },
    emailTemplates: [],
    whatsapp: { enabled: false, provider: 'custom' },
  },
  media: {
    provider: 'local', baseUrl: '',
    autoConvertToWebP: true, quality: 85, maxFileSizeMB: 10,
    allowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'],
    defaultFolders: [
      { id: 'f_products', nameAr: 'المنتجات', slug: 'products', order: 0 },
      { id: 'f_categories', nameAr: 'الأقسام', slug: 'categories', order: 1 },
      { id: 'f_banners', nameAr: 'البنرات', slug: 'banners', order: 2 },
    ],
  },
  featureFlags: DEFAULT_FEATURE_FLAGS,
};

export class MockSettingsRepository implements ISettingsRepository {
  private settings: SiteSettings = { ...DEFAULT_SETTINGS };

  async get(): Promise<SiteSettings> {
    return { ...this.settings };
  }

  async getSection<K extends keyof SiteSettings>(section: K): Promise<SiteSettings[K]> {
    return this.settings[section];
  }

  async updateSection<K extends keyof SiteSettings>(section: K, data: Partial<SiteSettings[K]>): Promise<SiteSettings[K]> {
    this.settings = {
      ...this.settings,
      [section]: { ...(this.settings[section] as object), ...data },
      settingsVersion: this.settings.settingsVersion + 1,
      lastUpdatedAt: new Date().toISOString(),
    };
    return this.settings[section];
  }

  async replace(settings: SiteSettings): Promise<SiteSettings> {
    this.settings = { ...settings };
    return { ...this.settings };
  }

  async getVersion(): Promise<{ schemaVersion: number; settingsVersion: number }> {
    return { schemaVersion: this.settings.schemaVersion, settingsVersion: this.settings.settingsVersion };
  }

  async bumpVersion(): Promise<void> {
    this.settings.settingsVersion += 1;
    this.settings.lastUpdatedAt = new Date().toISOString();
  }
}

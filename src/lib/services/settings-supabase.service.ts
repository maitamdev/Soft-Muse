import type { Settings } from '@/data/mock/settings';
import { loadAdminSetting, saveAdminSetting } from './admin-settings-storage';

const DEFAULT_SETTINGS: Settings = {
 store: { storeName: 'AURA', storeEmail: '', storePhone: '', currency: 'VND', language: 'vi', address: '', logo: '', favicon: '' },
 seo: { metaTitle: 'AURA', metaDescription: '', metaKeywords: '', ogImage: '' },
 payment: { currencyFormat: '{value} ₫', taxRate: 0, enableStripe: false, enablePaypal: false, enableCOD: true },
};

export const SupabaseSettingsService = {
 async getSettings(): Promise<Settings> { return loadAdminSetting('admin.settings', DEFAULT_SETTINGS); },
 async updateSettings(data: Partial<Settings>): Promise<Settings> {
  const current = await this.getSettings();
  const updated: Settings = {
   store: { ...current.store, ...data.store },
   seo: { ...current.seo, ...data.seo },
   payment: { ...current.payment, ...data.payment, taxRate: Math.max(0, Math.min(100, Number(data.payment?.taxRate ?? current.payment.taxRate))) },
  };
  return saveAdminSetting('admin.settings', updated);
 },
};

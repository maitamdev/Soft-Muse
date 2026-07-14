import { Settings, mockSettings, updateMockSettings } from '@/data/mock/settings';

export const SettingsService = {
 async getSettings(): Promise<Settings> {
 return new Promise((resolve) => {
 setTimeout(() => resolve(mockSettings), 300);
 });
 },

 async updateSettings(data: Partial<Settings>): Promise<Settings> {
 return new Promise((resolve) => {
 setTimeout(() => {
 const updated = { 
 store: { ...mockSettings.store, ...data.store },
 seo: { ...mockSettings.seo, ...data.seo },
 payment: { ...mockSettings.payment, ...data.payment }
 };
 updateMockSettings(updated);
 resolve(updated);
 }, 600);
 });
 }
};

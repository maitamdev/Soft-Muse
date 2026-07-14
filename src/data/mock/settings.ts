import { mockStorage } from '@/lib/storage/mock-storage';

export interface StoreSettings {
 storeName: string;
 storeEmail: string;
 storePhone: string;
 currency: string;
 language: string;
 address: string;
 logo: string;
 favicon: string;
}

export interface SEOSettings {
 metaTitle: string;
 metaDescription: string;
 metaKeywords: string;
 ogImage: string;
}

export interface PaymentSettings {
 currencyFormat: string;
 taxRate: number;
 enableStripe: boolean;
 enablePaypal: boolean;
 enableCOD: boolean;
}

export interface Settings {
 store: StoreSettings;
 seo: SEOSettings;
 payment: PaymentSettings;
}

export let mockSettings: Settings = {
 store: {
 storeName: 'AURA',
 storeEmail: 'support@aurabrand.com',
 storePhone: '+201000000000',
 currency: 'VND',
 language: 'ar',
 address: ',Việt Nam',
 logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&fit=crop',
 favicon: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=32&h=32&fit=crop',
 },
 seo: {
 metaTitle: 'AURA | cao cấp',
 metaDescription: 'cao cấp từ AURA.',
 metaKeywords: ',,, Váy, ',
 ogImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=630&fit=crop'
 },
 payment: {
 currencyFormat: '{value} ',
 taxRate: 14,
 enableStripe: true,
 enablePaypal: false,
 enableCOD: true,
 }
};

mockSettings = mockStorage.read('settings', mockSettings);

export const updateMockSettings = (newSettings: Settings) => {
 mockSettings = newSettings;
 mockStorage.write('settings', newSettings);
};

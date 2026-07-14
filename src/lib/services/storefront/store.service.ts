import { eventBus } from '@/lib/events/EventBus';
import { createClient } from '@/lib/supabase/client';

export interface AnnouncementBarSettings {
 enabled: boolean;
 text: string;
 link: string;
 bgColor: string;
 textColor: string;
}

export interface StoreInfo {
 storeName: string;
 phone: string;
 whatsapp: string;
 email: string;
 supportEmail: string;
 address: string;
 googleMapsUrl: string;
 workingHours: string;
 commercialRegistration: string;
 taxNumber: string;
 socialMedia: {
 instagram: string;
 facebook: string;
 whatsapp: string;
 tiktok: string;
 pinterest: string;
 };
 announcementBar: AnnouncementBarSettings;
}

// Soft Muse Vietnam contact data — replace with real business details before launch.
let mockStoreInfo: StoreInfo = {
 storeName: 'Soft Muse',
 phone: '+84 900 000 000',
 whatsapp: '+84 900 000 000',
 email: 'hello@softmuse.vn',
 supportEmail: 'support@softmuse.vn',
 address: 'TP. Hồ Chí Minh, Việt Nam',
 googleMapsUrl: 'https://maps.google.com/?q=Ho+Chi+Minh+City+Vietnam',
 workingHours: 'Thứ 2 - Chủ nhật, 9:00 - 21:00',
 commercialRegistration: '',
 taxNumber: '',
 socialMedia: {
 facebook: 'https://www.facebook.com/softmuse.vn',
 instagram: 'https://www.instagram.com/softmuse.vn/',
 whatsapp: 'https://zalo.me/0900000000',
 tiktok: 'https://www.tiktok.com/@softmuse.vn',
 pinterest: 'https://www.pinterest.com/softmusevn',
 },
 announcementBar: {
 enabled: false,
 text: 'Miễn phí vận chuyển toàn quốc cho đơn hàng từ 500.000đ',
 link: '/shop',
 bgColor: '#1C1C1B',
 textColor: '#FAF8F5',
 },
};

// Backfill announcementBar for stores saved before this field existed
if (!mockStoreInfo.announcementBar) {
 mockStoreInfo.announcementBar = {
 enabled: false,
 text: 'Miễn phí vận chuyển toàn quốc cho đơn hàng từ 500.000đ',
 link: '/shop',
 bgColor: '#1C1C1B',
 textColor: '#FAF8F5',
 };
}

export const StoreService = {
 async getInfo(): Promise<StoreInfo> {
 const { data, error } = await createClient().rpc('get_storefront_setting', { setting_key: 'storefront.store' });
 if (!error && data && typeof data === 'object') mockStoreInfo = { ...mockStoreInfo, ...(data as Partial<StoreInfo>) };
 return this.getInfoSync();
 },

 /** Synchronous counterpart of `getInfo`, for seeding initial render state without an async gap (avoids a CLS-causing pop-in of the announcement bar). */
 getInfoSync(): StoreInfo {
 return { ...mockStoreInfo };
 },

 async updateInfo(updates: Partial<StoreInfo>): Promise<StoreInfo> {
 mockStoreInfo = { ...mockStoreInfo, ...updates };
 const { error } = await createClient().rpc('update_storefront_setting', { setting_key: 'storefront.store', setting_value: mockStoreInfo });
 if (error) throw new Error(error.message);
 eventBus.emit('website.changed', { area: 'store' });
 return { ...mockStoreInfo };
 }
};

import { mockStorage } from '@/lib/storage/mock-storage';
import { eventBus } from '@/lib/events/EventBus';

export interface ContentBlock {
 id: string;
 group: 'general' | 'checkout' | 'order_tracking' | 'emails' | 'pages';
 key: string;
 value: string;
 description: string;
}

let mockContent: ContentBlock[] = [
 // ── Order tracking status messages ──────────────────────────────────
 { id: 'cnt-3', group: 'order_tracking', key: 'status_received', value: 'Đơn hàng đã được Soft Muse ghi nhận.', description: 'Thông báo đã nhận đơn' },
 { id: 'cnt-4', group: 'order_tracking', key: 'status_processing', value: 'Soft Muse đang chuẩn bị sản phẩm và đóng gói đơn hàng.', description: 'Thông báo đang xử lý' },
 { id: 'cnt-5', group: 'order_tracking', key: 'status_shipped', value: 'đãVận chuyển trong — 2-5.', description: 'thông báo:Đã gửi hàng' },
 { id: 'cnt-6', group: 'order_tracking', key: 'status_delivered', value: 'Đơn hàng đã giao thành công. Cảm ơn bạn đã mua sắm tại Soft Muse.', description: 'Thông báo đã giao' },

 // ── General ──────────────────────────────────────────────────────────
 { id: 'cnt-7', group: 'general', key: 'announcement_bar', value: 'Miễn phí vận chuyển toàn quốc | Miễn phí gói quà cao cấp', description: '' },

 // ── Pages — About ────────────────────────────────────────────────────
 { id: 'cnt-about-hero-title', group: 'pages', key: 'about_hero_title', value: '', description: 'từ — tiêu đề' },
 { id: 'cnt-about-hero-subtitle', group: 'pages', key: 'about_hero_subtitle', value: 'thủ công.', description: 'từ — mô tả' },
 { id: 'cnt-about-phil-title', group: 'pages', key: 'about_phil_title', value: 'cao cấp', description: 'từ — tiêu đề' },
 { id: 'cnt-about-phil-text', group: 'pages', key: 'about_phil_text', value: 'trong hộp AURA, ..., từ linen vàlụa. tất cảmãvềTay nghề.', description: 'từ —' },
 { id: 'cnt-about-craft-title', group: 'pages', key: 'about_craft_title', value: 'Chi tiết trongatelier TP. Hồ Chí Minh', description: 'từ — tiêu đềTay nghề' },
 { id: 'cnt-about-craft-text', group: 'pages', key: 'about_craft_text', value: 'từ linen cashmere, đếnlụa, trong hộp AURA.mã tất cảthủ công trongatelier TP. Hồ Chí Minh Việt Nam, trongmay đo tất cả, từ.', description: 'từ —Tay nghề' },
 { id: 'cnt-about-vision-quote', group: 'pages', key: 'about_vision_quote', value: '', description: 'từ —' },
 { id: 'cnt-about-vision-attr', group: 'pages', key: 'about_vision_attr', value: 'atelier AURA TP. Hồ Chí Minh', description: 'từ —' },
 { id: 'cnt-about-cta-title', group: 'pages', key: 'about_cta_title', value: 'Cửa hàng', description: 'từ — tiêu đềmã ' },
 { id: 'cnt-about-cta-text', group: 'pages', key: 'about_cta_text', value: 'AURA cao cấp thủ công couture may đo cao cấp.', description: 'từ —mã ' },
 { id: 'cnt-about-cta-button', group: 'pages', key: 'about_cta_button', value: 'Vào cửa hàng couture', description: 'từ —' },

 // ── Pages — Tracking ─────────────────────────────────────────────────
 { id: 'cnt-tracking-hero-title', group: 'pages', key: 'tracking_hero_title', value: 'Theo dõi đơn hàng', description: 'Theo dõi đơn hàng — tiêu đề' },
 { id: 'cnt-tracking-hero-label', group: 'pages', key: 'tracking_hero_label', value: '', description: 'Theo dõi đơn hàng — ' },
 { id: 'cnt-tracking-hero-subtitle', group: 'pages', key: 'tracking_hero_subtitle', value: 'Tra cứu tình trạng đơn hàng Soft Muse bằng mã đơn hoặc số điện thoại.', description: 'Theo dõi đơn hàng — mô tả' },
 { id: 'cnt-tracking-support-title', group: 'pages', key: 'tracking_support_title', value: 'đến ؟', description: 'Theo dõi đơn hàng — tiêu đềmã Hỗ trợ' },
 { id: 'cnt-tracking-support-text', group: 'pages', key: 'tracking_support_text', value: 'Soft Muse hỗ trợ qua Zalo, Messenger và email chăm sóc khách hàng.', description: 'Theo dõi đơn hàng — mô tả hỗ trợ' },
 { id: 'cnt-tracking-support-btn', group: 'pages', key: 'tracking_support_btn', value: 'Liên hệ với chúng tôi', description: 'Theo dõi đơn hàng — Hỗ trợ' },

 // ── Pages — Reviews ──────────────────────────────────────────────────
 { id: 'cnt-reviews-hero-label', group: 'pages', key: 'reviews_hero_label', value: '', description: 'Đánh giá — ' },
 { id: 'cnt-reviews-hero-title', group: 'pages', key: 'reviews_hero_title', value: '', description: 'Đánh giá — tiêu đề' },
 { id: 'cnt-reviews-hero-subtitle', group: 'pages', key: 'reviews_hero_subtitle', value: 'Cảm nhận thật từ khách hàng Soft Muse.', description: 'Đánh giá — mô tả' },

 // ── Pages — Wishlist ─────────────────────────────────────────────────
 { id: 'cnt-wishlist-empty-title', group: 'pages', key: 'wishlist_empty_title', value: 'Danh sách yêu thích đang trống', description: '— tiêu đềTrạng thái ' },
 { id: 'cnt-wishlist-empty-text', group: 'pages', key: 'wishlist_empty_text', value: 'Hãy lưu sản phẩm yêu thích bằng biểu tượng trái tim khi duyệt', description: '—Trạng thái ' },
 { id: 'cnt-wishlist-empty-btn', group: 'pages', key: 'wishlist_empty_btn', value: 'Vào cửa hàng', description: 'Trạng thái trống' },

 // ── Pages — Cart ─────────────────────────────────────────────────────
 { id: 'cnt-cart-empty-title', group: 'pages', key: 'cart_empty_title', value: 'Giỏ hàng của bạn đang trống', description: '— tiêu đềTrạng thái ' },
 { id: 'cnt-cart-empty-text', group: 'pages', key: 'cart_empty_text', value: 'Hãy khám phá bộ sưu tập và chọn thiết kế yêu thích.', description: '—Trạng thái ' },
 { id: 'cnt-cart-empty-btn', group: 'pages', key: 'cart_empty_btn', value: 'Vào cửa hàng', description: 'Trạng thái trống' },
];

mockContent = mockStorage.read('storefront.content', mockContent);

export const ContentService = {
 async getAllContent(): Promise<ContentBlock[]> {
 return [...mockContent];
 },

 async getContentByGroup(group: ContentBlock['group']): Promise<ContentBlock[]> {
 return mockContent.filter(c => c.group === group);
 },

 async getByKey(key: string): Promise<string | null> {
 return mockContent.find(c => c.key === key)?.value ?? null;
 },

 async updateContent(id: string, value: string): Promise<ContentBlock> {
 const idx = mockContent.findIndex(c => c.id === id);
 if (idx > -1) {
 mockContent[idx] = { ...mockContent[idx], value };
 mockStorage.write('storefront.content', mockContent);
 eventBus.emit('website.changed', { area: 'content' });
 return mockContent[idx];
 }
 throw new Error('Content not found');
 },
};

import { mockStorage } from '@/lib/storage/mock-storage';
import { eventBus } from '@/lib/events/EventBus';

export interface Review {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerAvatar?: string;
  rating: number;
  title: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected' | 'hidden';
  isFeatured: boolean;
  isPinned: boolean;
  verifiedPurchase: boolean;
  adminReply: string | null;
  createdAt: string;
  updatedAt: string;
}

let MOCK_REVIEWS: Review[] = [
  {
    id: "rev_1",
    productId: "prod_summer_001",
    productName: "بلوزة حرير كريمي فاخر",
    productImage: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200",
    customerName: "سارة أحمد",
    customerEmail: "sarah@example.com",
    rating: 5,
    title: "جودة استثنائية وخامة فاخرة",
    content: "القطعة رائعة جداً والخامة ممتازة! وصلتني في الوقت المحدد والتغليف الفاخر كان تجربة بحد ذاتها. أنصح بشدة.",
    status: 'approved',
    isFeatured: true,
    isPinned: true,
    verifiedPurchase: true,
    adminReply: "شكراً لكِ سارة! نسعد دائماً بخدمتك ونتمنى أن نراكِ قريباً.",
    createdAt: "2026-06-25T14:30:00Z",
    updatedAt: "2026-06-25T14:30:00Z"
  },
  {
    id: "rev_2",
    productId: "prod_winter_001",
    productName: "معطف صوفي شتوي",
    productImage: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=200",
    customerName: "نورة محمد",
    customerEmail: "noura@example.com",
    rating: 4,
    title: "أناقة حقيقية",
    content: "المعطف جميل جداً وأنيق في كل الأوقات، لكن التوصيل أخذ وقتاً أكثر من المتوقع بيوم واحد.",
    status: 'pending',
    isFeatured: false,
    isPinned: false,
    verifiedPurchase: true,
    adminReply: null,
    createdAt: "2026-06-26T09:15:00Z",
    updatedAt: "2026-06-26T09:15:00Z"
  },
  {
    id: "rev_3",
    productId: "prod_summer_001",
    productName: "بلوزة حرير كريمي فاخر",
    productImage: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200",
    customerName: "مريم علي",
    customerEmail: "mariam@example.com",
    rating: 5,
    title: "تصاميم تعكس الحرفة الحقيقية",
    content: "تفاصيل الخياطة اليدوية دقيقة للغاية وتجسد الحرفية والموضة البطيئة الراقية. فخورة بكل قطعة.",
    status: 'approved',
    isFeatured: true,
    isPinned: false,
    verifiedPurchase: true,
    adminReply: null,
    createdAt: "2026-06-20T11:00:00Z",
    updatedAt: "2026-06-20T11:00:00Z"
  },
  {
    id: "rev_4",
    productId: "prod_winter_001",
    productName: "معطف صوفي شتوي",
    productImage: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=200",
    customerName: "ياسمين الشافعي",
    customerEmail: "yasmin@example.com",
    rating: 5,
    title: "ثقة عالية في كل مناسبة",
    content: "الكتان المعالج مريح للغاية والقصات الهندسية تمنح حضوراً راقياً في كل مناسبة.",
    status: 'approved',
    isFeatured: false,
    isPinned: false,
    verifiedPurchase: false,
    adminReply: null,
    createdAt: "2026-06-18T16:00:00Z",
    updatedAt: "2026-06-18T16:00:00Z"
  }
];

MOCK_REVIEWS = mockStorage.read('reviews', MOCK_REVIEWS);
const persistReviews = () => mockStorage.write('reviews', MOCK_REVIEWS);

export const ReviewService = {
  async getReviews(filters?: { status?: Review['status']; productId?: string; isFeatured?: boolean }): Promise<Review[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.getReviewsSync(filters);
  },

  /** Synchronous counterpart of `getReviews`, for seeding initial render state (avoids a delayed pop-in of storefront testimonials). */
  getReviewsSync(filters?: { status?: Review['status']; productId?: string; isFeatured?: boolean }): Review[] {
    let data = [...MOCK_REVIEWS];
    if (filters?.status) data = data.filter(r => r.status === filters.status);
    if (filters?.productId) data = data.filter(r => r.productId === filters.productId);
    if (filters?.isFeatured !== undefined) data = data.filter(r => r.isFeatured === filters.isFeatured);
    return data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getReview(id: string): Promise<Review | null> {
    await new Promise(resolve => setTimeout(resolve, 150));
    return MOCK_REVIEWS.find(r => r.id === id) ?? null;
  },

  async createReview(data: Omit<Review, 'id' | 'createdAt' | 'updatedAt' | 'isFeatured' | 'isPinned' | 'adminReply'>): Promise<Review> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const review: Review = {
      ...data,
      id: `rev_${Date.now()}`,
      isFeatured: false,
      isPinned: false,
      adminReply: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    MOCK_REVIEWS = [review, ...MOCK_REVIEWS];
    persistReviews();
    eventBus.emit('review.submitted', review);
    eventBus.emit('reviews.changed');
    return review;
  },

  async updateReviewStatus(id: string, status: Review['status']): Promise<Review> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const idx = MOCK_REVIEWS.findIndex(r => r.id === id);
    if (idx === -1) throw new Error("Review not found");
    MOCK_REVIEWS[idx] = { ...MOCK_REVIEWS[idx], status, updatedAt: new Date().toISOString() };
    persistReviews();
    if (status === 'approved') eventBus.emit('review.approved', MOCK_REVIEWS[idx]);
    if (status === 'rejected') eventBus.emit('review.rejected', MOCK_REVIEWS[idx]);
    eventBus.emit('reviews.changed');
    return MOCK_REVIEWS[idx];
  },

  async updateAdminReply(id: string, reply: string | null): Promise<Review> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const idx = MOCK_REVIEWS.findIndex(r => r.id === id);
    if (idx === -1) throw new Error("Review not found");
    MOCK_REVIEWS[idx] = { ...MOCK_REVIEWS[idx], adminReply: reply, updatedAt: new Date().toISOString() };
    persistReviews();
    eventBus.emit('reviews.changed');
    return MOCK_REVIEWS[idx];
  },

  async toggleFeatured(id: string): Promise<Review> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const idx = MOCK_REVIEWS.findIndex(r => r.id === id);
    if (idx === -1) throw new Error("Review not found");
    MOCK_REVIEWS[idx] = { ...MOCK_REVIEWS[idx], isFeatured: !MOCK_REVIEWS[idx].isFeatured, updatedAt: new Date().toISOString() };
    persistReviews();
    eventBus.emit('reviews.changed');
    return MOCK_REVIEWS[idx];
  },

  async togglePinned(id: string): Promise<Review> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const idx = MOCK_REVIEWS.findIndex(r => r.id === id);
    if (idx === -1) throw new Error("Review not found");
    MOCK_REVIEWS[idx] = { ...MOCK_REVIEWS[idx], isPinned: !MOCK_REVIEWS[idx].isPinned, updatedAt: new Date().toISOString() };
    persistReviews();
    eventBus.emit('reviews.changed');
    return MOCK_REVIEWS[idx];
  },

  async updateReview(id: string, updates: Partial<Pick<Review, 'title' | 'content' | 'customerAvatar' | 'verifiedPurchase'>>): Promise<Review> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const idx = MOCK_REVIEWS.findIndex(r => r.id === id);
    if (idx === -1) throw new Error("Review not found");
    MOCK_REVIEWS[idx] = { ...MOCK_REVIEWS[idx], ...updates, updatedAt: new Date().toISOString() };
    persistReviews();
    eventBus.emit('reviews.changed');
    return MOCK_REVIEWS[idx];
  },

  async deleteReview(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    MOCK_REVIEWS = MOCK_REVIEWS.filter(r => r.id !== id);
    persistReviews();
    eventBus.emit('reviews.changed');
  }
};

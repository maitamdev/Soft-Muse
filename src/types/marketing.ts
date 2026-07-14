import type { BaseEntity } from './base';

// ─── Coupon ───────────────────────────────────────────────────────────────────

export type CouponType = 'percentage' | 'fixed_amount' | 'free_shipping';
export type CouponScope = 'all' | 'products' | 'categories' | 'customer_groups';

export interface Coupon extends BaseEntity {
 code: string;
 type: CouponType;
 value: number; // 10 = 10% or 50 VND
 minimumPurchase: number;
 maximumDiscount: number | null; // Cap for percentage coupons
 usageLimit: number | null; // null = unlimited
 usageCount: number; // Computed
 perCustomerLimit: number | null;
 startDate: string;
 expiryDate: string | null; // null = never expires
 appliesTo: CouponScope;
 productIds: string[];
 categoryIds: string[];
 customerGroupIds: string[];
 isOneTime: boolean;
}

// ─── Gift Card ────────────────────────────────────────────────────────────────

export interface GiftCardUsageRecord {
 id: string;
 orderId: string;
 amount: number;
 usedAt: string;
}

export interface GiftCard extends BaseEntity {
 code: string; // "GC-XXXX-XXXX-XXXX"
 initialAmount: number;
 currentBalance: number;
 currency: string;
 expiresAt: string | null;
 purchasedBy: string | null; // → Customer
 recipientEmail: string | null;
 recipientNameAr: string | null;
 personalMessage: string | null;
 isDigital: boolean;
 usageHistory: GiftCardUsageRecord[];
}

// ─── DTOs ────────────────────────────────────────────────────────────────────

export type CouponCreateDTO = Omit<Coupon,
 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'deletedAt' | 'isArchived' |
 'usageCount'
>;
export type CouponUpdateDTO = Partial<Omit<CouponCreateDTO, 'code'>>;

export type GiftCardCreateDTO = Omit<GiftCard,
 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'deletedAt' | 'isArchived' |
 'currentBalance' | 'usageHistory'
>;
export type GiftCardUpdateDTO = Partial<Pick<GiftCard,
 'recipientEmail' | 'recipientNameAr' | 'personalMessage' | 'expiresAt' | 'status'
>>;

import type { Coupon, CouponCreateDTO, CouponUpdateDTO, GiftCard, GiftCardCreateDTO, GiftCardUpdateDTO } from '@/types/marketing';
import type { IBaseRepository } from './IBaseRepository';

export interface ICouponRepository
  extends IBaseRepository<Coupon, CouponCreateDTO, CouponUpdateDTO> {
  findByCode(code: string): Promise<Coupon | null>;
  validate(code: string, customerId?: string, orderTotal?: number): Promise<{
    valid: boolean;
    coupon: Coupon | null;
    reason: string | null;
  }>;
  incrementUsage(id: string): Promise<void>;
  getActive(): Promise<Coupon[]>;
  getExpired(): Promise<Coupon[]>;
}

export interface IGiftCardRepository
  extends IBaseRepository<GiftCard, GiftCardCreateDTO, GiftCardUpdateDTO> {
  findByCode(code: string): Promise<GiftCard | null>;
  validate(code: string): Promise<{ valid: boolean; balance: number; reason: string | null }>;
  deductBalance(id: string, amount: number, orderId: string): Promise<GiftCard>;
  getByCustomer(customerId: string): Promise<GiftCard[]>;
}

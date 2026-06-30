import { BaseMockRepository } from './BaseMockRepository';
import type { Coupon, CouponCreateDTO, CouponUpdateDTO } from '@/types/marketing';
import type { ICouponRepository } from '@/lib/contracts/v2/IMarketingRepository';
import type { BaseEntity } from '@/types/base';

export class MockCouponRepository
  extends BaseMockRepository<Coupon, CouponCreateDTO, CouponUpdateDTO>
  implements ICouponRepository {

  protected buildEntity(data: CouponCreateDTO, base: BaseEntity): Coupon {
    return { ...base, usageCount: 0, ...data } as Coupon;
  }
  protected mergeUpdate(e: Coupon, d: CouponUpdateDTO): Coupon { return { ...e, ...d }; }
  protected applySearch(items: Coupon[], s: string) {
    return items.filter(i => i.code.toLowerCase().includes(s.toLowerCase()));
  }

  async findByCode(code: string) {
    return this.items.find(c => c.code.toUpperCase() === code.toUpperCase() && !c.deletedAt) ?? null;
  }
  async validate(code: string, _customerId?: string, orderTotal?: number) {
    const coupon = await this.findByCode(code);
    if (!coupon) return { valid: false, coupon: null, reason: 'الكوبون غير موجود' };
    if (coupon.status !== 'active') return { valid: false, coupon: null, reason: 'الكوبون غير نشط' };
    if (coupon.expiryDate && coupon.expiryDate < new Date().toISOString().split('T')[0]) return { valid: false, coupon: null, reason: 'انتهت صلاحية الكوبون' };
    if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) return { valid: false, coupon: null, reason: 'تم استنفاد حد استخدام الكوبون' };
    if (orderTotal !== undefined && orderTotal < coupon.minimumPurchase) return { valid: false, coupon: null, reason: `الحد الأدنى للشراء ${coupon.minimumPurchase} ج.م` };
    return { valid: true, coupon, reason: null };
  }
  async incrementUsage(id: string) {
    const idx = this.items.findIndex(c => c.id === id);
    if (idx !== -1) this.items[idx] = { ...this.items[idx], usageCount: this.items[idx].usageCount + 1 };
  }
  async getActive() { return this.items.filter(c => c.status === 'active' && !c.deletedAt); }
  async getExpired() {
    const now = new Date().toISOString().split('T')[0];
    return this.items.filter(c => c.expiryDate && c.expiryDate < now && !c.deletedAt);
  }
}

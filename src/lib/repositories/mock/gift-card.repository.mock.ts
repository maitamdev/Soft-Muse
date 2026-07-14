import { BaseMockRepository } from './BaseMockRepository';
import type { GiftCard, GiftCardCreateDTO, GiftCardUpdateDTO } from '@/types/marketing';
import type { IGiftCardRepository } from '@/lib/contracts/v2/IMarketingRepository';
import type { BaseEntity } from '@/types/base';

export class MockGiftCardRepository
 extends BaseMockRepository<GiftCard, GiftCardCreateDTO, GiftCardUpdateDTO>
 implements IGiftCardRepository {

 protected buildEntity(data: GiftCardCreateDTO, base: BaseEntity): GiftCard {
 return { ...base, currentBalance: data.initialAmount, usageHistory: [], ...data } as GiftCard;
 }
 protected mergeUpdate(e: GiftCard, d: GiftCardUpdateDTO): GiftCard { return { ...e, ...d }; }

 async findByCode(code: string) {
 return this.items.find(g => g.code === code && !g.deletedAt) ?? null;
 }
 async validate(code: string) {
 const gc = await this.findByCode(code);
 if (!gc) return { valid: false, balance: 0, reason: 'không' };
 if (gc.status !== 'active') return { valid: false, balance: 0, reason: 'Không hoạt động' };
 if (gc.expiresAt && gc.expiresAt < new Date().toISOString()) return { valid: false, balance: 0, reason: '' };
 if (gc.currentBalance <= 0) return { valid: false, balance: 0, reason: '' };
 return { valid: true, balance: gc.currentBalance, reason: null };
 }
 async deductBalance(id: string, amount: number, orderId: string): Promise<GiftCard> {
 const idx = this.items.findIndex(g => g.id === id);
 if (idx === -1) throw new Error('Gift card not found');
 const gc = this.items[idx];
 const newBalance = Math.max(0, gc.currentBalance - amount);
 this.items[idx] = { ...gc,
 currentBalance: newBalance,
 usageHistory: [...gc.usageHistory, { id: crypto.randomUUID(), orderId, amount, usedAt: new Date().toISOString() }],
 };
 return this.items[idx];
 }
 async getByCustomer(customerId: string) {
 return this.items.filter(g => g.purchasedBy === customerId && !g.deletedAt);
 }
}

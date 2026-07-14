import { BaseMockRepository } from './BaseMockRepository';
import type { Customer, CustomerCreateDTO, CustomerUpdateDTO, CustomerFilters, CustomerAddress } from '@/types/crm';
import type { ICustomerRepository } from '@/lib/contracts/v2/ICrmRepository';
import type { BaseEntity } from '@/types/base';

export class MockCustomerRepository
 extends BaseMockRepository<Customer, CustomerCreateDTO, CustomerUpdateDTO, CustomerFilters>
 implements ICustomerRepository {

 protected buildEntity(data: CustomerCreateDTO, base: BaseEntity): Customer {
 return { ...base, totalOrders: 0, totalSpent: 0, lastOrderDate: null, averageOrderValue: 0, ...data } as Customer;
 }
 protected mergeUpdate(e: Customer, d: CustomerUpdateDTO): Customer { return { ...e, ...d }; }
 protected applySearch(items: Customer[], s: string) {
 const q = s.toLowerCase();
 return items.filter(i => i.nameAr.includes(q) || i.email.includes(q) || i.phone.includes(q));
 }

 async findByEmail(email: string) { return this.items.find(c => c.email === email && !c.deletedAt) ?? null; }
 async getAddresses(_id: string): Promise<CustomerAddress[]> { return []; }
 async addAddress(_id: string, _data: any): Promise<CustomerAddress> { throw new Error('Not implemented'); }
 async removeAddress(_id: string, _addressId: string) {}
 async setDefaultAddress(_id: string, _addressId: string) {}
 async getOrderHistory(_id: string) { return []; }
 async updateStats(_id: string) {}
 async assignGroup(customerId: string, groupId: string) { await this.update(customerId, { groupId } as any); }
 async updateLevel(customerId: string, level: string) { await this.update(customerId, { level } as any); }
 async addTag(customerId: string, tag: string) {
 const c = await this.findById(customerId);
 if (c) await this.update(customerId, { tags: [...c.tags, tag] } as any);
 }
 async removeTag(customerId: string, tag: string) {
 const c = await this.findById(customerId);
 if (c) await this.update(customerId, { tags: c.tags.filter(t => t !== tag) } as any);
 }
}

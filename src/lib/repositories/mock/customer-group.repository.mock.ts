import { BaseMockRepository } from './BaseMockRepository';
import type { CustomerGroup, CustomerGroupCreateDTO, Customer } from '@/types/crm';
import type { ICustomerGroupRepository } from '@/lib/contracts/v2/ICrmRepository';
import type { BaseEntity } from '@/types/base';
import type { PaginatedResult, QueryOptions } from '@/types/query';
import { paginate } from '@/types/query';

export class MockCustomerGroupRepository
  extends BaseMockRepository<CustomerGroup, CustomerGroupCreateDTO, Partial<CustomerGroupCreateDTO>>
  implements ICustomerGroupRepository {

  protected buildEntity(data: CustomerGroupCreateDTO, base: BaseEntity): CustomerGroup {
    return { ...base, memberCount: 0, ...data } as CustomerGroup;
  }
  protected mergeUpdate(e: CustomerGroup, d: Partial<CustomerGroupCreateDTO>): CustomerGroup { return { ...e, ...d }; }

  async getMembers(_groupId: string, options?: QueryOptions): Promise<PaginatedResult<Customer>> { return paginate([], options); }
  async addMember(_groupId: string, _customerId: string) {}
  async removeMember(_groupId: string, _customerId: string) {}
  async refreshAutoGroup(_groupId: string) {}
}

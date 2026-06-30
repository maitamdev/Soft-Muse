import type { BaseEntity, Address, EntitySeo } from './base';

// ─── Customer ────────────────────────────────────────────────────────────────

export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketStatus = 'open' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed';

export interface CustomerAddress extends BaseEntity {
  customerId: string;
  labelAr: string;          // "المنزل", "العمل"
  nameAr: string;
  phone: string;
  address: Address;
  isDefault: boolean;
}

export interface Customer extends BaseEntity {
  nameAr: string;
  email: string;
  phone: string;
  whatsapp: string | null;
  dateOfBirth: string | null;
  groupId: string | null;   // → CustomerGroup
  level: string;            // From CRM settings
  tags: string[];
  defaultAddressId: string | null;
  notes: string | null;
  source: 'storefront' | 'admin' | 'import';

  // Stats — computed from orders, never stored directly
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string | null;
  averageOrderValue: number;
}

// ─── Customer Group ───────────────────────────────────────────────────────────

export type GroupType = 'manual' | 'automatic';

export interface GroupRule {
  field: 'total_spent' | 'total_orders' | 'last_order_days' | 'city' | 'level' | 'tag';
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte' | 'contains';
  value: string;
}

export interface CustomerGroup extends BaseEntity {
  nameAr: string;
  descriptionAr: string;
  type: GroupType;
  color: string;
  rules: GroupRule[];
  memberCount: number;  // Computed
}

// ─── Review ───────────────────────────────────────────────────────────────────

export interface Review extends BaseEntity {
  productId: string;
  customerId: string;
  customerNameAr: string;    // Snapshot
  customerEmail: string;     // Snapshot
  orderId: string | null;
  rating: number;            // 1-5
  titleAr: string;
  contentAr: string;
  replyAr: string | null;
  repliedAt: string | null;
  repliedBy: string | null;  // → StaffMember
  isFeatured: boolean;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
}

// ─── Support Ticket ───────────────────────────────────────────────────────────

export interface SupportMessage extends BaseEntity {
  ticketId: string;
  senderType: 'customer' | 'staff';
  senderId: string;
  messageAr: string;
  attachmentUrls: string[];
  isInternal: boolean;       // Internal notes not visible to customer
}

export interface SupportTicket extends BaseEntity {
  ticketNumber: string;      // "TKT-00001"
  customerId: string;
  orderId: string | null;
  subjectAr: string;
  priority: TicketPriority;
  ticketStatus: TicketStatus;
  assignedTo: string | null; // → StaffMember
  tags: string[];
  firstResponseAt: string | null;
  resolvedAt: string | null;
  closedAt: string | null;
  satisfactionRating: number | null; // 1-5 post-resolution
  messages: SupportMessage[];
}

// ─── Customer Filters ────────────────────────────────────────────────────────

export interface CustomerFilters {
  search?: string;
  status?: string | 'all';
  groupId?: string;
  level?: string;
  minSpent?: number;
  maxSpent?: number;
  dateFrom?: string;
  dateTo?: string;
}

// ─── DTOs ────────────────────────────────────────────────────────────────────

export type CustomerCreateDTO = Omit<Customer,
  'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'deletedAt' | 'isArchived' |
  'totalOrders' | 'totalSpent' | 'lastOrderDate' | 'averageOrderValue'
>;
export type CustomerUpdateDTO = Partial<CustomerCreateDTO>;

export type CustomerGroupCreateDTO = Omit<CustomerGroup,
  'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'deletedAt' | 'isArchived' |
  'memberCount'
>;

export type SupportTicketCreateDTO = Omit<SupportTicket,
  'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'deletedAt' | 'isArchived' |
  'firstResponseAt' | 'resolvedAt' | 'closedAt' | 'satisfactionRating' | 'messages'
>;

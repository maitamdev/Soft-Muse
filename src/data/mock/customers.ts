import { mockStorage } from '@/lib/storage/mock-storage';

export type CustomerStatus = 'active' | 'inactive' | 'blocked' | 'pending' | 'vip';

export interface CustomerAddress {
 id: string;
 label: string;
 fullName?: string;
 phone?: string;
 street: string;
 apartment?: string;
 floor?: string;
 building?: string;
 area?: string;
 city: string;
 postalCode?: string;
 country: string;
 isDefault: boolean;
}

export type CustomerActivityType =
 | 'order' | 'review' | 'login' | 'signup' | 'coupon'
 | 'registration' | 'status_change' | 'note_added'
 | 'tag_added' | 'tag_removed' | 'address_added' | 'address_removed';

export interface CustomerActivity {
 id: string;
 type: CustomerActivityType;
 description: string;
 date: string;
}

export interface CustomerInternalNote {
 id: string;
 adminName: string;
 text: string;
 date: string;
}

export interface CustomerSegment {
 id: string;
 name: string;
}

export interface Customer {
 id: string;
 customerNumber: string;

 // Name fields
 firstName?: string;
 lastName?: string;
 name: string;
 fullName: string;

 // Contact
 email: string;
 phone: string;
 avatar?: string;

 // Demographics
 gender?: 'male' | 'female' | 'unspecified';
 marketingConsent?: boolean;

 // Status
 status: CustomerStatus;

 // Finance metrics
 lifetimeValue: number;
 totalSpent: number;
 averagePurchaseValue: number;
 averageOrderValue: number;
 totalOrders: number;
 ordersCount: number;
 returnedOrdersCount: number;
 cancelledOrdersCount: number;
 totalRefunds?: number;
 couponsUsed: number;
 loyaltyPoints: number;
 wishlistCount: number;
 cartItemsCount?: number;
 reviewsCount: number;

 // Preferences
 favoriteCategory?: string;
 favoriteBrand?: string;
 favoriteColor?: string;

 // Relationship data
 notes: string;
 internalNotes: CustomerInternalNote[];
 tags: string[];
 segments: string[];
 addresses: CustomerAddress[];
 activities: CustomerActivity[];

 // Relational links (mock-first relationships → resolved against Product/Coupon services)
 wishlistProductIds?: string[];
 usedCouponCodes?: string[];

 // Dates
 registrationDate?: string;
 lastLogin?: string;
 createdAt: string;
}

export let mockCustomers: Customer[] = [
 {
 id: 'cust_1',
 customerNumber: 'AURA-001',
 firstName: '',
 lastName: '',
 name: '',
 fullName: '',
 email: 'sara@example.com',
 phone: '+966501234567',
 avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Sara',
 gender: 'female',
 marketingConsent: true,
 status: 'active',
 lifetimeValue: 45000,
 totalSpent: 45000,
 averagePurchaseValue: 15000,
 averageOrderValue: 15000,
 ordersCount: 3,
 totalOrders: 3,
 returnedOrdersCount: 0,
 cancelledOrdersCount: 1,
 totalRefunds: 0,
 couponsUsed: 2,
 loyaltyPoints: 450,
 wishlistCount: 7,
 cartItemsCount: 0,
 reviewsCount: 2,
 favoriteCategory: 'Váy',
 favoriteBrand: 'AURA',
 favoriteColor: 'Đen',
 notes: 'VIP, Váy.',
 internalNotes: [
 { id: 'in_1', adminName: 'Admin', text: 'WhatsApp', date: new Date(Date.now() - 10 * 86400000).toISOString() }
 ],
 tags: ['VIP', '', ''],
 segments: ['vip', 'high_ltv'],
 wishlistProductIds: ['prod_1', 'prod_2', 'prod_3'],
 usedCouponCodes: ['WELCOME2027', 'RAMADAN500'],
 addresses: [
 {
 id: 'addr_1',
 label: '',
 street: ',mã',
 city: 'TP. Hồ Chí Minh',
 country: '',
 isDefault: true
 }
 ],
 activities: [
 { id: 'act_1', type: 'order', description: 'đơn hàngMới #10024', date: new Date(Date.now() - 2 * 86400000).toISOString() },
 { id: 'act_2', type: 'review', description: '', date: new Date(Date.now() - 5 * 86400000).toISOString() },
 { id: 'act_3', type: 'login', description: '', date: new Date(Date.now() - 86400000).toISOString() },
 { id: 'act_4', type: 'registration', description: 'đã', date: new Date(Date.now() - 30 * 86400000).toISOString() }
 ],
 registrationDate: new Date(Date.now() - 30 * 86400000).toISOString(),
 lastLogin: new Date(Date.now() - 86400000).toISOString(),
 createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
 },
 {
 id: 'cust_2',
 customerNumber: 'AURA-002',
 firstName: '',
 lastName: '',
 name: '',
 fullName: '',
 email: 'noura@example.com',
 phone: '+966502345678',
 avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Noura',
 gender: 'female',
 marketingConsent: false,
 status: 'active',
 lifetimeValue: 22000,
 totalSpent: 22000,
 averagePurchaseValue: 7333,
 averageOrderValue: 7333,
 ordersCount: 3,
 totalOrders: 3,
 returnedOrdersCount: 1,
 cancelledOrdersCount: 0,
 totalRefunds: 1,
 couponsUsed: 1,
 loyaltyPoints: 220,
 wishlistCount: 3,
 cartItemsCount: 1,
 reviewsCount: 1,
 favoriteCategory: '',
 favoriteBrand: 'AURA',
 favoriteColor: 'Be',
 notes: '',
 internalNotes: [],
 tags: ['Mới'],
 segments: ['regular'],
 wishlistProductIds: ['prod_1'],
 usedCouponCodes: ['WELCOME2027'],
 addresses: [],
 activities: [
 { id: 'act_5', type: 'order', description: 'đơn hàngMới #10023', date: new Date(Date.now() - 10 * 86400000).toISOString() },
 { id: 'act_6', type: 'registration', description: 'đã', date: new Date(Date.now() - 90 * 86400000).toISOString() }
 ],
 registrationDate: new Date(Date.now() - 90 * 86400000).toISOString(),
 lastLogin: new Date(Date.now() - 3 * 86400000).toISOString(),
 createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
 }
];

mockCustomers = mockStorage.read('customers', mockCustomers);

export const updateMockCustomers = (data: Customer[]) => { mockCustomers = data; mockStorage.write('customers', data); };

import { mockStorage } from '@/lib/storage/mock-storage';

export interface Supplier {
  id: string;
  name: string;
  supplierCode: string;
  contactName: string;
  contactPerson?: string;
  email: string;
  phone: string;
  whatsapp: string;
  country: string;
  city: string;
  address: string;
  taxNumber: string;
  commercialRegistration: string;
  paymentTerms: string;
  currency: string;
  materialsProvided: string[];
  totalPurchases: number;
  outstandingBalance: number;
  status: 'active' | 'inactive';
  notes: string;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  reference: string;
  date: string;
  expectedArrival: string;
  receivedDate?: string;
  items: {
    productId?: string;       // links the line to a catalog product so receiving updates inventory
    name: string;
    quantity: number;
    unitCost: number;
    total: number;
    receivedQty?: number;
  }[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'draft' | 'sent' | 'partially_received' | 'received' | 'cancelled';
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  notes: string;
}

export interface Expense {
  id: string;
  name: string;
  category: 'manufacturing' | 'packaging' | 'shipping' | 'marketing' | 'operational' | 'software' | 'salary' | 'other' | string;
  amount: number;
  currency: string;
  date: string;
  paymentMethod: string;
  supplierId?: string;
  description?: string;
  notes?: string;
  receipt?: string;
  referenceId?: string;
  status: 'paid' | 'pending' | 'cancelled';
}

export interface Asset {
  id: string;
  name: string;
  type: 'equipment' | 'property' | 'software' | 'vehicle' | 'other' | string;
  purchaseDate: string;
  purchaseValue?: number;
  currentValue: number;
  depreciation?: number;
  depreciationRate?: number;
  status: 'active' | 'sold' | 'written_off';
  documents?: string[];
}

export interface Liability {
  id: string;
  name: string;
  type: 'loan' | 'invoice' | 'supplier_debt' | 'tax' | string;
  supplierId?: string;
  amount: number;
  dueDate: string;
  status?: 'unpaid' | 'partial' | 'paid';
}

export interface Capital {
  id: string;
  type: 'increase' | 'withdrawal';
  owner: string;
  amount: number;
  reason?: string;
  date: string;
  notes?: string;
}

export let mockSuppliers: Supplier[] = [
  {
    id: 'sup_1',
    name: 'مصنع الحرير الذهبي',
    supplierCode: 'SUP-001',
    contactName: 'أحمد محمود',
    email: 'ahmed@golden-silk.com',
    phone: '+966500000001',
    whatsapp: '+966500000001',
    country: 'السعودية',
    city: 'الرياض',
    address: 'المنطقة الصناعية الثانية',
    taxNumber: '300123456700003',
    commercialRegistration: '1010123456',
    paymentTerms: 'net_30',
    currency: 'EGP',
    materialsProvided: ['حرير خالص', 'بطائن حريرية'],
    totalPurchases: 150000,
    outstandingBalance: 25000,
    status: 'active',
    notes: 'مورد رئيسي'
  }
];

export let mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'po_1',
    supplierId: 'sup_1',
    reference: 'PO-2027-001',
    date: new Date().toISOString(),
    expectedArrival: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      { name: 'حرير خالص (لفة 50 متر)', quantity: 10, unitCost: 500, total: 5000 }
    ],
    subtotal: 5000,
    tax: 750,
    shipping: 100,
    total: 5850,
    status: 'received',
    paymentStatus: 'paid',
    notes: ''
  }
];

export let mockExpenses: Expense[] = [
  {
    id: 'exp_1',
    name: 'فاتورة تسويق شهرية',
    category: 'marketing',
    amount: 5000,
    currency: 'EGP',
    date: new Date().toISOString(),
    paymentMethod: 'bank_transfer',
    description: 'حملة تسويقية عبر انستجرام لتشكيلة الخريف',
    status: 'paid'
  }
];

export let mockAssets: Asset[] = [
  {
    id: 'ast_1',
    name: 'ماكينات خياطة صناعية',
    type: 'equipment',
    purchaseDate: '2026-01-15T00:00:00Z',
    currentValue: 120000,
    depreciation: 15,
    status: 'active',
    documents: []
  }
];

export let mockLiabilities: Liability[] = [
  {
    id: 'lib_1',
    name: 'قرض تجاري متوسط الأجل',
    type: 'loan',
    amount: 500000,
    dueDate: '2028-01-01T00:00:00Z',
    status: 'unpaid'
  }
];

export let mockCapital: Capital[] = [
  {
    id: 'cap_1',
    type: 'increase',
    owner: 'مؤسس الشركة',
    amount: 1000000,
    reason: 'ضخ سيولة للتوسع',
    date: '2025-01-01T00:00:00Z'
  }
];

mockSuppliers = mockStorage.read('suppliers', mockSuppliers);
mockPurchaseOrders = mockStorage.read('purchase_orders', mockPurchaseOrders);
mockExpenses = mockStorage.read('expenses', mockExpenses);
mockAssets = mockStorage.read('assets', mockAssets);
mockLiabilities = mockStorage.read('liabilities', mockLiabilities);
mockCapital = mockStorage.read('capital', mockCapital);

export const updateMockSuppliers = (data: Supplier[]) => { mockSuppliers = data; mockStorage.write('suppliers', data); };
export const updateMockPurchaseOrders = (data: PurchaseOrder[]) => { mockPurchaseOrders = data; mockStorage.write('purchase_orders', data); };
export const updateMockExpenses = (data: Expense[]) => { mockExpenses = data; mockStorage.write('expenses', data); };
export const updateMockAssets = (data: Asset[]) => { mockAssets = data; mockStorage.write('assets', data); };
export const updateMockLiabilities = (data: Liability[]) => { mockLiabilities = data; mockStorage.write('liabilities', data); };
export const updateMockCapital = (data: Capital[]) => { mockCapital = data; mockStorage.write('capital', data); };

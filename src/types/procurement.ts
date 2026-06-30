import type { BaseEntity, Address } from './base';

export type PaymentTerms = 'immediate' | 'net_15' | 'net_30' | 'net_60' | 'net_90';
export type PaymentMethod = 'bank_transfer' | 'cheque' | 'cash' | 'credit_card' | 'online';

// ─── Supplier ────────────────────────────────────────────────────────────────

export interface BankDetails {
  bankNameAr: string;
  accountNumber: string;
  iban: string;
  swiftCode: string | null;
}

export interface Supplier extends BaseEntity {
  nameAr: string;
  supplierCode: string;              // "SUP-001"
  categoryId: string | null;
  contactPersonAr: string;
  phone: string;
  whatsapp: string | null;
  email: string;
  country: string;
  city: string;
  address: Address | null;
  taxNumber: string | null;
  commercialRegistration: string | null;
  paymentTerms: PaymentTerms;
  currency: string;
  bankDetails: BankDetails | null;
  notes: string | null;

  // Computed from transactions — never stored directly
  totalPurchases: number;
  outstandingBalance: number;
  lastOrderDate: string | null;
}

// ─── Purchase Order ──────────────────────────────────────────────────────────

export type POStatus =
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'sent'
  | 'partially_received'
  | 'received'
  | 'cancelled';

export interface POItem {
  id: string;
  productId: string;
  variantId: string | null;
  descriptionAr: string;
  quantity: number;
  receivedQty: number;           // Updated on each receipt
  unitCost: number;
  totalCost: number;             // quantity * unitCost
}

export interface PurchaseOrder extends BaseEntity {
  poNumber: string;              // "PO-00001"
  supplierId: string;
  status: POStatus;
  items: POItem[];
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  total: number;
  currency: string;
  paymentTerms: PaymentTerms;
  expectedArrival: string;
  notes: string | null;
  approvedBy: string | null;
  approvedAt: string | null;

  // Computed
  receivedPercent: number;       // 0–100
  paidAmount: number;
}

// ─── Purchase Receipt ────────────────────────────────────────────────────────

export interface ReceiptItem {
  id: string;
  poItemId: string;
  productId: string;
  variantId: string | null;
  quantityOrdered: number;
  quantityReceived: number;
  unitCost: number;
}

export interface PurchaseReceipt extends BaseEntity {
  receiptNumber: string;         // "GR-00001"
  poId: string;                  // → PurchaseOrder
  warehouseId: string;           // Required — where goods arrive
  receivedAt: string;
  items: ReceiptItem[];
  notes: string | null;
  // On creation: triggers StockMovement(type: 'receive') for each item
}

// ─── Supplier Payment ────────────────────────────────────────────────────────

export interface SupplierPayment extends BaseEntity {
  paymentNumber: string;         // "SP-00001"
  supplierId: string;
  poId: string | null;           // Optional — can be a general payment
  amount: number;
  currency: string;
  method: PaymentMethod;
  referenceNumber: string | null;
  paidAt: string;
  notes: string | null;
}

// ─── DTOs ────────────────────────────────────────────────────────────────────

export type SupplierCreateDTO = Omit<Supplier,
  'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'deletedAt' | 'isArchived' |
  'totalPurchases' | 'outstandingBalance' | 'lastOrderDate'
>;
export type SupplierUpdateDTO = Partial<SupplierCreateDTO>;

export type PurchaseOrderCreateDTO = Omit<PurchaseOrder,
  'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'deletedAt' | 'isArchived' |
  'approvedBy' | 'approvedAt' | 'receivedPercent' | 'paidAmount'
>;
export type PurchaseOrderUpdateDTO = Partial<Omit<PurchaseOrderCreateDTO, 'poNumber'>>;

export type PurchaseReceiptCreateDTO = Omit<PurchaseReceipt,
  'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'deletedAt' | 'isArchived'
>;

export type SupplierPaymentCreateDTO = Omit<SupplierPayment,
  'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'deletedAt' | 'isArchived'
>;

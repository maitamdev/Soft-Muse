import type { BaseEntity } from './base';
import type { PaymentMethod } from './procurement';

export type ExpenseCategoryType =
 | 'operational'
 | 'manufacturing'
 | 'shipping'
 | 'marketing'
 | 'administrative'
 | 'other';

export type AssetType = 'equipment' | 'furniture' | 'vehicle' | 'electronics' | 'property' | 'other';
export type LiabilityType = 'bank_loan' | 'credit_facility' | 'supplier_credit' | 'lease' | 'other';

// ─── Expense ──────────────────────────────────────────────────────────────────

export interface Expense extends BaseEntity {
 expenseNumber: string; // "EXP-00001"
 nameAr: string;
 category: ExpenseCategoryType;
 categoryId: string | null; // → ExpenseCategory from settings (custom categories)
 amount: number;
 taxAmount: number;
 totalAmount: number; // amount + taxAmount
 currency: string;
 date: string;
 paymentMethod: PaymentMethod;
 supplierId: string | null;
 receiptUrl: string | null;
 notes: string | null;
}

// ─── Asset ───────────────────────────────────────────────────────────────────

export interface Asset extends BaseEntity {
 assetNumber: string; // "AST-00001"
 nameAr: string;
 type: AssetType;
 purchaseDate: string;
 purchaseValue: number;
 currentValue: number;
 depreciationRate: number; // Annual % (0.20 = 20%)
 warehouseId: string | null; // Physical location
 supplierId: string | null;
 serialNumber: string | null;
 notes: string | null;
}

// ─── Liability ────────────────────────────────────────────────────────────────

export interface PaymentScheduleItem {
 id: string;
 dueDate: string;
 amount: number;
 isPaid: boolean;
 paidAt: string | null;
}

export interface Liability extends BaseEntity {
 liabilityNumber: string; // "LIA-00001"
 nameAr: string;
 creditorAr: string;
 type: LiabilityType;
 principalAmount: number;
 outstandingAmount: number;
 interestRate: number | null;
 dueDate: string;
 paymentSchedule: PaymentScheduleItem[];
 notes: string | null;
}

// ─── Capital ──────────────────────────────────────────────────────────────────

export type CapitalType = 'increase' | 'withdrawal';

export interface Capital extends BaseEntity {
 capitalNumber: string; // "CAP-00001"
 type: CapitalType;
 ownerAr: string;
 amount: number;
 date: string;
 notes: string | null;
}

// ─── Financial Summary (read-only, computed) ──────────────────────────────────

export interface FinancialSummary {
 totalRevenue: number;
 totalCOGS: number;
 grossProfit: number;
 totalExpenses: number;
 netProfit: number;
 cashFlow: number;
 totalAssets: number;
 totalLiabilities: number;
 totalCapital: number;
 inventoryValue: number;
 outstandingPayments: number;
 supplierCount: number;
 poCount: number;
}

// ─── DTOs ────────────────────────────────────────────────────────────────────

export type ExpenseCreateDTO = Omit<Expense,
 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'deletedAt' | 'isArchived'
>;
export type ExpenseUpdateDTO = Partial<Omit<ExpenseCreateDTO, 'expenseNumber'>>;

export type AssetCreateDTO = Omit<Asset,
 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'deletedAt' | 'isArchived'
>;
export type AssetUpdateDTO = Partial<Omit<AssetCreateDTO, 'assetNumber'>>;

export type LiabilityCreateDTO = Omit<Liability,
 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'deletedAt' | 'isArchived'
>;
export type LiabilityUpdateDTO = Partial<Omit<LiabilityCreateDTO, 'liabilityNumber'>>;

export type CapitalCreateDTO = Omit<Capital,
 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy' | 'deletedAt' | 'isArchived'
>;
export type CapitalUpdateDTO = Partial<Omit<CapitalCreateDTO, 'capitalNumber'>>;

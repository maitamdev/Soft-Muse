import { z } from 'zod';
import { zArabicText, zNonNegativeNumber, zPositiveNumber, zDateString } from './base.schema';

export const ExpenseCreateSchema = z.object({
 nameAr: zArabicText('Tênchi phí'),
 category: z.enum(['operational', 'manufacturing', 'shipping', 'marketing', 'administrative', 'other']),
 categoryId: z.string().nullable().default(null),
 amount: zPositiveNumber('Số tiền'),
 taxAmount: zNonNegativeNumber('').default(0),
 totalAmount: zNonNegativeNumber('Tổng cộng'),
 currency: z.string().min(3).max(3).default('VND'),
 date: zDateString('Ngày'),
 paymentMethod: z.enum(['bank_transfer', 'cheque', 'cash', 'credit_card', 'online']),
 supplierId: z.string().nullable().default(null),
 receiptUrl: z.string().nullable().default(null),
 notes: z.string().nullable().default(null),
});

export const AssetCreateSchema = z.object({
 nameAr: zArabicText('Têntài sản'),
 type: z.enum(['equipment', 'furniture', 'vehicle', 'electronics', 'property', 'other']),
 purchaseDate: zDateString('Ngày mua'),
 purchaseValue: zPositiveNumber(''),
 currentValue: zNonNegativeNumber('Giá trị hiện tại'),
 depreciationRate: z.number().min(0).max(1).default(0),
 warehouseId: z.string().nullable().default(null),
 supplierId: z.string().nullable().default(null),
 serialNumber: z.string().nullable().default(null),
 notes: z.string().nullable().default(null),
});

export const LiabilityCreateSchema = z.object({
 nameAr: zArabicText('Têncông nợ'),
 creditorAr: zArabicText('mã '),
 type: z.enum(['bank_loan', 'credit_facility', 'supplier_credit', 'lease', 'other']),
 principalAmount: zPositiveNumber('Số tiền '),
 outstandingAmount: zNonNegativeNumber('Số tiền Còn lại'),
 interestRate: z.number().min(0).nullable().default(null),
 dueDate: zDateString('Ngày đến hạn'),
 paymentSchedule: z.array(z.any()).default([]),
 notes: z.string().nullable().default(null),
});

export const CapitalCreateSchema = z.object({
 type: z.enum(['increase', 'withdrawal']),
 ownerAr: zArabicText('mã /'),
 amount: zPositiveNumber('Số tiền'),
 date: zDateString('ngày'),
 notes: z.string().nullable().default(null),
});

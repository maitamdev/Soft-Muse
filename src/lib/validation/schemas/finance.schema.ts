import { z } from 'zod';
import { zArabicText, zNonNegativeNumber, zPositiveNumber, zDateString } from './base.schema';

export const ExpenseCreateSchema = z.object({
  nameAr:        zArabicText('اسم المصروف'),
  category:      z.enum(['operational', 'manufacturing', 'shipping', 'marketing', 'administrative', 'other']),
  categoryId:    z.string().nullable().default(null),
  amount:        zPositiveNumber('المبلغ'),
  taxAmount:     zNonNegativeNumber('الضريبة').default(0),
  totalAmount:   zNonNegativeNumber('الإجمالي'),
  currency:      z.string().min(3).max(3).default('EGP'),
  date:          zDateString('التاريخ'),
  paymentMethod: z.enum(['bank_transfer', 'cheque', 'cash', 'credit_card', 'online']),
  supplierId:    z.string().nullable().default(null),
  receiptUrl:    z.string().nullable().default(null),
  notes:         z.string().nullable().default(null),
});

export const AssetCreateSchema = z.object({
  nameAr:          zArabicText('اسم الأصل'),
  type:            z.enum(['equipment', 'furniture', 'vehicle', 'electronics', 'property', 'other']),
  purchaseDate:    zDateString('تاريخ الشراء'),
  purchaseValue:   zPositiveNumber('قيمة الشراء'),
  currentValue:    zNonNegativeNumber('القيمة الحالية'),
  depreciationRate: z.number().min(0).max(1).default(0),
  warehouseId:     z.string().nullable().default(null),
  supplierId:      z.string().nullable().default(null),
  serialNumber:    z.string().nullable().default(null),
  notes:           z.string().nullable().default(null),
});

export const LiabilityCreateSchema = z.object({
  nameAr:           zArabicText('اسم الالتزام'),
  creditorAr:       zArabicText('اسم الدائن'),
  type:             z.enum(['bank_loan', 'credit_facility', 'supplier_credit', 'lease', 'other']),
  principalAmount:  zPositiveNumber('المبلغ الأصلي'),
  outstandingAmount: zNonNegativeNumber('المبلغ المتبقي'),
  interestRate:     z.number().min(0).nullable().default(null),
  dueDate:          zDateString('تاريخ الاستحقاق'),
  paymentSchedule:  z.array(z.any()).default([]),
  notes:            z.string().nullable().default(null),
});

export const CapitalCreateSchema = z.object({
  type:    z.enum(['increase', 'withdrawal']),
  ownerAr: zArabicText('اسم المستثمر/الشريك'),
  amount:  zPositiveNumber('المبلغ'),
  date:    zDateString('تاريخ الحركة'),
  notes:   z.string().nullable().default(null),
});

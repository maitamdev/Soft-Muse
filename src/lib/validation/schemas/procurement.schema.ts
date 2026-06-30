import { z } from 'zod';
import { zArabicText, zPositiveNumber, zNonNegativeNumber, zDateString, zEmail, zPhone } from './base.schema';

export const SupplierCreateSchema = z.object({
  nameAr:                  zArabicText('اسم المورد'),
  supplierCode:            z.string().min(1, 'كود المورد مطلوب'),
  categoryId:              z.string().nullable().default(null),
  contactPersonAr:         z.string().default(''),
  phone:                   z.string().min(1, 'رقم الهاتف مطلوب'),
  whatsapp:                zPhone(),
  email:                   zEmail().or(z.literal('')),
  country:                 z.string().default('المملكة العربية السعودية'),
  city:                    z.string().default(''),
  address:                 z.any().nullable().default(null),
  taxNumber:               z.string().nullable().default(null),
  commercialRegistration:  z.string().nullable().default(null),
  paymentTerms:            z.enum(['immediate', 'net_15', 'net_30', 'net_60', 'net_90']).default('net_30'),
  currency:                z.string().default('EGP'),
  bankDetails:             z.any().nullable().default(null),
  notes:                   z.string().nullable().default(null),
});

export const POItemSchema = z.object({
  id:           z.string(),
  productId:    z.string().min(1, 'المنتج مطلوب'),
  variantId:    z.string().nullable().default(null),
  descriptionAr: z.string().default(''),
  quantity:     z.number().int().positive('الكمية يجب أن تكون أكبر من صفر'),
  receivedQty:  z.number().int().min(0).default(0),
  unitCost:     zPositiveNumber('سعر الوحدة'),
  totalCost:    zNonNegativeNumber('الإجمالي'),
});

export const PurchaseOrderCreateSchema = z.object({
  supplierId:    z.string().min(1, 'المورد مطلوب'),
  items:         z.array(POItemSchema).min(1, 'يجب إضافة منتج واحد على الأقل'),
  subtotal:      zNonNegativeNumber('المجموع الفرعي'),
  taxAmount:     zNonNegativeNumber('الضريبة').default(0),
  shippingCost:  zNonNegativeNumber('تكلفة الشحن').default(0),
  total:         zNonNegativeNumber('الإجمالي'),
  currency:      z.string().default('EGP'),
  paymentTerms:  z.enum(['immediate', 'net_15', 'net_30', 'net_60', 'net_90']).default('net_30'),
  expectedArrival: zDateString('تاريخ الوصول المتوقع'),
  notes:         z.string().nullable().default(null),
});

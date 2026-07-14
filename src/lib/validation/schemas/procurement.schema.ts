import { z } from 'zod';
import { zArabicText, zPositiveNumber, zNonNegativeNumber, zDateString, zEmail, zPhone } from './base.schema';

export const SupplierCreateSchema = z.object({
 nameAr: zArabicText('mã Nhà cung cấp'),
 supplierCode: z.string().min(1, 'Mã nhà cung cấp '),
 categoryId: z.string().nullable().default(null),
 contactPersonAr: z.string().default(''),
 phone: z.string().min(1, 'Số điện thoại '),
 whatsapp: zPhone(),
 email: zEmail().or(z.literal('')),
 country: z.string().default(''),
 city: z.string().default(''),
 address: z.any().nullable().default(null),
 taxNumber: z.string().nullable().default(null),
 commercialRegistration: z.string().nullable().default(null),
 paymentTerms: z.enum(['immediate', 'net_15', 'net_30', 'net_60', 'net_90']).default('net_30'),
 currency: z.string().default('VND'),
 bankDetails: z.any().nullable().default(null),
 notes: z.string().nullable().default(null),
});

export const POItemSchema = z.object({
 id: z.string(),
 productId: z.string().min(1, 'sản phẩm'),
 variantId: z.string().nullable().default(null),
 descriptionAr: z.string().default(''),
 quantity: z.number().int().positive('Số lượng từ'),
 receivedQty: z.number().int().min(0).default(0),
 unitCost: zPositiveNumber('giáModule'),
 totalCost: zNonNegativeNumber('Tổng cộng'),
});

export const PurchaseOrderCreateSchema = z.object({
 supplierId: z.string().min(1, 'Nhà cung cấp '),
 items: z.array(POItemSchema).min(1, 'Thêm sản phẩm trên'),
 subtotal: zNonNegativeNumber(''),
 taxAmount: zNonNegativeNumber('').default(0),
 shippingCost: zNonNegativeNumber('Vận chuyển').default(0),
 total: zNonNegativeNumber('Tổng cộng'),
 currency: z.string().default('VND'),
 paymentTerms: z.enum(['immediate', 'net_15', 'net_30', 'net_60', 'net_90']).default('net_30'),
 expectedArrival: zDateString('Ngày dự kiến nhận'),
 notes: z.string().nullable().default(null),
});

import { z } from 'zod';

/** Arabic-only string — rejects empty strings */
export const zArabicText = (fieldName: string) =>
  z.string().min(1, `${fieldName} مطلوب`).trim();

/** Optional Arabic string */
export const zArabicTextOpt = () =>
  z.string().trim().optional().nullable();

/** URL string */
export const zUrl = () =>
  z.string().url('رابط غير صالح').or(z.literal('')).optional().nullable();

/** Positive number */
export const zPositiveNumber = (fieldName: string) =>
  z.number({ error: `${fieldName} مطلوب` })
    .positive(`${fieldName} يجب أن يكون أكبر من صفر`);

/** Non-negative number (0 is allowed) */
export const zNonNegativeNumber = (fieldName: string) =>
  z.number({ error: `${fieldName} مطلوب` })
    .min(0, `${fieldName} لا يمكن أن يكون سالباً`);

/** ISO date string "2026-01-15" */
export const zDateString = (fieldName: string) =>
  z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, `${fieldName}: صيغة التاريخ يجب أن تكون YYYY-MM-DD`)
    .min(1, `${fieldName} مطلوب`);

/** ISO datetime string */
export const zDateTimeString = () =>
  z.string().datetime({ message: 'صيغة التاريخ والوقت غير صالحة' }).optional().nullable();

/** UUID string */
export const zId = () =>
  z.string().uuid('معرف غير صالح');

/** Optional UUID */
export const zIdOpt = () =>
  z.string().uuid('معرف غير صالح').optional().nullable();

/** Phone number — basic validation */
export const zPhone = () =>
  z.string()
    .regex(/^[+\d\s\-()]{7,20}$/, 'رقم الهاتف غير صالح')
    .optional().nullable();

/** Email */
export const zEmail = () =>
  z.string().email('البريد الإلكتروني غير صالح');

/** Price — 2 decimal places max */
export const zPrice = (fieldName: string) =>
  z.number({ error: `${fieldName} مطلوب` })
    .min(0, `${fieldName} لا يمكن أن يكون سالباً`)
    .multipleOf(0.01);

/** Slug — URL-safe */
export const zSlug = () =>
  z.string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'الرابط يجب أن يحتوي على أحرف إنجليزية صغيرة وأرقام وشرطات فقط')
    .min(1, 'الرابط مطلوب');

/** Percent 0–100 */
export const zPercent = () =>
  z.number().min(0).max(100);

/** Rating 1–5 */
export const zRating = () =>
  z.number().int().min(1).max(5);

/** Tags array */
export const zTags = () =>
  z.array(z.string().trim().min(1)).default([]);

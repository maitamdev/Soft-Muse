import { z } from 'zod';

/** Arabic-only string — rejects empty strings */
export const zArabicText = (fieldName: string) =>
 z.string().min(1, `${fieldName} `).trim();

/** Optional Arabic string */
export const zArabicTextOpt = () =>
 z.string().trim().optional().nullable();

/** URL string */
export const zUrl = () =>
 z.string().url('không').or(z.literal('')).optional().nullable();

/** Positive number */
export const zPositiveNumber = (fieldName: string) =>
 z.number({ error: `${fieldName} ` })
 .positive(`${fieldName} từ`);

/** Non-negative number (0 is allowed) */
export const zNonNegativeNumber = (fieldName: string) =>
 z.number({ error: `${fieldName} ` })
 .min(0, `${fieldName} không`);

/** ISO date string "2026-01-15" */
export const zDateString = (fieldName: string) =>
 z.string()
 .regex(/^\d{4}-\d{2}-\d{2}$/, `${fieldName}: Ngày YYYY-MM-DD`)
 .min(1, `${fieldName} `);

/** ISO datetime string */
export const zDateTimeString = () =>
 z.string().datetime({ message: 'Ngày không' }).optional().nullable();

/** UUID string */
export const zId = () =>
 z.string().uuid('không');

/** Optional UUID */
export const zIdOpt = () =>
 z.string().uuid('không').optional().nullable();

/** Phone number — basic validation */
export const zPhone = () =>
 z.string()
 .regex(/^[+\d\s\-()]{7,20}$/, 'Số điện thoại không')
 .optional().nullable();

/** Email */
export const zEmail = () =>
 z.string().email('Email không');

/** Price — 2 decimal places max */
export const zPrice = (fieldName: string) =>
 z.number({ error: `${fieldName} ` })
 .min(0, `${fieldName} không`)
 .multipleOf(0.01);

/** Slug — URL-safe */
export const zSlug = () =>
 z.string()
 .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Đường dẫn trên')
 .min(1, 'Đường dẫn ');

/** Percent 0–100 */
export const zPercent = () =>
 z.number().min(0).max(100);

/** Rating 1–5 */
export const zRating = () =>
 z.number().int().min(1).max(5);

/** Tags array */
export const zTags = () =>
 z.array(z.string().trim().min(1)).default([]);

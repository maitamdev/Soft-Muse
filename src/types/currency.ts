/**
 * Currency foundation — supports future multi-currency operation.
 * Current store uses VND only.
 */
export type CurrencyCode = 'VND' | 'SAR' | 'USD' | 'EUR' | 'GBP' | 'AED' | 'KWD' | 'BHD' | 'QAR' | 'OMR';

export interface Currency {
 code: CurrencyCode;
 nameAr: string;
 symbol: string;
 symbolPosition: 'before' | 'after';
 decimalPlaces: number;
 isActive: boolean;
 isDefault: boolean;
 exchangeRate: number; // Rate relative to store base currency
}

export const DEFAULT_CURRENCIES: Omit<Currency, 'isActive' | 'isDefault' | 'exchangeRate'>[] = [
 { code: 'VND', nameAr: 'Việt Nam', symbol: 'đ', symbolPosition: 'after', decimalPlaces: 2 },
 { code: 'USD', nameAr: '', symbol: '$', symbolPosition: 'before', decimalPlaces: 2 },
 { code: 'EUR', nameAr: '', symbol: '€', symbolPosition: 'before', decimalPlaces: 2 },
 { code: 'AED', nameAr: '', symbol: '.', symbolPosition: 'after', decimalPlaces: 2 },
 { code: 'KWD', nameAr: '', symbol: '.', symbolPosition: 'after', decimalPlaces: 3 },
];

/**
 * Format a money amount for display.
 * Uses the store's locale and currency settings.
 */
export function formatCurrency(
 amount: number,
 currency: CurrencyCode = 'VND',
 locale = 'ar-EG'
): string {
 return new Intl.NumberFormat(locale, {
 style: 'currency',
 currency,
 minimumFractionDigits: 2,
 maximumFractionDigits: 2,
 }).format(amount);
}

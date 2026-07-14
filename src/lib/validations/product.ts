import { Product } from '@/data/mock/products';

export interface ValidationResult {
 isValid: boolean;
 errors: Record<string, string>;
}

export class ProductValidator {
 /**
 * Validates if a required field is present
 */
 static isRequired(value: unknown): boolean {
 if (typeof value === 'string') return value.trim().length > 0;
 if (typeof value === 'number') return !isNaN(value);
 if (Array.isArray(value)) return value.length > 0;
 return value !== null && value !== undefined;
 }

 /**
 * Validates a readable uppercase SKU such as SM-ASM-001.
 */
 static isValidSku(sku: string): boolean {
 const skuRegex = /^[A-Z0-9]+(?:-[A-Z0-9]+)+$/;
 return skuRegex.test(sku);
 }

 /**
 * Checks SKU uniqueness against the products loaded from the database.
 */
 static isSkuUnique(sku: string, currentId: string, allProducts: Product[]): boolean {
 return !allProducts.some(p => p.sku === sku && p.id !== currentId);
 }

 /**
 * Validates pricing logic (Compare price must be >= regular price)
 */
 static isValidPricing(price: number, comparePrice: number, costPrice: number): boolean {
 if (price < 0 || comparePrice < 0 || costPrice < 0) return false;
 if (comparePrice > 0 && comparePrice < price) return false;
 // We allow costPrice > price (loss leader), but usually we can warn. Here we just return true.
 return true;
 }

 /**
 * Validates stock logic
 */
 static isValidStock(stock: number, lowStockLimit: number): boolean {
 return stock >= 0 && lowStockLimit >= 0;
 }

 /**
 * Full Product Validation
 */
 static validate(product: Partial<Product>, allProducts: Product[]): ValidationResult {
 const errors: Record<string, string> = {};

 if (!this.isRequired(product.name)) {
 errors.name = 'Vui lòng nhập tên sản phẩm.';
 }

 if (!this.isRequired(product.slug)) {
 errors.slug = 'Vui lòng nhập đường dẫn sản phẩm.';
 }

 if (!this.isRequired(product.sku)) {
 errors.sku = 'Vui lòng nhập mã SKU.';
 } else if (!this.isValidSku(product.sku as string)) {
 errors.sku = 'SKU chỉ gồm chữ in hoa, số và dấu gạch ngang, ví dụ SM-ASM-001.';
 } else if (!this.isSkuUnique(product.sku as string, product.id || '', allProducts)) {
 errors.sku = 'Mã SKU đã được sử dụng.';
 }

 if (!this.isRequired(product.price) || (product.price as number) <= 0) {
 errors.price = 'Giá bán phải lớn hơn 0.';
 }

 if (product.price !== undefined && product.comparePrice !== undefined && product.costPrice !== undefined) {
 if (!this.isValidPricing(product.price, product.comparePrice, product.costPrice)) {
 errors.pricing = 'Giá gốc phải bằng hoặc lớn hơn giá bán.';
 }
 }

 if (product.stock !== undefined && product.lowStockLimit !== undefined) {
 if (!this.isValidStock(product.stock, product.lowStockLimit)) {
 errors.stock = 'Số lượng tồn kho và ngưỡng cảnh báo không được âm.';
 }
 }

 return {
 isValid: Object.keys(errors).length === 0,
 errors
 };
 }
}

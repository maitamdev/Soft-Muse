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

 if (product.status === 'published') {
 if (!product.category?.trim()) errors.category = 'Sản phẩm xuất bản phải có danh mục.';
 if (!product.images?.length) errors.images = 'Sản phẩm xuất bản phải có ít nhất một ảnh.';
 }

 if (product.publishAt && product.hideAt && new Date(product.hideAt) <= new Date(product.publishAt)) {
 errors.schedule = 'Thời gian ngừng hiển thị phải sau thời gian bắt đầu.';
 }

 const variants = product.variants ?? [];
 const variantSkus = new Set<string>();
 const variantOptions = new Set<string>();
 variants.forEach((variant, index) => {
 const label = `Biến thể ${index + 1}`;
 if (!variant.size.trim()) errors[`variant_${index}`] = `${label} phải có kích cỡ.`;
 if (!this.isValidSku(variant.sku)) errors[`variant_sku_${index}`] = `${label} có SKU không hợp lệ.`;
 if (variant.sku === product.sku || variantSkus.has(variant.sku) || allProducts.some(p => p.id !== product.id && (p.sku === variant.sku || p.variants.some(v => v.sku === variant.sku)))) {
 errors[`variant_unique_${index}`] = `SKU ${variant.sku} đã được sử dụng.`;
 }
 variantSkus.add(variant.sku);
 const optionKey = variant.size.trim().toLowerCase();
 if (variantOptions.has(optionKey)) errors[`variant_option_${index}`] = `Biến thể size ${variant.size} bị trùng.`;
 variantOptions.add(optionKey);
 if (variant.price <= 0 || variant.stock < 0 || (variant.cost ?? 0) < 0) errors[`variant_values_${index}`] = `${label} có giá hoặc tồn kho không hợp lệ.`;
 });
 }

 return {
 isValid: Object.keys(errors).length === 0,
 errors
 };
 }
}

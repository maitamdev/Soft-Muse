import { create } from 'zustand';
import { Product, ProductStatus } from '@/data/mock/products';
import type { ProductFilters } from '@/lib/services/product.service';
import { ProductService } from '@/lib/services/product.service';
import { eventBus } from '@/lib/events/EventBus';

interface ProductState {
 products: Product[];
 isLoading: boolean;
 error: string | null;
 
 // Actions
 fetchProducts: (filters?: ProductFilters) => Promise<void>;
 updateProductOptimistic: (id: string, data: Partial<Product>) => void;
 deleteProductOptimistic: (id: string) => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
 products: [],
 isLoading: false,
 error: null,

 fetchProducts: async (filters) => {
 set({ isLoading: true, error: null });
 try {
 const products = await ProductService.getProducts(filters);
 set({ products, isLoading: false });
 eventBus.emit('products.fetched', products);
 } catch (err: any) {
 set({ error: err.message || 'Failed to fetch products', isLoading: false });
 }
 },

 updateProductOptimistic: (id, data) => {
 set((state) => ({
 products: state.products.map(p => p.id === id ? { ...p, ...data } : p)
 }));
 // Note: The actual API call and Revisions logging is handled by the autosave hook/service
 },

 deleteProductOptimistic: (id) => {
 set((state) => ({
 products: state.products.filter(p => p.id !== id)
 }));
 }
}));

import { loadAdminSetting, saveAdminSetting } from './admin-settings-storage';

export interface Brand {
 id: string;
 name: string;
 slug: string;
 logo: string;
 description: string;
 status: 'active' | 'draft' | 'archived';
 deletedAt?: string;
 createdAt: string;
 updatedAt: string;
}

let MOCK_BRANDS: Brand[] = [
 {
 id: "brand_aura",
 name: "AURA Original",
 slug: "aura-original",
 logo: "https://aura-fashion-virid.vercel.app/logo.svg",
 description: "The core AURA luxury line.",
 status: 'active',
 createdAt: new Date().toISOString(),
 updatedAt: new Date().toISOString()
 }
];

const hydrateBrands = async () => {
 MOCK_BRANDS = await loadAdminSetting('admin.brands', MOCK_BRANDS);
};
const persistBrands = async () => {
 MOCK_BRANDS = await saveAdminSetting('admin.brands', MOCK_BRANDS);
};

export const BrandService = {
 async getBrands(includeDeleted = false): Promise<Brand[]> {
 await hydrateBrands();
 return includeDeleted ? [...MOCK_BRANDS] : MOCK_BRANDS.filter(c => !c.deletedAt);
 },

 async getBrand(id: string): Promise<Brand | null> {
 await hydrateBrands();
 const c = MOCK_BRANDS.find(x => x.id === id);
 return (c && !c.deletedAt) ? { ...c } : null;
 },

 async createBrand(data: Omit<Brand, 'id' | 'createdAt' | 'updatedAt'>): Promise<Brand> {
 await hydrateBrands();
 if (MOCK_BRANDS.some((brand) => !brand.deletedAt && brand.slug === data.slug)) throw new Error('Slug thương hiệu đã tồn tại.');
 const newBrand: Brand = { ...data,
 id: `brand_${Date.now()}`,
 createdAt: new Date().toISOString(),
 updatedAt: new Date().toISOString()
 };
 MOCK_BRANDS = [...MOCK_BRANDS, newBrand];
 await persistBrands();
 return newBrand;
 },

 async updateBrand(id: string, updates: Partial<Brand>): Promise<Brand> {
 await hydrateBrands();
 const idx = MOCK_BRANDS.findIndex(x => x.id === id);
 if (idx === -1) throw new Error('Không tìm thấy thương hiệu.');
 if (updates.slug && MOCK_BRANDS.some((brand) => brand.id !== id && !brand.deletedAt && brand.slug === updates.slug)) throw new Error('Slug thương hiệu đã tồn tại.');
 const updated = { ...MOCK_BRANDS[idx], ...updates, updatedAt: new Date().toISOString() };
 MOCK_BRANDS = [...MOCK_BRANDS.slice(0, idx), updated, ...MOCK_BRANDS.slice(idx + 1)];
 await persistBrands();
 return updated;
 },

 async softDelete(id: string): Promise<void> {
 await hydrateBrands();
 const idx = MOCK_BRANDS.findIndex(x => x.id === id);
 if (idx > -1) { MOCK_BRANDS[idx].deletedAt = new Date().toISOString(); MOCK_BRANDS[idx].status = 'archived'; await persistBrands(); }
 }
};

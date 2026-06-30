export interface RevenueData {
  name: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  image: string;
}

export interface DeviceData {
  name: string;
  value: number;
}

export interface AnalyticsSummary {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  conversionRate: number;
  revenueGrowth: number;
  ordersGrowth: number;
  customersGrowth: number;
  conversionGrowth: number;
}

export const mockRevenueData: RevenueData[] = [
  { name: 'يناير', revenue: 125000, orders: 120 },
  { name: 'فبراير', revenue: 140000, orders: 135 },
  { name: 'مارس', revenue: 110000, orders: 105 },
  { name: 'أبريل', revenue: 180000, orders: 160 },
  { name: 'مايو', revenue: 210000, orders: 190 },
  { name: 'يونيو', revenue: 250000, orders: 230 },
];

export const mockTopProducts: TopProduct[] = [
  { id: 'prod_1', name: 'فستان سهرة حريري', sales: 45, revenue: 562500, image: 'https://images.unsplash.com/photo-1566162200424-a5ab04c40b8a?auto=format&fit=crop&q=80&w=100' },
  { id: 'prod_2', name: 'معطف شتوي كشمير', sales: 38, revenue: 912000, image: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?auto=format&fit=crop&q=80&w=100' },
  { id: 'prod_3', name: 'حقيبة كروس جلدية', sales: 120, revenue: 1020000, image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=100' },
];

export const mockDeviceData: DeviceData[] = [
  { name: 'الهاتف المحمول', value: 65 },
  { name: 'جهاز الكمبيوتر', value: 25 },
  { name: 'الجهاز اللوحي', value: 10 },
];

export const mockAnalyticsSummary: AnalyticsSummary = {
  totalRevenue: 1015000,
  revenueGrowth: 15.4,
  totalOrders: 940,
  ordersGrowth: 8.2,
  totalCustomers: 452,
  customersGrowth: 12.5,
  conversionRate: 3.2,
  conversionGrowth: -0.5,
};

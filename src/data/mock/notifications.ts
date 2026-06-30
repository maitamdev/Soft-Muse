import { mockStorage } from '@/lib/storage/mock-storage';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'customer' | 'system' | 'review';
  date: string;
  isRead: boolean;
  link?: string;
}

export let mockNotifications: Notification[] = [
  {
    id: 'notif_1',
    title: 'طلب جديد #ORD-7829',
    message: 'قام أحمد محمود بإنشاء طلب جديد بقيمة 14,400 جنيه.',
    type: 'order',
    date: new Date().toISOString(),
    isRead: false,
    link: '/admin/orders'
  },
  {
    id: 'notif_2',
    title: 'عميل جديد مسجل',
    message: 'سجلت منى حسين حساباً جديداً في المتجر.',
    type: 'customer',
    date: new Date(Date.now() - 3600000).toISOString(),
    isRead: false,
    link: '/admin/customers'
  },
  {
    id: 'notif_3',
    title: 'تقييم جديد بـ 5 نجوم',
    message: 'قامت سارة أحمد بتقييم فستان سهرة حريري.',
    type: 'review',
    date: new Date(Date.now() - 7200000).toISOString(),
    isRead: true,
    link: '/admin/reviews'
  },
  {
    id: 'notif_4',
    title: 'تحديث النظام المجدول',
    message: 'سيتم تحديث النظام غداً في الساعة 3 صباحاً بتوقيت القاهرة.',
    type: 'system',
    date: new Date(Date.now() - 86400000).toISOString(),
    isRead: true,
  }
];

mockNotifications = mockStorage.read('notifications', mockNotifications);

export const updateMockNotifications = (newNotifs: Notification[]) => {
  mockNotifications = newNotifs;
  mockStorage.write('notifications', newNotifs);
};

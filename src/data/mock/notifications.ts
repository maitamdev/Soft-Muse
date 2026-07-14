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
 title: 'đơn hàngMới #ORD-7829',
 message: 'đơn hàngMới 14,400.',
 type: 'order',
 date: new Date().toISOString(),
 isRead: false,
 link: '/admin/orders'
 },
 {
 id: 'notif_2',
 title: 'khách hàngMới ',
 message: 'MớitrongCửa hàng.',
 type: 'customer',
 date: new Date(Date.now() - 3600000).toISOString(),
 isRead: false,
 link: '/admin/customers'
 },
 {
 id: 'notif_3',
 title: 'Mới ـ 5 ',
 message: '.',
 type: 'review',
 date: new Date(Date.now() - 7200000).toISOString(),
 isRead: true,
 link: '/admin/reviews'
 },
 {
 id: 'notif_4',
 title: '',
 message: 'trong 3.',
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

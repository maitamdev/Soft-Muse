"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/admin/design-system/Button';
import { IconAlertTriangle, IconRefresh, IconArrowRight } from '@tabler/icons-react';

/**
 * Route-level error boundary for the order details page. Guarantees that any
 * runtime exception renders a recoverable error state — never a white screen.
 */
export default function OrderDetailsError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
 const router = useRouter();

 useEffect(() => {
 console.error('Order details page error:', error);
 }, [error]);

 return (
 <div className="max-w-xl mx-auto text-center py-20 flex flex-col items-center gap-5"> <div className="w-14 h-14 rounded-full bg-[var(--admin-danger-muted)] flex items-center justify-center"> <IconAlertTriangle size={28} className="text-[var(--admin-danger)]" /> </div> <div> <h2 className="text-2xl font-bold text-[var(--admin-text-base)] mb-2">tảiChi tiết Đơn hàng</h2> <p className="text-sm text-[var(--admin-text-muted)]">
 Đã xảy ra lỗi không mong muốn hiển thị nàyĐơn hàng. đếnĐơn hàng.
 </p> </div> <div className="flex items-center gap-3"> <Button variant="primary" onClick={() => reset()} leftIcon={<IconRefresh size={18} />}> </Button> <Button variant="secondary" onClick={() => router.push('/admin/orders')} leftIcon={<IconArrowRight size={18} />}>
 đếnĐơn hàng
 </Button> </div> </div>
 );
}

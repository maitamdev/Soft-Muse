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
    <div className="max-w-xl mx-auto text-center py-20 flex flex-col items-center gap-5">
      <div className="w-14 h-14 rounded-full bg-[var(--admin-danger-muted)] flex items-center justify-center">
        <IconAlertTriangle size={28} className="text-[var(--admin-danger)]" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-[var(--admin-text-base)] mb-2">تعذر تحميل تفاصيل الطلب</h2>
        <p className="text-sm text-[var(--admin-text-muted)]">
          حدث خطأ غير متوقع أثناء عرض هذا الطلب. يمكنكِ إعادة المحاولة أو العودة إلى قائمة الطلبات.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="primary" onClick={() => reset()} leftIcon={<IconRefresh size={18} />}>
          إعادة المحاولة
        </Button>
        <Button variant="secondary" onClick={() => router.push('/admin/orders')} leftIcon={<IconArrowRight size={18} />}>
          العودة إلى الطلبات
        </Button>
      </div>
    </div>
  );
}

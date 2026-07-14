import type { Metadata } from 'next';
import { generatePageMetadata } from '@/utils/seo-helper';

export async function generateMetadata(): Promise<Metadata> {
 return generatePageMetadata(
 'tracking',
 'Theo dõi đơn hàng | Soft Muse',
 'Tra cứu tình trạng đơn hàng Soft Muse bằng mã đơn hoặc số điện thoại.'
 );
}

export default function TrackingLayout({ children }: { children: React.ReactNode }) {
 return <>{children}</>;
}

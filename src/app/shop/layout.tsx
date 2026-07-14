import type { Metadata } from 'next';
import { generatePageMetadata } from '@/utils/seo-helper';

export async function generateMetadata(): Promise<Metadata> {
 return generatePageMetadata(
 'shop',
 'Sản phẩm | Soft Muse',
 'Mua áo sơ mi, áo kiểu, chân váy, váy, quần tây, blazer, set đồ và phụ kiện Soft Muse.'
 );
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
 return <>{children}</>;
}

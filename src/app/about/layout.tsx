import type { Metadata } from 'next';
import { generatePageMetadata } from '@/utils/seo-helper';

export async function generateMetadata(): Promise<Metadata> {
 return generatePageMetadata(
 'about',
 'Giới thiệu | Soft Muse',
 'Soft Muse là thương hiệu thời trang công sở nữ thanh lịch, tinh tế và có mức giá hợp lý.'
 );
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
 return <>{children}</>;
}

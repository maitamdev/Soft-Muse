import type { Metadata } from 'next';
import { generatePageMetadata } from '@/utils/seo-helper';

export async function generateMetadata(): Promise<Metadata> {
 return generatePageMetadata(
 'journal',
 'AURA | Thời trang Thanh lịch',
 'AURA vềThời trang Thanh lịch Tay nghề.'
 );
}

export default function JournalLayout({ children }: { children: React.ReactNode }) {
 return <>{children}</>;
}

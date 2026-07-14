import type { Metadata } from 'next';
import { generatePageMetadata } from '@/utils/seo-helper';

export async function generateMetadata(): Promise<Metadata> {
 return generatePageMetadata(
 'reviews',
 'Ý kiến khách hàng | AURA',
 'AURA vớicouture.'
 );
}

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
 return <>{children}</>;
}

import { MetadataRoute } from 'next';
import { mockArticles } from '@/data/journal';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
 const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://softmuse.vn';

 // Static routes
 const routes = [
 '',
 '/shop',
 '/winter-fashion',
 '/summer-fashion',
 '/about',
 '/journal',
 ].map((route) => ({
 url: `${baseUrl}${route}`,
 lastModified: new Date(),
 changeFrequency: 'daily' as const,
 priority: route === '' ? 1 : 0.8,
 }));

 // Product routes
 const { data: products } = isSupabaseConfigured
 ? await (await createClient()).from('products').select('id, updated_at').eq('status', 'published')
 : { data: [] };
 const productRoutes = (products ?? []).map((product) => ({
 url: `${baseUrl}/product/${product.id}`,
 lastModified: new Date(product.updated_at),
 changeFrequency: 'weekly' as const,
 priority: 0.9,
 }));

 // Journal routes
 const journalRoutes = mockArticles.map((article) => ({
 url: `${baseUrl}/journal/${article.slug}`,
 lastModified: new Date(article.isoDate || new Date().toISOString()),
 changeFrequency: 'monthly' as const,
 priority: 0.7,
 }));

 return [...routes, ...productRoutes, ...journalRoutes];
}

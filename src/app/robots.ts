import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
 return {
 rules: {
 userAgent: '*',
 allow: '/',
 disallow: ['/profile', '/cart', '/checkout', '/tracking'],
 },
 sitemap: 'https://softmuse.vn/sitemap.xml',
 };
}

import type { Article } from '@/data/mock/journal';
import { defaultSEOData } from '@/data/mock/shared';
import { loadAdminSetting, saveAdminSetting } from './admin-settings-storage';

const loadArticles = () => loadAdminSetting<Article[]>('admin.journal', []);
const saveArticles = (articles: Article[]) => saveAdminSetting('admin.journal', articles);
function ensureUniqueSlug(articles: Article[], slug: string, exceptId?: string) {
 if (articles.some((article) => article.id !== exceptId && article.slug === slug)) throw new Error('Slug bài viết đã tồn tại.');
}

export const SupabaseJournalService = {
 async getArticles(): Promise<Article[]> { return (await loadArticles()).sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()); },
 async getArticle(id: string) { return (await loadArticles()).find((article) => article.id === id); },
 async getArticleBySlug(slug: string) { return (await loadArticles()).find((article) => article.slug === slug); },
 async createArticle(data: Partial<Article>): Promise<Article> {
  const articles = await loadArticles(); const slug = data.slug?.trim() || `new-article-${Date.now()}`; ensureUniqueSlug(articles, slug);
  const article: Article = { id: crypto.randomUUID(), title: data.title?.trim() || 'Bài viết mới', slug, excerpt: data.excerpt || '', content: data.content || '', featuredImage: data.featuredImage || '', gallery: data.gallery || [], category: data.category || '', tags: data.tags || [], author: data.author || 'Admin', readingTime: Math.max(1, Number(data.readingTime || 1)), status: data.status || 'draft', isFeatured: data.isFeatured || false, publishDate: data.publishDate || new Date().toISOString(), seo: data.seo || { ...defaultSEOData, slug } };
  await saveArticles([...articles, article]); return article;
 },
 async updateArticle(id: string, data: Partial<Article>): Promise<Article> {
  const articles = await loadArticles(); const index = articles.findIndex((article) => article.id === id); if (index === -1) throw new Error('Không tìm thấy bài viết.'); if (data.slug) ensureUniqueSlug(articles, data.slug, id);
  const updated = { ...articles[index], ...data }; const next = [...articles]; next[index] = updated; await saveArticles(next); return updated;
 },
 async deleteArticle(id: string): Promise<void> { const articles = await loadArticles(); await saveArticles(articles.filter((article) => article.id !== id)); },
 async duplicateArticle(id: string): Promise<Article> {
  const articles = await loadArticles(); const original = articles.find((article) => article.id === id); if (!original) throw new Error('Không tìm thấy bài viết.');
  let slug = `${original.slug}-copy`; let suffix = 2; while (articles.some((article) => article.slug === slug)) slug = `${original.slug}-copy-${suffix++}`;
  const copy: Article = { ...original, id: crypto.randomUUID(), title: `${original.title} (Bản sao)`, slug, status: 'draft', publishDate: new Date().toISOString(), seo: { ...original.seo, slug } };
  await saveArticles([...articles, copy]); return copy;
 },
};

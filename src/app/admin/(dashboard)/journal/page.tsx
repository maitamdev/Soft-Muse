"use client";

import React, { useState, useEffect } from 'react';
import { JournalService } from '@/lib/services/journal.service';
import { Article } from '@/data/mock/journal';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils/formatters';
import Link from 'next/link';

// SaaS UI Components
import { PageHeader, EmptyState } from '@/components/admin/design-system/Layout';
import { Card } from '@/components/admin/design-system/Card';
import { Button } from '@/components/admin/design-system/Button';
import { Badge } from '@/components/admin/design-system/Badge';
import { Input } from '@/components/admin/design-system/Input';
import { DataTable, Column } from '@/components/admin/design-system/DataTable';

// Tabler Icons
import { 
 IconSearch, 
 IconPlus, 
 IconTrash, 
 IconCheck, 
 IconCopy, 
 IconEdit,
 IconPhoto,
 IconCalendar,
 IconArticle
} from '@tabler/icons-react';

export default function JournalPage() {
 const [articles, setArticles] = useState<Article[]>([]);
 const [loading, setLoading] = useState(true);
 const [search, setSearch] = useState('');

 const loadArticles = async () => {
 setLoading(true);
 try {
 const data = await JournalService.getArticles();
 setArticles(data);
 } catch {
 toast.error('Đã xảy ra lỗi trong tải');
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 loadArticles();
 }, []);

 const handleDelete = async (id: string) => {
 if (confirm('Xóa ؟')) {
 await JournalService.deleteArticle(id);
 toast.success('đãXóa');
 loadArticles();
 }
 };

 const handleDuplicate = async (id: string) => {
 await JournalService.duplicateArticle(id);
 toast.success('đãNháp');
 loadArticles();
 };

 const handleStatusChange = async (id: string, newStatus: 'published' | 'draft' | 'archived') => {
 await JournalService.updateArticle(id, { status: newStatus });
 toast.success('đã');
 loadArticles();
 };

 const filtered = articles.filter(a => a.title.toLowerCase().includes(search.toLowerCase()) || a.category.toLowerCase().includes(search.toLowerCase()));

 const columns: Column<Article>[] = [
 { 
 header: '', 
 accessor: 'title', 
 render: (_, article) => (
 <div className="flex items-center gap-4"> <div className="w-16 h-12 bg-[var(--admin-bg-elevated)] rounded-[var(--admin-radius-sm)] border border-[var(--admin-border-base)] overflow-hidden shrink-0">
 {article.featuredImage ? (
 <img src={article.featuredImage} alt={article.title} className="w-full h-full object-cover" />
 ) : (
 <div className="w-full h-full flex items-center justify-center text-[var(--admin-text-subtle)]"><IconPhoto size={20}/></div>
 )}
 </div> <div> <p className="font-semibold text-sm text-[var(--admin-text-base)] line-clamp-1">{article.title}</p> <div className="flex items-center gap-2 mt-1.5"> <Badge variant="info" className="px-1.5 py-0">{article.category}</Badge>
 {article.isFeatured && <Badge variant="warning" className="px-1.5 py-0"></Badge>}
 </div> </div> </div>
 )
 },
 { 
 header: '', 
 accessor: 'author', 
 render: (_, article) => (
 <div> <p className="text-sm font-medium text-[var(--admin-text-base)]">{article.author}</p> <p className="text-xs text-[var(--admin-text-muted)] mt-1 tabular-nums">{article.readingTime} Đọc</p> </div>
 )
 },
 { 
 header: '', 
 accessor: 'publishDate', 
 render: (_, article) => (
 <div className="flex items-center gap-1.5 text-sm text-[var(--admin-text-subtle)] tabular-nums"> <IconCalendar size={16} /> <span dir="ltr">{formatDate(article.publishDate)}</span> </div>
 )
 },
 { 
 header: 'Trạng thái', 
 accessor: 'status', 
 render: (_, article) => (
 <Badge variant={
 article.status === 'published' ? 'success' :
 article.status === 'archived' ? 'neutral' :
 'warning'
 }>
 {article.status === 'published' ? 'Đã xuất bản' : article.status === 'archived' ? 'Đã lưu trữ' : 'Nháp'}
 </Badge>
 )
 },
 { 
 header: 'Thao tác', 
 accessor: 'id',
 render: (_, article) => (
 <div className="flex items-center justify-end gap-1"> <Button size="sm" variant="ghost" onClick={() => handleStatusChange(article.id, article.status === 'published' ? 'draft' : 'published')} title={article.status === 'published' ? 'Hủy ' : ''} className={article.status === 'published' ? 'text-[var(--admin-success)]' : 'text-[var(--admin-text-muted)] hover:text-[var(--admin-success)]'}> <IconCheck size={16}/> </Button> <Button size="sm" variant="ghost" onClick={() => handleDuplicate(article.id)} title="AURA" className="text-[var(--admin-info)]"> <IconCopy size={16}/> </Button> <Link href="/admin/journal/new"> <Button size="sm" variant="ghost" title="Sửa" className="text-[var(--admin-text-base)]"> <IconEdit size={16}/> </Button> </Link> <Button size="sm" variant="ghost" onClick={() => handleDelete(article.id)} title="Xóa" className="text-[var(--admin-danger)]"> <IconTrash size={16}/> </Button> </div>
 )
 }
 ];

 return (
 <div className="space-y-6 max-w-7xl mx-auto pb-20"> <PageHeader 
 title="Tạp chí ()"
 description="Quản lý bài viết và nội dung marketing."
 actions={
 <Link href="/admin/journal/new"> <Button leftIcon={<IconPlus size={18} />}>
 Mới
 </Button> </Link>
 }
 /> <Card className="p-4 flex flex-col gap-4"> <div className="flex flex-col sm:flex-row justify-between gap-4"> <Input 
 icon={<IconSearch size={18} />}
 placeholder="Tìm kiếm trong."
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 className="w-full sm:w-80"
 /> </div> <div className="mt-2"> <DataTable 
 columns={columns}
 data={filtered as any[]}
 isLoading={loading}
 emptyState={
 <EmptyState 
 icon={<IconArticle size={24} />}
 title="Không có "
 description="Không tìm thấy Tìm kiếm."
 action={
 <Button variant="secondary" onClick={() => setSearch('')}>
 Tìm kiếm
 </Button>
 }
 />
 }
 /> </div> </Card> </div>
 );
}

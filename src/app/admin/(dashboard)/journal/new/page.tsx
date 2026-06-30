"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { JournalService } from '@/lib/services/journal.service';
import { RichTextEditor } from '@/components/admin/ui/RichTextEditor';
import { MediaPicker } from '@/components/admin/ui/MediaPicker';
import { Media } from '@/data/mock/media';
import { toast } from 'sonner';

// SaaS UI Components
import { PageHeader } from '@/components/admin/design-system/Layout';
import { Card } from '@/components/admin/design-system/Card';
import { Button } from '@/components/admin/design-system/Button';
import { Input } from '@/components/admin/design-system/Input';

// Tabler Icons
import { 
  IconArrowRight, 
  IconDeviceFloppy, 
  IconSend, 
  IconPhoto
} from '@tabler/icons-react';

export default function NewArticlePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    category: 'عام',
    author: 'المدير',
    readingTime: 5,
    isFeatured: false,
    metaTitle: '',
    metaDescription: ''
  });

  const handleSave = async (status: 'published' | 'draft') => {
    if (!formData.title || !formData.content) {
      toast.error('يرجى ملء العنوان والمحتوى على الأقل');
      return;
    }

    setLoading(true);
    try {
      await JournalService.createArticle({
        ...formData,
        status,
        seo: {
          metaTitle: formData.metaTitle || formData.title,
          metaDescription: formData.metaDescription || formData.excerpt,
          canonical: '', slug: formData.slug, keywords: '', robots: 'index, follow',
          ogTitle: '', ogDescription: '', ogImage: '', twitterTitle: '', twitterDescription: '', twitterImage: ''
        }
      });
      toast.success(status === 'published' ? 'تم نشر المقال' : 'تم حفظ المسودة');
      router.push('/admin/journal');
    } catch {
      toast.error('حدث خطأ أثناء الحفظ');
    } finally {
      setLoading(false);
    }
  };

  const handleMediaSelect = (media: Media | Media[]) => {
    const selected = Array.isArray(media) ? media[0] : media;
    if (selected) {
      setFormData(prev => ({ ...prev, featuredImage: selected.url }));
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-6" dir="rtl">
      
      <PageHeader 
        title="مقال جديد"
        description="المحرر الذكي للمقالات (CMS)."
        actions={
          <div className="flex gap-3">
            <Button 
              variant="secondary"
              disabled={loading}
              onClick={() => handleSave('draft')}
              leftIcon={<IconDeviceFloppy size={18} />}
            >
              حفظ مسودة
            </Button>
            <Button 
              disabled={loading}
              onClick={() => handleSave('published')}
              leftIcon={<IconSend size={18} />}
            >
              نشر المقال
            </Button>
          </div>
        }
        backLink="/admin/journal"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[var(--admin-text-base)] mb-1.5">عنوان المقال *</label>
              <Input 
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="أدخل عنوان المقال الجذاب..."
                className="font-serif text-lg py-3"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-[var(--admin-text-base)] mb-1.5">محتوى المقال *</label>
              <div className="mt-1 border border-[var(--admin-border-base)] rounded-[var(--admin-radius-md)] overflow-hidden focus-within:border-[var(--admin-primary)] focus-within:ring-1 focus-within:ring-[var(--admin-primary)] transition-all">
                <RichTextEditor 
                  value={formData.content} 
                  onChange={val => setFormData(prev => ({ ...prev, content: val }))} 
                  minHeight="500px"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-5">
            <h2 className="font-semibold text-lg text-[var(--admin-text-base)] border-b border-[var(--admin-border-light)] pb-3">تحسين محركات البحث (SEO)</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[var(--admin-text-base)] mb-1.5">العنوان التعريفي (Meta Title)</label>
                <Input 
                  value={formData.metaTitle}
                  onChange={e => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                  placeholder={formData.title || "عنوان SEO..."}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--admin-text-base)] mb-1.5">الوصف التعريفي (Meta Description)</label>
                <textarea 
                  value={formData.metaDescription}
                  onChange={e => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                  className="w-full px-4 py-2 bg-[var(--admin-bg-base)] border border-[var(--admin-border-base)] rounded-[var(--admin-radius-md)] outline-none focus:border-[var(--admin-primary)] focus:ring-1 focus:ring-[var(--admin-primary)] text-sm min-h-[100px] resize-y"
                  placeholder="وصف مختصر للمقال يظهر في نتائج بحث جوجل..."
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="p-6 space-y-5">
            <h2 className="font-semibold text-[var(--admin-text-base)] border-b border-[var(--admin-border-light)] pb-3">الصورة البارزة</h2>
            <div 
              onClick={() => setMediaPickerOpen(true)}
              className="w-full aspect-video bg-[var(--admin-bg-elevated)] border-2 border-dashed border-[var(--admin-border-base)] rounded-[var(--admin-radius-lg)] flex flex-col items-center justify-center cursor-pointer hover:border-[var(--admin-primary)] hover:bg-[var(--admin-primary-muted)] transition-all overflow-hidden relative group"
            >
              {formData.featuredImage ? (
                <>
                  <img src={formData.featuredImage} alt="Featured" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-medium text-sm">تغيير الصورة</span>
                  </div>
                </>
              ) : (
                <>
                  <IconPhoto size={32} className="text-[var(--admin-text-subtle)] mb-2 group-hover:text-[var(--admin-primary)] transition-colors" stroke={1.5} />
                  <span className="text-sm font-medium text-[var(--admin-text-muted)] group-hover:text-[var(--admin-primary)] transition-colors">انقر لاختيار صورة</span>
                </>
              )}
            </div>
          </Card>

          <Card className="p-6 space-y-5">
            <h2 className="font-semibold text-[var(--admin-text-base)] border-b border-[var(--admin-border-light)] pb-3">التنظيم</h2>
            
            <div>
              <label className="block text-sm font-medium text-[var(--admin-text-base)] mb-1.5">الرابط (Slug)</label>
              <Input 
                value={formData.slug}
                onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                dir="ltr"
                placeholder="article-url-slug"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--admin-text-base)] mb-1.5">القسم</label>
              <select 
                value={formData.category}
                onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-2 bg-[var(--admin-bg-base)] border border-[var(--admin-border-base)] rounded-[var(--admin-radius-md)] outline-none focus:border-[var(--admin-primary)] focus:ring-1 focus:ring-[var(--admin-primary)] text-sm"
              >
                <option value="عام">عام</option>
                <option value="صيحات الموضة">صيحات الموضة</option>
                <option value="نصائح أزياء">نصائح أزياء</option>
                <option value="أخبار العلامة">أخبار العلامة</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--admin-text-base)] mb-1.5">وقت القراءة (دقائق)</label>
              <Input 
                type="number" 
                min={1}
                value={formData.readingTime}
                onChange={e => setFormData(prev => ({ ...prev, readingTime: parseInt(e.target.value) || 1 }))}
              />
            </div>
            
            <label className="flex items-center gap-3 cursor-pointer mt-4 p-3 bg-[var(--admin-bg-elevated)] border border-[var(--admin-border-light)] rounded-[var(--admin-radius-md)] hover:border-[var(--admin-primary)] transition-colors">
              <input 
                type="checkbox" 
                checked={formData.isFeatured}
                onChange={e => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                className="w-4 h-4 rounded text-[var(--admin-primary)] focus:ring-[var(--admin-primary)] border-[var(--admin-border-strong)]"
              />
              <span className="text-sm font-medium text-[var(--admin-text-base)]">مقال مميز (Featured)</span>
            </label>
          </Card>
        </div>

      </div>

      <MediaPicker 
        open={mediaPickerOpen} 
        onClose={() => setMediaPickerOpen(false)} 
        onSelect={handleMediaSelect}
        allowedTypes={['image']}
      />
    </div>
  );
}

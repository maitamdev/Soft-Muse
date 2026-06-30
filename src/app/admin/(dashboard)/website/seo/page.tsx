"use client";

import React, { useState, useEffect } from "react";
import { IconDeviceFloppy, IconBrandGoogle } from "@tabler/icons-react";
import { toast } from "sonner";
import { Button } from "@/components/admin/design-system/Button";
import { FadeIn } from "@/components/admin/ui/motion";
import { SEOService, SEOSettings } from "@/lib/services/storefront/seo.service";

export default function SEOManager() {
  const [seo, setSeo] = useState<SEOSettings[]>([]);
  const [activePage, setActivePage] = useState<SEOSettings['page']>('global');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);


  async function loadSEO() {
    try {
      const data = await SEOService.getAll();
      setSeo(data);
    } catch (e) {
      toast.error("Failed to load SEO settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSEO();
  }, []);

  const currentSEO = seo.find(s => s.page === activePage) || {
    id: `seo-${activePage}`,
    page: activePage,
    title: '',
    description: '',
    keywords: '',
    ogImage: '',
    twitterCard: 'summary_large_image',
    robots: 'index, follow',
    jsonLd: true
  } as SEOSettings;

  const updateField = (field: keyof SEOSettings, value: any) => {
    const updated = { ...currentSEO, [field]: value };
    const exists = seo.find(s => s.page === activePage);
    if (exists) {
      setSeo(seo.map(s => s.page === activePage ? updated : s));
    } else {
      setSeo([...seo, updated]);
    }
  };

  const saveSEO = async () => {
    setSaving(true);
    try {
      await SEOService.update(currentSEO.id, currentSEO);
      toast.success("SEO settings saved");
    } catch (e) {
      toast.error("Failed to save SEO");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 animate-pulse">Loading SEO manager...</div>;
  }

  return (
    <FadeIn className="space-y-6 max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
      {/* Settings Form */}
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-end">
          <Button
            variant="primary"
            size="md"
            leftIcon={<IconDeviceFloppy size={18} />}
            onClick={saveSEO}
            loading={saving}
          >
            حفظ الإعدادات
          </Button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 border-b border-[var(--admin-border-light)] custom-scrollbar">
          {['global', 'homepage', 'products', 'categories', 'collections'].map(page => (
            <button
              key={page}
              onClick={() => setActivePage(page as any)}
              className={`px-4 py-2 rounded-t-[var(--admin-radius-md)] text-sm font-bold transition-colors whitespace-nowrap capitalize ${
                activePage === page
                  ? "bg-[var(--admin-bg-surface)] text-[var(--admin-primary)] border-t-2 border-[var(--admin-primary)] shadow-sm"
                  : "text-[var(--admin-text-muted)] hover:text-[var(--admin-text-base)] hover:bg-[var(--admin-bg-hover)]"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <div className="bg-[var(--admin-bg-surface)] rounded-[var(--admin-radius-xl)] border border-[var(--admin-border-base)] p-6 space-y-6">
          <div>
            <label className="block text-sm font-bold text-[var(--admin-text-base)] mb-1.5">Meta Title</label>
            <input
              type="text"
              value={currentSEO.title}
              onChange={e => updateField('title', e.target.value)}
              placeholder="e.g. AURA Premium Fashion"
              className="w-full bg-[var(--admin-bg-base)] border border-[var(--admin-border-base)] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)]"
            />
            <p className="text-xs text-[var(--admin-text-muted)] mt-1.5">Recommended: 50-60 characters (Current: {currentSEO.title.length})</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-[var(--admin-text-base)] mb-1.5">Meta Description</label>
            <textarea
              value={currentSEO.description}
              onChange={e => updateField('description', e.target.value)}
              rows={3}
              className="w-full bg-[var(--admin-bg-base)] border border-[var(--admin-border-base)] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)]"
            />
            <p className="text-xs text-[var(--admin-text-muted)] mt-1.5">Recommended: 150-160 characters (Current: {currentSEO.description.length})</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-[var(--admin-text-base)] mb-1.5">Keywords</label>
            <input
              type="text"
              value={currentSEO.keywords}
              onChange={e => updateField('keywords', e.target.value)}
              placeholder="fashion, clothes, premium..."
              className="w-full bg-[var(--admin-bg-base)] border border-[var(--admin-border-base)] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)]"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[var(--admin-text-base)] mb-1.5">Robots Meta</label>
            <input
              type="text"
              value={currentSEO.robots}
              onChange={e => updateField('robots', e.target.value)}
              className="w-full bg-[var(--admin-bg-base)] border border-[var(--admin-border-base)] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)]"
            />
          </div>
        </div>
      </div>

      {/* Google SERP Preview */}
      <div className="w-full md:w-[400px] shrink-0">
        <div className="bg-white border border-gray-200 rounded-[var(--admin-radius-lg)] p-4 shadow-sm font-sans">
          <div className="flex items-center gap-2 mb-4 text-gray-500 text-sm font-medium">
            <IconBrandGoogle size={18} /> Google Search Preview
          </div>
          <div className="flex flex-col gap-1 text-left" dir="ltr">
            <div className="text-[14px] text-gray-800 flex items-center gap-2">
              <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center font-bold text-xs">A</div>
              <div>
                <p className="text-[14px] leading-tight">AURA</p>
                <p className="text-[12px] text-gray-500 leading-tight">https://aurabrand.com</p>
              </div>
            </div>
            <h3 className="text-[20px] text-[#1a0dab] hover:underline cursor-pointer truncate font-medium">
              {currentSEO.title || 'Page Title'}
            </h3>
            <p className="text-[14px] text-[#4d5156] line-clamp-2 leading-[1.58]">
              {currentSEO.description || 'Provide a meta description by editing the fields to see how it will appear in search results.'}
            </p>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

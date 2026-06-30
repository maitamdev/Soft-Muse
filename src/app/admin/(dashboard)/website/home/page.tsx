"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  IconPlus, IconTrash, IconEye, IconEyeOff, IconHomeEdit,
  IconCopy, IconChevronLeft, IconChevronDown, IconGripVertical,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { Button } from "@/components/admin/design-system/Button";
import { CMSPreviewPanel, DeviceView } from "@/components/admin/storefront/CMSPreviewPanel";
import { SortableList } from "@/components/admin/dnd/SortableList";
import { SortableItem } from "@/components/admin/dnd/SortableItem";
import { FadeIn } from "@/components/admin/ui/motion";
import {
  HomepageService, HomepageSection, HomepageSectionType,
  SECTION_TYPE_LABELS_AR,
} from "@/lib/services/storefront/homepage.service";
import { useEventSubscribeMany } from "@/hooks/useEventBus";
import { REFRESH_EVENTS } from "@/lib/events/refresh-events";
import { cn } from "@/utils/cn";

const ADDABLE_TYPES: HomepageSectionType[] = [
  'hero', 'featured_collections', 'featured_products', 'best_sellers',
  'new_arrivals', 'testimonials', 'instagram', 'newsletter', 'custom_html',
];

export default function HomepageBuilder() {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<DeviceView>("desktop");
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [realProducts, setRealProducts] = useState<any[]>([]);

  const loadSections = useCallback(async () => {
    try {
      const data = await HomepageService.getSections();
      setSections(data);
    } catch {
      toast.error("فشل في تحميل أقسام الصفحة");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSections();
    import("@/lib/services/product.service").then((mod) => {
      mod.ProductService.getProducts().then(setRealProducts);
    });
  }, [loadSections]);

  // Live-sync with any other Website Manager tab editing the same content.
  useEventSubscribeMany(REFRESH_EVENTS.website, loadSections);

  const activeSection = sections.find((s) => s.id === activeSectionId) || null;

  const handleReorder = async (newSections: HomepageSection[]) => {
    const ordered = newSections.map((s, idx) => ({ ...s, order: idx }));
    setSections(ordered);
    setIsUpdating(true);
    try {
      await HomepageService.updateSections(ordered);
    } catch {
      toast.error("فشل في إعادة الترتيب");
      loadSections();
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddSection = async (type: HomepageSectionType) => {
    setAddMenuOpen(false);
    setIsUpdating(true);
    try {
      const created = await HomepageService.addSection(type);
      await loadSections();
      setActiveSectionId(created.id);
      toast.success("تمت إضافة القسم");
    } catch {
      toast.error("فشل في إضافة القسم");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDuplicate = async (id: string) => {
    setIsUpdating(true);
    try {
      const copy = await HomepageService.duplicateSection(id);
      await loadSections();
      setActiveSectionId(copy.id);
      toast.success("تم تكرار القسم");
    } catch {
      toast.error("فشل في تكرار القسم");
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleSection = async (id: string, currentStatus: boolean) => {
    setIsUpdating(true);
    try {
      await HomepageService.updateSection(id, { enabled: !currentStatus });
      setSections((s) => s.map((sec) => (sec.id === id ? { ...sec, enabled: !currentStatus } : sec)));
      toast.success(currentStatus ? "تم إخفاء القسم" : "تم تفعيل القسم");
    } catch {
      toast.error("فشل في تحديث القسم");
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteSection = async (id: string) => {
    setIsUpdating(true);
    try {
      await HomepageService.deleteSection(id);
      setSections((s) => s.filter((sec) => sec.id !== id));
      if (activeSectionId === id) setActiveSectionId(null);
      toast.success("تم حذف القسم");
    } catch {
      toast.error("فشل في حذف القسم");
    } finally {
      setIsUpdating(false);
    }
  };

  // Patch a section's top-level fields, persisting + updating local state for a live preview.
  const patchSection = async (id: string, updates: Partial<HomepageSection>) => {
    setSections((s) => s.map((sec) => (sec.id === id ? { ...sec, ...updates } : sec)));
    try {
      await HomepageService.updateSection(id, updates);
    } catch {
      toast.error("فشل في حفظ التعديل");
      loadSections();
    }
  };

  const patchSettings = (id: string, settingsPatch: Record<string, any>) => {
    const sec = sections.find((s) => s.id === id);
    if (!sec) return;
    patchSection(id, { settings: { ...sec.settings, ...settingsPatch } });
  };

  if (loading) {
    return <div className="p-8 animate-pulse text-[var(--admin-text-muted)]">جاري تحميل المُنشئ...</div>;
  }

  return (
    <FadeIn className="h-[calc(100vh-180px)] min-h-[560px] flex flex-col md:flex-row bg-[var(--admin-bg-base)] rounded-[var(--admin-radius-xl)] overflow-hidden border border-[var(--admin-border-base)]">
      {/* Left Panel: Editor Controls */}
      <div className="w-full md:w-[380px] shrink-0 border-r border-[var(--admin-border-base)] flex flex-col h-full bg-[var(--admin-bg-surface)]">

        {activeSection ? (
          /* ── Section property editor ── */
          <SectionEditor
            section={activeSection}
            onBack={() => setActiveSectionId(null)}
            onPatch={(updates) => patchSection(activeSection.id, updates)}
            onPatchSettings={(patch) => patchSettings(activeSection.id, patch)}
          />
        ) : (
          <>
            <div className="p-4 border-b border-[var(--admin-border-light)] flex items-center justify-between relative">
              <div className="flex items-center gap-2 text-[var(--admin-text-base)]">
                <IconHomeEdit size={20} className="text-[var(--admin-primary)]" />
                <h1 className="font-bold">مُنشئ الصفحة الرئيسية</h1>
              </div>
              <div className="relative">
                <Button variant="primary" size="sm" leftIcon={<IconPlus size={16} />} rightIcon={<IconChevronDown size={14} />} onClick={() => setAddMenuOpen((o) => !o)}>
                  إضافة قسم
                </Button>
                {addMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setAddMenuOpen(false)} />
                    <div className="absolute end-0 mt-2 w-56 z-20 bg-[var(--admin-bg-base)] border border-[var(--admin-border-base)] rounded-[var(--admin-radius-md)] shadow-[var(--admin-shadow-lg)] py-1 max-h-72 overflow-y-auto">
                      {ADDABLE_TYPES.map((type) => (
                        <button
                          key={type}
                          onClick={() => handleAddSection(type)}
                          className="w-full text-start px-4 py-2 text-sm text-[var(--admin-text-base)] hover:bg-[var(--admin-bg-hover)] transition-colors"
                        >
                          {SECTION_TYPE_LABELS_AR[type]}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {sections.length === 0 ? (
                <div className="text-center py-12 text-[var(--admin-text-muted)] text-sm">
                  لا توجد أقسام بعد. أضف قسماً للبدء.
                </div>
              ) : (
                <SortableList
                  items={sections}
                  keyExtractor={(s) => s.id}
                  onReorder={handleReorder}
                  renderItem={(section) => (
                    <SortableItem id={section.id} key={section.id} className="group">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0 flex-1 cursor-pointer" onClick={() => setActiveSectionId(section.id)}>
                          <IconGripVertical size={16} className="text-[var(--admin-text-subtle)] shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-[var(--admin-text-base)] truncate">{section.title}</p>
                            <p className="text-xs text-[var(--admin-text-muted)] font-medium mt-0.5">{SECTION_TYPE_LABELS_AR[section.type]}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <button onClick={() => toggleSection(section.id, section.enabled)} title={section.enabled ? "إخفاء" : "إظهار"} className="p-1.5 text-[var(--admin-text-subtle)] hover:text-[var(--admin-text-base)] rounded-md hover:bg-[var(--admin-bg-hover)]">
                            {section.enabled ? <IconEye size={16} /> : <IconEyeOff size={16} />}
                          </button>
                          <button onClick={() => handleDuplicate(section.id)} title="تكرار" className="p-1.5 text-[var(--admin-text-subtle)] hover:text-[var(--admin-info)] rounded-md hover:bg-[var(--admin-bg-hover)]">
                            <IconCopy size={16} />
                          </button>
                          <button onClick={() => deleteSection(section.id)} title="حذف" className="p-1.5 text-[var(--admin-danger-muted)] hover:text-[var(--admin-danger)] rounded-md hover:bg-[var(--admin-danger)]/10">
                            <IconTrash size={16} />
                          </button>
                        </div>
                      </div>
                    </SortableItem>
                  )}
                />
              )}
            </div>
          </>
        )}
      </div>

      {/* Right Panel: Live Preview */}
      <div className="flex-1 min-w-0 h-full p-4 pl-0">
        <CMSPreviewPanel view={view} onViewChange={setView} title="معاينة المتجر" isUpdating={isUpdating}>
          <div className="flex flex-col gap-8 pb-20 w-full min-h-full font-sans">
            {sections.filter((s) => s.enabled).length === 0 && (
              <div className="py-20 text-center text-slate-400">لا توجد أقسام مفعّلة للعرض</div>
            )}
            {sections.filter((s) => s.enabled).map((section) => (
              <div
                key={section.id}
                className={cn("relative border-2 border-transparent transition-colors cursor-pointer", activeSectionId === section.id && "border-blue-500 rounded-lg p-2")}
                onClick={() => setActiveSectionId(section.id)}
              >
                <SectionPreview section={section} products={realProducts} />
                {activeSectionId === section.id && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded shadow">يتم التحرير</div>
                )}
              </div>
            ))}
          </div>
        </CMSPreviewPanel>
      </div>
    </FadeIn>
  );
}

/* ───────────────────────── Section property editor ───────────────────────── */
function SectionEditor({
  section, onBack, onPatch, onPatchSettings,
}: {
  section: HomepageSection;
  onBack: () => void;
  onPatch: (updates: Partial<HomepageSection>) => void;
  onPatchSettings: (patch: Record<string, any>) => void;
}) {
  const inputCls = "w-full bg-[var(--admin-bg-base)] border border-[var(--admin-border-base)] rounded-[var(--admin-radius-md)] px-3 py-2 text-sm text-[var(--admin-text-base)] outline-none focus:border-[var(--admin-primary)] transition-colors";
  const labelCls = "block text-xs font-semibold text-[var(--admin-text-muted)] mb-1";
  const s = section.settings || {};

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-[var(--admin-border-light)] flex items-center gap-2">
        <button onClick={onBack} className="p-1.5 rounded-md hover:bg-[var(--admin-bg-hover)] text-[var(--admin-text-muted)]">
          <IconChevronLeft size={18} />
        </button>
        <div className="min-w-0">
          <p className="font-bold text-sm text-[var(--admin-text-base)] truncate">{section.title}</p>
          <p className="text-xs text-[var(--admin-text-muted)]">{SECTION_TYPE_LABELS_AR[section.type]}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        <div>
          <label className={labelCls}>العنوان</label>
          <input className={inputCls} value={section.title} onChange={(e) => onPatch({ title: e.target.value })} />
        </div>
        <div>
          <label className={labelCls}>العنوان الفرعي</label>
          <input className={inputCls} value={section.subtitle || ""} onChange={(e) => onPatch({ subtitle: e.target.value })} />
        </div>

        <label className="flex items-center justify-between p-3 border border-[var(--admin-border-base)] rounded-[var(--admin-radius-md)] bg-[var(--admin-bg-elevated)] cursor-pointer">
          <span className="text-sm font-medium text-[var(--admin-text-base)]">مفعّل (يظهر في الصفحة)</span>
          <input type="checkbox" checked={section.enabled} onChange={(e) => onPatch({ enabled: e.target.checked })} className="w-5 h-5 accent-[var(--admin-primary)]" />
        </label>

        {/* Type-specific settings */}
        {section.type === "hero" && (
          <>
            <div>
              <label className={labelCls}>نص الزر الرئيسي</label>
              <input className={inputCls} value={s.ctaText || ""} onChange={(e) => onPatchSettings({ ctaText: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>رابط الزر الرئيسي</label>
              <input className={inputCls} value={s.ctaLink || ""} onChange={(e) => onPatchSettings({ ctaLink: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>نص الزر الثانوي</label>
              <input className={inputCls} value={s.secondaryCtaText || ""} onChange={(e) => onPatchSettings({ secondaryCtaText: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>رابط الزر الثانوي</label>
              <input className={inputCls} value={s.secondaryCtaLink || ""} onChange={(e) => onPatchSettings({ secondaryCtaLink: e.target.value })} />
            </div>
            <hr className="border-[var(--admin-border-light)]" />
            <p className="text-xs font-bold text-[var(--admin-text-muted)] uppercase">الشرائح (Slides)</p>
            {(s.slides as any[] || []).map((slide: any, idx: number) => (
              <div key={slide.id ?? idx} className="border border-[var(--admin-border-base)] rounded-[var(--admin-radius-md)] p-3 space-y-2">
                <p className="text-xs font-bold text-[var(--admin-text-base)]">الشريحة {idx + 1}</p>
                <div>
                  <label className={labelCls}>العنوان العربي</label>
                  <input className={inputCls} value={slide.title || ""} onChange={(e) => {
                    const updated = [...(s.slides || [])];
                    updated[idx] = { ...updated[idx], title: e.target.value };
                    onPatchSettings({ slides: updated });
                  }} />
                </div>
                <div>
                  <label className={labelCls}>العنوان الإنجليزي</label>
                  <input className={inputCls} value={slide.engTitle || ""} onChange={(e) => {
                    const updated = [...(s.slides || [])];
                    updated[idx] = { ...updated[idx], engTitle: e.target.value };
                    onPatchSettings({ slides: updated });
                  }} />
                </div>
                <div>
                  <label className={labelCls}>التسمية (Label)</label>
                  <input className={inputCls} value={slide.label || ""} onChange={(e) => {
                    const updated = [...(s.slides || [])];
                    updated[idx] = { ...updated[idx], label: e.target.value };
                    onPatchSettings({ slides: updated });
                  }} />
                </div>
                <div>
                  <label className={labelCls}>النص التوضيحي</label>
                  <textarea className={inputCls + " min-h-[60px] resize-y"} value={slide.subtitle || ""} onChange={(e) => {
                    const updated = [...(s.slides || [])];
                    updated[idx] = { ...updated[idx], subtitle: e.target.value };
                    onPatchSettings({ slides: updated });
                  }} />
                </div>
                <div>
                  <label className={labelCls}>رابط الصورة</label>
                  <input className={inputCls} value={slide.image || ""} onChange={(e) => {
                    const updated = [...(s.slides || [])];
                    updated[idx] = { ...updated[idx], image: e.target.value };
                    onPatchSettings({ slides: updated });
                  }} />
                </div>
              </div>
            ))}
          </>
        )}

        {["best_sellers", "featured_products", "new_arrivals", "featured_collections", "testimonials", "instagram"].includes(section.type) && (
          <div>
            <label className={labelCls}>عدد العناصر المعروضة</label>
            <input type="number" min={1} max={12} className={inputCls} value={s.limit ?? 4} onChange={(e) => onPatchSettings({ limit: Number(e.target.value) })} />
          </div>
        )}

        {section.type === "instagram" && (
          <div>
            <label className={labelCls}>حساب إنستغرام</label>
            <input className={inputCls} value={s.handle || ""} onChange={(e) => onPatchSettings({ handle: e.target.value })} />
          </div>
        )}

        {section.type === "custom_html" && (
          <div>
            <label className={labelCls}>HTML مخصص</label>
            <textarea className={inputCls + " min-h-[140px] font-mono text-xs"} value={s.html || ""} onChange={(e) => onPatchSettings({ html: e.target.value })} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ───────────────────────── Storefront preview renderer ───────────────────────── */
function SectionPreview({ section, products }: { section: HomepageSection; products: any[] }) {
  const s = section.settings || {};

  if (section.type === "hero") {
    return (
      <div className="relative w-full aspect-[21/9] min-h-[400px] bg-slate-200 overflow-hidden flex items-center justify-center rounded-xl mx-auto">
        {s.image && <img src={s.image} alt={section.title} className="absolute inset-0 w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-black" style={{ opacity: (s.overlayOpacity ?? 0) / 100 }} />
        <div className="relative z-10 text-center text-white px-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{section.title}</h2>
          {section.subtitle && <p className="text-lg md:text-xl mb-8">{section.subtitle}</p>}
          {s.ctaText && <button className="px-8 py-3 bg-white text-black font-semibold rounded-full">{s.ctaText}</button>}
        </div>
      </div>
    );
  }

  if (section.type === "newsletter") {
    return (
      <div className="px-4 md:px-8 py-14 mx-auto w-full max-w-3xl text-center">
        <h3 className="text-2xl font-bold mb-2">{section.title}</h3>
        {section.subtitle && <p className="text-gray-500 mb-6">{section.subtitle}</p>}
        <div className="flex max-w-md mx-auto">
          <input className="flex-1 border border-slate-300 px-4 py-3 text-sm" placeholder="بريدكِ الإلكتروني..." disabled />
          <button className="bg-black text-white px-6 text-sm font-semibold">انضمام</button>
        </div>
      </div>
    );
  }

  if (section.type === "custom_html") {
    // Render admin-authored custom HTML inside a fully sandboxed iframe (no allow-scripts,
    // no same-origin) so injected <script>/event handlers can never execute — prevents XSS.
    const html = s.html || "<p style='color:#94a3b8'>HTML مخصص</p>";
    return (
      <div className="px-4 md:px-8 py-8 mx-auto w-full max-w-7xl">
        <iframe
          title={`custom-html-${section.id}`}
          sandbox=""
          srcDoc={`<!doctype html><html dir="rtl"><head><meta charset="utf-8"></head><body style="margin:0;font-family:sans-serif">${html}</body></html>`}
          className="w-full min-h-[140px] border-0 bg-white"
        />
      </div>
    );
  }

  // Product / collection grids (best_sellers, featured_products, new_arrivals, featured_collections, testimonials, instagram)
  const limit = s.limit || 4;
  return (
    <div className="px-4 md:px-8 py-12 mx-auto w-full max-w-7xl">
      <h3 className="text-2xl font-bold text-center mb-2">{section.title}</h3>
      {section.subtitle && <p className="text-gray-500 text-center mb-10">{section.subtitle}</p>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.slice(0, limit).map((p) => (
          <div key={p.id} className="group relative aspect-[3/4] bg-slate-100 rounded-lg flex flex-col items-center justify-center border border-slate-200 overflow-hidden">
            <img src={p.media?.[0]?.url || p.images?.[0] || "https://via.placeholder.com/400"} className="absolute inset-0 w-full h-full object-cover" alt="" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="font-bold truncate text-sm">{p.title || p.name}</p>
              <p className="text-xs opacity-90">{p.price} ج.م</p>
            </div>
          </div>
        ))}
        {products.length === 0 && Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="aspect-[3/4] bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200">
            <span className="text-slate-400 font-medium text-sm">عنصر {i + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

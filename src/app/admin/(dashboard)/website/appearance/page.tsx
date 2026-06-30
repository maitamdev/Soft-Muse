"use client";

import React, { useState, useEffect } from "react";
import { IconPalette, IconDeviceFloppy } from "@tabler/icons-react";
import { toast } from "sonner";
import { Button } from "@/components/admin/design-system/Button";
import { CMSPreviewPanel, DeviceView } from "@/components/admin/storefront/CMSPreviewPanel";
import { FadeIn } from "@/components/admin/ui/motion";
import { AppearanceService, StoreAppearance } from "@/lib/services/storefront/appearance.service";

export default function AppearanceManager() {
  const [settings, setSettings] = useState<StoreAppearance | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState<DeviceView>("desktop");


  const loadSettings = async () => {
    try {
      const data = await AppearanceService.getSettings();
      setSettings(data);
    } catch (e) {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const updateSetting = <K extends keyof StoreAppearance>(key: K, value: StoreAppearance[K]) => {
    if (settings) {
      setSettings({ ...settings, [key]: value });
    }
  };

  const saveSettings = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await AppearanceService.updateSettings(settings);
      toast.success("Appearance saved");
    } catch (e) {
      toast.error("Failed to save appearance");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <div className="p-8 animate-pulse">Loading appearance...</div>;
  }

  return (
    <FadeIn className="h-[calc(100vh-180px)] min-h-[560px] flex flex-col md:flex-row bg-[var(--admin-bg-base)] rounded-[var(--admin-radius-xl)] overflow-hidden border border-[var(--admin-border-base)]">
      {/* Left Panel */}
      <div className="w-full md:w-[400px] shrink-0 border-r border-[var(--admin-border-base)] flex flex-col h-full bg-[var(--admin-bg-surface)]">
        <div className="p-4 border-b border-[var(--admin-border-light)] flex items-center justify-between sticky top-0 bg-[var(--admin-bg-surface)] z-10">
          <div className="flex items-center gap-2 text-[var(--admin-text-base)]">
            <IconPalette size={20} className="text-[var(--admin-primary)]" />
            <h1 className="font-bold">المظهر والتصميم</h1>
          </div>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<IconDeviceFloppy size={16} />}
            onClick={saveSettings}
            loading={saving}
          >
            حفظ
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-8">

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[var(--admin-text-muted)] uppercase">الهوية البصرية</h3>

            <div>
              <label className="block text-sm font-bold text-[var(--admin-text-base)] mb-1.5">الشعار (Logo)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={settings.logoUrl}
                  onChange={(e) => updateSetting('logoUrl', e.target.value)}
                  className="flex-1 bg-[var(--admin-bg-base)] border border-[var(--admin-border-base)] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--admin-primary)]"
                />
                <Button variant="secondary">رفع</Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[var(--admin-text-base)] mb-1.5">أيقونة المتصفح (Favicon)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={settings.faviconUrl}
                  onChange={(e) => updateSetting('faviconUrl', e.target.value)}
                  className="flex-1 bg-[var(--admin-bg-base)] border border-[var(--admin-border-base)] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--admin-primary)]"
                />
                <Button variant="secondary">رفع</Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[var(--admin-text-muted)] uppercase">الأسلوب العام</h3>

            <div>
              <label className="block text-sm font-bold text-[var(--admin-text-base)] mb-1.5">القالب (Theme Preset)</label>
              <select
                value={settings.themePreset}
                onChange={(e) => updateSetting('themePreset', e.target.value as any)}
                className="w-full bg-[var(--admin-bg-base)] border border-[var(--admin-border-base)] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--admin-primary)]"
              >
                <option value="luxury">Luxury (أسود وأبيض ذهبي)</option>
                <option value="modern">Modern (عصري ومبسط)</option>
                <option value="minimal">Minimal (ألوان هادئة جدًا)</option>
                <option value="playful">Playful (ألوان مبهجة)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-[var(--admin-text-base)] mb-1.5">الحواف (Border Radius)</label>
              <select
                value={settings.borderRadius}
                onChange={(e) => updateSetting('borderRadius', e.target.value as any)}
                className="w-full bg-[var(--admin-bg-base)] border border-[var(--admin-border-base)] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--admin-primary)]"
              >
                <option value="none">بدون حواف (None)</option>
                <option value="sm">صغير (SM)</option>
                <option value="md">متوسط (MD)</option>
                <option value="lg">كبير (LG)</option>
                <option value="full">دائري (Full)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-[var(--admin-text-base)] mb-1.5">عرض المحتوى (Container Width)</label>
              <select
                value={settings.containerWidth}
                onChange={(e) => updateSetting('containerWidth', e.target.value as any)}
                className="w-full bg-[var(--admin-bg-base)] border border-[var(--admin-border-base)] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--admin-primary)]"
              >
                <option value="md">متوسط (MD)</option>
                <option value="lg">كبير (LG)</option>
                <option value="xl">واسع (XL)</option>
                <option value="full">عرض كامل (Full)</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[var(--admin-text-muted)] uppercase">التأثيرات</h3>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.effects.hoverScale}
                onChange={(e) => updateSetting('effects', { ...settings.effects, hoverScale: e.target.checked })}
                className="w-4 h-4 rounded text-[var(--admin-primary)]"
              />
              <span className="text-sm font-bold text-[var(--admin-text-base)]">تكبير العناصر عند التمرير (Hover Scale)</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.effects.pageTransitions}
                onChange={(e) => updateSetting('effects', { ...settings.effects, pageTransitions: e.target.checked })}
                className="w-4 h-4 rounded text-[var(--admin-primary)]"
              />
              <span className="text-sm font-bold text-[var(--admin-text-base)]">حركة انتقال الصفحات (Page Transitions)</span>
            </label>
          </div>

        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 min-w-0 h-full p-4 pl-0">
        <CMSPreviewPanel view={view} onViewChange={setView} title="Appearance Preview" isUpdating={saving}>
          <div className={`w-full h-full min-h-[600px] flex flex-col font-sans p-8 ${settings.themePreset === 'luxury' ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'}`}>
            <header className="mb-12 flex justify-between items-center">
              <div className="text-3xl font-black">{settings.themePreset.toUpperCase()}</div>
              <div className="flex gap-4">
                <div className="font-semibold text-sm cursor-pointer">Shop</div>
                <div className="font-semibold text-sm cursor-pointer">About</div>
              </div>
            </header>

            <div className={`max-w-4xl mx-auto w-full ${settings.containerWidth === 'full' ? 'max-w-none px-4' : ''}`}>
              <div className={`aspect-video w-full flex items-center justify-center mb-8 ${settings.themePreset === 'luxury' ? 'bg-zinc-900 border border-zinc-800' : 'bg-white shadow-xl'}
                ${settings.borderRadius === 'none' ? 'rounded-none' : settings.borderRadius === 'sm' ? 'rounded-sm' : settings.borderRadius === 'md' ? 'rounded-md' : settings.borderRadius === 'lg' ? 'rounded-lg' : 'rounded-3xl'}
                ${settings.effects.hoverScale ? 'hover:scale-[1.02] transition-transform duration-300 cursor-pointer' : ''}
              `}>
                <span className="text-2xl font-bold opacity-50">Hero Section</span>
              </div>

              <div className="grid grid-cols-3 gap-6">
                {[1,2,3].map(i => (
                  <div key={i} className={`aspect-[3/4] flex items-center justify-center ${settings.themePreset === 'luxury' ? 'bg-zinc-900' : 'bg-white shadow-sm'}
                    ${settings.borderRadius === 'none' ? 'rounded-none' : settings.borderRadius === 'sm' ? 'rounded-sm' : settings.borderRadius === 'md' ? 'rounded-md' : settings.borderRadius === 'lg' ? 'rounded-lg' : 'rounded-2xl'}
                    ${settings.effects.hoverScale ? 'hover:scale-105 transition-transform duration-300 cursor-pointer' : ''}
                  `}>
                    <span className="text-sm font-semibold opacity-50">Product</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CMSPreviewPanel>
      </div>
    </FadeIn>
  );
}

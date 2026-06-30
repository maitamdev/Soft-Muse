"use client";

import React, { useState, useEffect } from "react";
import { IconLayoutBottombar, IconDeviceFloppy } from "@tabler/icons-react";
import { toast } from "sonner";
import { Button } from "@/components/admin/design-system/Button";
import { CMSPreviewPanel, DeviceView } from "@/components/admin/storefront/CMSPreviewPanel";
import { FadeIn } from "@/components/admin/ui/motion";
import { FooterService, FooterSettings } from "@/lib/services/storefront/footer.service";

export default function FooterBuilder() {
  const [settings, setSettings] = useState<FooterSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState<DeviceView>("desktop");


  async function loadSettings() {
    try {
      const data = await FooterService.getSettings();
      setSettings(data);
    } catch (e) {
      toast.error("Failed to load footer settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const updateSetting = <K extends keyof FooterSettings>(key: K, value: FooterSettings[K]) => {
    if (settings) {
      setSettings({ ...settings, [key]: value });
    }
  };

  const saveSettings = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await FooterService.updateSettings(settings);
      toast.success("Footer saved");
    } catch (e) {
      toast.error("Failed to save footer");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <div className="p-8 animate-pulse">Loading builder...</div>;
  }

  return (
    <FadeIn className="h-[calc(100vh-180px)] min-h-[560px] flex flex-col md:flex-row bg-[var(--admin-bg-base)] rounded-[var(--admin-radius-xl)] overflow-hidden border border-[var(--admin-border-base)]">
      {/* Left Panel */}
      <div className="w-full md:w-[400px] shrink-0 border-r border-[var(--admin-border-base)] flex flex-col h-full bg-[var(--admin-bg-surface)]">
        <div className="p-4 border-b border-[var(--admin-border-light)] flex items-center justify-between sticky top-0 bg-[var(--admin-bg-surface)] z-10">
          <div className="flex items-center gap-2 text-[var(--admin-text-base)]">
            <IconLayoutBottombar size={20} className="text-[var(--admin-primary)]" />
            <h1 className="font-bold">تذييل الصفحة (Footer)</h1>
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
            <h3 className="text-sm font-bold text-[var(--admin-text-muted)] uppercase">النشرة البريدية</h3>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showNewsletter}
                onChange={(e) => updateSetting('showNewsletter', e.target.checked)}
                className="w-4 h-4 rounded text-[var(--admin-primary)]"
              />
              <span className="text-sm font-bold text-[var(--admin-text-base)]">تفعيل نموذج الاشتراك</span>
            </label>

            {settings.showNewsletter && (
              <>
                <div>
                  <label className="block text-sm font-bold text-[var(--admin-text-base)] mb-1.5">العنوان</label>
                  <input
                    type="text"
                    value={settings.newsletterTitle}
                    onChange={(e) => updateSetting('newsletterTitle', e.target.value)}
                    className="w-full bg-[var(--admin-bg-base)] border border-[var(--admin-border-base)] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--admin-primary)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[var(--admin-text-base)] mb-1.5">النص الفرعي</label>
                  <input
                    type="text"
                    value={settings.newsletterSubtitle}
                    onChange={(e) => updateSetting('newsletterSubtitle', e.target.value)}
                    className="w-full bg-[var(--admin-bg-base)] border border-[var(--admin-border-base)] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--admin-primary)]"
                  />
                </div>
              </>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[var(--admin-text-muted)] uppercase">العناصر الإضافية</h3>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showSocialIcons}
                onChange={(e) => updateSetting('showSocialIcons', e.target.checked)}
                className="w-4 h-4 rounded text-[var(--admin-primary)]"
              />
              <span className="text-sm font-bold text-[var(--admin-text-base)]">إظهار أيقونات التواصل الاجتماعي</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showPaymentIcons}
                onChange={(e) => updateSetting('showPaymentIcons', e.target.checked)}
                className="w-4 h-4 rounded text-[var(--admin-primary)]"
              />
              <span className="text-sm font-bold text-[var(--admin-text-base)]">إظهار طرق الدفع المدعومة</span>
            </label>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[var(--admin-text-muted)] uppercase">حقوق النشر</h3>
            <div>
              <input
                type="text"
                value={settings.copyrightText}
                onChange={(e) => updateSetting('copyrightText', e.target.value)}
                className="w-full bg-[var(--admin-bg-base)] border border-[var(--admin-border-base)] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--admin-primary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[var(--admin-text-base)] mb-1.5">نص التطوير (Developer Credit)</label>
              <input
                type="text"
                value={settings.developerCredit}
                onChange={(e) => updateSetting('developerCredit', e.target.value)}
                className="w-full bg-[var(--admin-bg-base)] border border-[var(--admin-border-base)] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--admin-primary)]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 min-w-0 h-full p-4 pl-0">
        <CMSPreviewPanel view={view} onViewChange={setView} title="Footer Preview" isUpdating={saving}>
          <div className="w-full h-full flex flex-col font-sans bg-slate-50">
            <div className="flex-1 flex items-center justify-center opacity-30 font-bold text-2xl">
              Page Content
            </div>
            <footer className="bg-white border-t border-slate-200">
              {settings.showNewsletter && (
                <div className="border-b border-slate-200 py-12 px-8 text-center">
                  <h3 className="text-2xl font-bold mb-2">{settings.newsletterTitle}</h3>
                  <p className="text-slate-500 mb-6">{settings.newsletterSubtitle}</p>
                  <div className="flex max-w-md mx-auto gap-2">
                    <input type="email" placeholder="Email Address" className="flex-1 bg-slate-100 border-none rounded-md px-4 py-2 outline-none" />
                    <button className="bg-black text-white px-6 py-2 rounded-md font-bold">Subscribe</button>
                  </div>
                </div>
              )}

              <div className="py-12 px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-1">
                  <div className="text-2xl font-black mb-4 tracking-tighter">AURA</div>
                  {settings.showSocialIcons && (
                    <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-slate-100" />
                      <div className="w-8 h-8 rounded-full bg-slate-100" />
                      <div className="w-8 h-8 rounded-full bg-slate-100" />
                    </div>
                  )}
                </div>
                {settings.columns.map(col => (
                  <div key={col.id}>
                    <h4 className="font-bold mb-4">{col.title}</h4>
                    <ul className="space-y-3">
                      {col.links.map(link => (
                        <li key={link.id} className="text-sm text-slate-500">{link.label}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 py-6 px-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-sm text-slate-500">{settings.copyrightText}</div>
                <div className="text-sm text-slate-400">{settings.developerCredit}</div>
                {settings.showPaymentIcons && (
                  <div className="flex gap-2">
                    <div className="w-10 h-6 bg-slate-100 rounded" />
                    <div className="w-10 h-6 bg-slate-100 rounded" />
                    <div className="w-10 h-6 bg-slate-100 rounded" />
                  </div>
                )}
              </div>
            </footer>
          </div>
        </CMSPreviewPanel>
      </div>
    </FadeIn>
  );
}

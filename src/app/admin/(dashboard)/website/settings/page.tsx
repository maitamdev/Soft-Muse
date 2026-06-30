"use client";

import React, { useState, useEffect } from "react";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { toast } from "sonner";
import { Button } from "@/components/admin/design-system/Button";
import { FadeIn } from "@/components/admin/ui/motion";
import { StoreService, StoreInfo } from "@/lib/services/storefront/store.service";

export default function StoreInfoManager() {
  const [info, setInfo] = useState<StoreInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);


  async function loadInfo() {
    try {
      const data = await StoreService.getInfo();
      setInfo(data);
    } catch (e) {
      toast.error("Failed to load store info");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInfo();
  }, []);

  const updateInfo = <K extends keyof StoreInfo>(key: K, value: StoreInfo[K]) => {
    if (info) {
      setInfo({ ...info, [key]: value });
    }
  };

  const updateSocial = (key: keyof StoreInfo['socialMedia'], value: string) => {
    if (info) {
      setInfo({ ...info, socialMedia: { ...info.socialMedia, [key]: value } });
    }
  };

  const saveInfo = async () => {
    if (!info) return;
    setSaving(true);
    try {
      await StoreService.updateInfo(info);
      toast.success("Store info saved successfully");
    } catch (e) {
      toast.error("Failed to save store info");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !info) {
    return <div className="p-8 animate-pulse">Loading store info...</div>;
  }

  return (
    <FadeIn className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-end">
        <Button
          variant="primary"
          size="md"
          leftIcon={<IconDeviceFloppy size={18} />}
          onClick={saveInfo}
          loading={saving}
        >
          حفظ التغييرات
        </Button>
      </div>

      <div className="bg-[var(--admin-bg-surface)] rounded-[var(--admin-radius-xl)] border border-[var(--admin-border-base)] overflow-hidden">
        <div className="p-6 border-b border-[var(--admin-border-light)]">
          <h2 className="text-lg font-bold text-[var(--admin-text-base)] mb-4">معلومات الاتصال</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-[var(--admin-text-base)] mb-1.5">اسم المتجر</label>
              <input
                type="text"
                value={info.storeName}
                onChange={(e) => updateInfo('storeName', e.target.value)}
                className="w-full bg-[var(--admin-bg-base)] border border-[var(--admin-border-base)] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[var(--admin-text-base)] mb-1.5">رقم الهاتف</label>
              <input
                type="text"
                value={info.phone}
                onChange={(e) => updateInfo('phone', e.target.value)}
                className="w-full bg-[var(--admin-bg-base)] border border-[var(--admin-border-base)] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)]"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[var(--admin-text-base)] mb-1.5">رقم الواتساب</label>
              <input
                type="text"
                value={info.whatsapp}
                onChange={(e) => updateInfo('whatsapp', e.target.value)}
                className="w-full bg-[var(--admin-bg-base)] border border-[var(--admin-border-base)] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)]"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[var(--admin-text-base)] mb-1.5">البريد الإلكتروني العام</label>
              <input
                type="email"
                value={info.email}
                onChange={(e) => updateInfo('email', e.target.value)}
                className="w-full bg-[var(--admin-bg-base)] border border-[var(--admin-border-base)] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)]"
                dir="ltr"
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-b border-[var(--admin-border-light)]">
          <h2 className="text-lg font-bold text-[var(--admin-text-base)] mb-4">المعلومات التجارية والموقع</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-[var(--admin-text-base)] mb-1.5">السجل التجاري</label>
              <input
                type="text"
                value={info.commercialRegistration}
                onChange={(e) => updateInfo('commercialRegistration', e.target.value)}
                className="w-full bg-[var(--admin-bg-base)] border border-[var(--admin-border-base)] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[var(--admin-text-base)] mb-1.5">الرقم الضريبي</label>
              <input
                type="text"
                value={info.taxNumber}
                onChange={(e) => updateInfo('taxNumber', e.target.value)}
                className="w-full bg-[var(--admin-bg-base)] border border-[var(--admin-border-base)] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-[var(--admin-text-base)] mb-1.5">العنوان بالتفصيل</label>
              <input
                type="text"
                value={info.address}
                onChange={(e) => updateInfo('address', e.target.value)}
                className="w-full bg-[var(--admin-bg-base)] border border-[var(--admin-border-base)] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)]"
              />
            </div>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-lg font-bold text-[var(--admin-text-base)] mb-4">الشبكات الاجتماعية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.keys(info.socialMedia).map((key) => (
              <div key={key}>
                <label className="block text-sm font-bold text-[var(--admin-text-base)] mb-1.5 capitalize">{key}</label>
                <input
                  type="text"
                  value={(info.socialMedia as any)[key]}
                  onChange={(e) => updateSocial(key as any, e.target.value)}
                  className="w-full bg-[var(--admin-bg-base)] border border-[var(--admin-border-base)] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)]"
                  dir="ltr"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

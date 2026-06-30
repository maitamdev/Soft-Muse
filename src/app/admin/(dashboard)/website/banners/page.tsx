"use client";

import React, { useState, useEffect } from "react";
import {
  IconPlus, IconSlideshow, IconEye, IconEyeOff, IconTrash, IconEdit
} from "@tabler/icons-react";
import { toast } from "sonner";
import { Button } from "@/components/admin/design-system/Button";
import { Badge } from "@/components/admin/design-system/Badge";
import { CMSPreviewPanel, DeviceView } from "@/components/admin/storefront/CMSPreviewPanel";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/admin/ui/motion";
import { BannerService, Banner } from "@/lib/services/storefront/banner.service";
import { cn } from "@/utils/cn";

export default function BannerManager() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<DeviceView>("desktop");
  const [activeBannerId, setActiveBannerId] = useState<string | null>(null);


  const loadBanners = async () => {
    try {
      const data = await BannerService.getBanners();
      setBanners(data);
      if (data.length > 0) setActiveBannerId(data[0].id);
    } catch (e) {
      toast.error("Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const deleteBanner = async (id: string) => {
    try {
      await BannerService.deleteBanner(id);
      setBanners(b => b.filter(x => x.id !== id));
      toast.success("Banner deleted");
    } catch (e) {
      toast.error("Failed to delete banner");
    }
  };

  const toggleStatus = async (id: string, current: Banner['status']) => {
    try {
      const newStatus = current === 'active' ? 'disabled' : 'active';
      await BannerService.updateBanner(id, { status: newStatus });
      setBanners(b => b.map(x => x.id === id ? { ...x, status: newStatus } : x));
      toast.success("Banner status updated");
    } catch (e) {
      toast.error("Failed to update status");
    }
  };

  const activeBanner = banners.find(b => b.id === activeBannerId);

  if (loading) {
    return <div className="p-8 animate-pulse">Loading manager...</div>;
  }

  return (
    <FadeIn className="h-[calc(100vh-180px)] min-h-[560px] flex flex-col md:flex-row bg-[var(--admin-bg-base)] rounded-[var(--admin-radius-xl)] overflow-hidden border border-[var(--admin-border-base)]">
      {/* Left Panel: List & Controls */}
      <div className="w-full md:w-[450px] shrink-0 border-r border-[var(--admin-border-base)] flex flex-col h-full bg-[var(--admin-bg-surface)]">
        <div className="p-4 border-b border-[var(--admin-border-light)] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[var(--admin-text-base)]">
            <IconSlideshow size={20} className="text-[var(--admin-primary)]" />
            <h1 className="font-bold">Banner Manager</h1>
          </div>
          <Button variant="primary" size="sm" leftIcon={<IconPlus size={16} />}>
            Add Banner
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4">
          <StaggerContainer>
            {banners.map(banner => (
              <StaggerItem key={banner.id}>
                <div
                  onClick={() => setActiveBannerId(banner.id)}
                  className={cn(
                    "p-4 rounded-[var(--admin-radius-lg)] border transition-all cursor-pointer group mb-4",
                    activeBannerId === banner.id
                      ? "bg-[var(--admin-primary-muted)] border-[var(--admin-primary)] shadow-sm"
                      : "bg-[var(--admin-bg-base)] border-[var(--admin-border-base)] hover:border-[var(--admin-border-strong)]"
                  )}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <Badge variant={banner.status === 'active' ? 'success' : banner.status === 'scheduled' ? 'warning' : 'neutral'} size="sm" className="mb-2 uppercase">
                        {banner.status}
                      </Badge>
                      <h3 className="font-bold text-[var(--admin-text-base)] capitalize">{banner.type} Banner</h3>
                      <p className="text-xs font-medium text-[var(--admin-text-muted)] mt-1">Priority: {banner.priority}</p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => { e.stopPropagation(); toggleStatus(banner.id, banner.status); }} className="p-1 text-[var(--admin-text-subtle)] hover:text-[var(--admin-text-base)]">
                        {banner.status === 'active' ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                      </button>
                      <button className="p-1 text-[var(--admin-text-subtle)] hover:text-[var(--admin-primary)]">
                        <IconEdit size={16} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); deleteBanner(banner.id); }} className="p-1 text-[var(--admin-danger-muted)] hover:text-[var(--admin-danger)]">
                        <IconTrash size={16} />
                      </button>
                    </div>
                  </div>

                  {banner.mediaUrl && (
                    <div className="w-full h-24 rounded-lg overflow-hidden bg-slate-100 relative">
                      { }
                      <img src={banner.mediaUrl} className="absolute inset-0 w-full h-full object-cover" alt="Banner preview" />
                    </div>
                  )}
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>

      {/* Right Panel: Live Preview */}
      <div className="flex-1 min-w-0 h-full p-4 pl-0">
        <CMSPreviewPanel
          view={view}
          onViewChange={setView}
          title="Banner Preview"
        >
          <div className="flex flex-col w-full h-full min-h-[500px] relative font-sans items-center justify-center bg-slate-100">
            {!activeBanner ? (
              <div className="text-slate-400">Select a banner to preview</div>
            ) : (
              <div className={cn(
                "relative w-full overflow-hidden flex flex-col items-center justify-center transition-all",
                activeBanner.type === 'desktop' ? "aspect-[21/9] max-w-7xl" :
                activeBanner.type === 'announcement' ? "h-10 text-sm max-w-full" :
                activeBanner.type === 'popup' ? "w-[400px] h-[400px] rounded-xl shadow-2xl" : "w-full aspect-[4/3] max-w-md"
              )}>
                {activeBanner.mediaUrl && (

                  <img src={activeBanner.mediaUrl} className="absolute inset-0 w-full h-full object-cover" alt="" />
                )}
                <div className="absolute inset-0 bg-black transition-opacity" style={{ opacity: activeBanner.overlayOpacity / 100 }} />

                <div className="relative z-10 p-4 text-center">
                  {activeBanner.buttonText && activeBanner.type === 'announcement' ? (
                    <span className="text-white font-medium">{activeBanner.buttonText}</span>
                  ) : activeBanner.buttonText ? (
                    <button className="px-6 py-2 bg-white text-black font-semibold rounded hover:bg-slate-100">
                      {activeBanner.buttonText}
                    </button>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </CMSPreviewPanel>
      </div>
    </FadeIn>
  );
}

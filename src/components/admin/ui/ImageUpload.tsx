"use client";

import React, { useState } from 'react';
import { adminAr } from '@/lib/i18n/admin-ar';
import { MediaPicker } from './MediaPicker';
import { Media } from '@/data/mock/media';
import { IconPhoto, IconX } from '@tabler/icons-react';

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  multiple?: boolean;
}

export function ImageUpload({ images, onChange, multiple = false }: ImageUploadProps) {
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  const handleMediaSelect = (media: Media | Media[]) => {
    if (Array.isArray(media)) {
      if (multiple) {
        onChange([...images, ...media.map(m => m.url)]);
      }
    } else {
      if (multiple) {
        onChange([...images, media.url]);
      } else {
        onChange([media.url]);
      }
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  return (
    <div className="space-y-4 w-full">
      <div 
        onClick={() => setMediaPickerOpen(true)}
        className="relative border-2 border-dashed rounded-[var(--admin-radius-lg)] p-8 text-center transition-colors cursor-pointer border-[var(--admin-border-strong)] hover:border-[var(--admin-primary)] bg-[var(--admin-bg-elevated)] hover:bg-[var(--admin-primary-muted)]"
      >
        <div className="flex flex-col items-center justify-center gap-2 pointer-events-none group">
          <IconPhoto size={36} className="text-[var(--admin-text-subtle)] group-hover:text-[var(--admin-primary)] transition-colors" stroke={1.5} />
          <p className="text-sm font-semibold text-[var(--admin-text-base)] group-hover:text-[var(--admin-primary)] transition-colors">
            اختيار من مكتبة الوسائط
          </p>
          <p className="text-xs text-[var(--admin-text-muted)] font-medium">
            أو رفع صورة جديدة
          </p>
        </div>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
          {images.map((src, idx) => (
            <div key={idx} className="relative aspect-square rounded-[var(--admin-radius-md)] overflow-hidden border border-[var(--admin-border-base)] shadow-[var(--admin-shadow-sm)] group bg-[var(--admin-bg-subtle)]">
              { }
              <img src={src} alt="Upload preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-[var(--admin-bg-base)]/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                  className="p-2 bg-[var(--admin-danger)] text-white rounded-[var(--admin-radius-md)] shadow-[var(--admin-shadow-md)] hover:bg-[#b91c1c] transition-colors hover:scale-105 active:scale-95"
                >
                  <IconX size={18} stroke={2.5} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <MediaPicker 
        open={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={handleMediaSelect}
        multiple={multiple}
        allowedTypes={['image']}
      />
    </div>
  );
}

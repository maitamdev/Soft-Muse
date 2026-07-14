"use client";

import { useRef, useState } from "react";
import { IconPhotoPlus, IconTrash, IconLoader2 } from "@tabler/icons-react";
import { createClient } from "@/lib/supabase/client";

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  multiple?: boolean;
  label?: string;
}

export function ImageUpload({ images, onChange, multiple = false, label = "Tải ảnh sản phẩm" }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    setError("");
    const uploaded: string[] = [];

    try {
      const supabase = createClient();
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) throw new Error("Chỉ chấp nhận tệp hình ảnh.");
        if (file.size > 10 * 1024 * 1024) throw new Error("Mỗi ảnh phải nhỏ hơn 10 MB.");
        const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${extension}`;
        const { error: uploadError } = await supabase.storage.from("product-images").upload(path, file, {
          cacheControl: "31536000",
          upsert: false,
        });
        if (uploadError) throw uploadError;
        uploaded.push(supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl);
      }
      onChange(multiple ? [...images, ...uploaded] : uploaded.slice(0, 1));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Tải ảnh thất bại.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple={multiple}
        className="sr-only"
        onChange={(event) => void upload(event.target.files)}
      />
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="flex min-h-36 w-full flex-col items-center justify-center gap-2 border-2 border-dashed border-[var(--admin-border-strong)] bg-[var(--admin-bg-elevated)] p-6 text-center transition-colors hover:border-[var(--admin-primary)] disabled:cursor-wait disabled:opacity-60"
      >
        {uploading ? <IconLoader2 className="animate-spin text-[var(--admin-primary)]" /> : <IconPhotoPlus size={32} className="text-[var(--admin-primary)]" />}
        <span className="text-sm font-semibold text-[var(--admin-text-base)]">
          {uploading ? "Đang tải ảnh lên Supabase..." : label}
        </span>
        <span className="text-xs text-[var(--admin-text-muted)]">JPG, PNG, WebP hoặc AVIF, tối đa 10 MB</span>
      </button>
      {error && <p className="text-sm text-[var(--admin-danger)]">{error}</p>}

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((src, index) => (
            <div key={src} className="group relative aspect-[3/4] overflow-hidden border border-[var(--admin-border-base)] bg-[var(--admin-bg-subtle)]">
              <img src={src} alt={`Ảnh sản phẩm ${index + 1}`} className="h-full w-full object-cover" />
              <button
                type="button"
                title="Xóa ảnh"
                onClick={() => onChange(images.filter((_, imageIndex) => imageIndex !== index))}
                className="absolute right-2 top-2 grid h-9 w-9 place-items-center bg-white/95 text-red-600 opacity-0 shadow transition-opacity group-hover:opacity-100 focus:opacity-100"
              >
                <IconTrash size={17} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { IconDeviceFloppy, IconExternalLink, IconHome, IconInfoCircle } from "@tabler/icons-react";
import { toast } from "sonner";
import { ContentService } from "@/lib/services/storefront/content.service";
import { ABOUT_CONTENT, HOME_CONTENT } from "@/hooks/usePageContent";
import { PageHeader } from "@/components/admin/design-system/Layout";
import { Button } from "@/components/admin/design-system/Button";
import { Input } from "@/components/admin/design-system/Input";
import { ImageUpload } from "@/components/admin/ui/ImageUpload";

type PageKey = "home" | "about";
type Field = { key: string; label: string; type?: "text" | "textarea" | "image"; section: string; hint?: string };

const fields: Record<PageKey, Field[]> = {
  home: [
    { key: "home_hero_label", label: "Nhãn thương hiệu", section: "Banner chính" },
    { key: "home_hero_title", label: "Tiêu đề chính", section: "Banner chính", type: "textarea" },
    { key: "home_hero_text", label: "Nội dung giới thiệu", section: "Banner chính", type: "textarea" },
    { key: "home_hero_primary_cta", label: "Nút mua sắm", section: "Banner chính" },
    { key: "home_hero_secondary_cta", label: "Nút bộ sưu tập", section: "Banner chính" },
    { key: "home_hero_image", label: "Ảnh banner", section: "Banner chính", type: "image" },
    { key: "home_category_label", label: "Nhãn", section: "Danh mục sản phẩm" },
    { key: "home_category_title", label: "Tiêu đề", section: "Danh mục sản phẩm" },
    { key: "home_lookbook_label", label: "Nhãn", section: "Lookbook" },
    { key: "home_lookbook_title", label: "Tiêu đề", section: "Lookbook", type: "textarea" },
    { key: "home_lookbook_text", label: "Nội dung", section: "Lookbook", type: "textarea" },
    { key: "home_lookbook_button", label: "Nút hành động", section: "Lookbook" },
    { key: "home_lookbook_image", label: "Ảnh lookbook", section: "Lookbook", type: "image" },
    { key: "home_testimonial_label", label: "Nhãn", section: "Đánh giá khách hàng" },
    { key: "home_testimonial_title", label: "Tiêu đề", section: "Đánh giá khách hàng" },
    { key: "home_newsletter_label", label: "Nhãn", section: "Đăng ký nhận tin" },
    { key: "home_newsletter_title", label: "Tiêu đề", section: "Đăng ký nhận tin" },
    { key: "home_newsletter_text", label: "Nội dung", section: "Đăng ký nhận tin", type: "textarea" },
    { key: "home_instagram_label", label: "Tài khoản Instagram", section: "Instagram" },
    { key: "home_instagram_title", label: "Tiêu đề", section: "Instagram" },
  ],
  about: [
    { key: "about_hero_label", label: "Nhãn", section: "Banner giới thiệu" },
    { key: "about_hero_title", label: "Tiêu đề", section: "Banner giới thiệu", type: "textarea" },
    { key: "about_hero_image", label: "Ảnh banner", section: "Banner giới thiệu", type: "image" },
    { key: "about_philosophy_label", label: "Nhãn", section: "Triết lý thương hiệu" },
    { key: "about_philosophy_title", label: "Tiêu đề", section: "Triết lý thương hiệu", type: "textarea" },
    { key: "about_philosophy_text", label: "Nội dung", section: "Triết lý thương hiệu", type: "textarea" },
    { key: "about_philosophy_image", label: "Hình ảnh", section: "Triết lý thương hiệu", type: "image" },
    { key: "about_products_label", label: "Nhãn", section: "Sản phẩm" },
    { key: "about_products_title", label: "Tiêu đề", section: "Sản phẩm", type: "textarea" },
    { key: "about_products_text", label: "Nội dung", section: "Sản phẩm", type: "textarea" },
    { key: "about_values_label", label: "Nhãn", section: "Giá trị cốt lõi" },
    { key: "about_values_title", label: "Tiêu đề", section: "Giá trị cốt lõi" },
    { key: "about_cta_label", label: "Nhãn", section: "Kêu gọi mua sắm" },
    { key: "about_cta_title", label: "Tiêu đề", section: "Kêu gọi mua sắm" },
    { key: "about_cta_text", label: "Nội dung", section: "Kêu gọi mua sắm", type: "textarea" },
    { key: "about_cta_button", label: "Nút hành động", section: "Kêu gọi mua sắm" },
  ],
};

export default function WebsiteContentPage() {
  const [page, setPage] = useState<PageKey>("home");
  const [values, setValues] = useState<Record<string, string>>({ ...HOME_CONTENT, ...ABOUT_CONTENT });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void ContentService.getContentByGroup("pages").then(blocks => {
      setValues(current => ({ ...current, ...Object.fromEntries(blocks.filter(block => block.value.trim()).map(block => [block.key, block.value])) }));
    }).catch(error => toast.error(error instanceof Error ? error.message : "Không thể tải nội dung.")).finally(() => setLoading(false));
  }, []);

  const sections = useMemo(() => Array.from(new Set(fields[page].map(field => field.section))), [page]);
  const save = async () => {
    setSaving(true);
    try {
      const pageValues = Object.fromEntries(fields[page].map(field => [field.key, values[field.key] ?? ""]));
      await ContentService.savePageContent(pageValues, Object.fromEntries(fields[page].map(field => [field.key, field.label])));
      toast.success("Đã lưu nội dung và cập nhật website.");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Không thể lưu nội dung."); }
    finally { setSaving(false); }
  };

  return <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-6 lg:p-8">
    <PageHeader title="Nội dung website" description="Chỉnh sửa nội dung hiển thị trên trang khách hàng mà không cần thay đổi mã nguồn." actions={<><Link href={page === "home" ? "/" : "/about"} target="_blank"><Button variant="secondary" leftIcon={<IconExternalLink size={17} />}>Xem trang</Button></Link><Button isLoading={saving} leftIcon={<IconDeviceFloppy size={17} />} onClick={() => void save()}>Lưu thay đổi</Button></>} />
    <div className="flex gap-2 border-b border-[var(--admin-border-base)]">
      <button onClick={() => setPage("home")} className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold ${page === "home" ? "border-[var(--admin-primary)] text-[var(--admin-primary)]" : "border-transparent text-[var(--admin-text-muted)]"}`}><IconHome size={17} />Trang chủ</button>
      <button onClick={() => setPage("about")} className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold ${page === "about" ? "border-[var(--admin-primary)] text-[var(--admin-primary)]" : "border-transparent text-[var(--admin-text-muted)]"}`}><IconInfoCircle size={17} />Giới thiệu</button>
    </div>
    {loading ? <div className="py-20 text-center text-sm text-[var(--admin-text-muted)]">Đang tải nội dung...</div> : <div className="space-y-6">
      {sections.map(section => <section key={section} className="border border-[var(--admin-border-base)] bg-[var(--admin-bg-surface)] p-5 shadow-sm md:p-6">
        <h2 className="mb-5 text-base font-bold text-[var(--admin-text-base)]">{section}</h2>
        <div className="grid gap-5 md:grid-cols-2">{fields[page].filter(field => field.section === section).map(field => <div key={field.key} className={field.type === "textarea" || field.type === "image" ? "md:col-span-2" : ""}>
          {field.type === "image" ? <><p className="mb-2 text-xs font-semibold text-[var(--admin-text-muted)]">{field.label}</p><ImageUpload label="Tải ảnh nội dung" images={values[field.key] ? [values[field.key]] : []} onChange={images => setValues(current => ({ ...current, [field.key]: images[0] ?? "" }))} /></> : field.type === "textarea" ? <label className="block text-xs font-semibold text-[var(--admin-text-muted)]">{field.label}<textarea rows={3} value={values[field.key] ?? ""} onChange={event => setValues(current => ({ ...current, [field.key]: event.target.value }))} className="mt-1.5 w-full border border-[var(--admin-border-base)] bg-[var(--admin-bg-surface)] p-3 text-sm font-normal text-[var(--admin-text-base)] outline-none focus:border-[var(--admin-primary)]" /></label> : <Input label={field.label} value={values[field.key] ?? ""} onChange={event => setValues(current => ({ ...current, [field.key]: event.target.value }))} />}
        </div>)}</div>
      </section>)}
    </div>}
  </div>;
}

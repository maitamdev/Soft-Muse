"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { mountFadeIn, mountFadeUp } from "@/lib/animations";
import { ABOUT_CONTENT, usePageContent } from "@/hooks/usePageContent";

const values = [
  {
    number: "01",
    title: "Thanh lịch",
    description: "Thiết kế đủ chỉn chu cho công sở nhưng vẫn mềm mại, nữ tính và dễ mặc hằng ngày.",
  },
  {
    number: "02",
    title: "Tối giản",
    description: "Ưu tiên đường cắt sạch, màu sắc trung tính và chi tiết vừa đủ để sản phẩm bền lâu.",
  },
  {
    number: "03",
    title: "Dễ tiếp cận",
    description: "Mức giá hợp lý trong khoảng 200.000-1.000.000đ, phù hợp phụ nữ đi làm trẻ.",
  },
  {
    number: "04",
    title: "Đáng tin cậy",
    description: "Tập trung chất liệu, phom dáng, tư vấn size và trải nghiệm mua sắm rõ ràng.",
  },
];

export default function AboutPage() {
  const content = usePageContent(ABOUT_CONTENT);
  return (
    <div className="bg-background-primary min-h-screen flex flex-col items-center">
      <section className="w-full max-w-[1440px] relative h-[55vh] md:h-[68vh] flex items-center justify-center overflow-hidden border-b border-brand-border bg-background-secondary">
        <Image
          src={content.about_hero_image}
          alt="Soft Muse officewear"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-text-primary/25 pointer-events-none" />
        <div className="relative z-10 text-center px-6 max-w-[780px] text-background-secondary">
          <motion.span
            variants={mountFadeIn}
            initial="hidden"
            animate="visible"
            className="font-sans text-[10px] uppercase tracking-[0.26em] font-bold text-background-secondary/90"
          >
            {content.about_hero_label}
          </motion.span>
          <motion.h1
            variants={mountFadeUp}
            initial="hidden"
            animate="visible"
            className="mt-4 font-sans text-4xl md:text-6xl lg:text-7xl font-light text-background-secondary leading-tight"
          >
            {content.about_hero_title}
          </motion.h1>
        </div>
      </section>

      <section className="w-full max-w-[1280px] px-6 md:px-12 py-16 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div className="flex flex-col items-start gap-5">
            <span className="font-sans text-[10px] text-accent font-bold uppercase tracking-[0.2em]">
              {content.about_philosophy_label}
            </span>
            <h2 className="font-sans text-3xl md:text-4xl font-light text-text-primary leading-tight">
              {content.about_philosophy_title}
            </h2>
            <p className="font-sans text-sm font-light text-text-secondary leading-relaxed">
              {content.about_philosophy_text}
            </p>
          </div>
          <div className="relative aspect-[3/4] w-full overflow-hidden border border-brand-border bg-background-secondary">
            <Image
              src={content.about_philosophy_image}
              alt="Bộ sưu tập Soft Muse"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="w-full bg-background-secondary border-y border-brand-border py-16 md:py-24">
        <div className="max-w-[760px] mx-auto px-6 text-center flex flex-col items-center gap-6">
          <span className="font-sans text-[10px] text-accent font-bold uppercase tracking-[0.2em]">
            {content.about_products_label}
          </span>
          <h2 className="font-sans text-3xl font-light text-text-primary leading-tight">
            {content.about_products_title}
          </h2>
          <p className="font-sans text-sm font-light text-text-secondary leading-relaxed">
            {content.about_products_text}
          </p>
        </div>
      </section>

      <section className="w-full max-w-[1280px] px-6 md:px-12 py-16 md:py-28">
        <div className="text-center mb-12 flex flex-col items-center gap-2">
          <span className="font-sans text-[10px] text-accent font-bold uppercase tracking-[0.2em]">
            {content.about_values_label}
          </span>
          <h2 className="font-sans text-2xl md:text-3xl font-light text-text-primary">
            {content.about_values_title}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value) => (
            <div key={value.number} className="p-6 bg-background-secondary border border-brand-border flex flex-col gap-3">
              <span className="font-display text-xl text-accent font-bold">{value.number}</span>
              <h3 className="font-sans text-base font-semibold text-text-primary">{value.title}</h3>
              <p className="font-sans text-xs text-text-secondary font-light leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="w-full py-16 md:py-28 bg-background-primary border-t border-brand-border flex flex-col items-center">
        <div className="max-w-[720px] mx-auto px-6 text-center flex flex-col items-center gap-6">
          <span className="font-sans text-[10px] text-accent font-bold uppercase tracking-[0.2em]">
            {content.about_cta_label}
          </span>
          <h2 className="font-sans text-2xl md:text-3xl font-light text-text-primary">
            {content.about_cta_title}
          </h2>
          <p className="font-sans text-xs md:text-sm font-light text-text-secondary leading-relaxed">
            {content.about_cta_text}
          </p>
          <div className="mt-2">
            <Link href="/shop">
              <Button variant="primary">{content.about_cta_button}</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

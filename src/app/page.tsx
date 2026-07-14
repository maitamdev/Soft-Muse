"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import Button from "@/components/ui/Button";
import { ProductCard } from "@/components/ui/Card";
import { useStorefrontProducts } from "@/hooks/useStorefrontProducts";
import { useStorefrontCategories } from "@/hooks/useStorefrontCategories";
import { discountOriginalPrice, primaryImage, resolveStockStatus } from "@/data/mock/products";
import RecentlyViewed from "@/components/product/RecentlyViewed";
import { heroFadeUp, scrollViewport } from "@/lib/animations";
import { HOME_CONTENT, usePageContent } from "@/hooks/usePageContent";
import { NewsletterService } from "@/lib/services/newsletter.service";

const testimonials = [
  {
    name: "Minh Anh, nhân viên ngân hàng",
    text: "Áo sơ mi rất mềm, mặc cả ngày vẫn thoải mái. Màu hồng đất lên da đẹp và lịch sự.",
  },
  {
    name: "Thu Hà, giáo viên",
    text: "Mình thích phom váy vừa kín đáo vừa nữ tính. Giá hợp lý hơn nhiều so với cảm giác sản phẩm mang lại.",
  },
  {
    name: "Linh Chi, nhân viên văn phòng",
    text: "Blazer dễ phối, đường may gọn. Đóng gói đẹp nên cảm giác nhận hàng rất chỉn chu.",
  },
];

export default function HomePage() {
  const content = usePageContent(HOME_CONTENT);
  const reduceMotion = useReducedMotion();
  const products = useStorefrontProducts();
  const categories = useStorefrontCategories();
  const [heroSlide, setHeroSlide] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [newsletterError, setNewsletterError] = useState("");
  const [newsletterSaving, setNewsletterSaving] = useState(false);
  const newArrivals = products.filter((product) => product.newArrival).slice(0, 4);
  const bestSellers = products.filter((product) => product.bestSeller).slice(0, 4);
  const homepageCategories = useMemo(() => {
    const visible = categories
      .filter((category) => category.showOnHomepage)
      .sort((a, b) => a.sortOrder - b.sortOrder);
    return (visible.length ? visible : categories).slice(0, 4).map((category) => {
      const firstProduct = products.find((product) => product.category === category.name);
      return {
        id: category.id,
        title: category.name,
        href: `/shop?category=${encodeURIComponent(category.name)}`,
        image: category.thumbnail || (firstProduct ? primaryImage(firstProduct) : "") || "/images/campaign/campaign_2.png",
      };
    });
  }, [categories, products]);
  const heroImages = useMemo(() => Array.from(new Set([
    content.home_hero_image,
    content.home_hero_image_2,
    content.home_hero_image_3,
    content.home_hero_image_4,
  ].filter(Boolean))), [content.home_hero_image, content.home_hero_image_2, content.home_hero_image_3, content.home_hero_image_4]);

  useEffect(() => {
    if (heroPaused || reduceMotion || heroImages.length < 2) return;
    const timer = window.setInterval(() => setHeroSlide(current => (current + 1) % heroImages.length), 5200);
    return () => window.clearInterval(timer);
  }, [heroImages.length, heroPaused, reduceMotion]);

  useEffect(() => {
    setHeroSlide(current => Math.min(current, Math.max(heroImages.length - 1, 0)));
    heroImages.slice(1).forEach(src => { const image = new window.Image(); image.src = src; });
  }, [heroImages]);

  return (
    <div className="w-full bg-background-primary flex flex-col items-center">
      <section
        className="relative w-full min-h-[calc(100vh-88px)] overflow-hidden bg-[#cfc9bf] border-b border-brand-border"
        onMouseEnter={() => setHeroPaused(true)}
        onMouseLeave={() => setHeroPaused(false)}
        onFocusCapture={() => setHeroPaused(true)}
        onBlurCapture={() => setHeroPaused(false)}
        aria-roledescription="carousel"
        aria-label="Bộ sưu tập Soft Muse"
      >
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={heroImages[heroSlide]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, scale: reduceMotion ? 1 : 1.025 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 0.9, ease: "easeInOut" }, scale: { duration: 6.2, ease: "linear" } }}
            className="absolute inset-y-0 right-0 w-full bg-[#cfc9bf] md:max-w-[1200px]"
          >
            <Image
              src={heroImages[heroSlide] ?? content.home_hero_image}
              alt={`Thời trang công sở nữ Soft Muse ${heroSlide + 1}`}
              fill
              priority={heroSlide === 0}
              unoptimized
              sizes="(max-width: 767px) 100vw, 1200px"
              className={`object-cover object-top saturate-[1.04] contrast-[1.08] ${heroSlide === 0 ? "md:object-cover md:object-center" : "md:object-contain md:object-right"}`}
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,17,17,0.82)_0%,rgba(17,17,17,0.62)_32%,rgba(17,17,17,0.22)_56%,rgba(17,17,17,0)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(17,17,17,0.18)_0%,rgba(17,17,17,0)_36%)]" />
        <div className="relative z-10 min-h-[calc(100vh-88px)] max-w-[1280px] mx-auto px-6 md:px-12 flex items-center">
          <motion.div
            variants={heroFadeUp}
            initial="hidden"
            animate="visible"
            className="max-w-xl text-background-secondary"
          >
            <span className="font-sans text-[10px] uppercase tracking-[0.28em] font-bold text-background-secondary/85">
              {content.home_hero_label}
            </span>
            <h1 className="mt-5 font-sans text-4xl md:text-6xl font-light leading-tight">
              {content.home_hero_title}
            </h1>
            <p className="mt-5 font-sans text-sm md:text-base leading-8 font-light text-background-secondary/90">
              {content.home_hero_text}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/shop">
                <Button variant="primary" className="h-12 px-8">{content.home_hero_primary_cta}</Button>
              </Link>
              <Link href="/collections">
                <Button variant="secondary" className="h-12 px-8">{content.home_hero_secondary_cta}</Button>
              </Link>
            </div>
          </motion.div>
        </div>
        {heroImages.length > 1 && <div className="absolute bottom-6 left-0 right-0 z-20 mx-auto flex max-w-[1280px] items-center justify-between px-6 md:bottom-8 md:px-12">
          <div className="flex items-center gap-2" role="tablist" aria-label="Chọn ảnh banner">
            {heroImages.map((_, index) => <button key={index} type="button" role="tab" aria-selected={heroSlide === index} aria-label={`Xem ảnh ${index + 1}`} onClick={() => setHeroSlide(index)} className={`h-1 transition-all duration-500 ${heroSlide === index ? "w-12 bg-white" : "w-7 bg-white/45 hover:bg-white/75"}`} />)}
          </div>
          <div className="hidden gap-2 sm:flex">
            <button type="button" aria-label="Ảnh trước" onClick={() => setHeroSlide(current => (current - 1 + heroImages.length) % heroImages.length)} className="grid h-10 w-10 place-items-center border border-white/60 bg-black/15 text-white backdrop-blur-sm transition-colors hover:bg-black/35"><IconChevronLeft size={19} /></button>
            <button type="button" aria-label="Ảnh tiếp theo" onClick={() => setHeroSlide(current => (current + 1) % heroImages.length)} className="grid h-10 w-10 place-items-center border border-white/60 bg-black/15 text-white backdrop-blur-sm transition-colors hover:bg-black/35"><IconChevronRight size={19} /></button>
          </div>
        </div>}
      </section>

      <motion.section
        variants={heroFadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={scrollViewport}
        className="w-full max-w-[1280px] px-6 md:px-12 py-14 md:py-24"
      >
        <div className="flex flex-col md:flex-row justify-between gap-6 md:items-end mb-10">
          <div>
            <span className="font-sans text-[10px] text-accent font-bold uppercase tracking-[0.22em]">
              {content.home_category_label}
            </span>
            <h2 className="font-sans text-3xl md:text-4xl font-light text-text-primary mt-2">
              {content.home_category_title}
            </h2>
          </div>
          <Link href="/shop" className="font-sans text-xs text-accent underline underline-offset-4">
            Tất cả sản phẩm
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {homepageCategories.map((category) => (
            <Link key={category.id} href={category.href} className="relative aspect-[3/4] overflow-hidden border border-brand-border group bg-background-secondary">
              <Image src={category.image} alt={category.title} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-text-primary/65 via-transparent to-transparent" />
              <h3 className="absolute bottom-5 left-5 right-5 font-sans text-xl text-background-secondary font-medium">
                {category.title}
              </h3>
            </Link>
          ))}
        </div>
      </motion.section>

      <ProductSection title="Hàng mới về" subtitle="New Arrivals" href="/new-arrivals" products={newArrivals} />
      <ProductSection title="Bestseller" subtitle="Được yêu thích nhất" href="/bestsellers" products={bestSellers} tinted />

      <motion.section
        variants={heroFadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={scrollViewport}
        className="w-full border-y border-brand-border bg-background-secondary"
      >
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/5] overflow-hidden border border-brand-border bg-background-primary">
            <Image src={content.home_lookbook_image} alt="Lookbook Soft Muse" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
          </div>
          <div className="flex flex-col items-start gap-5">
            <span className="font-sans text-[10px] text-accent font-bold uppercase tracking-[0.22em]">
              {content.home_lookbook_label}
            </span>
            <h2 className="font-sans text-3xl md:text-4xl font-light text-text-primary leading-tight">
              {content.home_lookbook_title}
            </h2>
            <p className="font-sans text-sm text-text-secondary font-light leading-7">
              {content.home_lookbook_text}
            </p>
            <Link href="/collections">
              <Button variant="dark-outline">{content.home_lookbook_button}</Button>
            </Link>
          </div>
        </div>
      </motion.section>

      <motion.section
        variants={heroFadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={scrollViewport}
        className="w-full max-w-[1280px] px-6 md:px-12 py-14 md:py-24"
      >
        <div className="text-center mb-10">
          <span className="font-sans text-[10px] text-accent font-bold uppercase tracking-[0.22em]">
            {content.home_testimonial_label}
          </span>
          <h2 className="font-sans text-3xl md:text-4xl font-light text-text-primary mt-2">
            {content.home_testimonial_title}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div key={item.name} className="border border-brand-border bg-background-secondary p-6">
              <div className="text-accent text-sm">★★★★★</div>
              <p className="mt-4 font-sans text-sm text-text-secondary font-light leading-7 italic">
                &quot;{item.text}&quot;
              </p>
              <p className="mt-5 font-sans text-[11px] font-bold text-text-primary">{item.name}</p>
            </div>
          ))}
        </div>
      </motion.section>

      <section className="w-full bg-background-secondary border-y border-brand-border py-14 md:py-20">
        <div className="max-w-[720px] mx-auto px-6 text-center flex flex-col items-center gap-5">
          <span className="font-sans text-[10px] text-accent font-bold uppercase tracking-[0.22em]">
            {content.home_newsletter_label}
          </span>
          <h2 className="font-sans text-3xl md:text-4xl font-light text-text-primary">
            {content.home_newsletter_title}
          </h2>
          <p className="font-sans text-sm text-text-secondary font-light leading-7">
            {content.home_newsletter_text}
          </p>
          {newsletterSubmitted ? (
            <div className="border border-accent/40 bg-accent/5 px-8 py-4 text-sm font-sans text-text-primary">
              Cảm ơn bạn đã đăng ký. Soft Muse sẽ gửi ưu đãi sớm.
            </div>
          ) : (
            <form
              className="flex flex-col sm:flex-row gap-3 w-full max-w-md"
              onSubmit={async (event) => {
                event.preventDefault();
                if (!newsletterEmail.trim()) return;
                setNewsletterSaving(true); setNewsletterError("");
                try { await NewsletterService.subscribe(newsletterEmail); setNewsletterSubmitted(true); }
                catch (error) { setNewsletterError(error instanceof Error ? error.message : "Không thể đăng ký lúc này."); }
                finally { setNewsletterSaving(false); }
              }}
            >
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(event) => setNewsletterEmail(event.target.value)}
                placeholder="Email của bạn"
                className="flex-1 h-12 border border-brand-border bg-background-primary px-4 text-sm font-sans text-text-primary outline-none placeholder:text-text-secondary/40 focus:border-accent transition-colors duration-300"
              />
              <Button type="submit" variant="primary" disabled={newsletterSaving} className="h-12 px-6 shrink-0">
                {newsletterSaving ? "Đang lưu..." : "Đăng ký"}
              </Button>
            </form>
          )}
          {newsletterError && <p className="text-sm text-red-600">{newsletterError}</p>}
        </div>
      </section>

      <section className="w-full max-w-[1280px] px-6 md:px-12 py-14 md:py-24">
        <div className="text-center mb-10">
          <span className="font-sans text-[10px] text-accent font-bold uppercase tracking-[0.22em]">
            {content.home_instagram_label}
          </span>
          <h2 className="font-sans text-3xl md:text-4xl font-light text-text-primary mt-2">
            {content.home_instagram_title}
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="relative aspect-square overflow-hidden border border-brand-border bg-background-secondary">
              <Image
                src={`/images/campaign/campaign_${index + 1}.png`}
                alt={`Soft Muse Instagram ${index + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 16vw"
                className="object-cover transition-transform duration-[1200ms] hover:scale-105"
              />
            </div>
          ))}
        </div>
      </section>

      <RecentlyViewed />
    </div>
  );
}

function ProductSection({
  title,
  subtitle,
  href,
  products,
  tinted = false,
}: {
  title: string;
  subtitle: string;
  href: string;
  products: ReturnType<typeof useStorefrontProducts>;
  tinted?: boolean;
}) {
  if (products.length === 0) return null;

  return (
    <motion.section
      variants={heroFadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={scrollViewport}
      className={`w-full border-t border-brand-border py-14 md:py-24 ${tinted ? "bg-background-secondary" : "bg-background-primary"}`}
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between gap-6 md:items-end mb-10">
          <div>
            <span className="font-sans text-[10px] text-accent font-bold uppercase tracking-[0.22em]">
              {subtitle}
            </span>
            <h2 className="font-sans text-3xl md:text-4xl font-light text-text-primary mt-2">
              {title}
            </h2>
          </div>
          <Link href={href} className="font-sans text-xs text-accent underline underline-offset-4">
            Xem tất cả
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.name}
              price={product.price}
              originalPrice={discountOriginalPrice(product)}
              image={primaryImage(product)}
              hoverImage={product.hoverImage}
              collection={product.collection}
              variants={product.colorVariants}
              badge={product.badge}
              stockStatus={resolveStockStatus(product)}
              index={index}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
}

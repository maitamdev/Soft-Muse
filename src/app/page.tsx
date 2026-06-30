"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/ui/Card";
import { useStorefrontProducts } from "@/hooks/useStorefrontProducts";
import { primaryImage, discountOriginalPrice, resolveStockStatus } from "@/data/mock/products";
import Button from "@/components/ui/Button";
import HeroSection from "@/components/HeroSection";
import RecentlyViewed from "@/components/product/RecentlyViewed";
import { heroFadeUp, scrollViewport } from "@/lib/animations";
import { HomepageService, HomepageSection } from "@/lib/services/storefront/homepage.service";
import { useEventSubscribeMany } from "@/hooks/useEventBus";

// Code-split: only ever renders for ~3.2s on a visitor's first session visit, never on repeat navigations.
const PremiumLoader = dynamic(() => import("@/components/ui/PremiumLoader"));

export default function HomePage() {
  const products = useStorefrontProducts();
  const [sections, setSections] = useState<HomepageSection[]>([]);

  useEffect(() => {
    HomepageService.getSections().then(setSections).catch(() => {});
  }, []);
  useEventSubscribeMany(['website.changed'], () => {
    HomepageService.getSections().then(setSections).catch(() => {});
  });

  // Derive product grids from enabled HomepageService sections + live product flags
  const bestSellersSection = sections.find(s => s.type === 'best_sellers' && s.enabled);
  const newArrivalsSection = sections.find(s => s.type === 'new_arrivals' && s.enabled);
  const featuredSection    = sections.find(s => s.type === 'featured_products' && s.enabled);

  const bsLimit = bestSellersSection?.settings?.limit ?? 4;
  const naLimit = newArrivalsSection?.settings?.limit ?? 4;
  const fpLimit = featuredSection?.settings?.limit ?? 4;

  const flaggedBestSellers = products.filter(p => p.bestSeller);
  const bestSellers = (flaggedBestSellers.length > 0 ? flaggedBestSellers : products).slice(0, bsLimit);

  const flaggedNewArrivals = products.filter(p => p.newArrival);
  const newArrivals = (flaggedNewArrivals.length > 0 ? flaggedNewArrivals : products).slice(0, naLimit);

  const flaggedFeatured = products.filter(p => p.featured);
  const featuredProducts = (flaggedFeatured.length > 0 ? flaggedFeatured : products).slice(0, fpLimit);

  return (
    <div className="w-full bg-background-primary flex flex-col items-center">
      {/* 0. Elegant Preloader */}
      <PremiumLoader />

      {/* 1. HERO CAMPAIGN - Asymmetrical Magazine Layout */}
      <HeroSection />

      {/* 2. NEW ARRIVALS SLIDER (Editorial visual story) - Reveal Entrance */}
      <motion.section 
        variants={heroFadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={scrollViewport}
        className="w-full max-w-[1280px] px-6 md:px-12 py-12 md:py-24"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12">
          <div>
            <span className="font-sans text-[10px] text-accent font-bold uppercase tracking-[0.2em]">نظرة مسبقة</span>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-text-primary mt-2">وصل حديثاً</h2>
          </div>
          <Link href="/shop" className="font-sans text-xs text-accent hover:text-text-primary transition-colors underline underline-offset-4 mt-2 md:mt-0">
            مشاهدة كل القطع
          </Link>
        </div>

        {/* 3 Campaign looks - Women's Clothing Only */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/shop" className="relative aspect-[3/4] overflow-hidden border border-brand-border bg-background-secondary block group">
            <Image
              src="/images/campaign/campaign_1.png"
              alt="إطلالة كلاسيكية راقية"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
            />
            <div className="absolute bottom-6 right-6 text-background-secondary z-10 text-right" dir="rtl">
              <span className="font-sans text-[10px] uppercase tracking-wider opacity-90">الإطلالة الأولى</span>
              <h3 className="font-serif text-lg font-light mt-1 text-white">فساتين السهرة الكوتور</h3>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-text-primary/65 via-transparent to-transparent pointer-events-none" />
          </Link>

          <Link href="/shop?category=summer" className="relative aspect-[3/4] overflow-hidden border border-brand-border bg-background-secondary block group">
            <Image
              src="/images/campaign/campaign_2.png"
              alt="بدلة عصرية بيضاء"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
            />
            <div className="absolute bottom-6 right-6 text-background-secondary z-10 text-right" dir="rtl">
              <span className="font-sans text-[10px] uppercase tracking-wider opacity-90">تشكيلة حصرية</span>
              <h3 className="font-serif text-lg font-light mt-1 text-white">أزياء الصيف المنعشة</h3>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-text-primary/65 via-transparent to-transparent pointer-events-none" />
          </Link>

          <Link href="/shop?category=winter" className="relative aspect-[3/4] overflow-hidden border border-brand-border bg-background-secondary block group">
            <Image
              src="/images/campaign/campaign_3.png"
              alt="أزياء الشتاء"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
            />
            <div className="absolute bottom-6 right-6 text-background-secondary z-10 text-right" dir="rtl">
              <span className="font-sans text-[10px] uppercase tracking-wider opacity-90">دفء وأناقة</span>
              <h3 className="font-serif text-lg font-light mt-1 text-white">تشكيلة الشتاء الفاخرة</h3>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-text-primary/65 via-transparent to-transparent pointer-events-none" />
          </Link>
        </div>
      </motion.section>

      {/* 3. FEATURED LOOKS (Contemporary Egyptian Fashion Styling) - Reveal Entrance */}
      <motion.section 
        variants={heroFadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={scrollViewport}
        className="w-full bg-background-secondary border-y border-brand-border py-12 md:py-24"
      >
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/5] w-full overflow-hidden border border-brand-border bg-background-primary group">
            <Image
              src="/images/campaign/campaign_4.png"
              alt="تنسيق التشكيلة"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
            />
          </div>

          <div className="flex flex-col items-start gap-4 md:pl-8 text-right" dir="rtl">
            <span className="font-sans text-[10px] text-accent font-bold uppercase tracking-[0.2em]">تنسيق مخصص</span>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-text-primary leading-snug">
              أناقة تواكب حضوركِ اليومي والمناسبات
            </h2>
            <p className="font-sans text-xs md:text-sm font-light text-text-secondary leading-relaxed mt-2">
              كل قطعة في تشكيلتنا مصممة لتكون حجر زاوية في خزانتكِ. نهتم بدمج الأقمشة الطبيعية عالية الجودة كالكتان المعالج والحرير الطبيعي مع قصات هندسية تمنحكِ الراحة دون التنازل عن فخامة المظهر.
            </p>
            <div className="mt-4">
              <Link href="/shop">
                <Button variant="dark-outline">استكشفي دليل الإطلالات</Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 4. EDITORIAL STORY - Reveal Entrance */}
      <motion.section 
        variants={heroFadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={scrollViewport}
        className="w-full py-20 md:py-32 bg-background-primary"
      >
        <div className="max-w-[720px] mx-auto px-6 text-center flex flex-col items-center gap-6" dir="rtl">
          <span className="font-sans text-[10px] text-accent font-bold uppercase tracking-[0.2em]">Contemporary Couture</span>
          <h2 className="font-serif text-3xl md:text-4xl font-light text-text-primary leading-tight">
            حياكة إبداعية ترسم ملامح حضورك الفخم
          </h2>
          <p className="font-sans text-xs md:text-sm font-light text-text-secondary leading-relaxed mt-2">
            تأسست دار أورا في الجيزة لنقدم مفهوماً جديداً للأناقة المعاصرة وجماليات الحياكة الفاخرة. نؤمن بالحياكة البطيئة والمدروسة؛ حيث يُقَص ويُحاك كل تصميم يدوياً بأيدي أمهر الحرفيين في أتيلييه الجيزة، مستلهمين تفاصيلنا من الأنسجة الطبيعية الراقية والخطوط الهندسية البسيطة التي تعبر عن قوة حضور المرأة العصرية.
          </p>
          <Link href="/about" className="font-sans text-xs text-accent hover:text-text-primary transition-colors underline underline-offset-4 font-semibold mt-4">
            اقرئي قصتنا وحكايتنا الفنية
          </Link>
        </div>
      </motion.section>

      {/* 5. BEST SELLERS - section-driven via HomepageService */}
      {(!sections.length || bestSellersSection) && bestSellers.length > 0 && (
        <motion.section
          variants={heroFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={scrollViewport}
          className="w-full bg-background-secondary border-t border-brand-border py-12 md:py-24"
        >
          <div className="max-w-[1280px] mx-auto px-6 md:px-12">
            <div className="text-center mb-12 flex flex-col items-center gap-2">
              <span className="font-sans text-[10px] text-accent font-bold uppercase tracking-[0.2em]">
                {bestSellersSection?.subtitle || 'المجموعة الحصرية'}
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-light text-text-primary">
                {bestSellersSection?.title || 'القطع الأكثر طلباً'}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {bestSellers.map((product, index) => (
                <ProductCard key={product.id} id={product.id} title={product.name} price={product.price}
                  originalPrice={discountOriginalPrice(product)} image={primaryImage(product)}
                  hoverImage={product.hoverImage} collection={product.collection}
                  badge={product.badge} stockStatus={resolveStockStatus(product)} index={index} />
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* 5b. NEW ARRIVALS - section-driven via HomepageService + newArrival flag */}
      {newArrivalsSection && newArrivals.length > 0 && (
        <motion.section
          variants={heroFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={scrollViewport}
          className="w-full border-t border-brand-border py-12 md:py-24"
        >
          <div className="max-w-[1280px] mx-auto px-6 md:px-12">
            <div className="text-center mb-12 flex flex-col items-center gap-2">
              <span className="font-sans text-[10px] text-accent font-bold uppercase tracking-[0.2em]">
                {newArrivalsSection.subtitle || 'نظرة مسبقة'}
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-light text-text-primary">
                {newArrivalsSection.title || 'وصل حديثاً'}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {newArrivals.map((product, index) => (
                <ProductCard key={product.id} id={product.id} title={product.name} price={product.price}
                  originalPrice={discountOriginalPrice(product)} image={primaryImage(product)}
                  hoverImage={product.hoverImage} collection={product.collection}
                  badge={product.badge} stockStatus={resolveStockStatus(product)} index={index} />
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* 5c. FEATURED PRODUCTS - section-driven via HomepageService + featured flag */}
      {featuredSection && featuredProducts.length > 0 && (
        <motion.section
          variants={heroFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={scrollViewport}
          className="w-full bg-background-secondary border-t border-brand-border py-12 md:py-24"
        >
          <div className="max-w-[1280px] mx-auto px-6 md:px-12">
            <div className="text-center mb-12 flex flex-col items-center gap-2">
              <span className="font-sans text-[10px] text-accent font-bold uppercase tracking-[0.2em]">
                {featuredSection.subtitle || 'تشكيلة مختارة'}
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-light text-text-primary">
                {featuredSection.title || 'منتجات مميزة'}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product, index) => (
                <ProductCard key={product.id} id={product.id} title={product.name} price={product.price}
                  originalPrice={discountOriginalPrice(product)} image={primaryImage(product)}
                  hoverImage={product.hoverImage} collection={product.collection}
                  badge={product.badge} stockStatus={resolveStockStatus(product)} index={index} />
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* 6. CUSTOMER EXPERIENCE & BRAND TRUST - Reveal Entrance */}
      <motion.section 
        variants={heroFadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={scrollViewport}
        className="w-full py-12 md:py-24 bg-background-primary border-t border-brand-border"
      >
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 flex flex-col gap-16">
          
          {/* Top row: Experience details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-right" dir="rtl">
            <div className="flex flex-col gap-2 items-start p-6 bg-background-secondary border border-brand-border group">
              <div className="relative w-full aspect-[4/3] overflow-hidden border border-brand-border mb-4 bg-background-primary">
                <Image 
                  src="/images/flatlay/flatlay_1.png" 
                  alt="شحن أورا" 
                  fill 
                  sizes="(max-width: 768px) 100vw, 33vw" 
                  className="object-cover transition-transform duration-[1200ms] group-hover:scale-105" 
                />
              </div>
              <h4 className="font-serif text-base font-semibold text-text-primary">توصيل سريع لكل المحافظات</h4>
              <p className="font-sans text-xs text-text-secondary font-light leading-relaxed mt-1">
                تصلكِ قطع أورا أينما كنتِ في مصر، مع خدمة شحن سريع مؤمن وموثوق خلال 2 إلى 5 أيام عمل بحد أقصى.
              </p>
            </div>

            <div className="flex flex-col gap-2 items-start p-6 bg-background-secondary border border-brand-border group">
              <div className="relative w-full aspect-[4/3] overflow-hidden border border-brand-border mb-4 bg-background-primary">
                <Image 
                  src="/aura_packaging_mockup.png" 
                  alt="تغليف أورا الفاخر" 
                  fill 
                  sizes="(max-width: 768px) 100vw, 33vw" 
                  className="object-cover transition-transform duration-[1200ms] group-hover:scale-105" 
                />
              </div>
              <h4 className="font-serif text-base font-semibold text-text-primary">تغليف مخملي فاخر كوتور</h4>
              <p className="font-sans text-xs text-text-secondary font-light leading-relaxed mt-1">
                تُسلّم كل شحنة مغلفة بصناديق أورا الفاخرة المخصصة لحفظ خامات الحرير والكتان وجاهزة لتكون هدية راقية.
              </p>
            </div>

            <div className="flex flex-col gap-2 items-start p-6 bg-background-secondary border border-brand-border group">
              <div className="relative w-full aspect-[4/3] overflow-hidden border border-brand-border mb-4 bg-background-primary">
                <Image 
                  src="/aura_clothing_label.png" 
                  alt="علامة جودة أورا" 
                  fill 
                  sizes="(max-width: 768px) 100vw, 33vw" 
                  className="object-cover transition-transform duration-[1200ms] group-hover:scale-105" 
                />
              </div>
              <h4 className="font-serif text-base font-semibold text-text-primary">تنسيق وتجهيز القياسات</h4>
              <p className="font-sans text-xs text-text-secondary font-light leading-relaxed mt-1">
                فريق الأتيلييه يتواصل معكِ عبر الواتساب لتأكيد مقاسات القوام الدقيقة قبل البدء بالخياطة والتجهيز.
              </p>
            </div>
          </div>

          {/* Middle row: Brand Trust Grid */}
          <div className="border-t border-brand-border pt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-right" dir="rtl">
            <div className="flex flex-col gap-2 items-start">
              <div className="flex items-center gap-2 text-accent font-semibold text-sm">
                <span className="text-accent">✓</span>
                <h5 className="font-serif text-sm font-bold">شحن آمن ومضمون</h5>
              </div>
              <p className="font-sans text-xs text-text-secondary font-light leading-relaxed mt-1">
                شحن سريع ومؤمن بالكامل لجميع محافظات مصر مع تتبع حي لرحلة مقتنياتكِ الفخمة.
              </p>
            </div>

            <div className="flex flex-col gap-2 items-start">
              <div className="flex items-center gap-2 text-accent font-semibold text-sm">
                <span className="text-accent">✓</span>
                <h5 className="font-serif text-sm font-bold">جودة الخامات الفاخرة</h5>
              </div>
              <p className="font-sans text-xs text-text-secondary font-light leading-relaxed mt-1">
                نستخدم أفضل خامات الكتان البلجيكي الطبيعي المعالج والحرير الإيطالي الخالص 100%.
              </p>
            </div>

            <div className="flex flex-col gap-2 items-start">
              <div className="flex items-center gap-2 text-accent font-semibold text-sm">
                <span className="text-accent">✓</span>
                <h5 className="font-serif text-sm font-bold">تصميم مصري فاخر</h5>
              </div>
              <p className="font-sans text-xs text-text-secondary font-light leading-relaxed mt-1">
                تصاميم كوتور أصلية وقطع محدودة الإصدار تُحاك وتُجهّز بكل فخر بأيدي حرفيين مصريين.
              </p>
            </div>

            <div className="flex flex-col gap-2 items-start">
              <div className="flex items-center gap-2 text-accent font-semibold text-sm">
                <span className="text-accent">✓</span>
                <h5 className="font-serif text-sm font-bold">دعم عملاء متميز</h5>
              </div>
              <p className="font-sans text-xs text-text-secondary font-light leading-relaxed mt-1">
                تواصل مباشر وتنسيق شخصي عبر الواتساب لتجهيز تفاصيل القياسات وتسهيل عملية الدفع.
              </p>
            </div>
          </div>

          {/* Bottom row: Testimonials & Trust */}
          <div className="border-t border-brand-border pt-16 flex flex-col items-center text-center">
            <span className="font-sans text-[10px] text-accent font-bold uppercase tracking-[0.2em] mb-4">آراء وثقة صالون أورا</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[900px] w-full mt-2" dir="rtl">
              <div className="bg-background-secondary p-6 border border-brand-border flex flex-col gap-3 justify-center text-right">
                <p className="font-sans text-xs text-text-secondary font-light italic leading-relaxed">
                  &quot;تصاميم دار أورا تعبر عن الأناقة الهادئة والفريدة. الكتان المعالج مريح للغاية والقصات الهندسية تمنح حضورًا راقيًا وثقة عالية في كل مناسبة.&quot;
                </p>
                <span className="font-sans text-[10px] text-accent font-bold">— ياسمين الشافعي، عميلة صالون أورا الخاص</span>
              </div>
              <div className="bg-background-secondary p-6 border border-brand-border flex flex-col gap-3 justify-center text-right">
                <p className="font-sans text-xs text-text-secondary font-light italic leading-relaxed">
                  &quot;تفاصيل الخياطة اليدوية دقيقة للغاية في فستان الحرير الذي اقتنيته. إنه تجسيد للحرفية والموضة البطيئة الراقية بكل فخر في مصر.&quot;
                </p>
                <span className="font-sans text-[10px] text-accent font-bold">— نورة آل سعود، عضو صالون أورا البريدي</span>
              </div>
            </div>
          </div>

        </div>
      </motion.section>

      {/* 8. RECENTLY VIEWED */}
      <RecentlyViewed />
    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { ProductCard } from "@/components/ui/Card";
import { useStorefrontProducts } from "@/hooks/useStorefrontProducts";
import { discountOriginalPrice, primaryImage, resolveStockStatus } from "@/data/mock/products";
import RecentlyViewed from "@/components/product/RecentlyViewed";
import { heroFadeUp, scrollViewport } from "@/lib/animations";

const categories = [
  { title: "Áo sơ mi", href: "/shop?category=Áo sơ mi", image: "/images/campaign/campaign_2.png" },
  { title: "Váy công sở", href: "/shop?category=Váy", image: "/images/products/product_evening_gown.png" },
  { title: "Blazer", href: "/shop?category=Blazer", image: "/images/products/product_winter_coat.png" },
  { title: "Set đồ", href: "/shop?category=Set đồ", image: "/images/campaign/campaign_4.png" },
];

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
  const products = useStorefrontProducts();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const newArrivals = products.filter((product) => product.newArrival).slice(0, 4);
  const bestSellers = products.filter((product) => product.bestSeller).slice(0, 4);

  return (
    <div className="w-full bg-background-primary flex flex-col items-center">
      <section className="relative w-full min-h-[calc(100vh-88px)] overflow-hidden bg-background-secondary border-b border-brand-border">
        <Image
          src="/images/campaign/campaign_1.png"
          alt="Soft Muse công sở nữ"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[56%_38%] saturate-[1.04] contrast-[1.04]"
        />
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
              Soft Muse Officewear
            </span>
            <h1 className="mt-5 font-sans text-4xl md:text-6xl font-light leading-tight">
              Thanh lịch mỗi ngày, tự tin theo cách của bạn
            </h1>
            <p className="mt-5 font-sans text-sm md:text-base leading-8 font-light text-background-secondary/90">
              Thời trang công sở nữ tối giản, nữ tính và hiện đại với mức giá 200.000-1.000.000đ.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/shop">
                <Button variant="primary" className="h-12 px-8">Mua sắm ngay</Button>
              </Link>
              <Link href="/collections">
                <Button variant="secondary" className="h-12 px-8">Xem bộ sưu tập</Button>
              </Link>
            </div>
          </motion.div>
        </div>
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
              Danh mục
            </span>
            <h2 className="font-sans text-3xl md:text-4xl font-light text-text-primary mt-2">
              Mua theo nhu cầu đi làm
            </h2>
          </div>
          <Link href="/shop" className="font-sans text-xs text-accent underline underline-offset-4">
            Tất cả sản phẩm
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((category) => (
            <Link key={category.title} href={category.href} className="relative aspect-[3/4] overflow-hidden border border-brand-border group bg-background-secondary">
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
            <Image src="/images/campaign/campaign_5.png" alt="Lookbook Soft Muse" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
          </div>
          <div className="flex flex-col items-start gap-5">
            <span className="font-sans text-[10px] text-accent font-bold uppercase tracking-[0.22em]">
              Lookbook
            </span>
            <h2 className="font-sans text-3xl md:text-4xl font-light text-text-primary leading-tight">
              Một tủ đồ công sở mềm mại, ít nghĩ nhưng luôn đẹp
            </h2>
            <p className="font-sans text-sm text-text-secondary font-light leading-7">
              Phối sơ mi lụa với quần tây ống đứng, thêm blazer linen cho những cuộc họp quan trọng,
              hoặc chọn váy midi khi bạn muốn vẻ ngoài nữ tính và gọn gàng hơn.
            </p>
            <Link href="/collections">
              <Button variant="dark-outline">Khám phá lookbook</Button>
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
            Khách hàng nói gì
          </span>
          <h2 className="font-sans text-3xl md:text-4xl font-light text-text-primary mt-2">
            Từ những ngày làm việc thật
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
            Newsletter
          </span>
          <h2 className="font-sans text-3xl md:text-4xl font-light text-text-primary">
            Nhận ưu đãi từ Soft Muse
          </h2>
          <p className="font-sans text-sm text-text-secondary font-light leading-7">
            Hàng mới, mẹo phối đồ công sở và mã giảm giá riêng cho thành viên.
          </p>
          {newsletterSubmitted ? (
            <div className="border border-accent/40 bg-accent/5 px-8 py-4 text-sm font-sans text-text-primary">
              Cảm ơn bạn đã đăng ký. Soft Muse sẽ gửi ưu đãi sớm.
            </div>
          ) : (
            <form
              className="flex flex-col sm:flex-row gap-3 w-full max-w-md"
              onSubmit={(event) => {
                event.preventDefault();
                if (newsletterEmail.trim()) setNewsletterSubmitted(true);
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
              <Button type="submit" variant="primary" className="h-12 px-6 shrink-0">
                Đăng ký
              </Button>
            </form>
          )}
        </div>
      </section>

      <section className="w-full max-w-[1280px] px-6 md:px-12 py-14 md:py-24">
        <div className="text-center mb-10">
          <span className="font-sans text-[10px] text-accent font-bold uppercase tracking-[0.22em]">
            @softmuse.vn
          </span>
          <h2 className="font-sans text-3xl md:text-4xl font-light text-text-primary mt-2">
            Instagram Gallery
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

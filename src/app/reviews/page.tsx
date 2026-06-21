"use client";

// Note: Metadata exported from a server component wrapper (page.tsx imports this client component)
// For client pages, metadata is handled in the layout. Here we export client component directly.

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { RatingStars, ReviewCard, fadeUp } from "@/components/ui/PageComponents";
import { AnimatedStars } from "@/components/ui/AnimatedIcon";
import { useNotification } from "@/context/NotificationContext";

/* ── Mock reviews data ── */
const reviews = [
  {
    name: "نورة الشمري",
    initials: "ن.ش",
    rating: 5,
    text: "فستان الكريب الأسود فاق توقعاتي بمراحل. الخياطة دقيقة للغاية والقماش ثقيل ومريح بنفس الوقت. شعرت وكأنني أرتدي تحفة فنية حقيقية. التغليف الفاخر جعل لحظة فتح الصندوق تجربة لا تُنسى.",
    product: "فستان الكريب المسائي",
    date: "مايو ٢٠٢٦",
  },
  {
    name: "منى عبد العزيز",
    initials: "م.ع",
    rating: 5,
    text: "طقم الكتان بلون الرمال من أجمل ما اقتنيته في خزانتي. البساطة التي تجعلكِ تبدين متميزة في كل مناسبة. فريق أورا تواصل معي لتأكيد المقاس وهذه اللفتة الصغيرة قالت الكثير عن اهتمامهم بالتفاصيل.",
    product: "طقم كتان رمل",
    date: "أبريل ٢٠٢٦",
  },
  {
    name: "سارة العمراني",
    initials: "س.ع",
    rating: 5,
    text: "من أولى مرة أسمع عن أورا كنت متشككة، لكن بعد أول تجربة أصبحت من أكثر المعجبين بالعلامة. الجودة ممتازة والتوصيل كان أسرع مما توقعت. أنصح كل سيدة تبحث عن أناقة حقيقية.",
    product: "بلوزة حرير",
    date: "أبريل ٢٠٢٦",
  },
  {
    name: "هند المصري",
    initials: "ه.م",
    rating: 5,
    text: "اشتريت فستان السهرة لحفل زفاف وتلقيت مئات الإطراءات طوال الليلة. الجميع كان يسأل من أين الفستان. أورا استطاعت أن تجمع بين الأناقة الشرقية والطراز العصري بشكل رائع.",
    product: "فستان سهرة حريري",
    date: "مارس ٢٠٢٦",
  },
  {
    name: "ريم الأنصاري",
    initials: "ر.أ",
    rating: 5,
    text: "خدمة العملاء استثنائية وفريق الأتيلييه محترف جداً. أرسلوا لي فيديو لمرحلة الخياطة وكأنهم يريدونني أن أعيش التجربة من أولها. منتج راقٍ بكل المقاييس.",
    product: "عباءة كتان",
    date: "مارس ٢٠٢٦",
  },
  {
    name: "لمى الحربي",
    initials: "ل.ح",
    rating: 5,
    text: "بالنسبة للسعر تجدين جودة تفوق العلامات التجارية العالمية بكثير. كل خيط وكل تفصيلة تشعرين أنها صُنعت بحب وعناية. أورا مفخرة للصناعة المصرية.",
    product: "تشكيلة الكوتور الجديدة",
    date: "فبراير ٢٠٢٦",
  },
];

/* ── Rating summary calculation ── */
const totalReviews = reviews.length;
const avgRating = +(reviews.reduce((s, r) => s + r.rating, 0) / totalReviews).toFixed(1);
const ratingDist = [5, 4, 3, 2, 1].map((star) => ({
  star,
  count: reviews.filter((r) => r.rating === star).length,
  pct: Math.round((reviews.filter((r) => r.rating === star).length / totalReviews) * 100),
}));

/* ── Rating bar ── */
function RatingBar({ star, pct, count }: { star: number; pct: number; count: number }) {
  return (
    <div className="flex items-center gap-3 text-xs font-sans text-text-secondary">
      <span className="w-3 text-right">{star}</span>
      <span className="text-accent">★</span>
      <div className="flex-1 h-1.5 bg-brand-border rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="h-full bg-accent rounded-full"
        />
      </div>
      <span className="w-4 text-right text-text-secondary/60">{count}</span>
    </div>
  );
}

export default function ReviewsPage() {
  const { showNotification } = useNotification();
  const [name, setName]   = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showNotification("شكراً لمشاركتكِ تجربتكِ مع دار أورا! سيتم مراجعة تعليقكِ قريباً.", "success");
    setName(""); setReview(""); setRating(5);
  };

  return (
    <div className="w-full bg-background-primary">

      {/* ════════════════════════════════
          HERO
      ════════════════════════════════ */}
      <section className="relative w-full border-b border-brand-border bg-background-secondary overflow-hidden">
        <div className="max-w-[900px] mx-auto px-6 md:px-12 py-20 md:py-32 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
            className="flex flex-col items-center gap-4"
          >
            <motion.span
              custom={0} variants={fadeUp}
              className="font-sans text-[10px] uppercase tracking-[0.3em] text-accent font-bold"
            >
              صوت عميلاتنا
            </motion.span>
            <motion.h1
              custom={0.1} variants={fadeUp}
              className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-text-primary leading-[1.15]"
            >
              آراء عملائنا
            </motion.h1>
            <motion.p
              custom={0.2} variants={fadeUp}
              className="font-sans text-sm font-light text-text-secondary leading-relaxed max-w-md"
            >
              تجارب حقيقية من عميلات دار أورا — كلمات صادقة تعكس شغفنا بالحرفية والتميز.
            </motion.p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-px bg-accent" />
      </section>

      {/* ════════════════════════════════
          RATING SUMMARY
      ════════════════════════════════ */}
      <section className="max-w-[1280px] mx-auto px-6 md:px-12 py-14 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-10 md:gap-20 items-center">

          {/* Big number */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col items-center md:items-start gap-3 text-center md:text-right"
          >
            <span className="font-serif text-[5rem] md:text-[7rem] font-light text-text-primary leading-none">
              {avgRating}
            </span>
            <RatingStars rating={Math.round(avgRating)} />
            <p className="font-sans text-xs text-text-secondary">
              بناءً على {totalReviews} تقييمات حقيقية
            </p>
          </motion.div>

          {/* Bar chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col gap-3 max-w-md w-full"
          >
            {ratingDist.map((d) => (
              <RatingBar key={d.star} {...d} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Separator */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-12">
        <div className="h-px bg-brand-border" />
      </div>

      {/* ════════════════════════════════
          REVIEWS GRID
      ════════════════════════════════ */}
      <section className="max-w-[1280px] mx-auto px-6 md:px-12 py-14 md:py-20">
        <motion.div
          custom={0} variants={fadeUp} initial="hidden"
          whileInView="visible" viewport={{ once: true }}
          className="mb-10"
        >
          <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-accent font-bold">
            تجارب حقيقية
          </span>
          <h2 className="font-serif text-2xl md:text-3xl font-light text-text-primary mt-2">
            ماذا قالت عملاؤنا
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {reviews.map((r, i) => (
            <ReviewCard key={i} index={i} {...r} />
          ))}
        </div>
      </section>

      {/* Separator */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-12">
        <div className="h-px bg-brand-border" />
      </div>

      {/* ════════════════════════════════
          CTA — SUBMIT A REVIEW
      ════════════════════════════════ */}
      <section className="max-w-[1280px] mx-auto px-6 md:px-12 py-14 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-start">

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col gap-4"
          >
            <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-accent font-bold">
              شاركينا رأيكِ
            </span>
            <h2 className="font-serif text-2xl md:text-3xl font-light text-text-primary leading-snug">
              تجربتكِ تُلهم السيدات الأخريات
            </h2>
            <p className="font-sans text-sm font-light text-text-secondary leading-[1.9]">
              كلماتكِ الصادقة تساعدنا على التطور وتساعد عميلاتنا الجدد في اتخاذ قراراتهن. شاركينا رأيكِ في قطعتكِ من دار أورا.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <div className="w-12 h-px bg-accent" />
              <Link href="/shop" className="font-sans text-xs text-accent hover:text-text-primary transition-colors underline underline-offset-4">
                تسوقي الآن لتشاركي تجربتكِ
              </Link>
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col gap-5 bg-background-secondary border border-brand-border p-7 md:p-8"
          >
            <div className="flex flex-col gap-2">
              <label className="font-sans text-[10px] uppercase tracking-[0.15em] text-accent font-bold">
                تقييمكِ
              </label>
              <AnimatedStars
                rating={rating}
                interactive
                onChange={setRating}
                size={24}
              />
            </div>

            {/* Name */}
            <div className="flex flex-col gap-2">
              <label className="font-sans text-[10px] uppercase tracking-[0.15em] text-accent font-bold">
                اسمكِ
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: سارة أحمد"
                required
                dir="rtl"
                className="h-11 border border-brand-border bg-background-primary px-4 text-sm font-sans
                           text-text-primary outline-none placeholder:text-text-secondary/40
                           focus:border-accent transition-colors duration-300"
              />
            </div>

            {/* Review text */}
            <div className="flex flex-col gap-2">
              <label className="font-sans text-[10px] uppercase tracking-[0.15em] text-accent font-bold">
                تجربتكِ
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="شاركينا رأيكِ في الجودة والتصميم والخدمة..."
                required
                rows={4}
                dir="rtl"
                className="border border-brand-border bg-background-primary px-4 py-3 text-sm font-sans
                           text-text-primary outline-none placeholder:text-text-secondary/40
                           focus:border-accent transition-colors duration-300 resize-none"
              />
            </div>

            <button
              type="submit"
              className="h-12 bg-text-primary text-background-secondary font-sans text-xs font-semibold
                         hover:bg-accent transition-colors duration-500 w-full mt-1"
            >
              إرسال التقييم
            </button>
          </motion.form>
        </div>
      </section>

    </div>
  );
}

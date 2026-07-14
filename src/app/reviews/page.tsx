"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AnimatedStars } from "@/components/ui/AnimatedIcon";
import { RatingStars, ReviewCard, fadeUp } from "@/components/ui/PageComponents";
import { useNotification } from "@/context/NotificationContext";
import { useStorefrontProducts } from "@/hooks/useStorefrontProducts";
import { useEventSubscribeMany } from "@/hooks/useEventBus";
import { scrollFadeIn, scrollFadeUp, scrollScaleIn, revealTransition, scrollViewport } from "@/lib/animations";
import { ContentService } from "@/lib/services/storefront/content.service";
import { ReviewService } from "@/lib/services/review.service";

const DEFAULT_HERO = {
 reviews_hero_label: "Cảm nhận khách hàng",
 reviews_hero_title: "Soft Muse trong những ngày đi làm thật",
 reviews_hero_subtitle: "Những chia sẻ chân thành về phom dáng, chất liệu và trải nghiệm mua sắm tại Soft Muse.",
};

const initialsFromName = (name: string) =>
 name.trim().split(/\s+/).slice(-2).map((word) => word[0]?.toUpperCase()).join("");

function RatingBar({ star, pct, count }: { star: number; pct: number; count: number }) {
 return (
 <div className="flex items-center gap-3 text-xs font-sans text-text-secondary">
 <span className="w-3 text-left">{star}</span><span className="text-accent">★</span>
 <div className="flex-1 h-1.5 bg-brand-border rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }} transition={revealTransition(0.2)} className="h-full bg-accent rounded-full" /></div>
 <span className="w-5 text-right text-text-secondary/60">{count}</span>
 </div>
 );
}

type DisplayReview = {
 id: string; name: string; initials: string; rating: number; text: string;
 product?: string; date: string; adminReply?: string; verifiedPurchase?: boolean;
};

export default function ReviewsPage() {
 const { showNotification } = useNotification();
 const products = useStorefrontProducts();
 const [hero, setHero] = useState(DEFAULT_HERO);
 const [name, setName] = useState("");
 const [email, setEmail] = useState("");
 const [productId, setProductId] = useState("");
 const [review, setReview] = useState("");
 const [rating, setRating] = useState(5);
 const [reviews, setReviews] = useState<DisplayReview[]>([]);
 const [submitting, setSubmitting] = useState(false);

 const loadHero = useCallback(async () => {
 try {
 const blocks = await ContentService.getContentByGroup("pages");
 const content = Object.fromEntries(blocks.map((block) => [block.key, block.value]));
 setHero((current) => ({ ...current, ...content }));
 } catch {
 // Keep the complete Vietnamese defaults when CMS content is unavailable.
 }
 }, []);

 const loadReviews = useCallback(async () => {
 try {
 const data = await ReviewService.getReviews({ status: "approved" });
 const sorted = [...data].sort((a, b) => Number(b.isPinned) - Number(a.isPinned) || Number(b.isFeatured) - Number(a.isFeatured) || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
 setReviews(sorted.map((item) => ({
 id: item.id,
 name: item.customerName,
 initials: initialsFromName(item.customerName),
 rating: item.rating,
 text: item.content,
 product: item.productName || undefined,
 date: new Date(item.createdAt).toLocaleDateString("vi-VN", { month: "long", year: "numeric" }),
 adminReply: item.adminReply ?? undefined,
 verifiedPurchase: item.verifiedPurchase,
 })));
 } catch {
 setReviews([]);
 }
 }, []);

 useEffect(() => { void loadReviews(); void loadHero(); }, [loadHero, loadReviews]);
 useEventSubscribeMany(["reviews.changed", "review.approved"], loadReviews);
 useEventSubscribeMany(["website.changed"], loadHero);

 const totalReviews = reviews.length;
 const avgRating = totalReviews ? Number((reviews.reduce((sum, item) => sum + item.rating, 0) / totalReviews).toFixed(1)) : 0;
 const ratingDist = useMemo(() => [5, 4, 3, 2, 1].map((star) => {
 const count = reviews.filter((item) => item.rating === star).length;
 return { star, count, pct: totalReviews ? Math.round(count / totalReviews * 100) : 0 };
 }), [reviews, totalReviews]);

 const handleSubmit = async (event: React.FormEvent) => {
 event.preventDefault();
 const product = products.find((item) => item.id === productId);
 if (!product) {
 showNotification("Vui lòng chọn sản phẩm bạn muốn đánh giá.", "warning");
 return;
 }
 setSubmitting(true);
 try {
 await ReviewService.createReview({
 productId: product.id,
 productName: product.name,
 productImage: product.images?.[0] ?? "",
 customerName: name.trim(),
 customerEmail: email.trim().toLowerCase(),
 rating,
 title: review.trim().slice(0, 80),
 content: review.trim(),
 status: "pending",
 verifiedPurchase: false,
 });
 showNotification("Cảm ơn bạn. Đánh giá đã được gửi và đang chờ duyệt.", "success");
 setName(""); setEmail(""); setProductId(""); setReview(""); setRating(5);
 } catch (error) {
 showNotification(error instanceof Error ? error.message : "Không thể gửi đánh giá lúc này.", "error");
 } finally {
 setSubmitting(false);
 }
 };

 return (
 <div className="w-full bg-background-primary">
 <section className="relative w-full border-b border-brand-border bg-background-secondary overflow-hidden">
 <div className="max-w-[900px] mx-auto px-6 md:px-12 py-20 md:py-28 text-center"><motion.div initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }} className="flex flex-col items-center gap-4">
 <motion.span variants={fadeUp} className="font-sans text-[10px] uppercase tracking-[0.3em] text-accent font-bold">{hero.reviews_hero_label}</motion.span>
 <motion.h1 variants={fadeUp} className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-text-primary leading-[1.15]">{hero.reviews_hero_title}</motion.h1>
 <motion.p variants={fadeUp} className="font-sans text-sm font-light text-text-secondary leading-relaxed max-w-xl">{hero.reviews_hero_subtitle}</motion.p>
 </motion.div></div><div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-px bg-accent" />
 </section>

 <section className="max-w-[1280px] mx-auto px-6 md:px-12 py-14 md:py-20"><div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-10 md:gap-20 items-center">
 <motion.div variants={scrollScaleIn} initial="hidden" whileInView="visible" viewport={scrollViewport} className="flex flex-col items-center md:items-start gap-3 text-center md:text-left">
 <span className="font-serif text-[5rem] md:text-[7rem] font-light text-text-primary leading-none">{avgRating || "—"}</span><RatingStars rating={Math.round(avgRating)} /><p className="font-sans text-xs text-text-secondary">Dựa trên {totalReviews} đánh giá đã duyệt</p>
 </motion.div>
 <motion.div variants={scrollFadeIn} initial="hidden" whileInView="visible" viewport={scrollViewport} className="flex flex-col gap-3 max-w-md w-full">{ratingDist.map((item) => <RatingBar key={item.star} {...item} />)}</motion.div>
 </div></section>

 <div className="max-w-[1280px] mx-auto px-6 md:px-12"><div className="h-px bg-brand-border" /></div>
 <section className="max-w-[1280px] mx-auto px-6 md:px-12 py-14 md:py-20">
 <div className="mb-10"><span className="font-sans text-[10px] uppercase tracking-[0.2em] text-accent font-bold">Đánh giá mới nhất</span><h2 className="font-serif text-2xl md:text-3xl font-light text-text-primary mt-2">Khách hàng nói gì về Soft Muse</h2></div>
 {reviews.length === 0 ? <p className="font-sans text-sm font-light text-text-secondary text-center py-12">Chưa có đánh giá nào được duyệt.</p> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">{reviews.map((item, index) => <ReviewCard key={item.id} index={index} {...item} />)}</div>}
 </section>

 <div className="max-w-[1280px] mx-auto px-6 md:px-12"><div className="h-px bg-brand-border" /></div>
 <section className="max-w-[1280px] mx-auto px-6 md:px-12 py-14 md:py-20"><div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-start">
 <motion.div variants={scrollFadeUp} initial="hidden" whileInView="visible" viewport={scrollViewport} className="flex flex-col gap-4">
 <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-accent font-bold">Chia sẻ trải nghiệm</span><h2 className="font-serif text-2xl md:text-3xl font-light text-text-primary leading-snug">Một lời nhận xét thật giúp Soft Muse làm tốt hơn</h2><p className="font-sans text-sm font-light text-text-secondary leading-[1.9]">Hãy cho chúng tôi biết cảm nhận về phom dáng, chất liệu và trải nghiệm sử dụng sản phẩm. Đánh giá sẽ được kiểm duyệt trước khi hiển thị.</p><Link href="/shop" className="font-sans text-xs text-accent hover:text-text-primary transition-colors underline underline-offset-4">Xem các sản phẩm Soft Muse</Link>
 </motion.div>
 <motion.form onSubmit={handleSubmit} variants={scrollFadeUp} initial="hidden" whileInView="visible" viewport={scrollViewport} className="flex flex-col gap-5 bg-background-secondary border border-brand-border p-7 md:p-8">
 <label className="flex flex-col gap-2"><span className="font-sans text-[10px] uppercase tracking-[0.15em] text-accent font-bold">Mức độ hài lòng</span><AnimatedStars rating={rating} interactive onChange={setRating} size={24} /></label>
 <label className="flex flex-col gap-2"><span className="font-sans text-[10px] uppercase tracking-[0.15em] text-accent font-bold">Họ và tên</span><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nguyễn Minh Anh" required minLength={2} maxLength={80} className="h-11 border border-brand-border bg-background-primary px-4 text-sm outline-none focus:border-accent" /></label>
 <label className="flex flex-col gap-2"><span className="font-sans text-[10px] uppercase tracking-[0.15em] text-accent font-bold">Email</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="ban@example.com" required maxLength={160} className="h-11 border border-brand-border bg-background-primary px-4 text-sm outline-none focus:border-accent" /></label>
 <label className="flex flex-col gap-2"><span className="font-sans text-[10px] uppercase tracking-[0.15em] text-accent font-bold">Sản phẩm</span><select value={productId} onChange={(event) => setProductId(event.target.value)} required className="h-11 border border-brand-border bg-background-primary px-4 text-sm outline-none focus:border-accent"><option value="">Chọn sản phẩm đã trải nghiệm</option>{products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}</select></label>
 <label className="flex flex-col gap-2"><span className="font-sans text-[10px] uppercase tracking-[0.15em] text-accent font-bold">Nội dung đánh giá</span><textarea value={review} onChange={(event) => setReview(event.target.value)} placeholder="Chia sẻ cảm nhận của bạn..." required minLength={10} maxLength={1500} rows={5} className="border border-brand-border bg-background-primary px-4 py-3 text-sm outline-none focus:border-accent resize-y" /></label>
 <button type="submit" disabled={submitting || products.length === 0} className="h-12 bg-text-primary text-background-secondary font-sans text-xs font-semibold hover:bg-accent transition-colors w-full disabled:opacity-60 disabled:cursor-not-allowed">{submitting ? "Đang gửi..." : "Gửi đánh giá"}</button>
 <p className="font-sans text-[10px] text-text-secondary/70 text-center">Email chỉ dùng để xác minh và không hiển thị công khai.</p>
 </motion.form>
 </div></section>
 </div>
 );
}

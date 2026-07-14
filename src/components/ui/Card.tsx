"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { motion } from "framer-motion";
import { ProductColorVariant, ProductStockStatus } from "@/data/mock/products";
import { AnimatedHeart } from "@/components/ui/AnimatedIcon";
import { scrollFadeUp, scrollViewport } from "@/lib/animations";

interface ProductCardProps {
 id: string;
 title: string;
 price: number;
 image: string;
 hoverImage?: string;
 collection?: string;
 variants?: ProductColorVariant[];
 /** Editorial label (e.g. "Phiên bản đặc biệt"). Rendered as a corner tag. */
 badge?: string;
 /** Pre-discount price. When greater than `price`, shows a discount badge + struck-through price. */
 originalPrice?: number;
 stockStatus?: ProductStockStatus;
 /** Position within a grid — drives a staggered reveal delay. */
 index?: number;
}

export const ProductCard = React.memo(function ProductCard({
 id,
 title,
 price,
 image,
 hoverImage,
 collection,
 variants,
 badge,
 originalPrice,
 stockStatus = "in_stock",
 index,
}: ProductCardProps) {
 const { toggleWishlist, isInWishlist } = useStore();
 const router = useRouter();
 const wishlisted = isInWishlist(id);
 const [currentImage, setCurrentImage] = useState(image);

 useEffect(() => {
 setCurrentImage(image);
 }, [image]);

 const isOutOfStock = stockStatus === "out_of_stock";
 const discountPercent =
 originalPrice && originalPrice > price
 ? Math.round((1 - price / originalPrice) * 100)
 : null;

 const handleViewProduct = (e: React.MouseEvent) => {
 e.preventDefault();
 e.stopPropagation();
 if (isOutOfStock) return;
 router.push(`/product/${id}`);
 };

 const activeVariant = variants?.find((v) => v.images[0] === currentImage);
 const cardHoverImage = activeVariant && activeVariant.images.length > 1
 ? activeVariant.images[1]
 : hoverImage;

 return (
 <motion.div
 variants={scrollFadeUp}
 custom={typeof index === "number" ? index * 0.08 : 0}
 initial="hidden"
 whileInView="visible"
 viewport={scrollViewport}
 className="group relative flex flex-col w-full bg-transparent cursor-pointer"
 >
 {/* 1. Large Image Frame - Image Dominates */}
 <div className="relative aspect-[3/4] w-full overflow-hidden bg-background-secondary border border-brand-border/40">

 {/* Corner badges */}
 <div className="absolute top-3 start-3 z-20 flex flex-col items-start gap-1.5 pointer-events-none">
 {discountPercent !== null && (
 <span className="bg-accent-dark text-background-secondary text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-1 shadow-sm">
 -{discountPercent}%</span>
 )}
 {badge && (
 <span className="bg-background-primary text-text-primary text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-1 shadow-sm">
 {badge}
 </span>
 )}
 </div>

 {/* Wishlist — always reachable on touch, hover-revealed on desktop */}
 <div className="absolute top-3 end-3 z-20"> <AnimatedHeart
 active={wishlisted}
 size="sm"
 onClick={() => toggleWishlist({ id, title, price, image, collection })}
 className="p-2.5 rounded-full bg-background-primary/80 backdrop-blur-md shadow-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 hover:bg-background-primary"
 /> </div>

 {/* Catalog Image Swapper */}
 <Link href={`/product/${id}`} className="block w-full h-full relative"> <motion.div
 key={currentImage}
 initial={{ opacity: 0.5 }}
 animate={{ opacity: 1 }}
 transition={{ duration: 0.3 }}
 className="absolute inset-0 w-full h-full overflow-hidden"
 > <Image
 src={currentImage}
 alt={title}
 fill
 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
 className={`object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105 ${isOutOfStock ? "opacity-60 grayscale-[0.3]" : ""}`}
 /> </motion.div>
 {cardHoverImage && !isOutOfStock && (
 <div className="absolute inset-0 w-full h-full opacity-0 transition-opacity duration-[800ms] ease-out group-hover:opacity-100 overflow-hidden"> <Image
 src={cardHoverImage}
 alt={`${title} - ảnh phối đồ`}
 fill
 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
 className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
 /> </div>
 )}

 {isOutOfStock && (
 <div className="absolute inset-0 z-10 flex items-center justify-center bg-text-primary/15"> <span className="bg-text-primary text-background-secondary text-[11px] font-sans font-bold uppercase tracking-wider px-4 py-2">
 Hết hàng
 </span> </div>
 )}
 </Link>

 {/* Hover quick add overlay - Solid Background, No Glassmorphism */}
 <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out bg-text-primary flex flex-col gap-2 z-10"> <span className="text-[10px] text-background-secondary font-sans">Xem màu sắc, kích cỡ và chất liệu</span> <button
 onClick={handleViewProduct}
 disabled={isOutOfStock}
 className="w-full bg-background-secondary text-text-primary text-[10px] font-sans font-semibold py-2.5 hover:bg-accent hover:text-background-secondary transition-colors text-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-background-secondary disabled:hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
 >
 {isOutOfStock ? "Hết hàng" : "Xem sản phẩm"}
 </button> </div> </div>

 {/* 2. Details Pane - Minimal Editorial Typography */}
 <div className="pt-4 flex flex-col items-start gap-1 w-full">
 {collection && (
 <span className="font-sans text-[9px] font-bold uppercase tracking-[0.15em] text-text-secondary/70">
 {collection}
 </span>
 )}
 <h3 className="font-sans text-xs text-text-primary hover:text-accent font-medium transition-colors leading-snug"> <Link href={`/product/${id}`}>
 {title}
 </Link> </h3> <div className="flex justify-between items-center w-full mt-0.5"> <span className="flex items-baseline gap-2"> <span className={`font-display text-xs font-medium ${discountPercent !== null ? "text-accent-dark font-semibold" : "text-text-secondary"}`}>
 {price.toLocaleString()} đ
 </span>
 {discountPercent !== null && (
 <span className="font-display text-[10px] text-text-secondary/50 line-through">
 {originalPrice!.toLocaleString()} đ
 </span>
 )}
 {stockStatus === "low_stock" && (
 <span className="font-sans text-[9px] text-accent-dark font-bold uppercase tracking-wide"></span>
 )}
 </span>
 {variants && variants.length > 0 && (
 <div className="flex gap-1.5" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
 {variants.map((v) => (
 <button
 key={v.color}
 onClick={(e) => {
 e.preventDefault();
 e.stopPropagation();
 setCurrentImage(v.images[0]);
 }}
 className="w-3.5 h-3.5 rounded-full border transition-all duration-300 bg-background-primary flex items-center justify-center cursor-pointer"
 style={{
 borderColor: currentImage === v.images[0] ? "var(--color-accent-dark)" : "var(--color-brand-border)",
 borderWidth: currentImage === v.images[0] ? "1.5px" : "1px",
 transform: currentImage === v.images[0] ? "scale(1.08)" : "none",
 }}
 title={v.color}
 aria-label={`Chọn màu ${v.color}`}
 aria-pressed={currentImage === v.images[0]}
 > <span
 className="w-2 h-2 rounded-full border border-black/5"
 style={{ backgroundColor: v.value }}
 /> </button>
 ))}
 </div>
 )}
 </div> </div> </motion.div>
 );
});

interface StoryCardProps {
 title: string;
 description: string;
 image: string;
 tag?: string;
 reversed?: boolean;
}

export const StoryCard = React.memo(function StoryCard({ title, description, image, tag, reversed = false }: StoryCardProps) {
 return (
 <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center ${reversed ? "md:flex-row-reverse" : ""}`}>
 {/* Image frame */}
 <motion.div
 initial={{ opacity: 0 }}
 whileInView={{ opacity: 1 }}
 viewport={{ once: true, margin: "200px" }}
 transition={{ duration: 0.8 }}
 className={`relative ${reversed ? "md:order-2" : ""}`}
 > <div className="relative aspect-[3/4] w-full overflow-hidden border border-brand-border"> <Image
 src={image}
 alt={title}
 fill
 sizes="(max-width: 768px) 100vw, 50vw"
 className="object-cover"
 /> </div> </motion.div>

 {/* Text frame - Premium Spacing */}
 <motion.div
 initial={{ opacity: 0 }}
 whileInView={{ opacity: 1 }}
 viewport={{ once: true, margin: "200px" }}
 transition={{ duration: 0.6, delay: 0.1 }}
 className={`flex flex-col items-start gap-4 max-w-[500px] ${reversed ? "md:order-1" : ""}`}
 >
 {tag && (
 <span className="font-sans text-[10px] text-accent font-bold uppercase">
 {tag}
 </span>
 )}
 <h3 className="font-display text-3xl font-semibold leading-tight text-text-primary">
 {title}
 </h3> <p className="font-sans text-sm font-light text-text-secondary leading-relaxed">
 {description}
 </p> </motion.div> </div>
 );
});

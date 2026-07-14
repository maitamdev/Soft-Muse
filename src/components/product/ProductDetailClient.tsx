"use client";

import React, { useState, use, useEffect } from "react";
import Link from "next/link";
import { IconHeart as Heart, IconShoppingBag as ShoppingBag, IconCheck as Check, IconX as X } from "@tabler/icons-react";
import { useStore } from "@/context/StoreContext";
import { useNotification } from "@/context/NotificationContext";
import { useStorefrontProductsState } from "@/hooks/useStorefrontProducts";
import { primaryImage, discountOriginalPrice, resolveStockStatus } from "@/data/mock/products";
import { getRelatedProducts } from "@/lib/catalog/storefront-catalog";
import { ProductCard } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { analytics } from "@/utils/analytics";
import Image from "next/image";
import CompleteTheLook from "@/components/product/CompleteTheLook";
import SizeRecommendation from "@/components/product/SizeRecommendation";
import RecentlyViewed from "@/components/product/RecentlyViewed";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import type { Product } from "@/data/mock/products";

interface PageProps {
 params: Promise<{ id: string }>;
 initialProduct?: Product;
}

export default function ProductDetailClient({ params, initialProduct }: PageProps) {
 const resolvedParams = use(params);
 const { id } = resolvedParams;
 const { addToCart, toggleWishlist, isInWishlist } = useStore();
 const { showNotification } = useNotification();

 const { products, loading: productsLoading } = useStorefrontProductsState();
 const product = products.find((p) => p.id === id) ?? (productsLoading ? initialProduct : undefined);

 // States
 const [selectedSize, setSelectedSize] = useState("");
 const [selectedColor, setSelectedColor] = useState("");
 const [activeImage, setActiveImage] = useState(product ? primaryImage(product) : "");
 const [quantity, setQuantity] = useState(1);
 const [isAdded, setIsAdded] = useState(false);
 const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
 const [activeDetailsTab, setActiveDetailsTab] = useState("story");

 const { addViewedItem } = useRecentlyViewed();

 useEffect(() => {
 if (product) {
 analytics.trackProductView(product.id, product.name, product.price);
 addViewedItem(product.id);
 }
 }, [product, addViewedItem]);

 if (!product) {
 return (
 <div className="max-w-[720px] mx-auto py-24 text-center"> <h2 className="font-sans text-3xl font-light text-text-primary">Không tìm thấy sản phẩm</h2> <p className="text-xs text-text-secondary mt-2">Sản phẩm có thể đã ngừng bán hoặc không còn hiển thị.</p> <Link href="/shop" className="mt-6 inline-block"> <Button variant="primary">Quay lại cửa hàng</Button> </Link> </div>
 );
 }

 const colorOptions = product.colorVariants?.length
 ? product.colorVariants.filter((variant) => variant.color.trim())
 : (product.colors ?? []).filter(Boolean).map((color) => ({ color, value: "#D8C8B6", images: [] }));
 const sizeOptions = (product.sizes ?? []).filter(Boolean);
 const hasColorOptions = colorOptions.length > 0;
 const hasSizeOptions = sizeOptions.length > 0;

 // Match only against attributes that this product actually offers.
 const selectedVariant = colorOptions.find((variant) => variant.color === selectedColor);

 // Gallery images array (fallback to defaults if no variant is selected)
 const defaultImages = [
 primaryImage(product),
 product.hoverImage || "/images/flatlay/flatlay_1.png",
 "/images/detail/detail_fabric.png",
 "/images/lifestyle/lifestyle_interior.png",
 ];

 const galleryImages = selectedVariant && selectedVariant.images && selectedVariant.images.length > 0
 ? selectedVariant.images
 : defaultImages;

 const handleColorSelect = (color: string) => {
 setSelectedColor(color);
 const variant = product.colorVariants?.find((v) => v.color === color);
 if (variant && variant.images && variant.images.length > 0) {
 setActiveImage(variant.images[0]);
 }
 };

 const cartVariant = product.variants.find((variant) =>
 (!hasColorOptions || variant.color === selectedColor)
 && (!hasSizeOptions || variant.size === selectedSize)
 );
 const selectionComplete = (!hasColorOptions || Boolean(selectedColor)) && (!hasSizeOptions || Boolean(selectedSize));
 const isOutOfStock = selectionComplete && product.variants.length ? !cartVariant || cartVariant.stock <= 0 : resolveStockStatus(product) === "out_of_stock";
 const displayPrice = cartVariant?.price ?? product.price;
 const displayedStock = cartVariant?.stock ?? product.stock;

 const handleAddToBag = () => {
 if (isOutOfStock) return;
 const missingColor = hasColorOptions && !selectedColor;
 const missingSize = hasSizeOptions && !selectedSize;
 if (missingColor || missingSize) {
 const message = missingColor && missingSize
 ? "Vui lòng chọn màu sắc và kích cỡ trước khi thêm vào giỏ hàng."
 : missingColor
 ? "Vui lòng chọn màu sắc trước khi thêm vào giỏ hàng."
 : "Vui lòng chọn kích cỡ trước khi thêm vào giỏ hàng.";
 showNotification(message, "warning");
 return;
 }
 if (product.variants.length && !cartVariant) { showNotification("Phân loại này hiện không tồn tại. Vui lòng chọn màu hoặc kích cỡ khác.", "warning"); return; }
 if (cartVariant && cartVariant.stock < quantity) { showNotification(`Phân loại này chỉ còn ${cartVariant.stock} sản phẩm.`, "warning"); return; }
 const sellingPrice = cartVariant?.price ?? product.price;
 addToCart({
 id: product.id,
 variantId: cartVariant?.id,
 title: product.name,
 price: sellingPrice,
 image: activeImage || primaryImage(product),
 size: selectedSize,
 color: selectedColor,
 collection: product.collection,
 variantImages: galleryImages,
 }, quantity);
 analytics.trackAddToCart(product.id, product.name, sellingPrice, selectedSize, selectedColor, quantity);
 showNotification(
 "Đã thêm sản phẩm vào giỏ hàng.",
 "success"
 );
 setIsAdded(true);
 setTimeout(() => setIsAdded(false), 2000);
 };

 const wishlisted = isInWishlist(product.id);

 // Same-collection matches first, backfilled with same-season items, capped at 4.
 const relatedProducts = getRelatedProducts(product, products);

 return (
 <div className="bg-background-primary min-h-screen pb-20 md:pb-0 flex flex-col items-center">
 
 {/* Breadcrumbs */}
 <nav className="w-full max-w-[1280px] px-6 md:px-12 py-6 text-xs text-text-secondary font-sans font-light flex items-center gap-2 border-b border-brand-border/40"> <Link href="/">Trang chủ</Link> / 
 <Link href="/shop">Cửa hàng</Link> / 
 <span className="text-text-primary font-medium">{product.name}</span> </nav>

 {/* Main product display section */}
 <main className="w-full max-w-[1280px] px-6 md:px-12 py-12"> <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 md:gap-16 items-start">
 
 {/* Right Column: Visual Gallery */}
 <div className="flex gap-4">
 
 {/* Gallery Thumbnails List */}
 <div className="flex flex-col gap-3 w-16 md:w-20 shrink-0">
 {galleryImages.map((img, idx) => (
 <button
 key={idx}
 onClick={() => setActiveImage(img)}
 className={`relative aspect-[3/4] border transition-all duration-300 ${
 activeImage === img ? "border-accent" : "border-brand-border/60 hover:border-text-primary"
 } bg-background-secondary`}
 > <Image src={img} alt={`hiển thị${idx}`} fill sizes="80px" className="object-cover" /> </button>
 ))}
 </div>

 {/* Big Main Image Preview */}
 <div className="flex-grow aspect-[3/4] overflow-hidden border border-brand-border/60 bg-background-secondary relative"> <Image
 key={activeImage || primaryImage(product)}
 src={activeImage || primaryImage(product)}
 alt={product.name}
 fill
 priority
 sizes="(max-width: 768px) 100vw, 50vw"
 className="absolute inset-0 w-full h-full object-cover animate-fade-in"
 /> </div> </div>

 {/* Left Column: Product Option Config Panel - SOLID BACKGROUNDS, NO GLASS */}
 <div className="flex flex-col gap-6 lg:sticky lg:top-24 bg-background-secondary border border-brand-border p-6 md:p-8 w-full text-left" dir="ltr"> <div> <span className="text-xs text-accent font-sans font-semibold block mb-1">
 {product.collection}
 </span> <h1 className="font-sans text-2xl font-light text-text-primary leading-snug">
 {product.name}
 </h1> <div className="flex items-center gap-2 mt-2 flex-wrap">
 {product.badge && (
 <span className="inline-block bg-accent text-background-secondary text-[9px] font-sans font-bold px-2 py-0.5">
 {product.badge}
 </span>
 )}
 {isOutOfStock && (
 <span className="inline-block bg-text-primary text-background-secondary text-[9px] font-sans font-bold uppercase px-2 py-0.5">
 Hết hàng
 </span>
 )}
 {displayedStock > 0 && displayedStock <= product.lowStockLimit && (
 <span className="inline-block border border-accent-dark text-accent-dark text-[9px] font-sans font-bold uppercase px-2 py-0.5">Chỉ còn {displayedStock}</span>
 )}
 </div> </div> <div className="flex items-baseline gap-3"> <span className="font-display text-2xl font-semibold text-accent">
 {displayPrice.toLocaleString()} đ
 </span>
 {discountOriginalPrice(product) && (
 <span className="font-display text-sm text-text-secondary/50 line-through">
 {discountOriginalPrice(product)!.toLocaleString()} đ
 </span>
 )}
 </div> <p className="font-sans text-xs md:text-sm font-light text-text-secondary leading-relaxed">
 {product.description}
 </p>

 {/* Colors Swatch Choice */}
 {hasColorOptions && (
 <div className="flex flex-col gap-2"> <label className="text-[10px] font-sans font-bold text-text-secondary">
 Màu sắc: {selectedColor || "Chọn màu"}
 </label> <div className="flex gap-3">
 {colorOptions.map((col) => {
 const unavailable = Boolean(product.variants.length && selectedSize && !product.variants.some((variant) => variant.color === col.color && variant.size === selectedSize && variant.stock > 0));
 return (
 <button
 key={col.color}
 onClick={() => handleColorSelect(col.color)}
 className="relative w-8 h-8 rounded-full border transition-all duration-300 bg-background-primary flex items-center justify-center animate-fade-in"
 style={{
 borderColor: selectedColor === col.color ? "var(--color-accent-dark)" : "var(--color-brand-border)",
 borderWidth: selectedColor === col.color ? "2px" : "1px",
 transform: selectedColor === col.color ? "scale(1.05)" : "none",
 }}
 title={col.color}
 aria-label={`Chọn màu ${col.color}`}
 aria-pressed={selectedColor === col.color}
 disabled={unavailable}
 data-unavailable={unavailable || undefined}
 > <span
 className="absolute inset-1 rounded-full border border-black/5 shadow-sm"
 style={{ backgroundColor: col.value }}
 />{unavailable && <span className="absolute h-px w-9 rotate-45 bg-text-secondary/50" />}</button>
 )})}
 </div> </div>
 )}

 {/* Sizes Box Choice */}
 {hasSizeOptions && (
 <div className="flex flex-col gap-2"> <div className="flex justify-between items-center text-[10px] font-sans font-bold text-text-secondary w-full"> <span>Kích cỡ: {selectedSize || "Kích cỡ"}</span> <button
 onClick={() => setIsSizeGuideOpen(true)}
 className="text-accent hover:underline text-[10px] font-bold"
 type="button"
 >
 Kích cỡ
 </button> </div> <div className="flex gap-2">
 {sizeOptions.map((sz) => {
 const unavailable = Boolean(product.variants.length && selectedColor && !product.variants.some((variant) => variant.color === selectedColor && variant.size === sz && variant.stock > 0));
 return (
 <button
 key={sz}
 onClick={() => setSelectedSize(sz)}
 aria-label={`Kích cỡ: ${sz}`}
 aria-pressed={selectedSize === sz}
 disabled={unavailable}
 className="text-xs px-4 py-2 border transition-all duration-300 bg-background-primary"
 style={{
 borderColor: selectedSize === sz ? "var(--color-accent-dark)" : "var(--color-brand-border)",
 backgroundColor: selectedSize === sz ? "rgba(142, 107, 75, 0.08)" : "transparent",
 color: unavailable ? "var(--color-text-secondary)" : selectedSize === sz ? "var(--color-accent-dark)" : "var(--color-text-secondary)",
 opacity: unavailable ? 0.4 : 1,
 fontWeight: selectedSize === sz ? "bold" : "normal",
 }}
 >
 {sz}
 </button>
 )})}
 </div> </div>
 )}

 {/* Premium Size Recommendation Form */}
 <SizeRecommendation />

 {/* Quantity select */}
 <div className="flex flex-col gap-2"> <label className="text-[10px] font-sans font-bold text-text-secondary">Số lượng</label> <input
 type="number"
 min="1"
 max={Math.max(1, displayedStock)}
 value={quantity}
 onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
 className="w-20 bg-background-primary border border-brand-border text-xs p-2 outline-none focus:border-accent text-center font-display"
 /> </div>

 {/* Add to cart / wishlist actions */}
 <div className="flex gap-4 mt-4 w-full"> <Button
 variant="primary"
 onClick={handleAddToBag}
 disabled={isOutOfStock}
 className="flex-grow h-12 disabled:opacity-50 disabled:cursor-not-allowed"
 >
 {isOutOfStock ? (
 <span>Hết hàng</span>
 ) : isAdded ? (
 <> <Check className="w-4 h-4 text-background-secondary" /> <span>Đã thêm</span> </>
 ) : (
 <> <ShoppingBag className="w-4 h-4 text-background-secondary" /> <span>Thêm vào giỏ</span> </>
 )}
 </Button> <Button
 variant="secondary"
 onClick={() => toggleWishlist({ id: product.id, title: product.name, price: displayPrice, image: primaryImage(product), collection: product.collection })}
 className={`h-12 w-1/3 ${wishlisted ? "border-accent text-accent" : ""}`}
 > <Heart className={`w-4 h-4 ${wishlisted ? "fill-accent text-accent" : ""}`} /> <span className="sr-only">Yêu thích</span> </Button> </div>

 {/* Trust Micro-copy below Action buttons */}
 <div className="flex flex-row justify-between items-center text-[10px] text-text-secondary border-t border-b border-brand-border py-3 my-2 font-sans w-full"> <span className="flex items-center gap-1">✓ Đổi size 7 ngày</span> <span className="flex items-center gap-1">✓ Giao hàng toàn quốc</span> <span className="flex items-center gap-1">✓ Tư vấn tận tâm</span> </div>

 {/* Elegant Luxury Tabs */}
 <div className="border-t border-brand-border mt-8 pt-6 w-full text-left" dir="ltr"> <div className="flex border-b border-brand-border pb-2 gap-6 md:gap-8 overflow-x-auto scrollbar-none"> <button
 onClick={() => setActiveDetailsTab("story")}
 className={`text-xs font-sans font-bold pb-2 transition-all relative whitespace-nowrap cursor-pointer ${
 activeDetailsTab === "story" ? "text-accent border-b-2 border-accent" : "text-text-secondary hover:text-text-primary"
 }`}
 type="button"
 >
 Phom dáng </button> <button
 onClick={() => setActiveDetailsTab("fabric")}
 className={`text-xs font-sans font-bold pb-2 transition-all relative whitespace-nowrap cursor-pointer ${
 activeDetailsTab === "fabric" ? "text-accent border-b-2 border-accent" : "text-text-secondary hover:text-text-primary"
 }`}
 type="button"
 > Chất liệu</button> <button
 onClick={() => setActiveDetailsTab("fit")}
 className={`text-xs font-sans font-bold pb-2 transition-all relative whitespace-nowrap cursor-pointer ${
 activeDetailsTab === "fit" ? "text-accent border-b-2 border-accent" : "text-text-secondary hover:text-text-primary"
 }`}
 type="button"
 > Bảng size</button> <button
 onClick={() => setActiveDetailsTab("shipping")}
 className={`text-xs font-sans font-bold pb-2 transition-all relative whitespace-nowrap cursor-pointer ${
 activeDetailsTab === "shipping" ? "text-accent border-b-2 border-accent" : "text-text-secondary hover:text-text-primary"
 }`}
 type="button"
 >
 Vận chuyển
 </button> </div> <div className="mt-4 min-h-[160px]"> <AnimatePresence mode="wait"> <motion.div
 key={activeDetailsTab}
 initial={{ opacity: 0, y: 4 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -4 }}
 transition={{ duration: 0.2 }}
 className="text-xs text-text-secondary font-light leading-relaxed"
 >
 {activeDetailsTab === "story" && (
 <div className="flex flex-col gap-3"> <p className="font-serif italic text-text-primary text-sm">
 &quot;Một thiết kế tối giản cho ngày làm việc hiện đại.&quot;
 </p> <p>
 {product.description} Phom dáng được cân bằng giữa sự chỉn chu và cảm giác thoải mái, phù hợp môi trường văn phòng, lớp học, ngân hàng hoặc những buổi gặp gỡ sau giờ làm.
 </p> </div>
 )}

 {activeDetailsTab === "fabric" && (
 <div className="flex flex-col gap-3"> <p className="font-medium text-text-primary">{product.fabric}</p> <p>Thông tin chi tiết:</p> <ul className="list-disc pl-4 flex flex-col gap-1.5 text-[11px] text-text-secondary">
 {(product.details ?? []).map((det, idx) => (
 <li key={idx}>{det}</li>
 ))}
 </ul> <div className="flex gap-4 items-center mt-3 pt-3 border-t border-brand-border/40"> <Image src="/images/detail/detail_fabric.png" alt="Chất liệu Soft Muse" width={100} height={50} className="border border-brand-border h-auto object-cover" /> <div> <span className="font-bold block text-text-primary text-[10px]">Bảo quản:</span> <span className="block text-[10px] text-text-secondary">Giặt nhẹ, phơi trong bóng râm và ủi nhiệt độ thấp để giữ phom sản phẩm.</span> </div> </div> </div>
 )}

 {activeDetailsTab === "fit" && (
 <div className="flex flex-col gap-3"> <p>
 Sản phẩm có phom vừa vặn. Nếu bạn ở giữa hai size, hãy chọn size lớn hơn để thoải mái khi ngồi làm việc cả ngày.
 </p> <ul className="list-disc pl-4 flex flex-col gap-1 text-[11px] text-text-secondary"> <li>XS-S: dáng nhỏ, vai và eo gọn.</li> <li>M-L: phom tiêu chuẩn, dễ mặc đi làm.</li> <li>XL/F: ưu tiên độ thoải mái hoặc phụ kiện freesize.</li> </ul> <p className="mt-2 text-accent">
 Cần tư vấn số đo? Nhắn Zalo hoặc Messenger để Soft Muse hỗ trợ chọn size.</p> </div>
 )}

 {activeDetailsTab === "shipping" && (
 <div className="flex flex-col gap-3"> <p>{product.packaging}</p> <p>
 Miễn phí đổi size trong 7 ngày với sản phẩm còn nguyên tem mác và chưa qua sử dụng.</p> <div className="flex gap-4 items-center mt-3 pt-3 border-t border-brand-border/40"> <Image src="/images/flatlay/flatlay_1.png" alt="Đóng gói Soft Muse" width={100} height={50} className="border border-brand-border h-auto object-cover" /> <div> <span className="font-bold block text-text-primary text-[10px]">Thời gian giao hàng:</span> <span className="block text-[10px] text-accent">TP. Hồ Chí Minh: 1-2 ngày. Tỉnh/thành khác: 2-5 ngày.</span> </div> </div> </div>
 )}
 </motion.div> </AnimatePresence> </div> </div> </div> </div> </main>

 {/* Related Products Grid */}
 {relatedProducts.length > 0 && (
 <section className="w-full bg-background-secondary border-t border-brand-border py-16 md:py-24"> <div className="max-w-[1280px] mx-auto px-6 md:px-12"> <div className="text-center mb-12"> <span className="font-sans text-xs text-accent font-bold uppercase"></span> <h2 className="font-sans text-2xl md:text-3xl font-light text-text-primary mt-1"> </h2> </div> <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
 {relatedProducts.map((rel, index) => (
 <ProductCard
 key={rel.id}
 id={rel.id}
 title={rel.name}
 price={rel.price}
 originalPrice={discountOriginalPrice(rel)}
 image={primaryImage(rel)}
 hoverImage={rel.hoverImage}
 collection={rel.collection}
 badge={rel.badge}
 stockStatus={resolveStockStatus(rel)}
 index={index}
 />
 ))}
 </div> </div> </section>
 )}

 {/* Complete The Look Section */}
 <CompleteTheLook currentProduct={product} />

 {/* Recently Viewed Section */}
 <RecentlyViewed />

 {/* STICKY BOTTOM PURCHASE PANEL - Solid Background, No Blur */}
 <div className="fixed bottom-16 md:bottom-0 left-0 right-0 h-16 bg-background-secondary border-t border-brand-border z-30 flex items-center shadow-md"> <div className="max-w-[1280px] mx-auto w-full px-6 md:px-12 flex justify-between items-center gap-4"> <div className="flex items-center gap-3"> <div className="relative w-10 h-12 shrink-0 border border-brand-border bg-background-primary"> <Image src={primaryImage(product)} alt="" fill sizes="40px" className="object-cover" /> </div> <div className="hidden sm:block"> <h5 className="font-sans text-xs font-bold truncate max-w-xs">{product.name}</h5> {(hasSizeOptions || hasColorOptions) && <span className="text-[10px] text-text-secondary font-light">{hasSizeOptions && `Kích cỡ: ${selectedSize || "Chưa chọn"}`}{hasSizeOptions && hasColorOptions && " | "}{hasColorOptions && `Màu: ${selectedColor || "Chưa chọn"}`}</span>} </div> </div> <div className="flex items-center gap-4"> <span className="font-display text-sm text-accent font-semibold">{displayPrice.toLocaleString()} đ</span> <Button
 variant="primary"
 onClick={handleAddToBag}
 className="h-10 px-6 text-[10px]"
 >
 {isAdded ? "Đã thêm" : "Thêm vào giỏ"}
 </Button> </div> </div> </div>

 {/* Interactive Size Guide Drawer Modal - Premium AURA Aesthetics */}
 <AnimatePresence>
 {isSizeGuideOpen && (
 <> <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 0.5 }}
 exit={{ opacity: 0 }}
 onClick={() => setIsSizeGuideOpen(false)}
 className="fixed inset-0 bg-text-primary/45 z-[999]"
 /> <motion.div
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.95 }}
 transition={{ duration: 0.3, ease: "easeOut" }}
 className="fixed inset-6 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-[500px] sm:h-auto bg-background-secondary border border-brand-border z-[1000] p-6 flex flex-col gap-6 text-left"
 dir="ltr"
 > <div className="flex justify-between items-center border-b border-brand-border pb-4"> <h3 className="font-sans text-lg font-bold text-text-primary">Bảng size Soft Muse</h3> <button
 onClick={() => setIsSizeGuideOpen(false)}
 className="p-1 hover:text-accent transition-colors"
 > <X className="w-5 h-5 stroke-[1.5]" /> </button> </div> <div className="overflow-x-auto"> <table className="w-full text-xs font-sans border-collapse"> <thead> <tr className="border-b border-brand-border bg-background-primary"> <th className="py-2 px-3 text-left text-text-primary font-bold">Kích cỡ</th> <th className="py-2 px-3 text-left text-text-primary font-bold">Ngực (cm)</th> <th className="py-2 px-3 text-left text-text-primary font-bold">Eo (cm)</th> <th className="py-2 px-3 text-left text-text-primary font-bold">Hông (cm)</th> </tr> </thead> <tbody> <tr className="border-b border-brand-border/60"> <td className="py-2.5 px-3 font-semibold text-accent">XS</td> <td className="py-2.5 px-3 text-text-secondary">80-84</td> <td className="py-2.5 px-3 text-text-secondary">60-64</td> <td className="py-2.5 px-3 text-text-secondary">86-90</td> </tr> <tr className="border-b border-brand-border/60"> <td className="py-2.5 px-3 font-semibold text-accent">S</td> <td className="py-2.5 px-3 text-text-secondary">84-88</td> <td className="py-2.5 px-3 text-text-secondary">64-68</td> <td className="py-2.5 px-3 text-text-secondary">90-94</td> </tr> <tr className="border-b border-brand-border/60"> <td className="py-2.5 px-3 font-semibold text-accent">M</td> <td className="py-2.5 px-3 text-text-secondary">88-92</td> <td className="py-2.5 px-3 text-text-secondary">68-72</td> <td className="py-2.5 px-3 text-text-secondary">94-98</td> </tr> <tr className="border-b border-brand-border/60"> <td className="py-2.5 px-3 font-semibold text-accent">L</td> <td className="py-2.5 px-3 text-text-secondary">92-96</td> <td className="py-2.5 px-3 text-text-secondary">72-76</td> <td className="py-2.5 px-3 text-text-secondary">98-102</td> </tr> <tr className="border-b border-brand-border/60"> <td className="py-2.5 px-3 font-semibold text-accent">XL</td> <td className="py-2.5 px-3 text-text-secondary">96-100</td> <td className="py-2.5 px-3 text-text-secondary">76-80</td> <td className="py-2.5 px-3 text-text-secondary">102-106</td> </tr> </tbody> </table> </div> <div className="bg-background-primary p-3 border border-brand-border text-[10px] text-text-secondary leading-relaxed">
 * Số đo là gợi ý tham khảo. Nếu cần hỗ trợ chọn size, hãy gửi chiều cao, cân nặng và số đo 3 vòng cho Soft Muse qua Zalo hoặc Messenger.</div> <Button
 variant="primary"
 onClick={() => setIsSizeGuideOpen(false)}
 className="w-full h-10 mt-2"
 >
 Đã hiểu
 </Button> </motion.div> </>
 )}
 </AnimatePresence> </div>
 );
}

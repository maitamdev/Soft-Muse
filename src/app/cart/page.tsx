"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/context/StoreContext";
import { IconShoppingBag as ShoppingBag, IconPlus as Plus, IconMinus as Minus, IconX as X } from "@tabler/icons-react";
import Button from "@/components/ui/Button";
import { ContentService } from "@/lib/services/storefront/content.service";
import { useEventSubscribeMany } from "@/hooks/useEventBus";

const DEFAULT_EMPTY = {
 cart_empty_title: 'Giỏ hàng của bạn đang trống',
 cart_empty_text: 'Hãy khám phá bộ sưu tập và chọn thiết kế yêu thích.',
 cart_empty_btn: 'Vào cửa hàng',
};

export default function CartPage() {
 const { cart, cartSubtotal, cartCount, updateQuantity, removeFromCart } = useStore();
 const [empty, setEmpty] = useState(DEFAULT_EMPTY);

 const loadContent = useCallback(async () => {
 try {
 const blocks = await ContentService.getContentByGroup('pages');
 const map: Record<string, string> = {};
 blocks.forEach(b => { map[b.key] = b.value; });
 setEmpty(prev => ({ ...prev, ...map }));
 } catch {
 // keep defaults
 }
 }, []);

 useEffect(() => { loadContent(); }, [loadContent]);
 useEventSubscribeMany(['website.changed'], loadContent);

 return (
 <div className="bg-background-primary min-h-screen flex flex-col items-center">
 {/* 1. Header */}
 <section className="w-full bg-background-secondary py-12 border-b border-brand-border flex flex-col items-center"> <div className="max-w-[720px] mx-auto px-6 text-center"> <span className="font-sans text-[10px] text-accent font-bold uppercase tracking-[0.2em]">Soft Muse</span> <h1 className="font-sans text-3xl font-light text-text-primary mt-2">Giỏ hàng</h1> <p className="font-sans text-xs text-text-secondary font-light mt-3 leading-relaxed">
Kiểm tra sản phẩm, số lượng và tổng đơn trước khi thanh toán.</p> </div> </section>

 {/* 2. Content */}
 <main className="w-full max-w-[1280px] px-6 md:px-12 py-16">
 {cart.length === 0 ? (
 <div className="text-center py-20 bg-background-secondary border border-brand-border max-w-xl mx-auto flex flex-col items-center gap-6"> <ShoppingBag className="w-12 h-12 stroke-[1] text-brand-border" /> <div> <h3 className="font-sans text-lg font-light text-text-primary">{empty.cart_empty_title}</h3> <p className="font-sans text-xs text-text-secondary font-light mt-1">{empty.cart_empty_text}</p> </div> <Link href="/shop"> <Button variant="primary">{empty.cart_empty_btn}</Button> </Link> </div>
 ) : (
 <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 items-start">
 
 {/* Items list */}
 <div className="bg-background-secondary border border-brand-border p-6 md:p-8 flex flex-col gap-6">
 {cart.map((item) => (
 <div
 key={`${item.id}-${item.size}-${item.color}`}
 className="flex gap-4 md:gap-6 border-b border-brand-border pb-6 last:border-b-0 last:pb-0"
 > <div className="relative w-20 h-28 shrink-0 bg-background-primary border border-brand-border"> <Image
 src={item.image}
 alt={item.title}
 fill
 sizes="80px"
 className="object-cover"
 /> </div> <div className="flex-grow flex flex-col justify-between"> <div> <span className="text-[10px] text-accent block font-bold mb-1 uppercase">
 {item.collection || "Soft Muse"}
 </span> <h4 className="font-sans text-base font-medium text-text-primary leading-snug">
 {item.title}
 </h4> <div className="font-sans text-xs text-text-secondary flex flex-col gap-1 mt-2"> <div>Kích cỡ: <span className="text-text-primary font-medium">{item.size || "Chưa chọn"}</span></div> </div> </div> <div className="flex justify-between items-center mt-4">
 {/* Quantity Controls */}
 <div className="flex items-center border border-brand-border bg-background-primary"> <button
 onClick={() => updateQuantity(item.id, item.quantity - 1, item.size, item.color)}
 className="p-2 text-text-secondary hover:text-accent hover:bg-background-secondary transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
 aria-label="Số lượng"
 > <Minus className="w-3.5 h-3.5" /> </button> <span className="px-3 text-xs font-bold w-10 text-center font-display">
 {item.quantity}
 </span> <button
 onClick={() => updateQuantity(item.id, item.quantity + 1, item.size, item.color)}
 className="p-2 text-text-secondary hover:text-accent hover:bg-background-secondary transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
 aria-label="Số lượng"
 > <Plus className="w-3.5 h-3.5" /> </button> </div> <span className="font-display text-base font-bold text-accent">
 {(item.price * item.quantity).toLocaleString()} đ
 </span> </div> </div> <button
 onClick={() => removeFromCart(item.id, item.size, item.color)}
 className="self-start text-text-secondary hover:text-text-primary transition-colors p-2"
 title="Xóa "
 > <X className="w-5 h-5 stroke-[1.5]" /> </button> </div>
 ))}
 </div>

 {/* Summary card */}
 <div className="bg-background-secondary border border-brand-border p-6 md:p-8 flex flex-col gap-6"> <h3 className="font-sans text-sm font-bold text-text-primary border-b border-brand-border pb-4">Tóm tắt đơn hàng</h3> <div className="flex justify-between items-center text-sm font-sans text-text-secondary"> <span>{cartCount} sản phẩm</span> <span className="font-display">{cartSubtotal.toLocaleString()} đ</span> </div> <div className="flex justify-between items-center text-sm font-sans text-text-secondary border-b border-brand-border pb-4"> <span>Vận chuyển</span> <span className="text-accent font-medium">Miễn phí</span> </div> <div className="flex justify-between items-center text-sm font-bold text-text-primary"> <span>Tổng cộng</span> <span className="font-display text-lg text-accent">{cartSubtotal.toLocaleString()} đ</span> </div> <p className="text-[11px] font-sans text-text-secondary leading-relaxed">
Soft Muse hỗ trợ đổi size trong 7 ngày với sản phẩm còn nguyên tem mác.</p> <div className="flex flex-col gap-2 mt-4"> <Link href="/checkout" className="w-full"> <Button variant="primary" className="w-full h-12">
Thanh toán
</Button> </Link> <Link href="/shop" className="w-full"> <Button variant="secondary" className="w-full h-12">Tiếp tục mua sắm</Button> </Link> </div> </div> </div>
 )}
 </main> </div>
 );
}


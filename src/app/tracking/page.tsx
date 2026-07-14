"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LuxuryInput } from "@/components/ui/Form";
import Button from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { IconSearch as Search, IconAlertCircle as AlertCircle, IconRefresh as RefreshCw, IconCheck } from "@tabler/icons-react";
import Image from "next/image";
import { TrackingResultSkeleton } from "@/components/ui/Skeleton";
import { OrderService } from "@/lib/services/order.service";
import type { Order } from "@/data/mock/orders";
import { useEventSubscribeMany } from "@/hooks/useEventBus";
import { getStatusMeta, buildCustomerTimeline, estimateDelivery } from "@/lib/orders/order-status";
import { ContentService } from "@/lib/services/storefront/content.service";
import { StoreService } from "@/lib/services/storefront/store.service";

type SearchStatus = "idle" | "loading" | "found" | "error";

const DEFAULT_CONTENT = {
 tracking_hero_title: 'Theo dõi đơn hàng',
 tracking_hero_label: 'Soft Muse',
 tracking_hero_subtitle: 'Tra cứu tình trạng đơn hàng bằng mã đơn hoặc số điện thoại.',
 tracking_support_title: 'Cần hỗ trợ thêm?',
 tracking_support_text: 'Soft Muse hỗ trợ qua Zalo, Messenger và email chăm sóc khách hàng.',
 tracking_support_btn: 'Liên hệ với chúng tôi',
};

function formatCurrency(value: number) {
 return `${value.toLocaleString("vi-VN")} đ`;
}

function formatDate(iso?: string) {
 if (!iso) return "—";
 return new Date(iso).toLocaleDateString("vi-VN", { year: "numeric", month: "long", day: "numeric" });
}

function TrackingContent({ c, supportUrl }: { c: typeof DEFAULT_CONTENT; supportUrl: string }) {
 const searchParams = useSearchParams();
 const [orderId, setOrderId] = useState("");
 const [contact, setContact] = useState("");
 const [status, setStatus] = useState<SearchStatus>("idle");
 const [order, setOrder] = useState<Order | null>(null);

 const lookup = useCallback(async (rawId: string, rawContact: string, mode: "loading" | "silent" = "loading") => {
 const id = rawId.trim();
 const lookupContact = rawContact.trim();
 if (!id || !lookupContact) return;
 if (mode === "loading") setStatus("loading");
 try {
 const found = await OrderService.getOrderByNumber(id, lookupContact);
 if (found) {
 setOrder(found);
 setStatus("found");
 } else if (mode === "loading") {
 setOrder(null);
 setStatus("error");
 }
 } catch {
 if (mode === "loading") setStatus("error");
 }
 }, []);

 useEffect(() => {
 const idParam = searchParams.get("id");
 if (idParam) {
 setOrderId(idParam);
 const savedContact = localStorage.getItem("soft_muse_last_order_contact") ?? "";
 setContact(savedContact);
 if (savedContact) lookup(idParam, savedContact);
 }
 }, [searchParams, lookup]);

 useEventSubscribeMany(["order.updated", "order.created", "order.deleted"], () => {
 if (order) lookup(order.orderNumber, contact, "silent");
 });

 const handleSearchSubmit = (e: React.FormEvent) => {
 e.preventDefault();
 if (!orderId || !contact) return;
 lookup(orderId, contact);
 };

 const meta = order ? getStatusMeta(order.status) : null;
 const timeline = order ? buildCustomerTimeline(order) : [];

 return (
 <main className="w-full max-w-[1280px] px-6 md:px-12 py-16 md:py-20 flex flex-col items-center gap-12">

 {/* Tracking Form */}
 <div className="w-full max-w-[600px] bg-background-secondary border border-brand-border p-6 md:p-8"> <form onSubmit={handleSearchSubmit} className="flex flex-col gap-6"> <div className="flex flex-col gap-4 text-left" dir="ltr"> <LuxuryInput
 label="Mã đơn hàng *"
 placeholder="Ví dụ: SM-10025"
 required
 value={orderId}
 onChange={(e) => setOrderId(e.target.value)}
 /> <LuxuryInput
 label="Số điện thoại hoặc email *"
 placeholder="Ví dụ: 0901234567 hoặc email@example.com"
 value={contact}
 onChange={(e) => setContact(e.target.value)}
 required
 /> </div> <Button type="submit" variant="primary" className="w-full h-12" disabled={status === "loading"}>
 {status === "loading" ? (
 <span className="flex items-center gap-2"> <RefreshCw className="w-4 h-4 animate-spin text-background-secondary" /> <span>Đang kiểm tra</span> </span>
 ) : (
 <span>Theo dõi đơn hàng</span>
 )}
 </Button> </form> </div>

 {/* Dynamic States */}
 <div className="w-full max-w-[1000px] min-h-[200px] flex flex-col items-center justify-center"> <AnimatePresence mode="wait">
 {status === "loading" && (
 <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full"> <TrackingResultSkeleton /> </motion.div>
 )}

 {status === "idle" && (
 <motion.div
 key="idle"
 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
 className="text-center py-12 flex flex-col items-center gap-4 bg-background-secondary border border-brand-border w-full max-w-[600px] px-6"
 > <Search className="w-10 h-10 stroke-[1.2] text-brand-border" /> <div> <h3 className="font-sans text-sm font-semibold text-text-primary">Nhập mã đơn hàng</h3> <p className="text-xs text-text-secondary font-light mt-1">Bạn có thể tìm mã trong email, tin nhắn hoặc màn hình đặt hàng thành công.</p> </div> </motion.div>
 )}

 {status === "error" && (
 <motion.div
 key="error"
 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
 className="text-center py-12 flex flex-col items-center gap-4 bg-background-secondary border border-brand-border w-full max-w-[600px] px-6"
 > <AlertCircle className="w-10 h-10 stroke-[1.2] text-accent" /> <div> <h3 className="font-sans text-sm font-bold text-text-primary">Không tìm thấy đơn hàng</h3> <p className="text-xs text-text-secondary font-light mt-2 max-w-sm leading-relaxed">
 Vui lòng kiểm tra lại mã đơn và số điện thoại/email đã dùng khi đặt hàng.
 </p> </div> </motion.div>
 )}

 {status === "found" && order && meta && (
 <motion.div
 key="found"
 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
 className="w-full flex flex-col gap-12"
 >
 {/* Timeline Container */}
 <div className="bg-background-secondary border border-brand-border p-6 md:p-10 flex flex-col gap-8 text-left" dir="ltr"> <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-brand-border pb-4"> <div> <span className="font-sans text-[10px] text-text-secondary font-medium">Đơn hàng :</span> <h2 className="font-sans text-lg font-bold text-accent mt-0.5">{meta.label}</h2> </div> <div className="md:text-left"> <span className="font-sans text-[10px] text-text-secondary font-medium block">:</span> <span className="font-sans text-sm font-semibold text-text-primary">
 {order.status === "delivered"
 ? "đã"
 : order.estimatedDeliveryDate
 ? formatDate(order.estimatedDeliveryDate)
 : estimateDelivery(order)}
 </span> </div> </div>

 {order.customerUpdate && (
 <div className="bg-accent/5 border border-accent/20 p-4 flex flex-col gap-1"> <span className="font-sans text-[10px] text-accent font-bold uppercase">Cập nhật mới nhất</span> <p className="font-sans text-sm text-text-primary leading-relaxed">{order.customerUpdate}</p>
 {order.customerUpdatedAt && (
 <span className="font-sans text-[10px] text-text-secondary font-light mt-0.5">{formatDate(order.customerUpdatedAt)}</span>
 )}
 </div>
 )}

 {/* Progress Timeline */}
 <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-4 py-6"> <div className="absolute top-1/2 left-4 right-4 h-[1px] bg-brand-border -translate-y-1/2 -z-10 hidden md:block" />
 {timeline.map((step) => {
 const active = step.state === "done" || step.state === "current";
 return (
 <div
 key={step.key}
 className="flex md:flex-col items-center md:items-center gap-4 md:gap-2 text-left md:text-center relative z-10 bg-background-secondary md:px-2 flex-grow"
 > <div className={`w-9 h-9 rounded-full font-display text-xs font-semibold flex items-center justify-center border transition-colors duration-500 ${active ? "bg-accent text-background-secondary border-accent" : "bg-background-secondary text-text-secondary border-brand-border"} ${step.state === "current" ? "ring-2 ring-accent/30" : ""}`}>
 {step.state === "done" ? <IconCheck className="w-4 h-4" /> : null}
 {step.state !== "done" && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
 </div> <div> <h4 className={`font-sans text-xs font-bold ${active ? "text-text-primary" : "text-text-secondary"}`}>{step.label}</h4> <span className="font-sans text-[10px] text-text-secondary font-light block mt-0.5">
 {step.date ? formatDate(step.date) : step.description}
 </span> </div> </div>
 );
 })}
 </div>

 {(order.status === "cancelled" || order.status === "returned") && (
 <div className="bg-accent/5 border border-accent/20 px-4 py-3 text-xs text-accent font-sans text-center">
 {meta.description}
 </div>
 )}
 </div>

 {/* Order Information */}
 <div className="bg-background-secondary border border-brand-border p-6 md:p-8 flex flex-col gap-6 text-left" dir="ltr"> <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 border-b border-brand-border pb-6"> <div> <span className="font-sans text-[10px] text-text-secondary font-medium">Mã đơn hàng</span> <h5 className="font-sans text-xs font-bold text-text-primary mt-0.5">{order.orderNumber}</h5> </div> <div> <span className="font-sans text-[10px] text-text-secondary font-medium">Ngày đặt</span> <h5 className="font-sans text-xs font-bold text-text-primary mt-0.5">{formatDate(order.createdAt || order.date)}</h5> </div> <div> <span className="font-sans text-[10px] text-text-secondary font-medium">Khách hàng</span> <h5 className="font-sans text-xs font-bold text-text-primary mt-0.5">{order.customerName}</h5> </div> <div> <span className="font-sans text-[10px] text-text-secondary font-medium">Tổng cộng</span> <h5 className="font-sans text-xs font-bold text-accent mt-0.5">{formatCurrency(order.total)}</h5> </div> </div> <div className="flex flex-col gap-4">
 {order.items.map((item) => (
 <div key={item.id} className="flex gap-4 items-center"> <div className="relative aspect-[3/4] w-14 shrink-0 overflow-hidden border border-brand-border bg-background-primary"> <Image
 src={item.image || "/images/products/product_evening_gown.png"}
 alt={item.productName} fill sizes="56px" className="object-cover"
 /> </div> <div className="flex-grow min-w-0"> <h4 className="font-sans text-xs font-semibold text-text-primary truncate">{item.productName}</h4> <span className="text-[10px] text-text-secondary font-light block mt-0.5">
 {item.size ? `Kích cỡ: ${item.size}` : ""}{item.size && item.color ? " | " : ""}{item.color ? `:${item.color}` : ""}{(item.size || item.color) ? " | " : ""}:{item.quantity}
 </span> </div> <span className="font-display text-xs font-bold text-accent shrink-0">
 {formatCurrency(item.price * item.quantity)}
 </span> </div>
 ))}
 </div>

 {(order.trackingNumber || order.shippingCompany || order.courierName) && (
 <div className="border-t border-brand-border pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
 {order.shippingCompany && (
 <div> <span className="font-sans text-[10px] text-text-secondary font-medium">Vận chuyển</span> <p className="font-sans text-xs font-bold text-text-primary mt-0.5">{order.shippingCompany}</p> </div>
 )}
 {order.trackingNumber && (
 <div> <span className="font-sans text-[10px] text-text-secondary font-medium">Mã </span> <p className="font-sans text-xs font-bold text-text-primary mt-0.5" dir="ltr">{order.trackingNumber}</p> </div>
 )}
 {order.courierName && (
 <div> <span className="font-sans text-[10px] text-text-secondary font-medium">giao hàng</span> <p className="font-sans text-xs font-bold text-text-primary mt-0.5">{order.courierName}</p> </div>
 )}
 </div>
 )}

 <div className="border-t border-brand-border pt-4"> <span className="font-sans text-[10px] text-text-secondary font-medium">Địa chỉ giao hàng</span> <p className="font-sans text-xs text-text-primary mt-0.5 leading-relaxed">{order.shippingAddress || "—"}</p> </div> <div className="border-t border-brand-border pt-4 flex justify-between items-center"> <span className="font-sans text-[10px] text-text-secondary font-medium">Cập nhật cuối</span> <span className="font-sans text-xs font-semibold text-text-primary">{formatDate(order.updatedAt)}</span> </div> </div> </motion.div>
 )}
 </AnimatePresence> </div>

 {/* Support Section */}
 <section className="w-full max-w-[600px] border-t border-brand-border pt-12 text-center flex flex-col items-center gap-4"> <h3 className="font-sans text-lg font-light text-text-primary">{c.tracking_support_title}</h3> <p className="font-sans text-xs text-text-secondary font-light max-w-xs leading-relaxed">
 {c.tracking_support_text}
 </p> <div className="mt-2"> <a href={supportUrl} target="_blank" rel="noopener noreferrer"> <Button variant="dark-outline" className="px-10">{c.tracking_support_btn}</Button> </a> </div> </section> </main>
 );
}

export default function TrackingPage() {
 const [c, setC] = useState(DEFAULT_CONTENT);
 const [supportUrl, setSupportUrl] = useState('https://zalo.me/0900000000');

 const loadContent = useCallback(async () => {
 try {
 const [blocks, storeInfo] = await Promise.all([
 ContentService.getContentByGroup('pages'),
 StoreService.getInfo(),
 ]);
 const map: Record<string, string> = {};
 blocks.forEach(b => { map[b.key] = b.value; });
 setC(prev => ({ ...prev, ...map }));
 if (storeInfo.socialMedia?.whatsapp) setSupportUrl(storeInfo.socialMedia.whatsapp);
 } catch {
 // keep defaults
 }
 }, []);

 useEffect(() => { loadContent(); }, [loadContent]);
 useEventSubscribeMany(['website.changed'], loadContent);

 return (
 <div className="bg-background-primary min-h-screen flex flex-col items-center"> <section className="w-full bg-background-secondary py-16 md:py-24 border-b border-brand-border flex flex-col items-center"> <div className="max-w-[720px] mx-auto px-6 text-center"> <span className="font-sans text-[10px] text-accent font-bold uppercase">{c.tracking_hero_label}</span> <h1 className="font-sans text-3xl font-light text-text-primary mt-2">{c.tracking_hero_title}</h1> <p className="font-sans text-xs md:text-sm text-text-secondary font-light mt-3 leading-relaxed">
 {c.tracking_hero_subtitle}
 </p> </div> </section> <Suspense fallback={
 <div className="w-full max-w-[1280px] px-6 md:px-12 py-16 md:py-20 flex flex-col items-center"> <TrackingResultSkeleton /> </div>
 }> <TrackingContent c={c} supportUrl={supportUrl} /> </Suspense> </div>
 );
}

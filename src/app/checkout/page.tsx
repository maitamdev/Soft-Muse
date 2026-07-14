"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { useNotification } from "@/context/NotificationContext";
import { CouponService } from "@/lib/services/coupon.service";
import { OrderService } from "@/lib/services/order.service";
import { LuxuryInput, LuxurySelect } from "@/components/ui/Form";
import Button from "@/components/ui/Button";
import { analytics } from "@/utils/analytics";
import { IconCircleCheck as CheckCircle, IconTruck as Truck, IconShieldExclamation as ShieldAlert, IconLoader2 as Loader2, IconArrowLeft as ArrowLeft, IconArrowRight as ArrowRight, IconPackage as Package } from "@tabler/icons-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn, slideInRight, scaleIn } from "@/lib/animations";

export default function CheckoutPage() {
 const { showNotification } = useNotification();
 const { cart, cartSubtotal, clearCart } = useStore();
 const router = useRouter();

 // Wizard Steps: 1 = Personal Info, 2 = Shipping, 3 = Payment, 4 = Success
 const [step, setStep] = useState(1);
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [generatedOrderId, setGeneratedOrderId] = useState("");
 // Snapshot of totals captured at submit (cart is cleared on success).
 const [submittedTotals, setSubmittedTotals] = useState<{ subtotal: number; discount: number; total: number; couponCode: string | null } | null>(null);

 // Form Fields
 const [form, setForm] = useState({
 firstName: "",
 lastName: "",
 address: "",
 governorate: "ho-chi-minh",
 phone: "",
 email: "",
 paymentMethod: "cod",
 });

 // Validation Errors
 const [errors, setErrors] = useState<Record<string, string>>({});

 // Coupon state (validated through the shared CouponService — same source as admin)
 const [couponInput, setCouponInput] = useState("");
 const [appliedCoupon, setAppliedCoupon] = useState<{ id: string; code: string; discount: number; type: string; discountValue: number } | null>(null);
 const [couponError, setCouponError] = useState("");
 const [couponLoading, setCouponLoading] = useState(false);

 const discount = appliedCoupon?.discount ?? 0;
 const shippingFee = cartSubtotal - discount >= 800000 ? 0 : 30000;
 const cartTotal = Math.max(0, cartSubtotal - discount + shippingFee);

 // Re-validate the applied coupon whenever the cart subtotal changes (e.g. min-order no longer met).
 useEffect(() => {
 if (!appliedCoupon) return;
 let active = true;
 CouponService.calculateDiscount(appliedCoupon.code, cartSubtotal).then((res) => {
 if (!active) return;
 if (!res.valid) {
 setAppliedCoupon(null);
 setCouponError(res.error || "");
 } else if (res.discountAmount !== appliedCoupon.discount) {
 setAppliedCoupon({
 id: appliedCoupon.id,
 code: appliedCoupon.code,
 discount: res.discountAmount,
 type: appliedCoupon.type,
 discountValue: appliedCoupon.discountValue
 });
 }
 });
 return () => { active = false; };
 }, [cartSubtotal]);

 const handleApplyCoupon = async () => {
 const code = couponInput.trim();
 if (!code) { setCouponError(""); return; }
 setCouponLoading(true);
 setCouponError("");
 try {
 const res = await CouponService.calculateDiscount(code, cartSubtotal);
 if (!res.valid) {
 setAppliedCoupon(null);
 setCouponError(res.error || "không");
 } else {
 setAppliedCoupon({
 id: res.coupon!.id,
 code: res.coupon!.code,
 discount: res.discountAmount,
 type: res.coupon!.type,
 discountValue: res.coupon!.discountValue
 });
 showNotification("Đã áp dụng mã giảm giá.", "success");
 }
 } catch {
 setCouponError("từ");
 } finally {
 setCouponLoading(false);
 }
 };

 const handleRemoveCoupon = () => {
 setAppliedCoupon(null);
 setCouponInput("");
 setCouponError("");
 };

 // Trigger Checkout Start Analytics
 useEffect(() => {
 if (cart.length > 0) {
 analytics.trackCheckoutStart(cart.length, cartSubtotal);
 }
 }, [cart.length, cartSubtotal]);

 const governorateOptions = [
 { value: "ho-chi-minh", label: "TP. Hồ Chí Minh" },
 { value: "ha-noi", label: "Hà Nội" },
 { value: "da-nang", label: "Đà Nẵng" },
 { value: "can-tho", label: "Cần Thơ" },
 { value: "hai-phong", label: "Hải Phòng" },
 { value: "binh-duong", label: "Bình Dương" },
 { value: "dong-nai", label: "Đồng Nai" },
 { value: "long-an", label: "Long An" },
 { value: "khanh-hoa", label: "Khánh Hòa" },
 { value: "other", label: "Tỉnh/thành khác" },
 ];

 const paymentOptions = [
 { value: "cod", label: "Thanh toán khi nhận hàng (COD)" },
 { value: "bank-transfer", label: "Chuyển khoản ngân hàng" },
 ];

 // Helper validation for steps
 const validateStep = (currentStep: number) => {
 const newErrors: Record<string, string> = {};

 if (currentStep === 1) {
 if (!form.firstName.trim()) newErrors.firstName = "Tên";
 if (!form.lastName.trim()) newErrors.lastName = "mã ";
 
 const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
 if (!form.phone.trim()) {
 newErrors.phone = "Số điện thoại ";
 } else if (!phoneRegex.test(form.phone.trim())) {
 newErrors.phone = "Số điện thoại Việt Nam chưa đúng định dạng.";
 }

 const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 if (!form.email.trim()) {
 newErrors.email = "Email ";
 } else if (!emailRegex.test(form.email.trim())) {
 newErrors.email = "Email không";
 }
 }

 if (currentStep === 2) {
 if (!form.address.trim() || form.address.trim().length < 8) {
 newErrors.address = "Vui lòng nhập địa chỉ cụ thể, tối thiểu 8 ký tự.";
 }
 if (!form.governorate) {
 newErrors.governorate = "Vui lòng chọn tỉnh/thành phố.";
 }
 }

 setErrors(newErrors);
 return Object.keys(newErrors).length === 0;
 };

 const handleNextStep = () => {
 if (validateStep(step)) {
 setStep((prev) => prev + 1);
 window.scrollTo(0, 0);
 } else {
 showNotification("Vui lòng kiểm tra lại thông tin bắt buộc.", "warning");
 }
 };

 const handlePrevStep = () => {
 setStep((prev) => Math.max(1, prev - 1));
 window.scrollTo(0, 0);
 };

 const handleFinalSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!validateStep(3)) return;

 setIsSubmitting(true);

 const governorateLabelValue = governorateOptions.find(o => o.value === form.governorate)?.label || form.governorate;
 const paymentLabel = paymentOptions.find(o => o.value === form.paymentMethod)?.label || form.paymentMethod;

 try {
 // Supabase revalidates prices and stock, then creates the order atomically.
 const created = await OrderService.createOrder({
 customerId: "",
 customerName: `${form.firstName} ${form.lastName}`.trim(),
 customerEmail: form.email.trim(),
 customerPhone: form.phone.trim(),
 shippingAddress: `${governorateLabelValue} - ${form.address}`,
 shipping: 0,
 taxRate: 0,
 discount,
 couponCode: appliedCoupon?.code ?? null,
 couponId: appliedCoupon?.id ?? null,
 discountValue: appliedCoupon?.discountValue ?? 0,
 discountType: (appliedCoupon?.type as any) ?? undefined,
 paymentMethod: form.paymentMethod,
 source: "storefront",
 notes: `Đơn hàng từ website Soft Muse — Phương thức thanh toán: ${paymentLabel}`,
 items: cart.map((item) => ({
 productId: String(item.id),
 variantId: item.variantId,
 productName: item.title,
 sku: String(item.id),
 quantity: item.quantity,
 price: item.price,
 image: item.image,
 size: item.size,
 color: item.color,
 })),
 });

 setGeneratedOrderId(created.orderNumber);
 setSubmittedTotals({ subtotal: created.subtotal || cartSubtotal, discount: created.discount || discount, total: created.total, couponCode: appliedCoupon?.code ?? null });

 // Remember the latest order number so the tracking page can preload it.
 localStorage.setItem("aura_last_order_id", created.orderNumber);
 localStorage.setItem("soft_muse_last_order_contact", form.phone.trim());

 analytics.trackPurchaseSuccess(created.orderNumber, cart, created.total, form.paymentMethod);

 setStep(4);
 clearCart();
 showNotification("Đặt hàng thành công. Soft Muse sẽ xác nhận đơn sớm.", "success");
 } catch (error) {
 showNotification(error instanceof Error ? error.message : "Không thể tạo đơn hàng, vui lòng thử lại.", "error");
 } finally {
 setIsSubmitting(false);
 }
 };

 if (cart.length === 0 && step !== 4) {
 return (
 <div className="max-w-[720px] mx-auto py-24 px-6 text-center flex flex-col items-center gap-6"> <Package className="w-16 h-16 stroke-[1.2] text-brand-border" /> <div> <h2 className="font-sans text-3xl font-light text-text-primary">Giỏ hàng của bạn đang trống</h2> <p className="text-xs text-text-secondary mt-2">Hãy chọn một thiết kế Soft Muse trước khi thanh toán.</p> </div> <Link href="/shop" className="mt-4"> <Button variant="primary">Vào cửa hàng</Button> </Link> </div>
 );
 }

 const governorateLabel = governorateOptions.find((o) => o.value === form.governorate)?.label || "";

 return (
 <div className="bg-background-primary min-h-screen flex flex-col items-center pb-20">
 {/* 1. Header */}
 <section className="w-full bg-background-secondary py-12 border-b border-brand-border flex flex-col items-center"> <div className="max-w-[720px] mx-auto px-6 text-center"> <span className="font-sans text-[10px] text-accent font-bold uppercase">
 Soft Muse Checkout </span> <h1 className="font-sans text-3xl font-light text-text-primary mt-2">
 Thanh toán</h1> </div> </section>

 {/* 2. Step Indicator (Desktop/Mobile responsive) */}
 {step < 4 && (
 <div className="w-full max-w-[800px] px-6 mt-8"> <div className="flex justify-between items-center relative py-4" dir="ltr"> <div className="absolute top-1/2 start-0 end-0 h-[1.5px] bg-brand-border -translate-y-1/2 -z-10" /> <motion.div
 className="absolute top-1/2 start-0 h-[1.5px] bg-accent -translate-y-1/2 -z-10"
 initial={false}
 animate={{ width: `${((step - 1) / 2) * 100}%` }}
 transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
 />

 {[
 { num: 1, name: "Thông tin" },
 { num: 2, name: "Giao hàng" },
 { num: 3, name: "Thanh toán" },
 ].map((s) => (
 <div key={s.num} className="flex flex-col items-center bg-background-primary px-4 z-10 relative"> <div
 className={`w-8 h-8 rounded-full flex items-center justify-center border text-xs font-sans font-bold transition-all duration-300 ${
 step >= s.num
 ? "bg-accent text-background-secondary border-accent"
 : "bg-background-secondary text-text-secondary border-brand-border"
 }`}
 >
 {step > s.num ? "✓" : s.num}
 </div> <span className={`text-[10px] font-sans font-bold mt-1.5 hidden sm:block ${step >= s.num ? "text-text-primary" : "text-text-secondary"}`}>
 {s.name}
 </span> </div>
 ))}
 </div> </div>
 )}

 {/* 3. Main content */}
 <main className="w-full max-w-[1280px] px-6 md:px-12 mt-8"> <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 md:gap-12 items-start">
 
 {/* Form Wizard Area */}
 <div className="bg-background-secondary border border-brand-border p-6 md:p-8 min-h-[420px] relative"> <AnimatePresence mode="wait">
 {isSubmitting ? (
 /* Simulated Luxury Loading Screen */
 <motion.div
 { ...fadeIn}
 className="absolute inset-0 bg-background-secondary/95 z-30 flex flex-col justify-center items-center text-center gap-4 p-8"
 > <Loader2 className="w-12 h-12 stroke-[1.2] text-accent animate-spin" /> <div className="flex flex-col gap-2"> <p className="font-sans text-base font-semibold text-text-primary">Đang tạo đơn hàng.</p> <p className="text-xs text-text-secondary font-light max-w-xs leading-relaxed">
 Soft Muse đang lưu thông tin và chuẩn bị xác nhận đơn cho bạn.
 </p> </div> </motion.div>
 ) : null}
 </AnimatePresence>

 {/* STEP 1: Personal Info */}
 {step === 1 && (
 <motion.div { ...slideInRight}> <h3 className="font-sans text-base font-bold text-text-primary mb-6 border-b border-brand-border pb-3 text-left">
 1. Thông tin liên hệ </h3> <div className="flex flex-col gap-5 text-left" dir="ltr"> <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> <LuxuryInput
 label="Tên*"
 placeholder="Ví dụ: Linh"
 required
 value={form.firstName}
 onChange={(e) => setForm({ ...form, firstName: e.target.value })}
 error={errors.firstName}
 /> <LuxuryInput
 label="Họ *"
 placeholder="Ví dụ: Nguyễn"
 required
 value={form.lastName}
 onChange={(e) => setForm({ ...form, lastName: e.target.value })}
 error={errors.lastName}
 /> </div> <LuxuryInput
 label="Số điện thoại *"
 placeholder="Ví dụ: 0901234567"
 required
 type="tel"
 value={form.phone}
 onChange={(e) => setForm({ ...form, phone: e.target.value })}
 error={errors.phone}
 /> <LuxuryInput
 label="Email *"
 placeholder="linh@example.com"
 required
 type="email"
 value={form.email}
 onChange={(e) => setForm({ ...form, email: e.target.value })}
 error={errors.email}
 /> <div className="flex justify-end mt-6"> <Button variant="primary" onClick={handleNextStep} className="w-full sm:w-auto px-12"> <span>Chi tiết Vận chuyển</span> <ArrowLeft className="w-4 h-4 mr-2" /> </Button> </div> </div> </motion.div>
 )}

 {/* STEP 2: Shipping Details */}
 {step === 2 && (
 <motion.div { ...slideInRight}> <h3 className="font-sans text-base font-bold text-text-primary mb-6 border-b border-brand-border pb-3 text-left">
 2. Chi tiết Vận chuyển </h3> <div className="flex flex-col gap-5 text-left" dir="ltr"> <LuxurySelect
 label="Tỉnh/thành phố *"
 options={governorateOptions}
 required
 value={form.governorate}
 onChange={(e) => setForm({ ...form, governorate: e.target.value })}
 error={errors.governorate}
 /> <LuxuryInput
 label="Địa chỉ nhận hàng *"
 placeholder="Số nhà, đường, phường/xã, quận/huyện"
 required
 value={form.address}
 onChange={(e) => setForm({ ...form, address: e.target.value })}
 error={errors.address}
 /> <div className="bg-background-primary p-4 border border-brand-border text-xs text-text-secondary leading-relaxed flex items-start gap-2.5"> <Truck className="w-4 h-4 text-accent shrink-0 mt-0.5" /> <p>
 Giao hàng toàn quốc. TP. Hồ Chí Minh 1-2 ngày, các tỉnh/thành khác 2-5 ngày.</p> </div> <div className="flex justify-between items-center mt-8"> <Button variant="secondary" onClick={handlePrevStep} className="px-6"> <ArrowRight className="w-4 h-4 ml-2" /> <span>Quay lại</span> </Button> <Button variant="primary" onClick={handleNextStep} className="px-12"> <span>Phương thức thanh toán</span> <ArrowLeft className="w-4 h-4 mr-2" /> </Button> </div> </div> </motion.div>
 )}

 {/* STEP 3: Payment Selection */}
 {step === 3 && (
 <motion.div { ...slideInRight}> <h3 className="font-sans text-base font-bold text-text-primary mb-6 border-b border-brand-border pb-3 text-left">
 3. Thanh toán </h3> <form onSubmit={handleFinalSubmit} className="flex flex-col gap-5 text-left" dir="ltr"> <LuxurySelect
 label="Phương thức thanh toán *"
 options={paymentOptions}
 required
 value={form.paymentMethod}
 onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
 /> <div className="bg-background-primary p-5 border border-brand-border flex flex-col gap-3"> <p className="font-sans text-xs text-text-secondary leading-relaxed">
 {form.paymentMethod === "cod"
 ? "Bạn thanh toán khi nhận hàng. Soft Muse sẽ gọi hoặc nhắn tin xác nhận trước khi giao."
 : form.paymentMethod === "bank-transfer"
 ? "Thông tin chuyển khoản sẽ được gửi sau khi đơn hàng được tạo thành công."
 : "Thông tin chuyển khoản và nội dung thanh toán sẽ được Soft Muse gửi sau khi tiếp nhận đơn."}
 </p> <div className="border-t border-brand-border/60 pt-3 mt-1 flex items-start gap-2 text-[10px] text-accent leading-relaxed"> <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" /> <div> <span className="font-bold block mb-0.5">Lưu ý:</span>
 Đơn chỉ được xác nhận sau khi Soft Muse kiểm tra tồn kho và thông tin nhận hàng.
 </div> </div> </div> <div className="flex justify-between items-center mt-8"> <Button variant="secondary" onClick={handlePrevStep} className="px-6" type="button"> <ArrowRight className="w-4 h-4 ml-2" /> <span>Quay lại</span> </Button> <Button variant="primary" type="submit" className="px-12"> <span>Đặt hàng</span> </Button> </div> </form> </motion.div>
 )}

 {/* STEP 4: Success Confirmation */}
 {step === 4 && (
 <motion.div
 { ...scaleIn}
 className="flex flex-col items-center text-center gap-6 py-8"
 > <CheckCircle className="w-16 h-16 text-accent stroke-[1.2]" /> <div className="flex flex-col gap-2"> <span className="text-[10px] text-accent font-sans font-bold uppercase">Soft Muse</span> <h3 className="font-sans text-2xl font-light text-text-primary">Đặt hàng thành công</h3> <p className="text-xs text-text-secondary max-w-sm mt-1 leading-relaxed">
 Cảm ơn bạn đã mua sắm tại Soft Muse. Chúng tôi sẽ xác nhận đơn hàng qua điện thoại hoặc tin nhắn trong thời gian sớm nhất.
 </p> </div>

 <div className="bg-accent/5 border border-accent/20 px-4 py-2 text-[10px] text-accent font-sans flex items-center gap-2"> <CheckCircle className="w-4 h-4" /> <span>Đơn hàng đã được lưu an toàn trên hệ thống Soft Muse</span> </div>

 {/* Details summary */}
 <div className="w-full max-w-[500px] bg-background-primary border border-brand-border p-5 text-left flex flex-col gap-3 text-xs font-sans mt-2" dir="ltr"> <div className="flex justify-between border-b border-brand-border/60 pb-2 font-bold"> <span>Mã đơn hàng:</span> <span className="text-accent text-sm font-display font-bold">{generatedOrderId}</span> </div> <div className="flex justify-between border-b border-brand-border/40 pb-2"> <span>Khách hàng:</span> <span>{form.firstName} {form.lastName}</span> </div> <div className="flex justify-between border-b border-brand-border/40 pb-2"> <span>Số điện thoại:</span> <span>{form.phone}</span> </div> <div className="flex justify-between border-b border-brand-border/40 pb-2"> <span>Địa chỉ:</span> <span>{governorateLabel} - {form.address}</span> </div> <div className="flex justify-between border-b border-brand-border/40 pb-2"> <span>Thanh toán:</span> <span>{paymentOptions.find(o => o.value === form.paymentMethod)?.label || form.paymentMethod}</span> </div>
 {submittedTotals && submittedTotals.discount > 0 && (
 <div className="flex justify-between border-b border-brand-border/40 pb-2 text-accent"> <span>Giảm giá{submittedTotals.couponCode ? ` (${submittedTotals.couponCode})` : ""}:</span> <span>- {submittedTotals.discount.toLocaleString()} đ</span> </div>
 )}
 <div className="flex justify-between font-bold pt-1"> <span>Số tiền :</span> <span className="text-accent text-sm">{(submittedTotals?.total ?? cartSubtotal).toLocaleString()} đ</span> </div> </div> <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full max-w-[400px]"> <button
 onClick={() => router.push(`/tracking?id=${generatedOrderId}`)}
 className="inline-flex items-center justify-center bg-text-primary text-background-secondary font-sans text-xs min-h-[44px] hover:bg-accent transition-colors flex-grow cursor-pointer"
 >
 Theo dõi đơn</button> <Link href="/shop" className="flex-grow"> <Button variant="secondary" className="w-full">Tiếp tục mua sắm</Button> </Link> </div> </motion.div>
 )}

 </div>

 {/* Checkout Summary sidebar (Solid panel, no glass) */}
 {step < 4 && (
 <aside className="bg-background-secondary border border-brand-border p-6 md:p-8 flex flex-col gap-6 lg:sticky lg:top-24 text-left" dir="ltr"> <h3 className="font-sans text-sm font-bold text-text-primary border-b border-brand-border pb-4">Tóm tắt đơn hàng</h3>
 
 {/* Items List */}
 <div className="flex flex-col gap-4 border-b border-brand-border pb-4 max-h-[220px] overflow-y-auto scrollbar-none">
 {cart.map((item) => (
 <div key={`${item.id}-${item.color}-${item.size}`} className="flex gap-4 items-center"> <div className="relative w-10 h-14 shrink-0 bg-background-primary border border-brand-border"> <Image src={item.image} alt={item.title} fill sizes="40px" className="object-cover" /> </div> <div className="flex-grow min-w-0"> <h4 className="font-sans text-xs font-medium truncate max-w-[160px]">{item.title}</h4> <span className="text-[10px] text-text-secondary font-light block mt-0.5">
 Kích cỡ: {item.size} | Màu: {item.color} | SL: {item.quantity}
 </span> </div> <span className="font-display text-xs font-bold text-accent shrink-0">
 {(item.price * item.quantity).toLocaleString()} đ
 </span> </div>
 ))}
 </div>

 {/* Coupon Code */}
 <div className="flex flex-col gap-2 border-b border-brand-border pb-4">
 {appliedCoupon ? (
 <div className="flex justify-between items-center bg-accent/5 border border-accent/20 px-3 py-2"> <div className="flex flex-col"> <span className="font-sans text-xs font-bold text-accent uppercase">{appliedCoupon.code}</span> <span className="text-[10px] text-text-secondary">đãÁp dụng Giảm giá</span> </div> <button
 type="button"
 onClick={handleRemoveCoupon}
 className="text-[10px] text-text-secondary hover:text-accent underline"
 >Thao tác</button> </div>
 ) : (
 <div className="flex gap-2"> <input
 type="text"
 id="couponInput"
 aria-label="Thao tác"
 value={couponInput}
 onChange={(e) => { setCouponInput(e.target.value); setCouponError(""); }}
 onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleApplyCoupon(); } }}
 placeholder="Nhập nội dung"
 className="flex-grow min-w-0 bg-background-primary border border-brand-border px-3 py-2 text-xs font-sans text-text-primary placeholder:text-text-secondary outline-none focus:border-accent transition-colors uppercase"
 /> <button
 type="button"
 onClick={handleApplyCoupon}
 disabled={couponLoading}
 className="bg-text-primary text-background-secondary px-4 text-xs font-sans font-bold hover:bg-accent transition-colors disabled:opacity-50 shrink-0"
 >
 {couponLoading ? "." : "Áp dụng"}
 </button> </div>
 )}
 {couponError && <span className="text-[10px] text-red-500 font-sans">{couponError}</span>}
 </div>

 {/* Cost Calculations */}
 <div className="flex flex-col gap-3 text-xs font-sans text-text-secondary border-b border-brand-border pb-4"> <div className="flex justify-between"> <span>Tạm tính:</span> <span className="font-display">{(cartSubtotal).toLocaleString()} đ</span> </div>
 {discount > 0 && (
 <div className="flex justify-between text-accent"> <span>Giảm giá{appliedCoupon ? ` (${appliedCoupon.code})` : ""}:</span> <span className="font-display">- {discount.toLocaleString()} đ</span> </div>
 )}
 <div className="flex justify-between"> <span>Thuế:</span> <span>Đã bao gồm</span> </div> <div className="flex justify-between"> <span>Vận chuyển:</span> <span>{shippingFee === 0 ? "Miễn phí" : `${shippingFee.toLocaleString()} đ`}</span> </div> </div> <div className="flex justify-between items-center text-sm font-bold text-text-primary"> <span className="font-sans">Tổng cộng:</span> <span className="font-display text-lg text-accent">{(cartTotal).toLocaleString()} đ</span> </div> </aside>
 )}

 </div> </main> </div>
 );
}


"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LuxuryInput } from "@/components/ui/Form";
import Button from "@/components/ui/Button";
import { IconUser as User, IconPackage as Package, IconSettings as Settings, IconRuler as Ruler, IconCheck as Check } from "@tabler/icons-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function ProfilePage() {
 const [activeTab, setActiveTab] = useState("orders");
 const [isSaved, setIsSaved] = useState(false);

 const [measurements, setMeasurements] = useState({
 bust: "88 mã",
 waist: "68 mã",
 hips: "94 mã",
 height: "170 mã",
 });

 const handleSaveMeasurements = (e: React.FormEvent) => {
 e.preventDefault();
 setIsSaved(true);
 setTimeout(() => setIsSaved(false), 2000);
 };

 const tabs = [
 { id: "orders", label: "couture ", icon: Package },
 { id: "measurements", label: "couture", icon: Ruler },
 { id: "settings", label: "", icon: Settings },
 ];

 return (
 <div className="bg-background-primary min-h-screen">
 {/* 1. Header */}
 <section className="bg-background-secondary py-12 border-b border-brand-border/60"> <div className="container text-center max-w-2xl flex flex-col items-center gap-3"> <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-accent"> <User className="w-8 h-8 stroke-[1.2]" /> </div> <div> <span className="text-[10px] text-text-secondary uppercase-letter-spacing font-light block">
 AURA </span> <h1 className="text-serif text-3xl font-light text-text-primary mt-1"> </h1> </div> </div> </section>

 {/* 2. Content */}
 <main className="container py-16"> <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 md:gap-12 items-start">
 
 {/* Right Navigation (RTL layout) */}
 <aside className="bg-background-secondary border border-brand-border/60 p-4 flex flex-col gap-2">
 {tabs.map((tab) => {
 const Icon = tab.icon;
 return (
 <button
 key={tab.id}
 onClick={() => setActiveTab(tab.id)}
 className={`w-full flex items-center gap-3 px-4 py-3 text-xs uppercase-letter-spacing transition-colors ${
 activeTab === tab.id
 ? "text-accent bg-accent/5 font-bold"
 : "text-text-secondary hover:text-text-primary"
 }`}
 > <Icon className="w-4 h-4" /> <span>{tab.label}</span> </button>
 );
 })}
 </aside>

 {/* Left Content Area */}
 <div className="bg-background-secondary border border-brand-border/60 p-6 md:p-8 min-h-[400px]">
 
 {/* TAB 1: Orders Log */}
 {activeTab === "orders" && (
 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6"> <h3 className="text-serif text-lg font-bold text-text-primary border-b border-brand-border pb-3">ngày</h3>
 
 {/* Order Item */}
 <div className="border border-brand-border p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"> <div className="flex gap-4 items-center"> <div className="relative w-12 h-16 shrink-0 bg-background-primary"> <Image
 src="/images/products/product_evening_gown.png"
 alt="AURA từ lụa "
 fill
 sizes="48px"
 className="object-cover"
 /> </div> <div> <span className="text-[10px] text-accent uppercase-letter-spacing font-bold">Hoàn tất Vận chuyển</span> <h4 className="text-serif text-sm font-light mt-0.5">AURA từ lụa </h4> <span className="text-[10px] text-text-secondary font-light">đơn hàngMã: AURA-89304 | 21 2026</span> </div> </div> <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end"> <span className="text-sm font-bold text-accent font-display">3,400 đ</span> <Link href="/tracking" className="text-xs text-text-primary underline underline-offset-4 font-light font-sans">
 Vận chuyển</Link> </div> </div> </motion.div>
 )}

 {/* TAB 2: Couture Measurements Form */}
 {activeTab === "measurements" && (
 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6"> <div className="border-b border-brand-border pb-3"> <h3 className="text-serif text-lg font-bold text-text-primary">couture</h3> <p className="text-xs text-text-secondary font-light mt-1">này vàSửavàVận chuyển.</p> </div> <form onSubmit={handleSaveMeasurements} className="flex flex-col gap-6 max-w-md"> <div className="grid grid-cols-2 gap-4"> <LuxuryInput
 label="Ngực (Bust)"
 value={measurements.bust}
 onChange={(e) => setMeasurements({ ...measurements, bust: e.target.value })}
 /> <LuxuryInput
 label="Eo (Waist)"
 value={measurements.waist}
 onChange={(e) => setMeasurements({ ...measurements, waist: e.target.value })}
 /> <LuxuryInput
 label="Hông (Hips)"
 value={measurements.hips}
 onChange={(e) => setMeasurements({ ...measurements, hips: e.target.value })}
 /> <LuxuryInput
 label="Tổng cộng (Height)"
 value={measurements.height}
 onChange={(e) => setMeasurements({ ...measurements, height: e.target.value })}
 /> </div> <Button type="submit" variant="primary" className="h-11">
 {isSaved ? (
 <> <Check className="w-4 h-4 text-background-secondary" /> <span>đãLưu thành công</span> </>
 ) : (
 <span></span>
 )}
 </Button> </form> </motion.div>
 )}

 {/* TAB 3: Settings */}
 {activeTab === "settings" && (
 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6"> <h3 className="text-serif text-lg font-bold text-text-primary border-b border-brand-border pb-3"></h3> <div className="flex flex-col gap-4 max-w-md font-sans"> <LuxuryInput label="tiêu đềEmail" value="noura@example.com" disabled /> <LuxuryInput label="Mã " value="01XXXXXXXXX 20+" disabled /> <p className="text-[10px] text-text-secondary font-light">vớiKhách hàng care@aurafashion.eg Email Điện thoại.</p> </div> </motion.div>
 )}

 </div> </div> </main> </div>
 );
}

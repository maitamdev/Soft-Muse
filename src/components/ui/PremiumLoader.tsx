"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PremiumLoader() {
 const [show, setShow] = useState(true);

 useEffect(() => {
 // Check if the loader has already been shown in this session
 const hasLoaded = sessionStorage.getItem("aura_loaded_2026");
 if (hasLoaded) {
 
 setShow(false);
 return;
 }

 const timer = setTimeout(() => {
 setShow(false);
 sessionStorage.setItem("aura_loaded_2026", "true");
 }, 3200); // 3.2 seconds total animation time

 return () => clearTimeout(timer);
 }, []);

 return (
 <AnimatePresence>
 {show && (
 <motion.div
 initial={{ opacity: 1 }}
 exit={{ 
 opacity: 0,
 transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] } 
 }}
 className="fixed inset-0 bg-text-primary text-background-primary z-[9999] flex flex-col items-center justify-center overflow-hidden"
 >
 {/* Subtle luxurious background lines */}
 <div className="absolute inset-0 opacity-[0.03] pointer-events-none"> <div className="absolute left-1/4 top-0 bottom-0 w-[1px] bg-background-primary" /> <div className="absolute left-2/4 top-0 bottom-0 w-[1px] bg-background-primary" /> <div className="absolute left-3/4 top-0 bottom-0 w-[1px] bg-background-primary" /> </div> <div className="flex flex-col items-center relative z-10">
 {/* Minimal editorial tag */}
 <motion.span
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 0.5, y: 0 }}
 transition={{ duration: 1, delay: 0.2 }}
 className="text-[9px] font-sans tracking-[0.4em] uppercase text-background-secondary mb-6 block"
 >
 {"ATELIER D'EGYPTE"}
 </motion.span>

 {/* Wordmark AURA */}
 <div className="overflow-hidden py-2 flex items-center justify-center"> <motion.h1
 initial={{ letterSpacing: "0.1em", opacity: 0, y: 30 }}
 animate={{ 
 letterSpacing: "0.5em", 
 opacity: 1, 
 y: 0,
 transition: { 
 duration: 1.8, 
 ease: [0.25, 1, 0.5, 1] 
 }
 }}
 className="font-serif text-5xl md:text-7xl font-extralight text-background-secondary text-center mr-[-0.5em]"
 >
 AURA
 </motion.h1> </div>

 {/* Sub-label */}
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ 
 opacity: 0.8,
 transition: { duration: 1.2, delay: 1.2 }
 }}
 className="mt-6 flex items-center gap-3"
 > <div className="w-8 h-[1px] bg-accent/40" /> <span className="font-serif text-[10px] text-accent tracking-[0.3em] uppercase">
 2026 CAMPAIGN
 </span> <div className="w-8 h-[1px] bg-accent/40" /> </motion.div> </div>

 {/* Loading status indicator bar at the bottom */}
 <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-background-primary/20"> <motion.div
 initial={{ width: "0%" }}
 animate={{ width: "100%" }}
 transition={{ duration: 2.5, ease: [0.25, 1, 0.5, 1] }}
 className="h-full bg-accent"
 /> </div> </motion.div>
 )}
 </AnimatePresence>
 );
}

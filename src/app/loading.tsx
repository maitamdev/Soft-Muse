"use client";

import React from "react";
import Logo from "@/components/Logo";
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background-secondary"
    >
      <div className="w-full max-w-[200px] md:max-w-[300px]">
        <Logo size="hero" animated={true} variant="black" />
      </div>
    </motion.div>
  );
}

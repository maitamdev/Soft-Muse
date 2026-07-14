"use client";

import React from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { cn } from "@/utils/cn";

interface AuthCardProps {
 children: React.ReactNode;
 className?: string;
}

/**
 * The authentication container: a subtly glassed, token-shadowed card capped at
 * ~420px. Owns spacing and elevation only — content is passed in.
 * Now enhanced with smooth mouse parallax rotation for premium luxury feel.
 */
export function AuthCard({ children, className }: AuthCardProps) {
 const x = useMotionValue(0);
 const y = useMotionValue(0);

 // Smooth springs to avoid jittering
 const rotateX = useSpring(useTransform(y, [-200, 200], [4, -4]), {
 damping: 25,
 stiffness: 150,
 });
 const rotateY = useSpring(useTransform(x, [-200, 200], [-4, 4]), {
 damping: 25,
 stiffness: 150,
 });

 const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
 const rect = event.currentTarget.getBoundingClientRect();
 const width = rect.width;
 const height = rect.height;
 const mouseX = event.clientX - rect.left - width / 2;
 const mouseY = event.clientY - rect.top - height / 2;
 x.set(mouseX);
 y.set(mouseY);
 };

 const handleMouseLeave = () => {
 x.set(0);
 y.set(0);
 };

 return (
 <motion.div
 style={{
 rotateX,
 rotateY,
 transformStyle: "preserve-3d",
 perspective: 1000,
 }}
 onMouseMove={handleMouseMove}
 onMouseLeave={handleMouseLeave}
 className={cn(
 "aura-enter w-full max-w-[420px] rounded-[var(--admin-radius-2xl)]",
 "border border-[var(--admin-border-base)] bg-[var(--admin-bg-card)]/94",
 "p-7 shadow-[var(--admin-shadow-xl)] backdrop-blur-md sm:p-9",
 "transition-shadow duration-300 hover:shadow-[0_25px_60px_rgba(0,0,0,0.18)]",
 className
 )}
 > <div style={{ transform: "translateZ(20px)" }} className="w-full">
 {children}
 </div> </motion.div>
 );
}

"use client";

import React from 'react';
import { motion, HTMLMotionProps, Variants } from 'framer-motion';
import { cn } from '@/utils/cn';

interface MotionProps extends HTMLMotionProps<"div"> {
 children: React.ReactNode;
 className?: string;
 delay?: number;
 duration?: number;
 once?: boolean;
}

export function FadeIn({ children, className, delay = 0, duration = 0.3, once = true, ...props }: MotionProps) {
 return (
 <motion.div
 initial={{ opacity: 0 }}
 whileInView={{ opacity: 1 }}
 viewport={{ once }}
 transition={{ duration, delay, ease: "easeOut" }}
 className={className}
 { ...props}
 >
 {children}
 </motion.div>
 );
}

export function FadeUp({ children, className, delay = 0, duration = 0.4, once = true, ...props }: MotionProps) {
 return (
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once }}
 transition={{ duration, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
 className={className}
 { ...props}
 >
 {children}
 </motion.div>
 );
}

export function Scale({ children, className, delay = 0, duration = 0.3, once = true, ...props }: MotionProps) {
 return (
 <motion.div
 initial={{ opacity: 0, scale: 0.95 }}
 whileInView={{ opacity: 1, scale: 1 }}
 viewport={{ once }}
 transition={{ duration, delay, ease: "easeOut" }}
 className={className}
 { ...props}
 >
 {children}
 </motion.div>
 );
}

export function HoverLift({ children, className, ...props }: MotionProps) {
 return (
 <motion.div
 whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" } }}
 className={cn("will-change-transform", className)}
 { ...props}
 >
 {children}
 </motion.div>
 );
}

export function HoverScale({ children, className, ...props }: MotionProps) {
 return (
 <motion.div
 whileHover={{ scale: 1.02, transition: { duration: 0.2, ease: "easeOut" } }}
 whileTap={{ scale: 0.98 }}
 className={cn("will-change-transform", className)}
 { ...props}
 >
 {children}
 </motion.div>
 );
}

const staggerContainer: Variants = {
 hidden: { opacity: 0 },
 show: {
 opacity: 1,
 transition: {
 staggerChildren: 0.05
 }
 }
};

const staggerItem: Variants = {
 hidden: { opacity: 0, y: 15 },
 show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }
};

export function StaggerContainer({ children, className, ...props }: HTMLMotionProps<"div">) {
 return (
 <motion.div
 variants={staggerContainer}
 initial="hidden"
 whileInView="show"
 viewport={{ once: true }}
 className={className}
 { ...props}
 >
 {children}
 </motion.div>
 );
}

export function StaggerItem({ children, className, ...props }: HTMLMotionProps<"div">) {
 return (
 <motion.div variants={staggerItem} className={className} { ...props}>
 {children}
 </motion.div>
 );
}

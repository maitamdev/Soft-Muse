"use client";

import React, { useRef, useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";
import { IconLoader2 } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";

const buttonVariants = cva(
 [
 "relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-[var(--admin-radius-md)] font-medium text-sm",
 "transition-all duration-200 focus-visible:outline-none focus-visible:ring-2",
 "focus-visible:ring-[var(--admin-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--admin-bg-base)]",
 "disabled:pointer-events-none disabled:opacity-50 shrink-0 select-none whitespace-nowrap",
 ],
 {
 variants: {
 variant: {
 primary: "bg-[var(--admin-primary)] text-white hover:bg-[var(--admin-primary-hover)] shadow-sm hover:shadow-[var(--admin-shadow-md)]",
 secondary: "bg-[var(--admin-bg-elevated)] text-[var(--admin-text-base)] border border-[var(--admin-border-base)] hover:bg-[var(--admin-bg-hover)] hover:border-[var(--admin-border-strong)] shadow-sm",
 ghost: "bg-transparent text-[var(--admin-text-muted)] hover:bg-[var(--admin-bg-hover)] hover:text-[var(--admin-text-base)]",
 outline: "bg-transparent border border-[var(--admin-border-strong)] text-[var(--admin-text-base)] hover:bg-[var(--admin-bg-hover)] hover:border-[var(--admin-text-subtle)]",
 danger: "bg-[var(--admin-danger)] text-white hover:opacity-90 shadow-sm",
 warning: "bg-[var(--admin-warning)] text-white hover:opacity-90 shadow-sm",
 success: "bg-[var(--admin-success)] text-white hover:opacity-90 shadow-sm",
 link: "bg-transparent text-[var(--admin-primary)] underline-offset-4 hover:underline p-0 h-auto",
 },
 size: {
 xs: "h-8 px-3 text-xs",
 sm: "h-9 px-4 text-xs",
 md: "h-10 px-5 text-sm",
 lg: "h-11 px-6 text-base",
 xl: "h-12 px-8 text-base",
 icon: "h-10 w-10 p-0",
 "icon-sm": "h-8 w-8 p-0 text-xs",
 "icon-lg": "h-12 w-12 p-0",
 },
 },
 defaultVariants: {
 variant: "primary",
 size: "md",
 },
 }
);

export interface ButtonProps
 extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "onAnimationStart" | "onDragStart" | "onDragEnd" | "onDrag" | "style">,
 VariantProps<typeof buttonVariants> {
 isLoading?: boolean;
 loading?: boolean;
 leftIcon?: React.ReactNode;
 rightIcon?: React.ReactNode;
 fullWidth?: boolean;
 children?: React.ReactNode;
 withRipple?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
 (
 { className, variant, size, isLoading, loading, leftIcon, rightIcon, fullWidth, children, disabled, withRipple = true, ...props },
 ref
 ) => {
 const isActuallyLoading = isLoading || loading;
 const isDisabled = disabled || isActuallyLoading;
 const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

 const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
 if (isDisabled || !withRipple) return;
 const rect = e.currentTarget.getBoundingClientRect();
 const x = e.clientX - rect.left;
 const y = e.clientY - rect.top;
 setRipples((prev) => [...prev, { x, y, id: Date.now() }]);
 if (props.onClick) props.onClick(e);
 };

 return (
 <motion.button
 ref={ref}
 whileHover={!isDisabled ? { scale: 1.01 } : undefined}
 whileTap={!isDisabled ? { scale: 0.98 } : undefined}
 transition={{ duration: 0.2, ease: "easeOut" }}
 disabled={isDisabled}
 onClick={handleClick}
 className={cn(buttonVariants({ variant, size }), fullWidth && "w-full", className)}
 { ...(props as any)}
 > <AnimatePresence>
 {ripples.map((ripple) => (
 <motion.span
 key={ripple.id}
 initial={{ scale: 0, opacity: 0.35 }}
 animate={{ scale: 2, opacity: 0 }}
 exit={{ opacity: 0 }}
 transition={{ duration: 0.5, ease: "easeOut" }}
 onAnimationComplete={() => {
 setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
 }}
 className="absolute bg-current rounded-full pointer-events-none"
 style={{
 left: ripple.x,
 top: ripple.y,
 width: 100,
 height: 100,
 marginTop: -50,
 marginLeft: -50,
 }}
 />
 ))}
 </AnimatePresence>

 {isActuallyLoading ? (
 <IconLoader2 size={16} className="animate-spin" />
 ) : leftIcon ? (
 React.cloneElement(leftIcon as React.ReactElement<{ className?: string }>, {
 className: cn("w-5 h-5", (leftIcon as React.ReactElement<{ className?: string }>).props.className),
 })
 ) : null}

 {children && <span>{children}</span>}

 {!isLoading && rightIcon ? (
 React.cloneElement(rightIcon as React.ReactElement<{ className?: string }>, {
 className: cn("w-5 h-5", (rightIcon as React.ReactElement<{ className?: string }>).props.className),
 })
 ) : null}
 </motion.button>
 );
 }
);
Button.displayName = "Button";

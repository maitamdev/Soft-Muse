"use client";

import React, { useId, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

export interface AuthInputProps
 extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
 label: string;
 error?: string;
 hint?: string;
 hintTone?: "muted" | "warning";
 leadingIcon?: React.ReactNode;
 /** Rendered at the logical end of the field (e.g. a password toggle). */
 trailing?: React.ReactNode;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Token-styled text field for the auth surface. Label is always visible (above the
 * field) for clarity and screen-reader association. Focus ring, error and hint
 * states are derived purely from --admin-* tokens.
 * Now upgraded with premium floating labels, interactive focus states, and email success checks.
 */
export const AuthInput = React.forwardRef<HTMLInputElement, AuthInputProps>(
 (
 { id, label, error, hint, hintTone = "muted", leadingIcon, trailing, className, ...props },
 ref
 ) => {
 const autoId = useId();
 const inputId = id ?? autoId;
 const errorId = `${inputId}-error`;
 const hintId = `${inputId}-hint`;
 const describedBy = error ? errorId : hint ? hintId : undefined;

 const [focused, setFocused] = useState(false);

 const hasValue = props.value !== undefined ? !!props.value : false;
 const isFloating = focused || hasValue;

 const isEmail = props.type === "email";
 const isValidEmail =
 isEmail && typeof props.value === "string" && EMAIL_RE.test(props.value.trim());

 return (
 <div className="flex flex-col gap-1.5 w-full"> <div
 className={cn(
 "group relative flex h-12 items-center rounded-[var(--admin-radius-md)] border bg-[var(--admin-bg-surface)]",
 "transition-all duration-200",
 "focus-within:ring-4",
 error
 ? "border-[var(--admin-danger)] focus-within:ring-[var(--admin-danger-muted)]"
 : "border-[var(--admin-border-base)] focus-within:border-[var(--admin-primary)] focus-within:ring-[var(--admin-primary-muted)]"
 )}
 >
 {leadingIcon && (
 <span
 className={cn(
 "ps-3.5 flex items-center text-[var(--admin-text-subtle)] transition-all duration-200",
 focused && "text-[var(--admin-primary)] scale-105"
 )}
 >
 {leadingIcon}
 </span>
 )}

 <label
 htmlFor={inputId}
 className={cn(
 "absolute pointer-events-none transition-all duration-200 ease-out select-none font-medium",
 isFloating
 ? "top-1.5 text-[10px] font-bold text-[var(--admin-primary)]"
 : "top-3 text-sm text-[var(--admin-text-subtle)]",
 leadingIcon ? "start-10" : "start-3.5"
 )}
 >
 {label}
 </label> <input
 ref={ref}
 id={inputId}
 aria-invalid={!!error}
 aria-describedby={describedBy}
 onFocus={(e) => {
 setFocused(true);
 props.onFocus?.(e);
 }}
 onBlur={(e) => {
 setFocused(false);
 props.onBlur?.(e);
 }}
 className={cn(
 "peer w-full bg-transparent px-3.5 pt-5 pb-1 text-sm text-[var(--admin-text-base)]",
 "placeholder:text-transparent focus:outline-none",
 leadingIcon && "ps-2.5",
 trailing && "pe-1",
 className
 )}
 { ...props}
 placeholder="Nhập nội dung"
 /> <AnimatePresence>
 {isEmail && isValidEmail && !error && (
 <motion.span
 initial={{ scale: 0, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 exit={{ scale: 0, opacity: 0 }}
 transition={{ type: "spring", stiffness: 300, damping: 20 }}
 className="pe-3.5 flex items-center text-[var(--admin-success)]"
 > <svg
 width="16"
 height="16"
 viewBox="0 0 24 24"
 fill="none"
 stroke="currentColor"
 strokeWidth="3.5"
 strokeLinecap="round"
 strokeLinejoin="round"
 > <polyline points="20 6 9 17 4 12" /> </svg> </motion.span>
 )}
 </AnimatePresence>

 {trailing && <span className="pe-2 flex items-center">{trailing}</span>}
 </div>

 {error ? (
 <p
 id={errorId}
 role="alert"
 className="text-xs font-medium text-[var(--admin-danger)] ms-0.5"
 >
 {error}
 </p>
 ) : hint ? (
 <p
 id={hintId}
 aria-live="polite"
 className={cn(
 "text-xs ms-0.5",
 hintTone === "warning"
 ? "font-medium text-[var(--admin-warning)]"
 : "text-[var(--admin-text-subtle)]"
 )}
 >
 {hint}
 </p>
 ) : null}
 </div>
 );
 }
);
AuthInput.displayName = "AuthInput";

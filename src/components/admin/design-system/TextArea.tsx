"use client";

import React, { useState } from "react";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
 label?: string;
 error?: string;
 hint?: string;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
 ({ className, label, error, hint, id, value, defaultValue, placeholder, ...props }, ref) => {
 const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
 const [isFocused, setIsFocused] = useState(false);
 
 return (
 <div className={cn("flex flex-col gap-1.5", className)}> <div className={cn(
 "relative flex w-full rounded-[var(--admin-radius-md)] border bg-[var(--admin-bg-surface)] transition-all duration-200 overflow-hidden",
 error ? "border-[var(--admin-danger)] focus-within:ring-4 focus-within:ring-[var(--admin-danger-muted)]" 
 : "border-[var(--admin-border-base)] focus-within:border-[var(--admin-primary)] focus-within:ring-4 focus-within:ring-[var(--admin-primary-muted)]"
 )}> <textarea
 ref={ref}
 id={inputId}
 value={value}
 defaultValue={defaultValue}
 placeholder={placeholder}
 onFocus={(e) => { setIsFocused(true); props.onFocus?.(e); }}
 onBlur={(e) => { setIsFocused(false); props.onBlur?.(e); }}
 className="w-full bg-transparent border-none focus:outline-none p-4 text-[var(--admin-text-base)] placeholder:text-[var(--admin-text-subtle)] min-h-[100px] resize-y custom-scrollbar"
 aria-invalid={!!error}
 aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
 { ...props}
 /> </div>
 {error && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} id={`${inputId}-error`} className="text-xs text-[var(--admin-danger)] ms-1">{error}</motion.p>}
 {!error && hint && <p id={`${inputId}-hint`} className="text-xs text-[var(--admin-text-subtle)] ms-1">{hint}</p>}
 </div>
 );
 }
);
TextArea.displayName = "TextArea";

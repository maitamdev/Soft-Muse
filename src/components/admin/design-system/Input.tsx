"use client";

import React, { useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";

const inputWrapperVariants = cva(
  [
    "relative flex items-center w-full rounded-[var(--admin-radius-md)] border bg-[var(--admin-bg-surface)]",
    "transition-all duration-200 overflow-hidden",
  ],
  {
    variants: {
      variant: {
        default: "border-[var(--admin-border-base)] focus-within:border-[var(--admin-primary)] focus-within:ring-4 focus-within:ring-[var(--admin-primary-muted)]",
        error:   "border-[var(--admin-danger)] focus-within:ring-4 focus-within:ring-[var(--admin-danger-muted)]",
        ghost:   "border-transparent bg-[var(--admin-bg-elevated)] hover:bg-[var(--admin-bg-hover)] focus-within:bg-[var(--admin-bg-surface)] focus-within:border-[var(--admin-primary)]",
      },
      inputSize: {
        sm: "h-10",
        md: "h-12",
        lg: "h-14",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "md",
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputWrapperVariants> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  icon?: React.ReactNode; // Alias for leftIcon to support old usages
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, inputSize, label, error, hint, leftIcon, rightIcon, icon, id, value, defaultValue, placeholder, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    const resolvedVariant = error ? "error" : variant;
    
    // For floating label
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = Boolean(value || defaultValue);
    const isFloating = isFocused || hasValue || !!placeholder;

    return (
      <div className="w-full flex flex-col gap-1">
        <div className={cn(inputWrapperVariants({ variant: resolvedVariant, inputSize }), className)}>
          {(leftIcon || icon) && (
            <span className="ps-4 flex items-center text-[var(--admin-text-subtle)] pointer-events-none">
              {leftIcon || icon}
            </span>
          )}
          
          <div className="relative flex-1 h-full flex flex-col justify-center px-4">
            {label && (
              <motion.label
                htmlFor={inputId}
                initial={false}
                animate={{
                  y: isFloating ? (inputSize === 'sm' ? -8 : -10) : 0,
                  scale: isFloating ? 0.8 : 1,
                  color: error ? "var(--admin-danger)" : isFocused ? "var(--admin-primary)" : "var(--admin-text-muted)"
                }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className={cn(
                  "absolute left-4 origin-left pointer-events-none text-base",
                  (leftIcon || icon) && "left-0"
                )}
              >
                {label}
              </motion.label>
            )}
            
            <input
              ref={ref}
              id={inputId}
              value={value}
              defaultValue={defaultValue}
              placeholder={isFocused ? placeholder : ""}
              onFocus={(e) => {
                setIsFocused(true);
                props.onFocus?.(e);
              }}
              onBlur={(e) => {
                setIsFocused(false);
                props.onBlur?.(e);
              }}
              className={cn(
                "w-full bg-transparent border-none focus:outline-none text-[var(--admin-text-base)] placeholder:text-[var(--admin-text-subtle)]",
                label && isFloating && "pt-4 text-sm font-medium"
              )}
              aria-invalid={!!error}
              aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
              {...props}
            />
          </div>

          {rightIcon && (
            <span className="pe-4 flex items-center text-[var(--admin-text-subtle)] pointer-events-none">
              {rightIcon}
            </span>
          )}
        </div>
        
        {error && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} id={`${inputId}-error`} className="text-xs text-[var(--admin-danger)] ms-1">{error}</motion.p>
        )}
        {!error && hint && (
          <p id={`${inputId}-hint`} className="text-xs text-[var(--admin-text-subtle)] ms-1">{hint}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

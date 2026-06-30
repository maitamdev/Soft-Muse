"use client";

import React from "react";
import { motion } from "framer-motion";

interface ButtonProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd"
  > {
  variant?: "primary" | "secondary" | "ghost" | "dark-outline";
  children: React.ReactNode;
  className?: string;
}

export default function Button({
  variant = "primary",
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyle =
    "relative inline-flex items-center justify-center font-sans font-medium text-xs transition-colors duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary min-h-[46px] px-8 cursor-pointer select-none disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-text-primary text-background-secondary border border-text-primary hover:bg-accent hover:border-accent hover:shadow-[0_8px_24px_rgba(154,115,85,0.25)]",
    secondary:
      "bg-transparent text-text-primary border border-brand-border hover:border-text-primary",
    "dark-outline":
      "bg-transparent text-text-primary border border-text-primary hover:bg-text-primary hover:text-background-secondary",
    ghost:
      "bg-transparent text-text-primary hover:text-accent px-4 min-h-[36px]",
  };

  return (
    <motion.button
      whileHover={disabled ? undefined : { y: -2 }}
      whileTap={disabled ? undefined : { scale: 0.97, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </motion.button>
  );
}


"use client";

import React from "react";
import { motion } from "framer-motion";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl" | "hero" | number;
  animated?: boolean;
  variant?: "black" | "white" | "currentColor";
  className?: string;
}

const sizeMap = {
  sm: "text-lg md:text-xl",
  md: "text-xl md:text-2xl",
  lg: "text-2xl md:text-3xl lg:text-4xl",
  xl: "text-3xl md:text-5xl",
  hero: "text-5xl md:text-7xl",
};

const colorMap = {
  black: "text-[#171313]",
  white: "text-[#FFF9F3]",
  currentColor: "",
};

export default function Logo({
  size = "md",
  animated = true,
  variant = "currentColor",
  className = "",
}: LogoProps) {
  const numericStyle = typeof size === "number" ? { fontSize: `${size}px` } : {};
  const classNames = [
    "inline-flex flex-col items-center justify-center leading-none select-none",
    typeof size === "string" ? sizeMap[size] : "",
    colorMap[variant],
    className,
  ].join(" ");

  const content = (
    <>
      <span className="font-serif font-medium tracking-[0.16em] uppercase whitespace-nowrap">
        Soft Muse
      </span>
      <span className="mt-1 font-sans text-[0.28em] font-medium tracking-[0.34em] uppercase text-accent whitespace-nowrap">
        Officewear
      </span>
    </>
  );

  if (!animated) {
    return (
      <span className={classNames} style={numericStyle}>
        {content}
      </span>
    );
  }

  return (
    <motion.span
      className={classNames}
      style={numericStyle}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {content}
    </motion.span>
  );
}

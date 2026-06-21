import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "dark-outline";
  children: React.ReactNode;
  className?: string;
}

export default function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyle =
    "relative inline-flex items-center justify-center font-sans font-medium text-xs transition-all duration-300 ease-out focus:outline-none min-h-[46px] px-8 cursor-pointer select-none";

  const variants = {
    primary:
      "bg-text-primary text-background-secondary border border-text-primary hover:bg-accent hover:border-accent active:scale-[0.98]",
    secondary:
      "bg-transparent text-text-primary border border-brand-border hover:border-text-primary active:scale-[0.98]",
    "dark-outline":
      "bg-transparent text-text-primary border border-text-primary hover:bg-text-primary hover:text-background-secondary active:scale-[0.98]",
    ghost:
      "bg-transparent text-text-primary hover:text-accent px-4 min-h-[36px]",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </button>
  );
}


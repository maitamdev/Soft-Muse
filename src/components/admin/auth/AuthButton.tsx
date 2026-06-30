"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { IconLoader2 } from "@tabler/icons-react";
import { cn } from "@/utils/cn";

type AuthButtonState = "idle" | "loading" | "success";

interface AuthButtonProps
  extends Omit<HTMLMotionProps<"button">, "children"> {
  state?: AuthButtonState;
  children: React.ReactNode;
}

/**
 * Full-width primary action for the auth surface, with idle / loading / success
 * states. Motion is CSS-driven and Framer Motion powered, honoring reduced-motion.
 */
export const AuthButton = React.forwardRef<HTMLButtonElement, AuthButtonProps>(
  ({ state = "idle", children, className, disabled, ...props }, ref) => {
    const busy = state === "loading" || state === "success";

    return (
      <motion.button
        ref={ref}
        disabled={disabled || busy}
        aria-busy={state === "loading"}
        whileHover={
          disabled || busy
            ? {}
            : {
                scale: 1.01,
                boxShadow: "0 0 15px var(--admin-primary-muted)",
              }
        }
        whileTap={disabled || busy ? {} : { scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className={cn(
          "relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-[var(--admin-radius-md)]",
          "text-sm font-semibold text-white",
          "bg-[var(--admin-primary)] shadow-[var(--admin-shadow-md)]",
          "transition-all duration-200",
          "hover:bg-[var(--admin-primary-hover)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--admin-bg-card)]",
          "disabled:cursor-not-allowed disabled:opacity-80",
          state === "success" && "bg-[var(--admin-success)] hover:bg-[var(--admin-success)]",
          className
        )}
        {...props}
      >
        {state === "loading" && <IconLoader2 size={18} className="animate-spin" />}
        {state === "success" && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              className="aura-check-path"
              d="M5 13l4 4L19 7"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        <span>{children}</span>
      </motion.button>
    );
  }
);
AuthButton.displayName = "AuthButton";

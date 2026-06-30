"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconEye, IconEyeOff, IconLock } from "@tabler/icons-react";
import { adminAr } from "@/lib/i18n/admin-ar";
import { AuthInput, type AuthInputProps } from "./AuthInput";

type PasswordFieldProps = Omit<
  AuthInputProps,
  "type" | "trailing" | "leadingIcon" | "hint" | "hintTone"
> & {
  /** Show the inline Caps Lock warning when detected. Defaults to true. */
  detectCapsLock?: boolean;
};

/**
 * Password input with a show/hide toggle and live Caps Lock detection,
 * built on top of {@link AuthInput} so styling is never duplicated.
 * Now enhanced with password length indicator and animated eye icon.
 */
export const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ detectCapsLock = true, error, onKeyUp, onKeyDown, onBlur, ...props }, ref) => {
    const [visible, setVisible] = useState(false);
    const [capsLock, setCapsLock] = useState(false);

    const trackCaps = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!detectCapsLock) return;
      if (typeof e.getModifierState === "function") {
        setCapsLock(e.getModifierState("CapsLock"));
      }
    };

    const passwordLength = typeof props.value === "string" ? props.value.length : 0;

    return (
      <AuthInput
        ref={ref}
        type={visible ? "text" : "password"}
        error={error}
        leadingIcon={<IconLock size={18} stroke={1.6} />}
        hint={!error && capsLock ? adminAr.login.capsLock : undefined}
        hintTone="warning"
        onKeyUp={(e) => {
          trackCaps(e);
          onKeyUp?.(e);
        }}
        onKeyDown={(e) => {
          trackCaps(e);
          onKeyDown?.(e);
        }}
        onBlur={(e) => {
          setCapsLock(false);
          onBlur?.(e);
        }}
        trailing={
          <div className="flex items-center gap-2 pe-1">
            {passwordLength > 0 && (
              <span className="text-[10px] font-mono text-[var(--admin-text-subtle)] bg-[var(--admin-bg-active)] px-1.5 py-0.5 rounded select-none flex items-center gap-0.5">
                <span className="tracking-[0.08em]">{"•".repeat(Math.min(passwordLength, 6))}</span>
                {passwordLength > 6 && "+"}
                <span className="ms-1 font-semibold">{passwordLength}ch</span>
              </span>
            )}
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              aria-label={visible ? adminAr.login.hidePassword : adminAr.login.showPassword}
              aria-pressed={visible}
              className="rounded-[var(--admin-radius-sm)] p-1.5 text-[var(--admin-text-subtle)] transition-colors hover:text-[var(--admin-text-base)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)]"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={visible ? "visible" : "hidden"}
                  initial={{ rotate: -45, scale: 0.8, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 45, scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="flex items-center justify-center"
                >
                  {visible ? (
                    <IconEyeOff size={17} stroke={1.7} />
                  ) : (
                    <IconEye size={17} stroke={1.7} />
                  )}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        }
        {...props}
      />
    );
  }
);
PasswordField.displayName = "PasswordField";

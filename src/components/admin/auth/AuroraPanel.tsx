"use client";

import React from "react";
import {
  IconHanger,
  IconBuildingWarehouse,
  IconShoppingBag,
  IconChartHistogram,
  IconShieldLock,
} from "@tabler/icons-react";
import { adminAr } from "@/lib/i18n/admin-ar";
import { AuraWordmark } from "./AuraWordmark";

const features = [
  { icon: IconHanger, label: adminAr.login.brandPointProducts },
  { icon: IconBuildingWarehouse, label: adminAr.login.brandPointInventory },
  { icon: IconShoppingBag, label: adminAr.login.brandPointOrders },
  { icon: IconChartHistogram, label: adminAr.login.brandPointFinance },
];

/**
 * Signature branding panel — a slow-drifting "aurora" (the brand is AURA) rendered
 * entirely from --admin-* tokens, so it reads correctly in both light and dark.
 */
export function AuroraPanel() {
  return (
    <aside className="relative hidden overflow-hidden bg-[var(--admin-bg-surface)] lg:flex lg:flex-col lg:justify-between lg:p-14 xl:p-16">
      {/* Aurora field */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="aura-orb aura-orb--a"
          style={{
            width: "32rem",
            height: "32rem",
            insetInlineStart: "-8rem",
            top: "-6rem",
            background:
              "radial-gradient(circle at center, var(--admin-primary) 0%, transparent 68%)",
            opacity: 0.5,
          }}
        />
        <div
          className="aura-orb aura-orb--b"
          style={{
            width: "30rem",
            height: "30rem",
            insetInlineEnd: "-10rem",
            top: "30%",
            background:
              "radial-gradient(circle at center, var(--admin-accent) 0%, transparent 70%)",
            opacity: 0.45,
          }}
        />
        <div
          className="aura-orb aura-orb--c"
          style={{
            width: "26rem",
            height: "26rem",
            insetInlineStart: "20%",
            bottom: "-8rem",
            background:
              "radial-gradient(circle at center, var(--admin-info) 0%, transparent 72%)",
            opacity: 0.4,
          }}
        />
        {/* Hairline grid for an engineered, ERP texture */}
        <div
          className="aura-sheen absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(var(--admin-border-base) 1px, transparent 1px), linear-gradient(90deg, var(--admin-border-base) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse at 30% 20%, black, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse at 30% 20%, black, transparent 75%)",
            opacity: 0.5,
          }}
        />
      </div>

      {/* Top: wordmark + kicker */}
      <div className="relative aura-enter">
        <AuraWordmark size="lg" />
        <p className="mt-3 text-sm font-medium tracking-[0.18em] text-[var(--admin-primary)]">
          {adminAr.login.brandKicker}
        </p>
      </div>

      {/* Middle: headline + tagline */}
      <div className="relative aura-enter" style={{ animationDelay: "0.08s" }}>
        <h1
          className="text-[2rem] font-bold leading-tight text-[var(--admin-text-base)] xl:text-[2.4rem]"
          style={{ fontFamily: "var(--font-el-messiri), serif" }}
        >
          {adminAr.login.brandHeadline}
        </h1>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[var(--admin-text-muted)]">
          {adminAr.login.brandTagline}
        </p>

        <ul className="mt-9 grid max-w-md grid-cols-2 gap-3">
          {features.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-2.5 rounded-[var(--admin-radius-md)] border border-[var(--admin-border-base)] bg-[var(--admin-bg-card)]/60 px-3.5 py-3 backdrop-blur-sm"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--admin-radius-sm)] bg-[var(--admin-primary-muted)] text-[var(--admin-primary)]">
                <Icon size={17} stroke={1.7} />
              </span>
              <span className="text-[13px] font-medium text-[var(--admin-text-base)]">
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom: trust + copyright */}
      <div
        className="relative aura-enter flex items-center justify-between text-xs text-[var(--admin-text-subtle)]"
        style={{ animationDelay: "0.16s" }}
      >
        <span className="inline-flex items-center gap-1.5">
          <IconShieldLock size={15} stroke={1.7} />
          {adminAr.login.securedNote}
        </span>
        <span className="text-end">
          {adminAr.login.copyright} تطوير:{" "}
          <a
            href="https://salahkhaled.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline transition-colors hover:text-[var(--admin-text-base)]"
          >
            Salah Khaled
          </a>
        </span>
      </div>
    </aside>
  );
}

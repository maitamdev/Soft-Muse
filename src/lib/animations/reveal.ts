import { type Variants } from "framer-motion";

export const revealEase = [0.25, 0.1, 0.25, 1] as const;
export const heroEase = [0.25, 1, 0.5, 1] as const;

export const scrollViewport = { once: true, margin: "-120px" } as const;

/** Scroll-triggered fade-up reveal for hero/section-level entrances. */
export const heroFadeUp: Variants = {
 hidden: { opacity: 0, y: 40 },
 visible: (delay: number = 0) => ({
 opacity: 1,
 y: 0,
 transition: { duration: 1, delay, ease: heroEase },
 }),
};

/** Scroll-triggered fade-up reveal for in-page content blocks. */
export const scrollFadeUp: Variants = {
 hidden: { opacity: 0, y: 20 },
 visible: (delay: number = 0) => ({
 opacity: 1,
 y: 0,
 transition: { duration: 0.8, delay, ease: revealEase },
 }),
};

/** Scroll-triggered fade-in from the trailing edge (RTL-safe horizontal reveal). */
export const scrollFadeIn: Variants = {
 hidden: { opacity: 0, x: 20 },
 visible: (delay: number = 0) => ({
 opacity: 1,
 x: 0,
 transition: { duration: 0.8, delay, ease: revealEase },
 }),
};

/** Scroll-triggered scale-in reveal for avatars/portraits/badges. */
export const scrollScaleIn: Variants = {
 hidden: { opacity: 0, scale: 0.9 },
 visible: (delay: number = 0) => ({
 opacity: 1,
 scale: 1,
 transition: { duration: 0.8, delay, ease: revealEase },
 }),
};

/** Shared timing for dynamically-animated properties (e.g. width bars) that can't use Variants. */
export const revealTransition = (delay: number = 0) => ({ duration: 0.8, delay, ease: revealEase });

/** On-mount fade-up for hero titles (not scroll-triggered). */
export const mountFadeUp: Variants = {
 hidden: { opacity: 0, y: 20 },
 visible: (delay: number = 0) => ({
 opacity: 1,
 y: 0,
 transition: { duration: 0.8, delay, ease: revealEase },
 }),
};

/** On-mount fade-in for hero subtitles (not scroll-triggered). */
export const mountFadeIn: Variants = {
 hidden: { opacity: 0 },
 visible: (delay: number = 0) => ({
 opacity: 1,
 transition: { duration: 0.8, delay, ease: revealEase },
 }),
};

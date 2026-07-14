"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { motion } from "framer-motion";
import {
 IconPlus as Plus,
 IconMinus as Minus,
 IconBrandFacebook,
 IconBrandInstagram,
 IconBrandPinterest,
 IconBrandTiktok,
 IconBrandWhatsapp,
} from "@tabler/icons-react";
import { useNotification } from "@/context/NotificationContext";
import { SocialIconButton } from "@/components/ui/AnimatedIcon";
import { FooterService, FooterSettings } from "@/lib/services/storefront/footer.service";
import { StoreService } from "@/lib/services/storefront/store.service";
import { useEventSubscribeMany } from "@/hooks/useEventBus";

/* ─────────────── Social SVG icons ─────────────── */
const SocialIcons = {
 Facebook: () => <IconBrandFacebook stroke={1.4} className="w-5 h-5" />,
 Instagram: () => <IconBrandInstagram stroke={1.4} className="w-5 h-5" />,
 TikTok: () => <IconBrandTiktok stroke={1.4} className="w-5 h-5" />,
 Pinterest: () => <IconBrandPinterest stroke={1.4} className="w-5 h-5" />,
 WhatsApp: () => <IconBrandWhatsapp stroke={1.4} className="w-5 h-5" />,
};

type NavColumnData = { title: string; links: { label: string; href: string }[] };
type SocialEntry = { Icon: React.FC; label: string; href: string };

const DEFAULT_NAV_DATA: NavColumnData[] = [
 {
 title: "Cửa hàng",
 links: [
 { label: "Tất cả sản phẩm", href: "/shop" },
 { label: "Hàng mới", href: "/new-arrivals" },
 { label: "Bestseller", href: "/bestsellers" },
 { label: "Khuyến mãi", href: "/sale" },
 ],
 },
 {
 title: "Soft Muse",
 links: [
 { label: "Giới thiệu thương hiệu", href: "/about" },
 { label: "Theo dõi đơn hàng", href: "/tracking" },
 { label: "Liên hệ với chúng tôi", href: "/contact" },
 ],
 },
 {
 title: "Dịch vụ khách hàng",
 links: [
 { label: "Vận chuyển và giao hàng", href: "/shipping" },
 { label: "Đổi trả", href: "/returns" },
 { label: "Điều khoản", href: "/terms" },
 { label: "Chính sách bảo mật", href: "/privacy" },
 ],
 },
];

const DEFAULT_SOCIALS: SocialEntry[] = [
 { Icon: SocialIcons.Facebook, label: "Facebook", href: "https://www.facebook.com/softmuse.vn" },
 { Icon: SocialIcons.Instagram, label: "Instagram", href: "https://www.instagram.com/softmuse.vn/" },
 { Icon: SocialIcons.WhatsApp, label: "Zalo", href: "https://zalo.me/0900000000" },
 { Icon: SocialIcons.TikTok, label: "TikTok", href: "https://www.tiktok.com/@softmuse.vn" },
 { Icon: SocialIcons.Pinterest, label: "Pinterest", href: "https://www.pinterest.com/softmusevn" },
];

/* ─────────────── Reusable animated link ─────────────── */
function FooterLink({ label, href }: { label: string; href: string }) {
 return (
 <li> <Link
 href={href}
 className="group relative inline-block font-sans text-xs font-light text-text-secondary hover:text-text-primary transition-colors duration-300 leading-relaxed min-h-[36px] md:min-h-0 flex items-center md:inline-flex"
 >
 {label}
 <span className="absolute bottom-0 start-0 w-0 h-px bg-accent group-hover:w-full transition-all duration-500 ease-out" /> </Link> </li>
 );
}

/* ─────────────── Accordion column (mobile) ─────────────── */
function NavColumn({ title, links, delay }: { title: string; links: { label: string; href: string }[]; delay: number }) {
 const [open, setOpen] = useState(false);

 return (
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: "60px" }}
 transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
 >
 {/* Title / toggle */}
 <button
 onClick={() => setOpen((p) => !p)}
 className="w-full flex justify-between items-center py-4 md:py-0 md:pointer-events-none border-b border-brand-border md:border-none text-left"
 aria-expanded={open}
 > <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-accent font-bold">
 {title}
 </span> <span className="md:hidden text-text-secondary/60">
 {open
 ? <Minus className="w-3.5 h-3.5" />
 : <Plus className="w-3.5 h-3.5" />}
 </span> </button>

 {/* Links list */}
 <motion.ul
 initial={false}
 animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
 transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
 className="overflow-hidden md:!h-auto md:!opacity-100 flex flex-col gap-3 pb-2 md:pb-0 md:mt-5"
 >
 {links.map((l) => <FooterLink key={l.href} { ...l} />)}
 </motion.ul> </motion.div>
 );
}

/* ─────────────── Main Footer ─────────────── */
export default function Footer() {
 const { showNotification } = useNotification();
 const [email, setEmail] = useState("");
 const [navData, setNavData] = useState<NavColumnData[]>(DEFAULT_NAV_DATA);
 const [socials, setSocials] = useState<SocialEntry[]>(DEFAULT_SOCIALS);
 const [newsletterTitle, setNewsletterTitle] = useState('Bản tin Soft Muse');
 const [newsletterSubtitle, setNewsletterSubtitle] = useState('Nhận hàng mới, gợi ý phối đồ và ưu đãi riêng');
 const [copyrightText, setCopyrightText] = useState('© 2026 Soft Muse');
 const [developerCredit, setDeveloperCredit] = useState('');
 const [showNewsletter, setShowNewsletter] = useState(true);
 const [showSocialIcons, setShowSocialIcons] = useState(true);

 const SOCIAL_ICON_MAP: Record<string, React.FC> = {
 facebook: SocialIcons.Facebook,
 instagram: SocialIcons.Instagram,
 whatsapp: SocialIcons.WhatsApp,
 tiktok: SocialIcons.TikTok,
 pinterest: SocialIcons.Pinterest,
 };

 const loadFooterData = useCallback(async () => {
 try {
 const [footerSettings, storeInfo] = await Promise.all([
 FooterService.getSettings(),
 StoreService.getInfo(),
 ]);

 if (footerSettings.columns?.length) {
 setNavData(footerSettings.columns
.sort((a, b) => a.order - b.order)
.map(col => ({
 title: col.title,
 links: col.links.map(l => ({ label: l.label, href: l.url })),
 })));
 }

 if (footerSettings.newsletterTitle) setNewsletterTitle(footerSettings.newsletterTitle);
 if (footerSettings.newsletterSubtitle) setNewsletterSubtitle(footerSettings.newsletterSubtitle);
 if (footerSettings.copyrightText) setCopyrightText(footerSettings.copyrightText);
 if (footerSettings.developerCredit) setDeveloperCredit(footerSettings.developerCredit);
 setShowNewsletter(footerSettings.showNewsletter ?? true);
 setShowSocialIcons(footerSettings.showSocialIcons ?? true);

 if (storeInfo?.socialMedia) {
 const sm = storeInfo.socialMedia;
 const built: SocialEntry[] = Object.entries(sm)
.filter(([key]) => SOCIAL_ICON_MAP[key] && (sm as any)[key])
.map(([key, href]) => ({
 Icon: SOCIAL_ICON_MAP[key],
 label: key.charAt(0).toUpperCase() + key.slice(1),
 href: href as string,
 }));
 if (built.length) setSocials(built);
 }
 } catch {
 // keep defaults
 }
 }, []);

 useEffect(() => { loadFooterData(); }, [loadFooterData]);
 useEventSubscribeMany(['website.changed'], loadFooterData);

 const handleSubscribe = (e: React.FormEvent) => {
 e.preventDefault();
 showNotification("Cảm ơn bạn đã đăng ký nhận tin từ Soft Muse.", "success");
 setEmail("");
 };

 return (
 <footer
 aria-label="Chân trang — Soft Muse"
 className="w-full bg-[#FAF8F5] border-t border-[#EAE3D9]"
 >

 {/* ══════════════════════════════
 HERO BRAND ROW
 ══════════════════════════════ */}
 <div className="max-w-[1280px] mx-auto px-6 md:px-12"> <div className="py-14 md:py-20 flex flex-col md:flex-row md:items-end md:justify-between gap-8">

 {/* Logo + tagline */}
 <motion.div
 initial={{ opacity: 0, y: 28 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: "60px" }}
 transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
 className="flex flex-col items-start gap-4"
 > <Link href="/" aria-label="Soft Muse – Trang chủ"> <Logo size="lg" variant="black" animated={false} className="hover:opacity-70 transition-opacity duration-500" /> </Link> <p className="font-serif text-base md:text-lg font-light text-text-secondary leading-relaxed max-w-[300px]">
 Thời trang công sở nữ tối giản, thanh lịch và hiện đại.</p> </motion.div>

 {/* Newsletter */}
 {showNewsletter && (
 <motion.div
 initial={{ opacity: 0, y: 28 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: "60px" }}
 transition={{ duration: 1, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
 className="flex flex-col gap-3 w-full md:max-w-[380px]"
 > <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-accent font-bold">
 {newsletterTitle}
 </span> <h3 className="font-serif text-lg md:text-xl font-light text-text-primary leading-snug">
 {newsletterSubtitle}
 </h3> <form
 onSubmit={handleSubscribe}
 className="flex mt-1"
 > <input
 type="email"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 placeholder="Email của bạn."
 required
 dir="ltr"
 className="flex-1 h-12 bg-white border border-[#EAE3D9] border-l-0 text-xs font-sans
 text-text-primary px-5 outline-none placeholder:text-text-secondary/40
 focus:border-accent transition-colors duration-300"
 /> <button
 type="submit"
 className="h-12 shrink-0 bg-text-primary text-background-secondary text-xs font-sans
 font-semibold px-7 hover:bg-accent transition-colors duration-500"
 >Đăng ký</button> </form> </motion.div>
 )}
 </div>

 {/* Thin separator */}
 <div className="h-px bg-[#EAE3D9]" /> </div>

 {/* ══════════════════════════════
 NAV COLUMNS
 ══════════════════════════════ */}
 <div className="max-w-[1280px] mx-auto px-6 md:px-12 py-10 md:py-16"> <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-12 lg:gap-20">
 {navData.map((col, i) => (
 <NavColumn key={col.title} title={col.title} links={col.links} delay={i * 0.1} />
 ))}
 </div> </div>

 {/* Thin separator */}
 <div className="max-w-[1280px] mx-auto px-6 md:px-12"> <div className="h-px bg-[#EAE3D9]" /> </div>

 {/* ══════════════════════════════
 BOTTOM BAR
 ══════════════════════════════ */}
 <div className="max-w-[1280px] mx-auto px-6 md:px-12"> <motion.div
 initial={{ opacity: 0 }}
 whileInView={{ opacity: 1 }}
 viewport={{ once: true }}
 transition={{ duration: 1, ease: "easeOut" }}
 className="py-6 md:py-8 flex flex-col-reverse md:flex-row items-center justify-between gap-5"
 >

 {/* Copyright */}
 <div className="flex flex-col items-center md:items-start gap-2.5"> <div className="flex flex-col sm:flex-row items-center gap-3 text-[10px] font-sans font-light text-text-secondary"> <span>{copyrightText}</span> <span className="hidden sm:block text-[#EAE3D9]">|</span> <address className="not-italic flex gap-1"> <span>Hoạt động tại</span> <span className="text-accent font-medium">Việt Nam</span> </address> </div>
 {/* Developer Attribution */}
 <div className="text-[10px] font-sans font-light text-text-secondary/90 flex items-center gap-1.5 select-none"> <span>Mãtừ</span> <a
 href="https://salahkhaled.com/en"
 target="_blank"
 rel="noopener noreferrer"
 className="font-normal text-text-secondary hover:text-accent opacity-90 hover:opacity-100 transition-all duration-300 relative py-0.5 group focus:outline-none focus-visible:ring-1 focus-visible:ring-accent rounded px-1 -mx-1"
 >
 {developerCredit}
 <span className="absolute bottom-0 end-0 w-0 h-[1px] bg-accent group-hover:w-full transition-all duration-300 ease-out motion-reduce:transition-none" /> </a> </div> </div>

 {/* Social icons */}
 {showSocialIcons && (
 <div className="flex items-center gap-0">
 {socials.map(({ Icon, label, href }) => (
 <SocialIconButton key={label} href={href} label={label} size="md"> <Icon /> </SocialIconButton>
 ))}
 </div>
 )}
 </motion.div> </div> </footer>
 );
}

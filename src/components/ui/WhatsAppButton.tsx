"use client";

import { motion } from "framer-motion";
import { IconBrandFacebook, IconMessageCircle } from "@tabler/icons-react";

const chatLinks = [
  {
    label: "Zalo",
    href: "https://zalo.me/0900000000",
    Icon: IconMessageCircle,
    className: "hover:border-[#0068FF] hover:text-[#0068FF] hover:shadow-[0_8px_24px_rgba(0,104,255,0.22)]",
  },
  {
    label: "Messenger",
    href: "https://m.me/softmuse.vn",
    Icon: IconBrandFacebook,
    className: "hover:border-[#0084FF] hover:text-[#0084FF] hover:shadow-[0_8px_24px_rgba(0,132,255,0.22)]",
  },
];

export default function WhatsAppButton() {
  return (
    <div className="fixed bottom-20 right-4 z-40 md:bottom-8 md:right-8 flex flex-col gap-2">
      {chatLinks.map(({ label, href, Icon, className }, index) => (
        <motion.a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Chat với Soft Muse qua ${label}`}
          initial={{ opacity: 0, scale: 0.88, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            opacity: { duration: 0.45, delay: 0.45 + index * 0.1 },
            scale: { duration: 0.45, delay: 0.45 + index * 0.1, ease: [0.25, 0.1, 0.25, 1] },
            y: { duration: 0.45, delay: 0.45 + index * 0.1 },
          }}
          whileHover={{ y: -3, scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className={`flex h-12 w-12 md:h-13 md:w-13 items-center justify-center rounded-full bg-background-secondary border border-brand-border text-accent shadow-[0_8px_24px_rgba(154,115,85,0.12)] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 ${className}`}
        >
          <Icon className="h-6 w-6" stroke={1.5} />
        </motion.a>
      ))}
    </div>
  );
}

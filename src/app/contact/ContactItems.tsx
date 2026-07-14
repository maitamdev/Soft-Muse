"use client";

import { useState, useEffect, useCallback } from "react";
import { IconMessageCircle as MessageCircle, IconMail as Mail, IconMapPin as MapPin, IconClock as Clock } from "@tabler/icons-react";
import { StoreService } from "@/lib/services/storefront/store.service";
import { useEventSubscribeMany } from "@/hooks/useEventBus";

const DEFAULT_ITEMS = [
 { icon: MessageCircle, title: "Zalo", text: "0900 000 000", href: "https://zalo.me/0900000000" },
 { icon: MessageCircle, title: "Messenger", text: "m.me/softmuse.vn", href: "https://m.me/softmuse.vn" },
 { icon: Mail, title: "Email", text: "hello@softmuse.vn", href: "mailto:hello@softmuse.vn" },
 { icon: MapPin, title: "Địa chỉ", text: "TP. Hồ Chí Minh, Việt Nam", href: "#address" },
 { icon: Clock, title: "Giờ hỗ trợ", text: "Thứ 2 - Chủ nhật, 9:00 - 21:00", href: "#hours" },
];

type ContactItemEntry = typeof DEFAULT_ITEMS[number];

export function ContactItems() {
 const [items, setItems] = useState<ContactItemEntry[]>(DEFAULT_ITEMS);

 const loadContactInfo = useCallback(async () => {
 try {
 const info = await StoreService.getInfo();
 setItems([
 { icon: MessageCircle, title: "Zalo", text: info.phone, href: info.socialMedia.whatsapp || "https://zalo.me/0900000000" },
 { icon: MessageCircle, title: "Messenger", text: "m.me/softmuse.vn", href: info.socialMedia.facebook?.replace("www.facebook.com", "m.me") || "https://m.me/softmuse.vn" },
 { icon: Mail, title: "Email", text: info.email, href: `mailto:${info.email}` },
 { icon: MapPin, title: "Địa chỉ", text: info.address, href: "#address" },
 { icon: Clock, title: "Giờ hỗ trợ", text: info.workingHours, href: "#hours" },
 ]);
 } catch {
 // keep defaults
 }
 }, []);

 useEffect(() => { loadContactInfo(); }, [loadContactInfo]);
 useEventSubscribeMany(['website.changed'], loadContactInfo);

 return (
 <section className="grid grid-cols-1 gap-5 sm:grid-cols-2">
 {items.map(({ icon: Icon, title, text, href }) => (
 <a key={title} href={href} className="border border-brand-border bg-background-secondary p-6 transition-colors duration-300 hover:border-accent"> <Icon className="h-5 w-5 text-accent stroke-[1.4]" aria-hidden="true" /> <h2 className="mt-5 font-sans text-sm font-bold text-text-primary">{title}</h2> <p className="mt-2 font-sans text-xs font-light leading-relaxed text-text-secondary">{text}</p> </a>
 ))}
 </section>
 );
}

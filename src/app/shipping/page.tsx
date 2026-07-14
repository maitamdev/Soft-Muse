import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageLayout, SectionTitle, LegalParagraph, LegalList } from "@/components/ui/PageComponents";

export const metadata: Metadata = {
 title: "Vận chuyển và giao hàng | AURA",
 description: "Chi tiết Vận chuyển và giao hàng nhà mốtAURA Việt Nam Đơn hàng.",
};

export default function ShippingPage() {
 return (
 <LegalPageLayout
 title="Vận chuyển và giao hàng"
 subtitle="AURA."
 lastUpdated="2026"
 > <SectionTitle number="01" title="giao hàng" /> <LegalParagraph>AURA giao hàng đếnTất cả Việt Nam, vớiĐịa chỉ vàChi tiết Đơn hàng Vận chuyển.</LegalParagraph> <LegalList items={["Vận chuyển Tất cả Đơn hàng Việt Nam.", "Đơn hàng AURA.", "đơn hàngWhatsApp."]} /> <SectionTitle number="02" title="AURA" /> <LegalParagraph>24 đến 48. kích cỡatelier từ 3 đến 7Vận chuyển.</LegalParagraph> <LegalList items={["vàTP. Hồ Chí Minh: 2 đến 3.", ": 3 đến 5.", "."]} /> <SectionTitle number="03" title="Đơn hàng" /> <LegalParagraph>Đơn hàng, Mã từTheo dõi đơn hàng AURA.</LegalParagraph> <Link href="/tracking" className="font-sans text-xs text-accent underline underline-offset-4">đếnTheo dõi đơn hàng</Link> </LegalPageLayout>
 );
}
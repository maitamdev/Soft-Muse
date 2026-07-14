import type { Metadata } from "next";
import { LegalPageLayout, SectionTitle, LegalParagraph, LegalList } from "@/components/ui/PageComponents";

export const metadata: Metadata = {
 title: "Đổi trả | AURA",
 description: "Đổi trả AURA vàĐơn hàng Kích cỡ.",
};

export default function ReturnsPage() {
 return (
 <LegalPageLayout
 title="Đổi trả"
 subtitle="tất cả đơn hàngKích cỡ,Hỗ trợً."
 lastUpdated="2026"
 > <SectionTitle number="01" title="AURA" /> <LegalParagraph>đơn hàng 7 từNgày nhận Đónggói.</LegalParagraph> <LegalList items={["Kích cỡ.", "AURA vàĐónggói.", "Đơn hàng WhatsApp."]} /> <SectionTitle number="02" title="Kích cỡ" /> <LegalParagraph>trênKhách hàngkhông trong từ AURA trongmay đo.</LegalParagraph> <LegalList items={[".", "trênmay đo 48 từ.", "atelier."]} /> <SectionTitle number="03" title="Đơn hàng" /> <LegalParagraph>Mã Đơn hàng vàĐónggói đếnAURA WhatsApp, ...</LegalParagraph> </LegalPageLayout>
 );
}
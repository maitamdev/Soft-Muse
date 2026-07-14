import type { Metadata } from "next";
import { LegalPageLayout, SectionTitle, LegalParagraph, LegalList } from "@/components/ui/PageComponents";

export const metadata: Metadata = {
 title: "Chính sách bảo mật | AURA",
 description: "AURA.",
};

export default function PrivacyPage() {
 return (
 <LegalPageLayout
 title="Chính sách bảo mật"
 subtitle="."
 lastUpdated="2026"
 > <SectionTitle number="01" title="AURA" /> <LegalParagraph>
 AURA ảnh. này :</LegalParagraph> <LegalList items={[
 "Họ và tên Vận chuyển vàSố điện thoại giao hàng.",
 "tiêu đềEmail Đơn hàng.",
 "(không ).",
 "Chi tiết Kích cỡ trong.",
 "từ.",
 ]} /> <SectionTitle number="02" title="AURA" /> <LegalParagraph>
 trong :</LegalParagraph> <LegalList items={[
 "Vận chuyển.",
 "Kích cỡ vàChi tiết Tay nghề.",
 "AURA.",
 "Vị trí trên.",
 "trongViệt Nam.",
 ]} /> <SectionTitle number="03" title="AURA" /> <LegalParagraph>
 SSL Tất cả. không với trongVận chuyển và giao hàng, ...</LegalParagraph> <LegalParagraph>
 Lưu trên.</LegalParagraph> <SectionTitle number="04" title="AURA" /> <LegalParagraph>
 AURA,, ...trong từ trong.Hủy trênVị trí.
 </LegalParagraph> <SectionTitle number="05" title="AURA" /> <LegalParagraph>
 từ (Google Analytics). này. không đến.</LegalParagraph> <SectionTitle number="06" title="AURA" /> <LegalList items={[
 ": đơn hàngBản sao từ.",
 ":Sửa không trong.",
 "Xóa: đơn hàngXóa.",
 ":.",
 "Đồngý:Hủy trongBản tin trong.",
 ]} /> <SectionTitle number="07" title="Liên hệ với chúng tôi" /> <LegalParagraph>
 Yêu cầu hỗ trợ Chính sách bảo mật từ,Liên hệ :</LegalParagraph> <LegalList items={[
 "WhatsApp: trên.",
 "Email: privacy@aura-fashion-virid.vercel.app",
 "Địa chỉ: TP. Hồ Chí Minh, Việt Nam.",
 ]} /> </LegalPageLayout>
 );
}

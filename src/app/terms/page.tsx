import type { Metadata } from "next";
import { LegalPageLayout, SectionTitle, LegalParagraph, LegalList } from "@/components/ui/PageComponents";

export const metadata: Metadata = {
 title: "Điều khoản | AURA",
 description: "Điều khoản vàĐơn hàng vàVận chuyển AURA.",
};

export default function TermsPage() {
 return (
 <LegalPageLayout
 title="Điều khoản"
 subtitle="Đọc nàyVị trí AURA."
 lastUpdated="2026"
 > <SectionTitle number="01" title="AURA" /> <LegalParagraph>
 AURA (aura-fashion-virid.vercel.app), trênĐiều khoản. không trên từ này, vềVị trí.
 </LegalParagraph> <LegalParagraph>
 AURA này trong.Khách hàng Email.
 </LegalParagraph> <SectionTitle number="02" title="Đơn hàng " /> <LegalParagraph>
 Tất cả Đơn hàng. thông báo trênEmail của bạn. AURA Chi tiết Kích cỡ trong.</LegalParagraph> <LegalList items={[
 "Đơn hàng Tay nghề Tùy chỉnhtừ 7 đến 14.",
 "khôngHủy Đơn hàng may đo.",
 "trong trongSửa, 24 từ.",
 "Việt NamVAT.",
 ]} /> <SectionTitle number="03" title="AURA" /> <LegalParagraph>
 AURA :</LegalParagraph> <LegalList items={[
 "InstaPay — Áp dụng Điện thoại.",
 "Vodafone Cash — Lưu.",
 "— trong vàTP. Hồ Chí Minh.",
 "—.",
 ]} /> <LegalParagraph>
 Đơn hàng không. trong,AURA Hủy Đơn hàng trong.</LegalParagraph> <SectionTitle number="04" title="Vận chuyển và giao hàng" /> <LegalList items={[
 "Miễn phí vận chuyển toàn quốc.",
 "giao hàng từ 2 đến 5.",
 "Mã Đơn hàng Vận chuyển.",
 "AURA không về vềVận chuyển.",
 "trongVận chuyển, 48 vớiHình ảnh.",
 ]} /> <SectionTitle number="05" title="AURA" /> <LegalParagraph>
 sản phẩmAURA Tay nghề Đơn hàng, vềSản phẩm :</LegalParagraph> <LegalList items={[
 ": 7 từ trong.",
 "Tùy chỉnhKích cỡ: không trong từ.",
 "khôngcao cấp.",
 "Vận chuyển Khách hàngtrong từ AURA.",
 "Số tiền 5 từ.",
 ]} /> <SectionTitle number="06" title="Sản phẩm" /> <LegalParagraph>
 AURA trênTay nghề. trongSửa sản phẩm. trongĐơn hàng, Số tiền.</LegalParagraph> <SectionTitle number="07" title="Vị trí" /> <LegalList items={[
 "trên không.",
 "từVị trí.",
 "AURA không về vềVị trí.",
 "Vị trí không.",
 ]} /> <SectionTitle number="08" title="AURA" /> <LegalParagraph>
 Tất cả trênAURA — Hình ảnh vàLogo—AURA Việt Nam. không.</LegalParagraph> <SectionTitle number="09" title="Khách hàng" /> <LegalList items={[
 "Đơn hàng.",
 "trên trongVị trí.",
 "trong.",
 "từ tiêu đềVận chuyển Đơn hàng.",
 "trênBảo quản với tất cả.",
 ]} /> </LegalPageLayout>
 );
}

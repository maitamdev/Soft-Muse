import { Metadata } from "next";

export const metadata: Metadata = {
 title: "Áo sơ mi và váy công sở mùa hè | Soft Muse",
 description: "Thiết kế nhẹ, mềm và thoáng cho nàng công sở trong những ngày nắng.",
 openGraph: {
 title: "Áo sơ mi và váy công sở mùa hè | Soft Muse",
 description: "Thiết kế nhẹ, mềm và thoáng từ Soft Muse.",
 url: "https://softmuse.vn/summer-fashion",
 },
 alternates: {
 canonical: "https://softmuse.vn/summer-fashion",
 },
};

export default function SummerFashionLayout({ children }: { children: React.ReactNode }) {
 return children;
}

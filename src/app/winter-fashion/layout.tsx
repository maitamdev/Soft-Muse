import { Metadata } from "next";

export const metadata: Metadata = {
 title: "Blazer và đồ công sở mùa lạnh | Soft Muse",
 description: "Blazer, quần tây và set đồ công sở thanh lịch cho ngày làm việc se lạnh.",
 openGraph: {
 title: "Blazer và đồ công sở mùa lạnh | Soft Muse",
 description: "Blazer, quần tây và set đồ công sở thanh lịch từ Soft Muse.",
 url: "https://softmuse.vn/winter-fashion",
 },
 alternates: {
 canonical: "https://softmuse.vn/winter-fashion",
 },
};

export default function WinterFashionLayout({ children }: { children: React.ReactNode }) {
 return children;
}

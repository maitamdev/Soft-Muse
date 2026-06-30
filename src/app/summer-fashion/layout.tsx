import { Metadata } from "next";

export const metadata: Metadata = {
  title: "أزياء الصيف | AURA",
  description: "تشكيلة الصيف المنعشة من دار أورا — قطع صيفية حصرية بأقمشة الكتان والقطن المصري الطبيعي.",
  openGraph: {
    title: "أزياء الصيف | AURA",
    description: "تشكيلة الصيف المنعشة من دار أورا.",
    url: "https://aura-fashion-virid.vercel.app/summer-fashion",
  },
  alternates: {
    canonical: "https://aura-fashion-virid.vercel.app/summer-fashion",
  },
};

export default function SummerFashionLayout({ children }: { children: React.ReactNode }) {
  return children;
}

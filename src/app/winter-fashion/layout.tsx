import { Metadata } from "next";

export const metadata: Metadata = {
  title: "أزياء الشتاء | AURA",
  description: "تشكيلة الشتاء الفاخرة من دار أورا — معاطف وقطع شتوية راقية بأقمشة الكشمير والصوف الطبيعي.",
  openGraph: {
    title: "أزياء الشتاء | AURA",
    description: "تشكيلة الشتاء الفاخرة من دار أورا.",
    url: "https://aura-fashion-virid.vercel.app/winter-fashion",
  },
  alternates: {
    canonical: "https://aura-fashion-virid.vercel.app/winter-fashion",
  },
};

export default function WinterFashionLayout({ children }: { children: React.ReactNode }) {
  return children;
}

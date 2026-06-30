import { Metadata } from "next";

export const metadata: Metadata = {
  title: "آراء العميلات | AURA",
  description: "تجارب حقيقية من عميلات دار أورا — تقييمات وآراء صادقة حول الجودة والحرفية والخدمة.",
  openGraph: {
    title: "آراء العميلات | AURA",
    description: "تجارب حقيقية من عميلات دار أورا — تقييمات وآراء صادقة.",
    url: "https://aura-fashion-virid.vercel.app/reviews",
  },
  alternates: {
    canonical: "https://aura-fashion-virid.vercel.app/reviews",
  },
};

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

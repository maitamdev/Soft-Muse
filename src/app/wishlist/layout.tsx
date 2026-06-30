import { Metadata } from "next";

export const metadata: Metadata = {
  title: "المفضلة | AURA",
  description: "القطع التي حفظتِها من تشكيلات أورا الفاخرة لمراجعتها لاحقاً.",
  openGraph: {
    title: "المفضلة | AURA",
    description: "القطع التي حفظتِها من تشكيلات أورا الفاخرة.",
    url: "https://aura-fashion-virid.vercel.app/wishlist",
  },
  alternates: {
    canonical: "https://aura-fashion-virid.vercel.app/wishlist",
  },
};

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "إتمام الطلب | AURA",
  description: "أكملي بيانات الشحن والدفع لإتمام طلبكِ من دار أورا.",
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "تتبع الطلب | AURA",
  description: "تتبعي حالة شحن طلبكِ من دار أورا خطوة بخطوة.",
  robots: { index: false, follow: false },
};

export default function TrackingLayout({ children }: { children: React.ReactNode }) {
  return children;
}

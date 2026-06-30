import { Metadata } from "next";

export const metadata: Metadata = {
  title: "حقيبة التسوق | AURA",
  description: "راجعي القطع المختارة في حقيبة تسوقكِ قبل إتمام الطلب.",
  robots: { index: false, follow: false },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}

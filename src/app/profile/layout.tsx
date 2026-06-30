import { Metadata } from "next";

export const metadata: Metadata = {
  title: "حسابي | AURA",
  description: "إدارة بياناتكِ وتاريخ طلباتكِ في دار أورا.",
  robots: { index: false, follow: false },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}

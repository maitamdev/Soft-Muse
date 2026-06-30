import { Metadata } from "next";

export const metadata: Metadata = {
  title: "مجلة أورا | AURA Journal",
  description: "مقالات عن الموضة، الحرفية، والأناقة من دار أورا للأزياء الفاخرة.",
  openGraph: {
    title: "مجلة أورا | AURA Journal",
    description: "مقالات عن الموضة والحرفية والأناقة من دار أورا.",
    url: "https://aura-fashion-virid.vercel.app/journal",
  },
  alternates: {
    canonical: "https://aura-fashion-virid.vercel.app/journal",
  },
};

export default function JournalLayout({ children }: { children: React.ReactNode }) {
  return children;
}

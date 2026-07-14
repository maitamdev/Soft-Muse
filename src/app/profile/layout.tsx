import { Metadata } from "next";

export const metadata: Metadata = {
 title: "| AURA",
 description: "Quản lý trong hộp AURA.",
 robots: { index: false, follow: false },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
 return children;
}

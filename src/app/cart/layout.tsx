import { Metadata } from "next";

export const metadata: Metadata = {
 title: "Giỏ hàng | Soft Muse",
 description: "Xem và chỉnh sửa giỏ hàng Soft Muse.",
 robots: { index: false, follow: false },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
 return children;
}

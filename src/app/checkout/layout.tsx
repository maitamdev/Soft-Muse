import { Metadata } from "next";

export const metadata: Metadata = {
 title: "Thanh toán | Soft Muse",
 description: "Hoàn tất đơn hàng Soft Muse.",
 robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
 return children;
}

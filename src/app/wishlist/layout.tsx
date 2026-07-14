import { Metadata } from "next";

export const metadata: Metadata = {
 title: "Yêu thích | Soft Muse",
 description: "Danh sách sản phẩm Soft Muse yêu thích.",
 openGraph: {
 title: "Yêu thích | Soft Muse",
 description: "Danh sách sản phẩm Soft Muse yêu thích.",
 url: "https://softmuse.vn/wishlist",
 },
 alternates: {
 canonical: "https://softmuse.vn/wishlist",
 },
};

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
 return children;
}

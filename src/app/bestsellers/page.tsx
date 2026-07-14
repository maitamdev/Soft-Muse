import type { Metadata } from "next";
import ProductCollectionPage from "@/components/product/ProductCollectionPage";

export const metadata: Metadata = {
  title: "Bestseller | Soft Muse",
  description: "Các thiết kế công sở nữ được yêu thích nhất tại Soft Muse.",
};

export default function BestsellersPage() {
  return (
    <ProductCollectionPage
      eyebrow="Bestseller Edit"
      title="Bestseller"
      description="Các sản phẩm được nàng công sở yêu thích nhờ phom dáng dễ mặc và chất liệu mềm mại."
      filter="best"
    />
  );
}

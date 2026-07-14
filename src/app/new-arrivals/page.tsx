import type { Metadata } from "next";
import ProductCollectionPage from "@/components/product/ProductCollectionPage";

export const metadata: Metadata = {
  title: "Hàng mới | Soft Muse",
  description: "Những thiết kế công sở nữ mới nhất từ Soft Muse.",
};

export default function NewArrivalsPage() {
  return (
    <ProductCollectionPage
      eyebrow="New Arrivals"
      title="Hàng mới"
      description="Những thiết kế vừa lên kệ cho tuần làm việc mới: nhẹ nhàng, tinh tế và dễ phối."
      filter="new"
    />
  );
}

import type { Metadata } from "next";
import ProductCollectionPage from "@/components/product/ProductCollectionPage";

export const metadata: Metadata = {
  title: "Khuyến mãi | Soft Muse",
  description: "Ưu đãi hiện có cho thời trang công sở nữ Soft Muse.",
};

export default function SalePage() {
  return (
    <ProductCollectionPage
      eyebrow="Soft Muse Sale"
      title="Khuyến mãi"
      description="Những thiết kế thanh lịch đang có mức giá tốt trong thời gian giới hạn."
      filter="sale"
    />
  );
}

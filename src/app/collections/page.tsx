import type { Metadata } from "next";
import ProductCollectionPage from "@/components/product/ProductCollectionPage";

export const metadata: Metadata = {
  title: "Bộ sưu tập | Soft Muse",
  description: "Khám phá các danh mục thời trang công sở nữ của Soft Muse.",
};

export default function CollectionsPage() {
  return (
    <ProductCollectionPage
      eyebrow="Collections"
      title="Bộ sưu tập"
      description="Tìm nhanh theo nhu cầu đi làm hằng ngày: áo sơ mi, áo kiểu, váy, quần tây, blazer, set đồ và phụ kiện."
      filter="collections"
    />
  );
}

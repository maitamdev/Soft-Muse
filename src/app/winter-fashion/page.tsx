"use client";

import CollectionHero from "@/components/ui/CollectionHero";
import SeasonalProductGrid from "@/components/ui/SeasonalProductGrid";
import { useStorefrontProducts } from "@/hooks/useStorefrontProducts";
import { getProductsBySeason } from "@/lib/catalog/storefront-catalog";

export default function WinterFashionPage() {
  const products = useStorefrontProducts();
  const winterProducts = getProductsBySeason("winter", products);

  return (
    <div className="bg-background-primary min-h-screen flex flex-col items-center w-full">
      <CollectionHero
        title="تشكيلة الشتاء الفاخرة"
        description="دفء وأناقة في تصاميم شتوية راقية تعكس فخامة دار أورا، منسوجة يدوياً في أتيلييه الجيزة."
        imageSrc="/images/campaign/campaign_3.png"
      />
      <SeasonalProductGrid products={winterProducts} />
    </div>
  );
}

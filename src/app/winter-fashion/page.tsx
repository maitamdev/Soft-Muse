"use client";

import CollectionHero from "@/components/ui/CollectionHero";
import SeasonalProductGrid from "@/components/ui/SeasonalProductGrid";
import { useStorefrontProducts } from "@/hooks/useStorefrontProducts";
import { getProductsBySeason } from "@/lib/catalog/storefront-catalog";

export default function WinterFashionPage() {
 const products = useStorefrontProducts();
 const winterProducts = getProductsBySeason("winter", products);

 return (
 <div className="bg-background-primary min-h-screen flex flex-col items-center w-full"> <CollectionHero
 title="Bộ sưu tập Mùa đông cao cấp"
 description="vàThanh lịch trong hộp AURA, thủ công trongatelier TP. Hồ Chí Minh."
 imageSrc="/images/campaign/campaign_3.png"
 /> <SeasonalProductGrid products={winterProducts} /> </div>
 );
}

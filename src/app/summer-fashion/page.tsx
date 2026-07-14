"use client";

import CollectionHero from "@/components/ui/CollectionHero";
import SeasonalProductGrid from "@/components/ui/SeasonalProductGrid";
import { useStorefrontProducts } from "@/hooks/useStorefrontProducts";
import { getProductsBySeason } from "@/lib/catalog/storefront-catalog";

export default function SummerFashionPage() {
 const products = useStorefrontProducts();
 const summerProducts = getProductsBySeason("summer", products);

 return (
 <div className="bg-background-primary min-h-screen flex flex-col items-center w-full"> <CollectionHero
 title="Thời trang hè "
 description="mùa hètrongMùa hè."
 imageSrc="/images/campaign/campaign_2.png"
 /> <SeasonalProductGrid products={summerProducts} /> </div>
 );
}

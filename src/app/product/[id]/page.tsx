import { Metadata } from "next";
import { Suspense } from "react";
import { primaryImage, resolveStockStatus } from "@/data/mock/products";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import { ProductDetailSkeleton } from "@/components/ui/Skeleton";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { mapProductRow, productSelect } from "@/lib/supabase/product-mapper";
import type { Product } from "@/data/mock/products";

interface PageProps {
 params: Promise<{ id: string }>;
}

async function getProduct(id: string): Promise<Product | undefined> {
 const { data, error } = await (await createClient())
 .from("products")
 .select(productSelect)
 .eq("id", id)
 .eq("status", "published")
 .maybeSingle();
 if (error || !data) return undefined;
 return mapProductRow(data);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
 const resolvedParams = await params;
 const product = await getProduct(resolvedParams.id);

 if (!product) {
 return {
 title: "Không tìm thấy sản phẩm | Soft Muse",
 description: "Sản phẩm bạn tìm kiếm hiện không tồn tại hoặc đã ngừng bán.",
 };
 }

 return {
 title: `${product.name} | ${product.collection} - Soft Muse`,
 description: product.description.substring(0, 160),
 openGraph: {
 title: `${product.name} | Soft Muse`,
 description: product.description.substring(0, 160),
 url: `https://softmuse.vn/product/${product.id}`,
 siteName: "Soft Muse",
 images: [
 {
 url: primaryImage(product),
 width: 800,
 height: 1000,
 alt: product.name,
 },
 ],
 type: "website",
 },
 twitter: {
 card: "summary_large_image",
 title: `${product.name} | Soft Muse`,
 description: product.description.substring(0, 160),
 images: [primaryImage(product)],
 },
 alternates: {
 canonical: `https://softmuse.vn/product/${product.id}`,
 },
 };
}

export default async function ProductPage({ params }: PageProps) {
 const resolvedParams = await params;
 const product = await getProduct(resolvedParams.id);

 if (!product) {
 return notFound();
 }

 // Create JSON-LD product schema
 const productSchema = {
 "@context": "https://schema.org",
 "@type": "Product",
 "name": product.name,
 "image": [
 primaryImage(product),
 product.hoverImage, ...(product.colorVariants?.flatMap(v => v.images) || [])
 ].filter(Boolean),
 "description": product.description,
 "brand": {
 "@type": "Brand",
 "name": "Soft Muse"
 },
 "offers": {
 "@type": "Offer",
 "url": `https://softmuse.vn/product/${product.id}`,
 "priceCurrency": "VND",
 "price": product.price,
 "availability":
 resolveStockStatus(product) === "out_of_stock"
 ? "https://schema.org/OutOfStock"
 : "https://schema.org/InStock",
 "itemCondition": "https://schema.org/NewCondition"
 },
 "aggregateRating": {
 "@type": "AggregateRating",
 "ratingValue": "4.9",
 "reviewCount": "24"
 }
 };

 const breadcrumbSchema = {
 "@context": "https://schema.org",
 "@type": "BreadcrumbList",
 "itemListElement": [
 {
 "@type": "ListItem",
 "position": 1,
 "name": "Trang chủ",
 "item": "https://softmuse.vn/"
 },
 {
 "@type": "ListItem",
 "position": 2,
 "name": "Cửa hàng",
 "item": "https://softmuse.vn/shop"
 },
 {
 "@type": "ListItem",
 "position": 3,
 "name": product.name,
 "item": `https://softmuse.vn/product/${product.id}`
 }
 ]
 };

 return (
 <> <script
 type="application/ld+json"
 dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
 /> <script
 type="application/ld+json"
 dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
 /> <Suspense fallback={<ProductDetailSkeleton />}> <ProductDetailClient params={params} initialProduct={product} /> </Suspense> </>
 );
}

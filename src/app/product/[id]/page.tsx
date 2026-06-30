import { Metadata } from "next";
import { Suspense } from "react";
import { getPublishedProductById } from "@/lib/catalog/storefront-catalog";
import { primaryImage, resolveStockStatus } from "@/data/mock/products";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import { ProductDetailSkeleton } from "@/components/ui/Skeleton";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const product = getPublishedProductById(resolvedParams.id);

  if (!product) {
    return {
      title: "المنتج غير موجود | AURA",
      description: "المنتج الذي تبحثين عنه غير موجود.",
    };
  }

  return {
    title: `${product.name} | ${product.collection} - AURA`,
    description: product.description.substring(0, 160),
    openGraph: {
      title: `${product.name} | AURA`,
      description: product.description.substring(0, 160),
      url: `https://aura-fashion-virid.vercel.app/product/${product.id}`,
      siteName: "AURA",
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
      title: `${product.name} | AURA`,
      description: product.description.substring(0, 160),
      images: [primaryImage(product)],
    },
    alternates: {
      canonical: `https://aura-fashion-virid.vercel.app/product/${product.id}`,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const resolvedParams = await params;
  const product = getPublishedProductById(resolvedParams.id);

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
      product.hoverImage,
      ...(product.colorVariants?.flatMap(v => v.images) || [])
    ].filter(Boolean),
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": "AURA"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://aura-fashion-virid.vercel.app/product/${product.id}`,
      "priceCurrency": "EGP",
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
        "name": "الرئيسية",
        "item": "https://aura-fashion-virid.vercel.app/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "المتجر",
        "item": "https://aura-fashion-virid.vercel.app/shop"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.name,
        "item": `https://aura-fashion-virid.vercel.app/product/${product.id}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetailClient params={params} />
      </Suspense>
    </>
  );
}

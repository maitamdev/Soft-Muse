"use client";

import Link from "next/link";
import Image from "next/image";
import { ProductCard } from "@/components/ui/Card";
import { useStorefrontProducts } from "@/hooks/useStorefrontProducts";
import { useStorefrontCategories } from "@/hooks/useStorefrontCategories";
import type { Category } from "@/lib/services/category.service";
import { discountOriginalPrice, primaryImage, resolveStockStatus, type Product } from "@/data/mock/products";

interface ProductCollectionPageProps {
  eyebrow: string;
  title: string;
  description: string;
  filter: "new" | "best" | "sale" | "collections";
}

export default function ProductCollectionPage({
  eyebrow,
  title,
  description,
  filter,
}: ProductCollectionPageProps) {
  const products = useStorefrontProducts();
  const categories = useStorefrontCategories();
  const visibleProducts = resolveProducts(products, filter);
  const grouped = groupByCategory(products, categories);

  return (
    <div className="min-h-screen bg-background-primary">
      <section className="w-full bg-background-secondary border-b border-brand-border py-14 md:py-20">
        <div className="max-w-[920px] mx-auto px-6 md:px-12 text-center">
          <span className="font-sans text-[10px] text-accent font-bold uppercase tracking-[0.24em]">
            {eyebrow}
          </span>
          <h1 className="font-sans text-3xl md:text-5xl font-light text-text-primary mt-4">
            {title}
          </h1>
          <p className="font-sans text-sm text-text-secondary font-light leading-relaxed mt-5 max-w-2xl mx-auto">
            {description}
          </p>
        </div>
      </section>

      {filter === "collections" ? (
        <main className="max-w-[1280px] mx-auto px-6 md:px-12 py-12 md:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {grouped.map((collection) => (
              <Link
                key={collection.name}
                href={`/shop?category=${encodeURIComponent(collection.name)}`}
                className="group relative aspect-[4/5] overflow-hidden border border-brand-border bg-background-secondary"
              >
                <Image
                  src={collection.image}
                  alt={collection.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-text-primary/70 via-text-primary/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-background-secondary">
                  <span className="font-sans text-[10px] uppercase tracking-[0.2em] opacity-80">
                    {collection.products.length} sản phẩm
                  </span>
                  <h2 className="font-sans text-xl font-medium mt-2">{collection.name}</h2>
                </div>
              </Link>
            ))}
          </div>
        </main>
      ) : (
        <main className="max-w-[1280px] mx-auto px-6 md:px-12 py-12 md:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {visibleProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.name}
                price={product.price}
                originalPrice={discountOriginalPrice(product)}
                image={primaryImage(product)}
                hoverImage={product.hoverImage}
                collection={product.collection}
                variants={product.colorVariants}
                badge={product.badge}
                stockStatus={resolveStockStatus(product)}
                index={index}
              />
            ))}
          </div>
        </main>
      )}
    </div>
  );
}

function resolveProducts(products: Product[], filter: ProductCollectionPageProps["filter"]): Product[] {
  if (filter === "new") return products.filter((product) => product.newArrival);
  if (filter === "best") return products.filter((product) => product.bestSeller);
  if (filter === "sale") return products.filter((product) => product.comparePrice > product.price);
  return products;
}

function groupByCategory(
  products: Product[],
  categories: Category[],
): { name: string; image: string; products: Product[] }[] {
  const byCategory = new Map<string, Product[]>();
  products.forEach((product) => {
    if (!product.category) return;
    const current = byCategory.get(product.category) ?? [];
    current.push(product);
    byCategory.set(product.category, current);
  });

  if (categories.length) {
    return categories
      .map((category) => {
        const groupedProducts = byCategory.get(category.name) ?? [];
        return {
          name: category.name,
          image: category.thumbnail || (groupedProducts[0] ? primaryImage(groupedProducts[0]) : "") || "/images/campaign/campaign_2.png",
          products: groupedProducts,
        };
      });
  }

  return Array.from(byCategory.entries()).map(([name, groupedProducts]) => ({
    name,
    image: groupedProducts[0] ? primaryImage(groupedProducts[0]) : "/images/campaign/campaign_2.png",
    products: groupedProducts,
  }));
}

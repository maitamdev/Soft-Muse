"use client";

import Link from "next/link";
import Image from "next/image";
import { ProductCard } from "@/components/ui/Card";
import { useStorefrontProducts } from "@/hooks/useStorefrontProducts";
import { useStorefrontCollections } from "@/hooks/useStorefrontCollections";
import { productsForCollection } from "@/lib/catalog/collection-rules";
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
  const collections = useStorefrontCollections();
  const visibleProducts = resolveProducts(products, filter);
  const grouped = collections.map((collection) => {
    const collectionProducts = productsForCollection(collection, products);
    const fallbackProduct = collectionProducts[0] ?? products[0];
    return {
      id: collection.id,
      slug: collection.slug,
      name: collection.name,
      image: collection.image || (fallbackProduct ? primaryImage(fallbackProduct) : "") || "/images/campaign/campaign_2.png",
      products: collectionProducts,
    };
  });

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
                key={collection.id}
                href={`/shop?collection=${encodeURIComponent(collection.slug)}`}
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
          {grouped.length === 0 && <div className="border border-brand-border bg-background-secondary px-6 py-16 text-center"><h2 className="font-sans text-xl font-medium text-text-primary">Chưa có bộ sưu tập đang hiển thị</h2><p className="mt-2 text-sm text-text-secondary">Các bộ sưu tập được xuất bản trong trang quản trị sẽ xuất hiện tại đây ngay sau khi lưu.</p><Link href="/shop" className="mt-6 inline-block text-sm font-semibold text-accent underline underline-offset-4">Xem tất cả sản phẩm</Link></div>}
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

import type { Product, ProductStatus, ProductVariant } from "@/data/mock/products";

type ProductRow = Record<string, unknown> & {
  product_images?: Array<Record<string, unknown>> | null;
  product_variants?: Array<Record<string, unknown>> | null;
};

const emptyCosting = {
  fabric: 0,
  accessories: 0,
  manufacturing: 0,
  printing: 0,
  packaging: 0,
  photography: 0,
  shipping: 0,
  marketing: 0,
  taxes: 0,
  marketplaceFees: 0,
  otherExpenses: 0,
};

const emptySeo = {
  metaTitle: "",
  metaDescription: "",
  keywords: "",
  canonicalUrl: "",
  ogTitle: "",
  ogDescription: "",
};

const emptyStats = {
  views: 0,
  orders: 0,
  revenue: 0,
  wishlistCount: 0,
  cartCount: 0,
  reviewsCount: 0,
};

function number(value: unknown): number {
  return Number(value ?? 0);
}

export function mapProductRow(row: ProductRow): Product {
  const imageRows = [...(row.product_images ?? [])].sort(
    (a, b) => number(a.sort_order) - number(b.sort_order),
  );
  const variants: ProductVariant[] = (row.product_variants ?? []).map((variant) => ({
    id: String(variant.id),
    sku: String(variant.sku ?? ""),
    color: String(variant.color ?? ""),
    size: String(variant.size ?? ""),
    price: number(variant.price),
    cost: number(variant.cost),
    stock: number(variant.stock),
    weight: number(variant.weight),
    image: variant.image_url ? String(variant.image_url) : undefined,
    status: variant.status === "inactive" ? "inactive" : "active",
  }));
  const colors = Array.from(new Set(variants.map((variant) => variant.color).filter(Boolean)));
  const sizes = Array.from(new Set(variants.map((variant) => variant.size).filter(Boolean)));
  const images = imageRows.map((image) => String(image.url));

  return {
    id: String(row.id),
    name: String(row.name ?? ""),
    slug: String(row.slug ?? ""),
    shortDescription: String(row.short_description ?? ""),
    description: String(row.description ?? ""),
    category: String(row.category ?? ""),
    collection: String(row.collection ?? ""),
    season: String(row.season ?? "all"),
    brand: String(row.brand ?? "Soft Muse"),
    tags: (row.tags as string[] | null) ?? [],
    price: number(row.price),
    comparePrice: number(row.compare_price),
    costing: { ...emptyCosting, ...((row.costing as object | null) ?? {}) },
    costPrice: number(row.cost_price),
    sku: String(row.sku ?? ""),
    barcode: String(row.barcode ?? ""),
    stock: variants.length ? variants.reduce((sum, variant) => sum + variant.stock, 0) : number(row.stock),
    lowStockLimit: number(row.low_stock_limit),
    material: String(row.material ?? ""),
    weight: number(row.weight),
    variants,
    featured: Boolean(row.featured),
    bestSeller: Boolean(row.best_seller),
    newArrival: Boolean(row.new_arrival),
    status: String(row.status ?? "draft") as ProductStatus,
    publishAt: row.publish_at ? String(row.publish_at) : undefined,
    hideAt: row.hide_at ? String(row.hide_at) : undefined,
    revisions: [],
    seo: { ...emptySeo, ...((row.seo as object | null) ?? {}) },
    stats: { ...emptyStats, ...((row.stats as object | null) ?? {}) },
    images,
    hoverImage: images[1],
    badge: row.badge ? String(row.badge) : undefined,
    details: (row.details as string[] | null) ?? [],
    fabric: String(row.fabric ?? row.material ?? ""),
    packaging: String(row.packaging ?? ""),
    colors: ((row.colors as string[] | null) ?? []).length ? (row.colors as string[]) : colors,
    sizes: ((row.sizes as string[] | null) ?? []).length ? (row.sizes as string[]) : sizes,
    colorVariants: colors.map((color) => ({
      color,
      value: String(
        (row.product_variants ?? []).find((variant) => variant.color === color)?.color_value ?? "#D8C8B6",
      ),
      images: variants.filter((variant) => variant.color === color && variant.image).map((variant) => variant.image!),
    })),
  };
}

export const productSelect = "*, product_images(*), product_variants(*)";

export function productToRow(product: Partial<Product>) {
  const allowedStatus = ["draft", "published", "hidden", "archived"].includes(product.status ?? "")
    ? product.status
    : "draft";

  return {
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    barcode: product.barcode || null,
    short_description: product.shortDescription ?? "",
    description: product.description ?? "",
    category: product.category ?? "",
    collection: product.collection ?? "",
    season: product.season ?? "all",
    brand: product.brand || "Soft Muse",
    tags: product.tags ?? [],
    price: product.price ?? 0,
    compare_price: product.comparePrice ?? 0,
    cost_price: product.costPrice ?? 0,
    stock: product.stock ?? 0,
    low_stock_limit: product.lowStockLimit ?? 5,
    material: product.material ?? "",
    weight: product.weight ?? 0,
    featured: product.featured ?? false,
    best_seller: product.bestSeller ?? false,
    new_arrival: product.newArrival ?? false,
    status: allowedStatus,
    publish_at: product.publishAt || null,
    hide_at: product.hideAt || null,
    badge: product.badge || null,
    details: product.details ?? [],
    fabric: product.fabric ?? product.material ?? "",
    packaging: product.packaging ?? "",
    colors: product.colors ?? [],
    sizes: product.sizes ?? [],
    costing: product.costing ?? emptyCosting,
    seo: product.seo ?? emptySeo,
    stats: product.stats ?? emptyStats,
  };
}

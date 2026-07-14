import type { Product } from "@/data/mock/products";
import type { Collection, CollectionRule } from "@/lib/services/collection.service";

function compareRule(product: Product, rule: CollectionRule): boolean {
  const expected = rule.value.trim().toLowerCase();
  let actual: string | number | string[];
  if (rule.field === "title") actual = product.name;
  else if (rule.field === "tag") actual = product.tags;
  else if (rule.field === "price") actual = product.price;
  else actual = product.stock;

  if (Array.isArray(actual)) {
    const values = actual.map((value) => value.toLowerCase());
    if (rule.operator === "not_equals") return !values.includes(expected);
    if (rule.operator === "contains") return values.some((value) => value.includes(expected));
    return values.includes(expected);
  }

  if (typeof actual === "number") {
    const numericExpected = Number(rule.value);
    if (!Number.isFinite(numericExpected)) return false;
    if (rule.operator === "greater_than") return actual > numericExpected;
    if (rule.operator === "less_than") return actual < numericExpected;
    if (rule.operator === "not_equals") return actual !== numericExpected;
    return actual === numericExpected;
  }

  const normalized = actual.toLowerCase();
  if (rule.operator === "not_equals") return normalized !== expected;
  if (rule.operator === "contains") return normalized.includes(expected);
  return normalized === expected;
}

export function productsForCollection(collection: Collection, products: Product[]): Product[] {
  if (collection.type === "automatic") {
    if (!collection.rules.length) return [];
    return products.filter((product) => {
      const matches = collection.rules.map((rule) => compareRule(product, rule));
      return collection.matchType === "all" ? matches.every(Boolean) : matches.some(Boolean);
    });
  }

  const selected = new Set(collection.productIds);
  return products.filter((product) =>
    selected.has(product.id)
    || product.collection.toLowerCase() === collection.name.toLowerCase()
    || product.collection.toLowerCase() === collection.slug.toLowerCase(),
  );
}

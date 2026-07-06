import { products } from "@/content/products";
import type { Product } from "@/types/content";
import { reverseCategorySlug, type Language } from "@/lib/i18n";
import { getProducts } from "./getProducts";

export function getProductBySlug(slug: string, lang: Language = "de") {
  return getProducts(lang).find((product) => product.slug === slug);
}

export function getProductByPath(category: string, slug: string, lang: Language = "de") {
  const sourceCategory = reverseCategorySlug(category);
  const product = products.find((item) => item.categorySlug === sourceCategory && item.slug === slug);
  if (!product) return undefined;
  return getProducts(lang).find((item: Product) => item.slug === product.slug);
}

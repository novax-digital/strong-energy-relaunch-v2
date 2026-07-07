import { products, productCategories } from "@/content/products";
import productTranslationsEnJson from "@/content/generated/product-translations-en.json";
import type { Product, ProductCategory } from "@/types/content";
import { translateCategorySlug, type Language } from "@/lib/i18n";

const productTranslationsEn = productTranslationsEnJson as Record<string, Partial<Product>>;

function localizeProduct(product: Product, lang: Language): Product {
  const category = productCategories.find((item) => item.slug === product.categorySlug);
  const localizedCategory = lang === "en" ? category?.label_en || product.category : category?.label_de || product.category;
  const overrides = lang === "en" ? productTranslationsEn[product.slug] || {} : {};
  const modelAssets = product.modelAssets?.map((asset) => ({
    ...asset,
    label: lang === "en" ? asset.label.replace("3D-Modell", "3D model") : asset.label
  }));
  return {
    ...product,
    ...overrides,
    category: localizedCategory,
    categorySlug: translateCategorySlug(product.categorySlug, lang),
    modelAssets
  };
}

function localizeCategory(category: ProductCategory, lang: Language): ProductCategory {
  return {
    ...category,
    slug: translateCategorySlug(category.slug, lang)
  };
}

export function getProducts(lang: Language = "de") {
  return products.map((product) => localizeProduct(product, lang));
}

export function getProductCategories(lang: Language = "de") {
  return productCategories.map((category) => localizeCategory(category, lang));
}

export function getProductsByCategory(categorySlug: string, lang: Language = "de") {
  return getProducts(lang).filter((product) => product.categorySlug === categorySlug);
}

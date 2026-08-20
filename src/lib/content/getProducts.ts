import { products, productCategories } from "@/content/products";
import productTranslationsEnJson from "@/content/generated/product-translations-en.json";
import type { Product, ProductCategory } from "@/types/content";
import { reverseCategorySlug, translateCategorySlug, type Language } from "@/lib/i18n";

const productTranslationsEn = productTranslationsEnJson as Record<string, Partial<Product>>;
const productCategoryImages: Record<string, string> = {
  solaranlagen: "/assets/solaranlagen-2BF5y_wA.webp",
  "gewerbespeicher-aio": "/assets/gewerbespeicher-aio-kachel-YpXwZeiG.jpg",
  "gewerbespeicher-container": "/assets/gewerbespeicher-container-hero-Cf9R8gAu.png",
  "mobile-charging": "/assets/powerbank-s19-ZCOk-RgR.webp"
};

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

export function getProductCategoryImage(categorySlug: string) {
  return productCategoryImages[reverseCategorySlug(categorySlug)];
}

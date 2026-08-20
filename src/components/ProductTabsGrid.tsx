"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useLiveProductCategories } from "@/hooks/useLiveProductCategories";
import type { Product, ProductCategory } from "@/types/content";
import { localizedPath, translations, type Language } from "@/lib/i18n";
import { ProductCard } from "./ProductCard";

type ActiveCategory = "all" | string;

interface ProductTabsGridProps {
  products: Product[];
  categories: ProductCategory[];
  initialCategory?: string;
  lang?: Language;
}

export function ProductTabsGrid({ products, categories, initialCategory, lang = "de" }: ProductTabsGridProps) {
  const t = translations[lang].products;
  const liveCategories = useLiveProductCategories(categories, lang, initialCategory);
  const activeCategory: ActiveCategory = initialCategory || "all";
  const visibleCategorySlugs = useMemo(() => new Set(liveCategories.map((category) => category.slug)), [liveCategories]);
  const visibleProducts = useMemo(() => products.filter((product) => visibleCategorySlugs.has(product.categorySlug)), [products, visibleCategorySlugs]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return visibleProducts;
    return products.filter((product) => product.categorySlug === activeCategory);
  }, [activeCategory, products, visibleProducts]);

  return (
    <div>
      <div className="flex justify-center mb-8 px-0">
        <div className="inline-flex items-center gap-2 p-1.5 rounded-full bg-secondary/40 border border-border backdrop-blur-sm overflow-x-auto max-w-full no-scrollbar" role="tablist" aria-label="Produktkategorien">
          <Link
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
              activeCategory === "all" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-card/50"
            }`}
            href={localizedPath("/produkte", lang)}
            role="tab"
            aria-selected={activeCategory === "all"}
          >
            {t.all}
          </Link>
          {liveCategories.map((category) => (
            <Link
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                activeCategory === category.slug ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-card/50"
              }`}
              href={localizedPath(`/produkte/${category.slug}`, lang)}
              key={category.slug}
              role="tab"
              aria-selected={activeCategory === category.slug}
            >
              {lang === "en" ? category.label_en : category.label_de}
            </Link>
          ))}
        </div>
      </div>

      <div role="tabpanel" aria-live="polite">
        {filteredProducts.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.slug} product={product} priority={index < 3} lang={lang} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground text-lg py-12">{t.comingSoon}</p>
        )}
      </div>
    </div>
  );
}

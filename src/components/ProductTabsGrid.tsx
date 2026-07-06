"use client";

import { useMemo, useState } from "react";
import type { Product, ProductCategory } from "@/types/content";
import { translations, type Language } from "@/lib/i18n";
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
  const initialActive = initialCategory && products.some((product) => product.categorySlug === initialCategory) ? initialCategory : "all";
  const [activeCategory, setActiveCategory] = useState<ActiveCategory>(initialActive);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return products;
    return products.filter((product) => product.categorySlug === activeCategory);
  }, [activeCategory, products]);

  function selectCategory(category: ActiveCategory) {
    setActiveCategory(category);
  }

  return (
    <div>
      <div className="flex justify-center mb-8 px-0">
        <div className="inline-flex items-center gap-2 p-1.5 rounded-full bg-secondary/40 border border-border backdrop-blur-sm overflow-x-auto max-w-full no-scrollbar" role="tablist" aria-label="Produktkategorien">
          <button
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
              activeCategory === "all" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-card/50"
            }`}
            type="button"
            role="tab"
            aria-selected={activeCategory === "all"}
            onClick={() => selectCategory("all")}
          >
            {t.all}
          </button>
          {categories.map((category) => (
            <button
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                activeCategory === category.slug ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-card/50"
              }`}
              key={category.slug}
              type="button"
              role="tab"
              aria-selected={activeCategory === category.slug}
              onClick={() => selectCategory(category.slug)}
            >
              {lang === "en" ? category.label_en : category.label_de}
            </button>
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

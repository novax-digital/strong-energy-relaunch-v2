import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/types/content";
import { localizedPath, translations, type Language } from "@/lib/i18n";

export function ProductCard({ product, priority = false, lang = "de" }: { product: Product; priority?: boolean; lang?: Language }) {
  const image = product.heroImage || product.images[0] || "/assets/logo-CkaIU7X8.png";
  const t = translations[lang].products;
  return (
    <article className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/40 transition-all duration-500 hover:shadow-xl">
      <Link href={localizedPath(`/produkte/${product.categorySlug}/${product.slug}`, lang)} aria-label={`${product.name} ${t.viewDetails}`}>
        <div className="relative aspect-square overflow-hidden bg-secondary/20">
          <Image src={image} alt={product.name} fill sizes="(min-width: 1024px) 33vw, 100vw" priority={priority} className="object-cover transition-transform duration-700 group-hover:scale-105" />
        </div>
        <div className="p-6">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider">{product.category}</p>
          <h2 className="text-xl font-bold text-foreground mt-2">{product.name}</h2>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.subtitle}</p>
          <span className="flex items-center gap-2 mt-4 text-primary text-sm font-semibold group-hover:gap-3 transition-all">
            {t.viewDetails}
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </Link>
    </article>
  );
}

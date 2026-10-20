import "server-only";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProductDetailHero } from "@/components/ProductDetailHero";
import { ProductDetailTabs } from "@/components/ProductDetailTabs";
import { ProductFeatureIcon } from "@/components/ProductFeatureIcon";
import { ProductImageGallery } from "@/components/ProductImageGallery";
import { ProductInquiryButton } from "@/components/ProductInquiryModal";
import { ProductVideoButton } from "@/components/ProductVideoButton";
import { ProductAvailability } from "@/components/ProductAvailability";
import { OnovoModelViewer } from "@/components/OnovoModelViewer";
import { PrivateProductReviews } from "@/components/PrivateProductReviews";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getDownloadsByProduct } from "@/lib/content/getDownloads";
import { localizedPath, translations, type Language } from "@/lib/i18n";
import type { Product } from "@/types/content";

export function OnovoProductPage({ lang, product }: { lang: Language; product: Product }) {
  const downloads = getDownloadsByProduct(product.slug, lang);
  const t = translations[lang].products;

  return (
    <>
      <ProductDetailHero product={product} lang={lang} />
      <div className="relative scroll-mt-28 overflow-hidden pb-20 pt-12 md:scroll-mt-32" id="beschreibung">
        <div className="container-wide mb-8 flex flex-wrap items-center gap-3 text-sm">
          <Link href={localizedPath("/produkte", lang)} className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />{t.back}
          </Link>
          <span className="text-border" aria-hidden="true">|</span>
          <Breadcrumbs items={[
            { label: t.home, href: localizedPath("/", lang) },
            { label: product.category, href: localizedPath(`/produkte/${product.categorySlug}`, lang) },
            { label: product.name }
          ]} />
        </div>
        <section className="container-wide">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16">
            <ProductImageGallery images={product.images} name={product.name} lang={lang} imageFit="contain" />
            <div className="flex flex-col justify-center">
              <span className="text-sm font-semibold uppercase tracking-wider text-primary">{product.category}</span>
              <h2 className="mt-2 text-3xl font-bold text-foreground md:text-4xl lg:text-[2.5rem]">{product.name}</h2>
              <ProductAvailability label={product.availabilityLabel} />
              <p className="mt-2 text-lg font-medium text-muted-foreground">{product.subtitle}</p>
              <p className="mt-6 whitespace-pre-line text-base leading-[1.625] text-muted-foreground">{product.shortDescription}</p>
              <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {product.highlights.slice(0, 4).map((item) => (
                  <div key={item.title} className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] gap-3 overflow-hidden rounded-xl bg-secondary/60 p-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <ProductFeatureIcon className="h-5 w-5" icon={item.icon} strokeWidth={1.8} />
                    </div>
                    <div className="min-w-0">
                      <div className="break-words text-sm font-bold leading-snug text-foreground">{item.title}</div>
                      <div className="mt-1 whitespace-pre-line break-words text-xs leading-relaxed text-muted-foreground">{item.text}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-7 flex flex-col gap-4 sm:flex-row">
                <ProductInquiryButton product={product} lang={lang} label={t.inquireNow} />
                {lang === "de" ? <ProductVideoButton product={product} portrait /> : null}
              </div>
            </div>
          </div>
        </section>
        <OnovoModelViewer lang={lang} src="/assets/models/onovo-kunstor.glb" />
        <ProductDetailTabs downloads={downloads} product={product} lang={lang} />
      </div>
      <Suspense fallback={null}>
        <PrivateProductReviews lang={lang} />
      </Suspense>
    </>
  );
}

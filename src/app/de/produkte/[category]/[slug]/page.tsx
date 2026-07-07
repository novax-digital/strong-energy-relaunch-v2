import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProductDetailHero } from "@/components/ProductDetailHero";
import { ProductDetailTabs } from "@/components/ProductDetailTabs";
import { ProductFeatureIcon } from "@/components/ProductFeatureIcon";
import { ProductImageGallery } from "@/components/ProductImageGallery";
import { ProductInquiryButton } from "@/components/ProductInquiryModal";
import { SEOJsonLd } from "@/components/SEOJsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getDownloadsByProduct } from "@/lib/content/getDownloads";
import { getProductByPath } from "@/lib/content/getProductBySlug";
import { getProducts } from "@/lib/content/getProducts";
import { absoluteUrl, breadcrumbJsonLd, createMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return getProducts().map((product) => ({ category: product.categorySlug, slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string; slug: string }> }): Promise<Metadata> {
  const { category, slug } = await params;
  const product = getProductByPath(category, slug);
  if (!product) return {};
  return createMetadata({
    title: `${product.name} – ${product.subtitle} | Strong Energy`,
    description: product.shortDescription,
    path: `/de/produkte/${product.categorySlug}/${product.slug}`,
    image: product.heroImage || product.images[0]
  });
}

export default async function ProductDetailPage({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params;
  const product = getProductByPath(category, slug);
  if (!product) notFound();
  const downloads = getDownloadsByProduct(product.slug);
  const image = product.heroImage || product.images[0];
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    brand: { "@type": "Brand", name: "Strong Energy" },
    category: product.category,
    description: product.shortDescription,
    image: absoluteUrl(image),
    url: absoluteUrl(`/de/produkte/${product.categorySlug}/${product.slug}`)
  };
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/de" },
    { name: "Produkte", path: "/de/produkte" },
    { name: product.category, path: `/de/produkte/${product.categorySlug}` },
    { name: product.name, path: `/de/produkte/${product.categorySlug}/${product.slug}` }
  ]);

  return (
    <>
      <SEOJsonLd data={[productJsonLd, breadcrumbs]} />
      <ProductDetailHero product={product} />
      <div className="relative scroll-mt-28 overflow-hidden pb-20 pt-12 md:scroll-mt-32" id="beschreibung">
        <div className="absolute top-32 -left-20 right-0 pointer-events-none opacity-[0.18] blur-[3px]">
          <svg viewBox="0 0 1200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M-50 120 C150 40, 350 180, 550 100 S850 20, 1050 100 S1250 160, 1300 80" stroke="url(#product-wave-1)" strokeWidth="6" strokeLinecap="round" />
            <path d="M-50 130 C200 50, 400 190, 600 110 S900 30, 1100 110 S1250 170, 1300 90" stroke="url(#product-wave-2)" strokeWidth="4" strokeLinecap="round" />
            <defs>
              <linearGradient id="product-wave-1" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#28a795" stopOpacity="0" /><stop offset="30%" stopColor="#28a795" /><stop offset="70%" stopColor="#d7d42f" /><stop offset="100%" stopColor="#d7d42f" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="product-wave-2" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#5fb88a" stopOpacity="0" /><stop offset="40%" stopColor="#5fb88a" /><stop offset="60%" stopColor="#28a795" /><stop offset="100%" stopColor="#28a795" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="container-wide mb-8 flex flex-wrap items-center gap-3 text-sm">
          <Link href="/de/produkte" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Zurück
          </Link>
          <span className="text-border" aria-hidden="true">|</span>
          <Breadcrumbs
            items={[
              { label: "Home", href: "/de" },
              { label: product.category, href: `/de/produkte/${product.categorySlug}` },
              { label: product.name }
            ]}
          />
        </div>
        <section className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] gap-12 lg:gap-16">
            <div className="space-y-4">
              <ProductImageGallery images={product.images} modelAssets={product.modelAssets} name={product.name} />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-sm font-semibold text-primary uppercase tracking-wider">{product.category}</span>
              <div className="flex items-end justify-between gap-4 mt-2">
                <div>
                  <h2 className="text-3xl font-bold text-foreground md:text-4xl lg:text-[2.5rem]">{product.name}</h2>
                  <p className="mt-2 text-lg font-medium text-muted-foreground">{product.subtitle}</p>
                </div>
                {product.slug === "alfred-10" ? (
                  <Image
                    src="/assets/reddot-winner-2024-DnnYkg0s.png"
                    alt="Red Dot Design Award Winner 2024"
                    width={653}
                    height={382}
                    sizes="(min-width: 768px) 96px, 80px"
                    className="w-20 md:w-24 object-contain flex-shrink-0 opacity-80"
                  />
                ) : null}
              </div>
              <p className="mt-6 whitespace-pre-line text-base leading-[1.625] text-muted-foreground">{product.shortDescription}</p>
              <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {product.highlights.slice(0, 4).map((item) => (
                  <div key={item.title} className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] gap-3 overflow-hidden rounded-xl bg-secondary/60 p-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <ProductFeatureIcon className="h-5 w-5" icon={item.icon} strokeWidth={1.8} />
                    </div>
                    <div className="min-w-0">
                      <div className="break-words text-sm font-bold leading-snug text-foreground">{item.title}</div>
                      <div className="mt-1 break-words text-xs leading-relaxed text-muted-foreground">{item.text}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-7 flex flex-col gap-4 sm:flex-row">
                <ProductInquiryButton product={product} label="Angebot anfragen" />
              </div>
            </div>
          </div>
        </section>
        <ProductDetailTabs downloads={downloads} product={product} />
      </div>
    </>
  );
}

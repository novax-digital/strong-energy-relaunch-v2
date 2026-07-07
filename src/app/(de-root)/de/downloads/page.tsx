import type { Metadata } from "next";
import { Suspense } from "react";
import { DownloadsInteractive } from "@/components/DownloadsInteractive";
import { PageHero } from "@/components/Hero";
import { SEOJsonLd } from "@/components/SEOJsonLd";
import { pageSeo } from "@/content/site";
import { getDownloads } from "@/lib/content/getDownloads";
import { getProducts } from "@/lib/content/getProducts";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata(pageSeo.downloads);

export default function DownloadsPage() {
  const downloads = getDownloads();
  const products = getProducts();
  return (
    <>
      <SEOJsonLd data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: "Downloads", url: "https://strong-energy.eu/de/downloads" }} />
      <PageHero title="Downloads">
        <p>Datenblätter, Installationsanleitungen, Broschüren und mehr für alle unsere Produkte.</p>
      </PageHero>
      <Suspense fallback={<DownloadsFallback />}>
        <DownloadsInteractive downloads={downloads} products={products} />
      </Suspense>
    </>
  );
}

function DownloadsFallback() {
  return (
    <section className="pb-20">
      <div className="container-wide text-sm text-muted-foreground">Downloads werden geladen...</div>
    </section>
  );
}

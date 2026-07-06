import type { Metadata } from "next";
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
      <DownloadsInteractive downloads={downloads} products={products} />
    </>
  );
}

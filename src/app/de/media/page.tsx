import type { Metadata } from "next";
import { MediaGallery } from "@/components/MediaGallery";
import { PageHero } from "@/components/Hero";
import { SEOJsonLd } from "@/components/SEOJsonLd";
import { pageSeo } from "@/content/site";
import { getMediaCategories, getMediaItems } from "@/lib/content/getMediaItems";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata(pageSeo.media);

export default function MediaPage() {
  const items = getMediaItems();
  const categories = getMediaCategories();
  return (
    <>
      <SEOJsonLd data={{ "@context": "https://schema.org", "@type": "ImageGallery", name: "Mediengalerie", url: "https://strong-energy.eu/de/media" }} />
      <PageHero title="Mediengalerie">
        <p>Entdecken Sie Produktbilder, Installationsfotos und Videos.</p>
      </PageHero>
      <section className="py-12">
        <div className="container-wide">
          <MediaGallery items={items} categories={categories} />
        </div>
      </section>
    </>
  );
}

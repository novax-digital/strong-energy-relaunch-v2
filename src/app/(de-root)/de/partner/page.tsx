import type { Metadata } from "next";
import { PageHero } from "@/components/Hero";
import { PartnerApplicationForm } from "@/components/PartnerApplicationForm";
import { PartnerGrid } from "@/components/PartnerGrid";
import { SEOJsonLd } from "@/components/SEOJsonLd";
import { partners } from "@/content/partners";
import { pageSeo } from "@/content/site";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata(pageSeo.partner);

export default function PartnerPage() {
  return (
    <>
      <SEOJsonLd data={{ "@context": "https://schema.org", "@type": "CollectionPage", name: "Partner", url: "https://strong-energy.eu/de/partner" }} />
      <PageHero title="Unsere Partner">
        <p>Gemeinsam für eine nachhaltige Energiezukunft – unsere starken Partner im Überblick.</p>
      </PageHero>
      <section className="pb-20 md:pb-28">
        <div className="container-wide">
          <div className="mb-10 text-center">
            <div className="mb-2 flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-border" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Alle Partner</h2>
              <div className="h-px w-12 bg-border" />
            </div>
          </div>
          <PartnerGrid partners={partners} />
          <PartnerApplicationForm />
        </div>
      </section>
    </>
  );
}

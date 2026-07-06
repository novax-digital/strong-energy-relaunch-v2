import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/Hero";
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
          <section className="mt-20 text-center">
            <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-10 md:p-14">
              <h2 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">Partner werden?</h2>
              <p className="mx-auto mb-8 max-w-lg text-muted-foreground">
                Sie haben Interesse an einer Partnerschaft mit Strong Energy? Kontaktieren Sie uns - wir freuen uns auf Ihre Nachricht.
              </p>
              <Link href="/de/kontakt" className="btn-gradient group inline-flex items-center gap-2 rounded-full px-8 py-4 text-lg font-semibold shadow-lg">
                Jetzt Kontakt aufnehmen
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}

import Image from "next/image";
import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ContactLiveForm } from "@/components/ContactLiveForm";
import { SEOJsonLd } from "@/components/SEOJsonLd";
import { pageSeo } from "@/content/site";
import { site } from "@/content/site";
import { getProducts } from "@/lib/content/getProducts";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata(pageSeo.contact);

type ContactPageProps = {
  searchParams?: Promise<{ produkt?: string | string[] }>;
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const resolvedSearchParams = await searchParams;
  const productQueryValue = resolvedSearchParams?.produkt;
  const productQuery = (Array.isArray(productQueryValue) ? productQueryValue[0] : productQueryValue)?.trim();
  const product = productQuery
    ? getProducts().find((item) => item.slug === productQuery || item.name.toLowerCase() === productQuery.toLowerCase())
    : undefined;
  const productName = product?.name ?? productQuery;

  return (
    <>
      <SEOJsonLd data={{ "@context": "https://schema.org", "@type": "ContactPage", name: "Kontakt", url: "https://strong-energy.eu/de/kontakt" }} />
      <section className="pt-32 pb-20">
        <div className="container-wide">
          <div className="mb-16 text-center">
            <h1 className="mb-4 text-4xl md:text-5xl font-bold text-foreground">{productName ? `${productName} anfragen` : "Kontakt"}</h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              {productName ? "Wir melden uns mit Beratung, Verfügbarkeit und einem passenden Angebot." : "Haben Sie Fragen oder möchten Sie ein Angebot? Wir freuen uns auf Ihre Nachricht."}
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-3">
            <aside className="space-y-8">
              <div>
                <h2 className="mb-6 text-xl font-bold text-foreground">So erreichen Sie uns</h2>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 rounded-xl bg-primary/10 p-2.5">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p className="font-semibold text-foreground">{site.legalName}</p>
                      <p>{site.address.street}</p>
                      <p>{site.address.postalCode} {site.address.city}, Deutschland</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 rounded-xl bg-primary/10 p-2.5">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <a href={site.phoneHref} className="font-semibold text-foreground transition-smooth hover:text-primary">{site.phone}</a>
                      <p className="text-xs">(gebührenfrei)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 rounded-xl bg-primary/10 p-2.5">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Mo-Do: 8:00-17:00 Uhr</p>
                      <p>Fr: 8:00-15:30 Uhr</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 rounded-xl bg-primary/10 p-2.5">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-sm">
                      <a href={`mailto:${site.email}`} className="text-foreground transition-smooth hover:text-primary">{site.email}</a>
                    </div>
                  </div>
                </div>
                <div className="relative mt-8 h-48 overflow-hidden rounded-2xl">
                  <Image src="/assets/kontakt-hero-BGf2Dxw2.jpg" alt="Strong Energy" fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover object-top" />
                </div>
              </div>
            </aside>

            <div className="lg:col-span-2">
              <ContactLiveForm productName={productName} productSlug={product?.slug} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

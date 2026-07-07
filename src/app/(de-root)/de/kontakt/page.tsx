import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactPageInteractive } from "@/components/ContactPageInteractive";
import { SEOJsonLd } from "@/components/SEOJsonLd";
import { pageSeo } from "@/content/site";
import { getProducts } from "@/lib/content/getProducts";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata(pageSeo.contact);

export default function ContactPage() {
  const products = getProducts().map((product) => ({ name: product.name, slug: product.slug }));

  return (
    <>
      <SEOJsonLd data={{ "@context": "https://schema.org", "@type": "ContactPage", name: "Kontakt", url: "https://strong-energy.eu/de/kontakt" }} />
      <Suspense fallback={<ContactFallback />}>
        <ContactPageInteractive products={products} />
      </Suspense>
    </>
  );
}

function ContactFallback() {
  return (
    <section className="pb-20 pt-32">
      <div className="container-wide text-center text-sm text-muted-foreground">Kontaktformular wird geladen...</div>
    </section>
  );
}

import { CookieBanner } from "@/components/CookieBanner";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SEOJsonLd } from "@/components/SEOJsonLd";
import { site } from "@/content/site";
import { absoluteUrl } from "@/lib/seo";
import type { ReactNode } from "react";

export default function GermanLayout({ children }: { children: ReactNode }) {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    legalName: site.legalName,
    url: site.baseUrl,
    logo: absoluteUrl(site.logo),
    email: site.email,
    telephone: "+49 221 2920 1070",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      postalCode: site.address.postalCode,
      addressLocality: site.address.city,
      addressCountry: "DE"
    },
    sameAs: site.social.map((item) => item.href)
  };
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.baseUrl,
    inLanguage: "de-DE"
  };

  return (
    <>
      <SEOJsonLd data={[organization, website]} />
      <Header />
      <main>{children}</main>
      <Footer />
      <CookieBanner />
    </>
  );
}

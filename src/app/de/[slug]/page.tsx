import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SEOJsonLd } from "@/components/SEOJsonLd";
import { legalPages } from "@/content/legal";
import { createMetadata } from "@/lib/seo";

const legalDescriptions: Record<string, string> = {
  impressum: "Impressum und Anbieterkennzeichnung der STRONG Digital GmbH.",
  datenschutz: "Datenschutzerklärung der STRONG Digital GmbH für strong-energy.eu.",
  agb: "Allgemeine Geschäftsbedingungen der STRONG Digital GmbH.",
  garantiebedingungen: "Garantiebedingungen für Strong Energy Produkte.",
  "rechtliche-hinweise": "Rechtliche Hinweise zur Nutzung und Entsorgung von Strong Energy Produkten.",
  gpsr: "GPSR Informationen und Produktsicherheitsangaben der STRONG Digital GmbH.",
  "cookie-richtlinie": "Cookie-Richtlinie für die Strong Energy Website."
};

export function generateStaticParams() {
  return legalPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = legalPages.find((item) => item.slug === slug);
  if (!page) return {};
  return createMetadata({
    title: `${page.title} | Strong Energy`,
    description: legalDescriptions[page.slug] || `${page.title} von Strong Energy.`,
    path: `/de/${page.slug}`,
    image: "/assets/logo-CkaIU7X8.png"
  });
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = legalPages.find((item) => item.slug === slug);
  if (!page) notFound();
  return (
    <>
      <SEOJsonLd data={{ "@context": "https://schema.org", "@type": "WebPage", name: page.title, url: `https://strong-energy.eu/de/${page.slug}` }} />
      <article className="legal-page">
        <div className="container legal-page__inner">
          <h1>{page.title}</h1>
          <div className="rich-text" dangerouslySetInnerHTML={{ __html: page.content }} />
        </div>
      </article>
    </>
  );
}

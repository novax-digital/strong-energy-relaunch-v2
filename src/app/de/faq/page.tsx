import type { Metadata } from "next";
import { FaqInteractive } from "@/components/FaqInteractive";
import { PageHero } from "@/components/Hero";
import { SEOJsonLd } from "@/components/SEOJsonLd";
import { faqGroups } from "@/content/faq";
import { pageSeo } from "@/content/site";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata(pageSeo.faq);

export default function FaqPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqGroups.flatMap((group) =>
      group.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer
        }
      }))
    )
  };
  return (
    <>
      <SEOJsonLd data={faqJsonLd} />
      <PageHero title={<>Häufig gestellte <span>Fragen</span></>}>
        <p>Finden Sie Antworten zu unseren Produkten, Installation und Solarenergie.</p>
      </PageHero>
      <FaqInteractive groups={faqGroups} />
    </>
  );
}

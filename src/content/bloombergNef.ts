import type { Locale, Product, ProductHighlight } from "@/types/content";

const manufacturerImage = "/assets/cnte-bloombergnef-tier-1-q4-2026.png";
const listingImage = "/assets/bloombergnef-tier-1-list-q4-2026.jpg";
const sealImage = "/assets/bloombergnef-tier-1-q4-2026-transparent.png";

export const bloombergNefTabCopy = {
  de: {
    introduction: "Die BloombergNEF Tier-1-Einstufung bestätigt die starke Marktposition und finanzielle Bankfähigkeit von CNTE. Sie basiert unter anderem auf erfolgreich realisierten Großprojekten und deren Finanzierung durch internationale Banken.",
    benefitsTitle: "Ihre Vorteile mit Strong Energy:",
    benefits: [
      {
        title: "Starker Technologiepartner",
        text: "Sie profitieren von einem Hersteller mit internationaler Anerkennung und nachgewiesener Projekterfahrung."
      },
      {
        title: "Mehr Vertrauen in Ihre Projekte",
        text: "Die Tier-1-Einstufung stärkt die Glaubwürdigkeit gegenüber Investoren, Banken und Geschäftspartnern."
      },
      {
        title: "Ein verlässlicher Partner in Europa",
        text: "Strong Energy ist Ihr direkter Ansprechpartner für CNTE-Energiespeicherlösungen auf dem europäischen Markt."
      },
      {
        title: "Internationale Technologie, persönlicher Service",
        text: "Wir verbinden die Stärke eines global aufgestellten Herstellers mit persönlicher Betreuung und deutschem Support."
      }
    ],
    closing: "Strong Energy und CNTE – starke Technologie, internationale Erfahrung und ein zuverlässiger Partner an Ihrer Seite."
  },
  en: {
    introduction: "The BloombergNEF Tier 1 classification confirms CNTE’s strong market position and financial bankability. It is based, among other things, on successfully completed large-scale projects and their financing by international banks.",
    benefitsTitle: "Your benefits with Strong Energy:",
    benefits: [
      {
        title: "A strong technology partner",
        text: "You benefit from a manufacturer with international recognition and proven project experience."
      },
      {
        title: "Greater confidence in your projects",
        text: "The Tier 1 classification strengthens credibility with investors, banks and business partners."
      },
      {
        title: "A reliable partner in Europe",
        text: "Strong Energy is your direct point of contact for CNTE energy storage solutions in the European market."
      },
      {
        title: "International technology, personal service",
        text: "We combine the strength of a global manufacturer with personal assistance and German support."
      }
    ],
    closing: "Strong Energy and CNTE – strong technology, international experience and a reliable partner at your side."
  }
};

const copy = {
  de: {
    sealAlt: "BloombergNEF Tier 1 Energy Storage – Q4 2026, Hersteller CNTE",
    manufacturerAlt: "CNTE Herstellerveröffentlichung: BloombergNEF Tier 1 Energy Storage Manufacturer",
    listingAlt: "Auszug aus der BloombergNEF Tier-1-Liste für Q4 2026 mit CNTE (Contemporary Nebula)",
    feature: "CNTE ist im 4. Quartal 2026 als Tier-1-Energiespeicherhersteller gelistet.",
    description: (name: string) => `CNTE, der Hersteller des ${name}, ist in der BloombergNEF Tier-1-Liste für Energiespeicherhersteller im 4. Quartal 2026 aufgeführt.`
  },
  en: {
    sealAlt: "BloombergNEF Tier 1 Energy Storage – Q4 2026, manufacturer CNTE",
    manufacturerAlt: "CNTE manufacturer announcement: BloombergNEF Tier 1 Energy Storage Manufacturer",
    listingAlt: "Excerpt from the BloombergNEF Q4 2026 Tier 1 list showing CNTE (Contemporary Nebula)",
    feature: "CNTE is listed as a Tier 1 energy storage manufacturer for Q4 2026.",
    description: (name: string) => `CNTE, the manufacturer of the ${name}, is included in BloombergNEF’s Tier 1 list of energy storage manufacturers for Q4 2026.`
  }
};

// Keep these additions separate from generated CMS snapshots so a content sync retains them.
export function withBloombergNefRecognition(product: Product, lang: Locale): Product {
  if (product.slug !== "star-q" && product.slug !== "star-h") return product;

  const localized = copy[lang];
  const highlight: ProductHighlight = {
    icon: "Trophy",
    title: "BloombergNEF Tier 1",
    text: localized.feature
  };

  return {
    ...product,
    description: `${product.description}\n\n${localized.description(product.name)}`,
    images: [...product.images, manufacturerImage, listingImage],
    imageDetails: {
      ...product.imageDetails,
      [manufacturerImage]: { alt: localized.manufacturerAlt, fit: "contain" },
      [listingImage]: { alt: localized.listingAlt, fit: "contain" }
    },
    recognition: { image: sealImage, alt: localized.sealAlt },
    highlights: [...product.highlights.slice(0, 4), highlight, ...product.highlights.slice(4)]
  };
}

import contentJson from "./generated/onovo.json";
import type { Product } from "@/types/content";
import type { AdditionalComparisonProduct } from "@/components/ProductComparisonTable";
import { localizedPath, type Language } from "@/lib/i18n";

export const onovoProducts = { de: contentJson.de as Product, en: contentJson.en as Product };
export const onovoLegacyPreviewId = "0807726eb6b6911d40cdd2265cffdaf11f4e6e7b";

export function onovoProductPath(lang: Language) {
  return localizedPath("/produkte/gewerbespeicher-aio/onovo-kunstor", lang);
}

export function onovoLanguageAlternates(lang: Language) {
  return {
    canonical: onovoProductPath(lang),
    languages: { "de-DE": onovoProductPath("de"), "en-GB": onovoProductPath("en"), "x-default": onovoProductPath("de") }
  };
}

export function getOnovoComparison(lang: Language): AdditionalComparisonProduct {
  return {
    ...contentJson.comparison as Omit<AdditionalComparisonProduct, "href">,
    href: `${onovoProductPath(lang)}#${lang === "de" ? "vergleich" : "comparison"}`
  };
}

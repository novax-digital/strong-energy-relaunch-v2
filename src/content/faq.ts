import faqJson from "./generated/faq.json";
import faqEnJson from "./generated/faq-en.json";
import type { FaqGroup } from "@/types/content";
import type { Language } from "@/lib/i18n";

export const faqGroups = faqJson as FaqGroup[];
export const faqGroupsEn = faqEnJson as FaqGroup[];

export function getFaqGroups(lang: Language = "de") {
  return lang === "en" ? faqGroupsEn : faqGroups;
}

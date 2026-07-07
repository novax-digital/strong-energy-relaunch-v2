import legalPagesJson from "./generated/legal-pages.json";
import legalPagesEnJson from "./generated/legal-pages-en.json";
import type { LegalPage } from "@/types/content";

export const legalPages = legalPagesJson as LegalPage[];
export const legalPagesEn = legalPagesEnJson as LegalPage[];

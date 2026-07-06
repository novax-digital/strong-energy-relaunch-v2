import faqJson from "./generated/faq.json";
import type { FaqGroup } from "@/types/content";

export const faqGroups = faqJson as FaqGroup[];

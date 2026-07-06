import { downloads } from "@/content/downloads";
import { type Language } from "@/lib/i18n";

export function getDownloads(lang: Language = "de") {
  if (lang === "de") return downloads.filter((download) => Boolean(download.local_file_url_de || download.file_url_de));
  return downloads.filter((download) => Boolean(download.local_file_url_en || download.file_url_en || download.local_file_url_de || download.file_url_de));
}

export function getDownloadsByProduct(productSlug: string, lang: Language = "de") {
  return getDownloads(lang).filter((download) => download.product_slugs.includes(productSlug));
}

import type { Metadata } from "next";
import { site } from "@/content/site";
import { getLanguageFromPathname, languages } from "@/lib/i18n";

export function absoluteUrl(path: string) {
  if (path.startsWith("http")) return path;
  return `${site.baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function createMetadata({
  title,
  description,
  path,
  image
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const canonical = absoluteUrl(path);
  const ogImage = absoluteUrl(image || site.defaultImage);
  const lang = getLanguageFromPathname(path);

  return {
    title,
    description,
    alternates: {
      canonical
    },
    robots: {
      index: true,
      follow: true
    },
    openGraph: {
      type: "website",
      locale: languages[lang].ogLocale,
      siteName: site.name,
      title,
      description,
      url: canonical,
      images: [{ url: ogImage }]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage]
    }
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path)
    }))
  };
}

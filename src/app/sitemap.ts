import type { MetadataRoute } from "next";
import { legalPages } from "@/content/legal";
import { site } from "@/content/site";
import { getBlogPosts } from "@/lib/content/getBlogPosts";
import { getProductCategories, getProducts } from "@/lib/content/getProducts";
import { localizeLegalSlug, localizedPath } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "/de",
    "/de/produkte",
    "/de/ueber-uns",
    "/de/partner",
    "/de/360-app",
    "/de/gewerbespeicher",
    "/de/blog",
    "/de/downloads",
    "/de/media",
    "/de/kontakt",
    "/de/faq"
  ];
  const staticPathsEn = [
    "/en",
    "/en/products",
    "/en/about-us",
    "/en/partners",
    "/en/360-app",
    "/en/blog",
    "/en/downloads",
    "/en/media",
    "/en/contact",
    "/en/faq"
  ];
  const categoryPaths = getProductCategories().map((category) => `/de/produkte/${category.slug}`);
  const productPaths = getProducts().map((product) => `/de/produkte/${product.categorySlug}/${product.slug}`);
  const blogPaths = getBlogPosts("de").map((post) => `/de/blog/${post.slug}`);
  const legalPaths = legalPages.map((page) => `/de/${page.slug}`);
  const categoryPathsEn = getProductCategories("en").map((category) => `/en/products/${category.slug}`);
  const productPathsEn = getProducts("en").map((product) => localizedPath(`/produkte/${product.categorySlug}/${product.slug}`, "en"));
  const blogPathsEn = getBlogPosts("en").map((post) => `/en/blog/${post.slug}`);
  const legalPathsEn = legalPages.map((page) => `/en/${localizeLegalSlug(page.slug, "en")}`);

  return [...staticPaths, ...categoryPaths, ...productPaths, ...blogPaths, ...legalPaths, ...staticPathsEn, ...categoryPathsEn, ...productPathsEn, ...blogPathsEn, ...legalPathsEn].map((path) => ({
    url: `${site.baseUrl}${path}`,
    lastModified: new Date("2026-04-17"),
    changeFrequency: path.includes("/blog") ? "daily" : "weekly",
    priority: path === "/de" ? 1 : path.includes("/produkte") ? 0.8 : 0.6
  }));
}

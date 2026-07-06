import { blogPosts } from "@/content/blog";
import { type Language } from "@/lib/i18n";

export function getBlogPosts(lang?: Language) {
  if (!lang) return blogPosts;
  const localized = blogPosts.filter((post) => post.language === lang);
  return localized.length ? localized : lang === "en" ? [] : blogPosts;
}

export function getBlogPostBySlug(slug: string, lang?: Language) {
  return getBlogPosts(lang).find((post) => post.slug === slug);
}

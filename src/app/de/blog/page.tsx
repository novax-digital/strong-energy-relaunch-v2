import type { Metadata } from "next";
import { Newspaper } from "lucide-react";
import { BlogListing } from "@/components/BlogListing";
import { SEOJsonLd } from "@/components/SEOJsonLd";
import { pageSeo } from "@/content/site";
import { getBlogPosts } from "@/lib/content/getBlogPosts";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata(pageSeo.blog);

export default function BlogPage() {
  const posts = getBlogPosts("de");
  return (
    <>
      <SEOJsonLd data={{ "@context": "https://schema.org", "@type": "Blog", name: "Strong Energy Blog", url: "https://strong-energy.eu/de/blog" }} />
      <section className="bg-gradient-to-b from-secondary/50 to-background pb-14 pt-32 md:pt-40">
        <div className="container-wide text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-sm font-medium text-muted-foreground shadow-sm">
            <Newspaper className="h-3.5 w-3.5" />
            Strong Energy Blog
          </div>
          <h1 className="mb-4 text-4xl font-bold leading-tight text-foreground md:text-5xl">News, Tipps & Wissenswertes</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Bleib auf dem Laufenden mit den neuesten Energie-Tipps, Produktneuheiten und Wissenswertem rund um Strong Energy.
          </p>
        </div>
      </section>
      <BlogListing posts={posts} />
    </>
  );
}

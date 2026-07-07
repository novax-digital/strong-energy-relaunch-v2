import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArticle } from "@/components/BlogArticle";
import { SEOJsonLd } from "@/components/SEOJsonLd";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/content/getBlogPosts";
import { absoluteUrl, createMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return getBlogPosts("de").map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug, "de");
  if (!post) return {};
  return createMetadata({
    title: `${post.title} | Strong Energy Blog`,
    description: post.excerpt || post.title,
    path: `/de/blog/${post.slug}`,
    image: post.local_cover_image_url || post.cover_image_url || undefined
  });
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug, "de");
  if (!post) notFound();
  const image = post.local_cover_image_url || post.cover_image_url;
  const article = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || post.title,
    image: image ? absoluteUrl(image) : undefined,
    datePublished: post.published_at || undefined,
    author: { "@type": "Person", name: post.author || "Strong Energy" },
    url: absoluteUrl(`/de/blog/${post.slug}`)
  };
  return (
    <>
      <SEOJsonLd data={article} />
      <BlogArticle post={post} lang="de" />
    </>
  );
}

import type { BlogPost } from "@/types/content";

export type BlogPostRow = Omit<BlogPost, "local_cover_image_url" | "tags"> & {
  tags: string[] | null;
};

export function normalizeBlogPost(row: BlogPostRow, fallback?: BlogPost): BlogPost {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt || null,
    content: row.content || "",
    category: row.category || null,
    author: row.author || null,
    tags: Array.isArray(row.tags) ? row.tags : null,
    cover_image_url: row.cover_image_url || null,
    local_cover_image_url: fallback?.local_cover_image_url || null,
    cover_image_alt: row.cover_image_alt || fallback?.cover_image_alt || null,
    seo_title: row.seo_title || fallback?.seo_title || null,
    seo_description: row.seo_description || fallback?.seo_description || null,
    focus_keyword: row.focus_keyword || fallback?.focus_keyword || null,
    is_published: row.is_published,
    is_featured: row.is_featured,
    published_at: row.published_at || null,
    created_at: row.created_at,
    updated_at: row.updated_at,
    reading_time_minutes: row.reading_time_minutes ?? null,
    language: row.language || fallback?.language || "de"
  };
}

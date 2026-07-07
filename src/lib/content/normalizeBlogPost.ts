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
    is_published: row.is_published,
    is_featured: row.is_featured,
    published_at: row.published_at || null,
    created_at: row.created_at,
    reading_time_minutes: row.reading_time_minutes ?? null,
    language: row.language || fallback?.language || "de"
  };
}

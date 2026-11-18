"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { normalizeBlogPost, type BlogPostRow } from "@/lib/content/normalizeBlogPost";
import type { Language } from "@/lib/i18n";
import type { BlogPost } from "@/types/content";

export function useLiveBlogPosts(initialPosts: BlogPost[], lang: Language = "de") {
  const [livePosts, setLivePosts] = useState<{ lang: Language; posts: BlogPost[] } | null>(null);

  const localPostsById = useMemo(() => new Map(initialPosts.map((post) => [post.id, post])), [initialPosts]);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const { data, error } = await getSupabaseBrowserClient()
          .from("blog_posts")
          .select("id,title,slug,excerpt,content,category,author,tags,cover_image_url,cover_image_alt,seo_title,seo_description,focus_keyword,is_published,is_featured,published_at,created_at,updated_at,reading_time_minutes,language")
          .eq("is_published", true)
          .eq("language", lang)
          .order("published_at", { ascending: false })
          .order("created_at", { ascending: false });

        if (error || !Array.isArray(data)) return;

        const cmsPosts = (data as BlogPostRow[]).map((row) => normalizeBlogPost(row, localPostsById.get(row.id)));
        const cmsIds = new Set(cmsPosts.map((post) => post.id));
        const bundledPosts = initialPosts.filter((post) => post.is_published && !cmsIds.has(post.id));
        const nextPosts = [...cmsPosts, ...bundledPosts];

        if (active) {
          setLivePosts({ lang, posts: nextPosts });
        }
      } catch {
        // Keep static fallback data if Supabase is unavailable.
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [initialPosts, lang, localPostsById]);

  return livePosts?.lang === lang ? livePosts.posts : initialPosts;
}

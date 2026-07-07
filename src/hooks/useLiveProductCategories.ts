"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { translateCategorySlug, type Language } from "@/lib/i18n";
import type { ProductCategory } from "@/types/content";

export function useLiveProductCategories(initialCategories: ProductCategory[], lang: Language = "de", includeSlug?: string) {
  const [liveCategories, setLiveCategories] = useState<{ includeSlug?: string; lang: Language; categories: ProductCategory[] } | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const { data, error } = await getSupabaseBrowserClient()
          .from("product_categories")
          .select("slug,label_de,label_en,is_visible,sort_order")
          .order("sort_order", { ascending: true });

        if (error || !Array.isArray(data)) return;

        const nextCategories = (data as ProductCategory[])
          .map((category) => ({
            ...category,
            slug: translateCategorySlug(category.slug, lang)
          }))
          .filter((category) => category.is_visible || category.slug === includeSlug);

        if (active) {
          setLiveCategories({ includeSlug, lang, categories: nextCategories });
        }
      } catch {
        // Keep static fallback data if Supabase is unavailable.
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [includeSlug, lang]);

  return liveCategories?.lang === lang && liveCategories.includeSlug === includeSlug ? liveCategories.categories : initialCategories;
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { MediaCategory, MediaItem } from "@/types/content";

type MediaItemRow = Omit<MediaItem, "local_file_url" | "local_thumbnail_url" | "media_type" | "product_slugs"> & {
  media_type: string;
  product_slugs: string[] | null;
};

export function useLiveMedia(initialItems: MediaItem[], initialCategories: MediaCategory[]) {
  const [liveMedia, setLiveMedia] = useState<{ items: MediaItem[]; categories: MediaCategory[] } | null>(null);

  const localItemsById = useMemo(() => new Map(initialItems.map((item) => [item.id, item])), [initialItems]);
  const fallbackMedia = useMemo(() => ({ items: initialItems, categories: initialCategories }), [initialCategories, initialItems]);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const supabase = getSupabaseBrowserClient();
        const [categoriesResult, itemsResult] = await Promise.all([
          supabase.from("media_categories").select("id,name_de,name_en,parent_id,sort_order").order("sort_order", { ascending: true }),
          supabase
            .from("media_items")
            .select("id,title_de,title_en,description_de,description_en,category_id,media_type,file_url,video_url,thumbnail_url,product_slugs,is_published,sort_order")
            .eq("is_published", true)
            .order("sort_order", { ascending: true })
            .order("title_de", { ascending: true })
        ]);

        if (categoriesResult.error || itemsResult.error || !Array.isArray(categoriesResult.data) || !Array.isArray(itemsResult.data)) return;

        const nextCategories = categoriesResult.data as MediaCategory[];
        const nextItems = (itemsResult.data as MediaItemRow[]).map((row) => normalizeMediaItem(row, localItemsById.get(row.id)));

        if (active) {
          setLiveMedia({ items: nextItems, categories: nextCategories });
        }
      } catch {
        // Keep static fallback data if Supabase is unavailable.
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [localItemsById]);

  return liveMedia ?? fallbackMedia;
}

function normalizeMediaItem(row: MediaItemRow, fallback?: MediaItem): MediaItem {
  return {
    id: row.id,
    title_de: row.title_de,
    title_en: row.title_en || "",
    description_de: row.description_de || null,
    description_en: row.description_en || null,
    category_id: row.category_id || null,
    media_type: row.media_type === "video" ? "video" : "image",
    file_url: row.file_url || null,
    video_url: row.video_url || null,
    thumbnail_url: row.thumbnail_url || null,
    local_file_url: fallback?.local_file_url || null,
    local_thumbnail_url: fallback?.local_thumbnail_url || null,
    product_slugs: Array.isArray(row.product_slugs) ? row.product_slugs : [],
    is_published: row.is_published,
    sort_order: row.sort_order
  };
}

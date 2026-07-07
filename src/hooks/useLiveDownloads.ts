"use client";

import { useEffect, useMemo, useState } from "react";
import type { DownloadItem } from "@/types/content";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type DownloadRow = Omit<DownloadItem, "local_file_url_de" | "local_file_url_en"> & {
  product_slugs: string[] | null;
};

export function useLiveDownloads(initialDownloads: DownloadItem[], productSlug?: string) {
  const [downloads, setDownloads] = useState(initialDownloads);

  const localFilesById = useMemo(() => {
    return new Map(initialDownloads.map((download) => [download.id, download]));
  }, [initialDownloads]);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const { data, error } = await getSupabaseBrowserClient()
          .from("downloads")
          .select("id,title_de,title_en,description_de,description_en,category,file_url_de,file_url_en,product_slugs,is_published,sort_order")
          .eq("is_published", true)
          .order("sort_order", { ascending: true })
          .order("title_de", { ascending: true });

        if (error || !Array.isArray(data)) return;

        const nextDownloads = (data as DownloadRow[])
          .map((row) => normalizeDownload(row, localFilesById.get(row.id)))
          .filter((download) => !productSlug || download.product_slugs.includes(productSlug));

        if (active && nextDownloads.length) {
          setDownloads(nextDownloads);
        }
      } catch {
        // Keep static fallback data if Supabase is unavailable.
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [localFilesById, productSlug]);

  return downloads;
}

function normalizeDownload(row: DownloadRow, fallback?: DownloadItem): DownloadItem {
  return {
    id: row.id,
    title_de: row.title_de,
    title_en: row.title_en || null,
    description_de: row.description_de || null,
    description_en: row.description_en || null,
    category: row.category,
    file_url_de: row.file_url_de || null,
    file_url_en: row.file_url_en || null,
    local_file_url_de: fallback?.local_file_url_de || null,
    local_file_url_en: fallback?.local_file_url_en || null,
    product_slugs: Array.isArray(row.product_slugs) ? row.product_slugs : [],
    is_published: row.is_published,
    sort_order: row.sort_order
  };
}

import downloadsJson from "./generated/downloads.json";
import type { DownloadItem } from "@/types/content";

export const downloads = (downloadsJson as DownloadItem[]).map((download) => download.id === "5449b12a-6d63-47f2-9d61-4cc3d9e50032"
  ? { ...download, product_slugs: [...new Set([...download.product_slugs, "onovo-kunstor"])] }
  : download);

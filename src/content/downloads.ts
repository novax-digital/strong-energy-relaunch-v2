import downloadsJson from "./generated/downloads.json";
import type { DownloadItem } from "@/types/content";

export const downloads = downloadsJson as DownloadItem[];

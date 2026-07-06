import mediaItemsJson from "./generated/media-items.json";
import mediaCategoriesJson from "./generated/media-categories.json";
import type { MediaCategory, MediaItem } from "@/types/content";

export const mediaItems = mediaItemsJson as MediaItem[];
export const mediaCategories = mediaCategoriesJson as MediaCategory[];

import mediaItemsJson from "./generated/media-items.json";
import mediaCategoriesJson from "./generated/media-categories.json";
import type { MediaCategory, MediaItem } from "@/types/content";
import onovoMedia from "./generated/onovo-media.json";
import alfredMedia from "./generated/alfred-media.json";

export const mediaItems = [...mediaItemsJson, ...onovoMedia.items, ...alfredMedia] as MediaItem[];
export const mediaCategories = [...mediaCategoriesJson, onovoMedia.category] as MediaCategory[];

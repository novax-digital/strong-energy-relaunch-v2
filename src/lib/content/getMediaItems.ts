import { mediaCategories, mediaItems } from "@/content/media";

export function getMediaItems() {
  return mediaItems;
}

export function getMediaCategories() {
  return mediaCategories;
}

export function getMediaItemsByProduct(productSlug: string) {
  return mediaItems.filter((item) => item.product_slugs.includes(productSlug));
}

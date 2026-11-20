import type { MediaCategory, MediaItem } from "@/types/content";

export const installationCategoryIds = {
  root: "f4e0b8f9-97e1-48de-be2c-41fc84eb796f",
  commercial: "review-commercial-storage-installations",
  alfred: "review-alfred-installations",
  ediHohenlohe: "review-commercial-storage-edi-hohenlohe",
  hofquartierTaufkirchen: "review-commercial-storage-hofquartier-taufkirchen"
} as const;

export const reviewMediaCategories = [
  {
    id: installationCategoryIds.commercial,
    name_de: "Gewerbespeicher",
    name_en: "Commercial storage",
    parent_id: installationCategoryIds.root,
    sort_order: 0
  },
  {
    id: installationCategoryIds.alfred,
    name_de: "Alfred",
    name_en: "Alfred",
    parent_id: installationCategoryIds.root,
    sort_order: 1
  },
  {
    id: installationCategoryIds.ediHohenlohe,
    name_de: "Gewerbespeicher EDI Hohenlohe",
    name_en: "Commercial Storage EDI Hohenlohe",
    parent_id: installationCategoryIds.commercial,
    sort_order: 0
  },
  {
    id: installationCategoryIds.hofquartierTaufkirchen,
    name_de: "Hofquartier Taufkirchen",
    name_en: "Hofquartier Taufkirchen",
    parent_id: installationCategoryIds.commercial,
    sort_order: 1
  }
] satisfies MediaCategory[];

const ediHohenloheMediaItems = Array.from({ length: 12 }, (_, index) => {
  const number = String(index + 1).padStart(2, "0");
  return {
    id: `review-edi-hohenlohe-${number}`,
    title_de: `${number} · Gewerbespeicher EDI Hohenlohe`,
    title_en: `${number} · Commercial Storage EDI Hohenlohe`,
    description_de: "Installation von drei Star H Gewerbespeichern bei EDI Energy Direct.",
    description_en: "Installation of three Star H commercial battery systems at EDI Energy Direct.",
    category_id: installationCategoryIds.ediHohenlohe,
    media_type: "image" as const,
    file_url: null,
    video_url: null,
    thumbnail_url: null,
    local_file_url: `/assets/blog/edi-hohenlohe/gewerbespeicher-edi-hohenlohe-${number}.jpg`,
    local_thumbnail_url: null,
    product_slugs: ["star-h"],
    is_published: true,
    sort_order: index
  };
}) satisfies MediaItem[];

const hofquartierTaufkirchenMediaItems = Array.from({ length: 17 }, (_, index) => {
  const number = String(index + 1).padStart(2, "0");
  return {
    id: `review-hofquartier-taufkirchen-${number}`,
    title_de: `${number} · Hofquartier Taufkirchen`,
    title_en: `${number} · Hofquartier Taufkirchen`,
    description_de: "Installation von zwei Star Q Gewerbespeichern am Hofquartier Taufkirchen.",
    description_en: "Installation of two Star Q commercial battery systems at Hofquartier Taufkirchen.",
    category_id: installationCategoryIds.hofquartierTaufkirchen,
    media_type: "image" as const,
    file_url: null,
    video_url: null,
    thumbnail_url: null,
    local_file_url: `/assets/blog/hofquartier-taufkirchen/gewerbespeicher-hofquartier-taufkirchen-${number}.jpg`,
    local_thumbnail_url: null,
    product_slugs: ["star-q"],
    is_published: true,
    sort_order: index
  };
}) satisfies MediaItem[];

export const reviewMediaItems = [
  ...hofquartierTaufkirchenMediaItems,
  ...ediHohenloheMediaItems
] satisfies MediaItem[];

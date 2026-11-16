import type { MediaCategory, MediaItem } from "@/types/content";

const installationsCategoryId = "f4e0b8f9-97e1-48de-be2c-41fc84eb796f";
const commercialInstallationsCategoryId = "review-commercial-storage-installations";
const ediHohenloheCategoryId = "review-commercial-storage-edi-hohenlohe";

export const reviewMediaCategories = [
  {
    id: commercialInstallationsCategoryId,
    name_de: "Gewerbespeicher Installationen",
    name_en: "Commercial Storage Installations",
    parent_id: installationsCategoryId,
    sort_order: 20
  },
  {
    id: ediHohenloheCategoryId,
    name_de: "Gewerbespeicher EDI Hohenlohe",
    name_en: "Commercial Storage EDI Hohenlohe",
    parent_id: commercialInstallationsCategoryId,
    sort_order: 0
  }
] satisfies MediaCategory[];

export const reviewMediaItems = Array.from({ length: 12 }, (_, index) => {
  const number = String(index + 1).padStart(2, "0");
  return {
    id: `review-edi-hohenlohe-${number}`,
    title_de: `${number} · Gewerbespeicher EDI Hohenlohe`,
    title_en: `${number} · Commercial Storage EDI Hohenlohe`,
    description_de: "Installation von drei Star H Gewerbespeichern bei EDI Energy Direct.",
    description_en: "Installation of three Star H commercial battery systems at EDI Energy Direct.",
    category_id: ediHohenloheCategoryId,
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

export type Locale = "de" | "en";

export interface NavItem {
  label: string;
  href: string;
}

export interface SeoContent {
  title: string;
  description: string;
  path: string;
  image?: string;
}

export interface ProductHighlight {
  icon: string;
  title: string;
  text: string;
}

export interface SpecRow {
  label: string;
  value?: string;
  values?: string[];
}

export interface SpecGroup {
  label: string;
  rows: SpecRow[];
}

export interface SpecSection {
  title: string;
  rows?: SpecRow[];
  groups?: SpecGroup[];
}

export interface SpecsTable {
  models: string[];
  rows: SpecRow[];
}

export interface Product {
  slug: string;
  name: string;
  subtitle: string;
  tagline?: string;
  shortDescription: string;
  description: string;
  images: string[];
  heroImage?: string;
  heroVideo?: string;
  heroVideoWebm?: string;
  productVideo?: string;
  productVideoWebm?: string;
  modelAssets?: Array<{
    label: string;
    url: string;
    format: string;
  }>;
  category: string;
  categorySlug: string;
  highlights: ProductHighlight[];
  specs: SpecRow[];
  specsSections?: SpecSection[];
  specsTable?: SpecsTable;
  downloads?: unknown[];
  media?: unknown[];
}

export interface ProductCategory {
  slug: string;
  label_de: string;
  label_en: string;
  is_visible: boolean;
  sort_order: number;
}

export interface DownloadItem {
  id: string;
  title_de: string;
  title_en: string | null;
  description_de: string | null;
  description_en: string | null;
  category: string;
  file_url_de: string | null;
  file_url_en: string | null;
  local_file_url_de: string | null;
  local_file_url_en: string | null;
  product_slugs: string[];
  is_published: boolean;
  sort_order: number;
}

export interface MediaCategory {
  id: string;
  name_de: string;
  name_en: string;
  parent_id: string | null;
  sort_order: number;
}

export interface MediaItem {
  id: string;
  title_de: string;
  title_en: string;
  description_de: string | null;
  description_en: string | null;
  category_id: string | null;
  media_type: "image" | "video";
  file_url: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  local_file_url: string | null;
  local_thumbnail_url: string | null;
  product_slugs: string[];
  is_published: boolean;
  sort_order: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string | null;
  author: string | null;
  tags: string[] | null;
  cover_image_url: string | null;
  local_cover_image_url: string | null;
  is_published: boolean;
  is_featured: boolean;
  published_at: string | null;
  created_at?: string;
  reading_time_minutes: number | null;
  language: string;
}

export interface LegalPage {
  slug: string;
  title: string;
  content: string;
}

export interface Partner {
  name: string;
  logo: string;
  url?: string;
  premium?: boolean;
}

export interface FaqGroup {
  category: string;
  items: Array<{
    question: string;
    answer: string;
  }>;
}

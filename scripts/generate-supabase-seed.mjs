import { readFileSync, writeFileSync } from "node:fs";

const generatedDir = new URL("../src/content/generated/", import.meta.url);
const output = new URL("../supabase/migrations/20260623180000_seed_initial_content.sql", import.meta.url);
const oldSupabaseHost = "https://qyxshvsbovymfodqnvfq.supabase.co";

function readJson(name) {
  return JSON.parse(readFileSync(new URL(`${name}.json`, generatedDir), "utf8"));
}

function sql(value) {
  if (value === null || value === undefined) return "null";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : "null";
  return `'${String(value).replaceAll("'", "''")}'`;
}

function sqlTextArray(value) {
  const items = Array.isArray(value) ? value.filter(Boolean) : [];
  if (!items.length) return "'{}'::text[]";
  return `array[${items.map(sql).join(", ")}]::text[]`;
}

function localOrOriginal(localValue, originalValue) {
  if (localValue) return localValue;
  if (typeof originalValue === "string" && originalValue.startsWith(oldSupabaseHost)) return null;
  return originalValue || null;
}

function values(rows, mapper) {
  return rows.map((row) => `  (${mapper(row).join(", ")})`).join(",\n");
}

const productCategories = readJson("product-categories");
const downloads = readJson("downloads");
const mediaCategories = readJson("media-categories");
const mediaItems = readJson("media-items");
const blogPosts = readJson("blog-posts");

const sqlParts = [
  "-- Initial Strong Energy content for a fresh Supabase project.",
  "-- Generated from src/content/generated/*.json by scripts/generate-supabase-seed.mjs.",
  "",
  "insert into public.product_categories (slug, label_de, label_en, is_visible, sort_order)",
  `values\n${values(productCategories, (row) => [sql(row.slug), sql(row.label_de), sql(row.label_en || ""), sql(row.is_visible), sql(row.sort_order || 0)])}`,
  "on conflict (slug) do update set",
  "  label_de = excluded.label_de,",
  "  label_en = excluded.label_en,",
  "  is_visible = excluded.is_visible,",
  "  sort_order = excluded.sort_order;",
  "",
  "insert into public.downloads (id, title_de, title_en, description_de, description_en, category, file_url_de, file_url_en, product_slugs, is_published, sort_order, created_at, updated_at)",
  `values\n${values(downloads, (row) => [
    sql(row.id),
    sql(row.title_de),
    sql(row.title_en || ""),
    sql(row.description_de),
    sql(row.description_en),
    sql(row.category || "Datenblatt"),
    sql(localOrOriginal(row.local_file_url_de, row.file_url_de)),
    sql(localOrOriginal(row.local_file_url_en, row.file_url_en)),
    sqlTextArray(row.product_slugs),
    sql(Boolean(row.is_published)),
    sql(row.sort_order || 0),
    sql(row.created_at),
    sql(row.updated_at)
  ])}`,
  "on conflict (id) do update set",
  "  title_de = excluded.title_de,",
  "  title_en = excluded.title_en,",
  "  description_de = excluded.description_de,",
  "  description_en = excluded.description_en,",
  "  category = excluded.category,",
  "  file_url_de = excluded.file_url_de,",
  "  file_url_en = excluded.file_url_en,",
  "  product_slugs = excluded.product_slugs,",
  "  is_published = excluded.is_published,",
  "  sort_order = excluded.sort_order,",
  "  updated_at = excluded.updated_at;",
  "",
  "insert into public.media_categories (id, name_de, name_en, sort_order, created_at, parent_id)",
  `values\n${values(mediaCategories, (row) => [sql(row.id), sql(row.name_de), sql(row.name_en || ""), sql(row.sort_order || 0), sql(row.created_at), "null"])}`,
  "on conflict (id) do update set",
  "  name_de = excluded.name_de,",
  "  name_en = excluded.name_en,",
  "  sort_order = excluded.sort_order;",
  "",
  ...mediaCategories
    .filter((row) => row.parent_id)
    .map((row) => `update public.media_categories set parent_id = ${sql(row.parent_id)} where id = ${sql(row.id)};`),
  "",
  "insert into public.media_items (id, title_de, title_en, description_de, description_en, category_id, media_type, file_url, video_url, thumbnail_url, product_slugs, is_published, sort_order, created_at, updated_at)",
  `values\n${values(mediaItems, (row) => [
    sql(row.id),
    sql(row.title_de),
    sql(row.title_en || ""),
    sql(row.description_de),
    sql(row.description_en),
    sql(row.category_id),
    sql(row.media_type || "image"),
    sql(localOrOriginal(row.local_file_url, row.file_url)),
    sql(localOrOriginal(null, row.video_url)),
    sql(localOrOriginal(row.local_thumbnail_url, row.thumbnail_url)),
    sqlTextArray(row.product_slugs),
    sql(Boolean(row.is_published)),
    sql(row.sort_order || 0),
    sql(row.created_at),
    sql(row.updated_at)
  ])}`,
  "on conflict (id) do update set",
  "  title_de = excluded.title_de,",
  "  title_en = excluded.title_en,",
  "  description_de = excluded.description_de,",
  "  description_en = excluded.description_en,",
  "  category_id = excluded.category_id,",
  "  media_type = excluded.media_type,",
  "  file_url = excluded.file_url,",
  "  video_url = excluded.video_url,",
  "  thumbnail_url = excluded.thumbnail_url,",
  "  product_slugs = excluded.product_slugs,",
  "  is_published = excluded.is_published,",
  "  sort_order = excluded.sort_order,",
  "  updated_at = excluded.updated_at;",
  "",
  "insert into public.blog_posts (id, title, slug, excerpt, content, category, author, tags, cover_image_url, is_published, is_featured, published_at, scheduled_at, reading_time_minutes, created_at, updated_at, language, translation_group_id, author_id)",
  `values\n${values(blogPosts, (row) => [
    sql(row.id),
    sql(row.title),
    sql(row.slug),
    sql(row.excerpt),
    sql(row.content || ""),
    sql(row.category),
    sql(row.author),
    sqlTextArray(row.tags),
    sql(localOrOriginal(row.local_cover_image_url, row.cover_image_url)),
    sql(Boolean(row.is_published)),
    sql(Boolean(row.is_featured)),
    sql(row.published_at),
    sql(row.scheduled_at),
    sql(row.reading_time_minutes || 3),
    sql(row.created_at),
    sql(row.updated_at),
    sql(row.language || "de"),
    sql(row.translation_group_id),
    "null"
  ])}`,
  "on conflict (id) do update set",
  "  title = excluded.title,",
  "  slug = excluded.slug,",
  "  excerpt = excluded.excerpt,",
  "  content = excluded.content,",
  "  category = excluded.category,",
  "  author = excluded.author,",
  "  tags = excluded.tags,",
  "  cover_image_url = excluded.cover_image_url,",
  "  is_published = excluded.is_published,",
  "  is_featured = excluded.is_featured,",
  "  published_at = excluded.published_at,",
  "  scheduled_at = excluded.scheduled_at,",
  "  reading_time_minutes = excluded.reading_time_minutes,",
  "  updated_at = excluded.updated_at,",
  "  language = excluded.language,",
  "  translation_group_id = excluded.translation_group_id;",
  ""
];

writeFileSync(output, `${sqlParts.join("\n")}\n`);
console.log(`Generated ${output.pathname}`);

import * as cheerio from "cheerio";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const CACHE_DIR = path.join(ROOT, ".cache", "live-site");
const PUBLIC_DIR = path.join(ROOT, "public");
const GENERATED_DIR = path.join(ROOT, "src", "content", "generated");
const SUPABASE_URL = "https://qyxshvsbovymfodqnvfq.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5eHNodnNib3Z5bWZvZHFudmZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4MDkxNjksImV4cCI6MjA4NjM4NTE2OX0.T1fX2Ne9gVUyXDr_RDcOBOaR47gM5gWn8VygH_6VpdI";

const userAgent = "StrongEnergyNextContentSync/1.0";
const localAssetMap = new Map();

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function fileNameFromUrl(url, fallback = "asset") {
  const parsed = new URL(url);
  const rawName = decodeURIComponent(path.basename(parsed.pathname) || fallback);
  const ext = path.extname(rawName) || ".bin";
  const base = slugify(rawName.replace(ext, "")) || fallback;
  const hash = createHash("sha1").update(url).digest("hex").slice(0, 8);
  return `${base}-${hash}${ext.toLowerCase()}`;
}

async function fetchJson(table, query = "select=*") {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "user-agent": userAgent
    }
  });
  if (!response.ok) {
    throw new Error(`${table}: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

async function download(url, targetPublicPath) {
  if (!url || url.startsWith("data:")) return null;
  if (localAssetMap.has(url)) return localAssetMap.get(url);

  const filePath = path.join(PUBLIC_DIR, targetPublicPath);
  await mkdir(path.dirname(filePath), { recursive: true });
  try {
    const response = await fetch(url, { headers: { "user-agent": userAgent } });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    const buffer = Buffer.from(await response.arrayBuffer());
    await writeFile(filePath, buffer);
    const publicPath = `/${targetPublicPath}`;
    localAssetMap.set(url, publicPath);
    return publicPath;
  } catch (error) {
    console.warn(`Could not download ${url}: ${error.message}`);
    return url;
  }
}

async function downloadAssetPath(assetPath) {
  const target = assetPath.replace(/^\//, "");
  return download(`https://strong-energy.eu${assetPath}`, target);
}

async function mirrorUrl(url, folder) {
  if (!url || url.startsWith("/")) return url;
  const name = fileNameFromUrl(url, folder);
  return download(url, `assets/${folder}/${name}`);
}

function extractBundleAssets(bundle) {
  return [...new Set([...bundle.matchAll(/\/assets\/[^"')]+/g)].map((match) => match[0]))].filter(
    (asset) => !asset.includes("elements/badges")
  );
}

async function extractLegalHtml() {
  const pages = [
    ["impressum", "de-impressum.rendered.html", "Impressum"],
    ["datenschutz", "de-datenschutz.rendered.html", "Datenschutzerklärung"],
    ["agb", "de-agb.rendered.html", "Allgemeine Geschäftsbedingungen"],
    ["garantiebedingungen", "de-garantiebedingungen.rendered.html", "Garantiebedingungen"],
    ["rechtliche-hinweise", "de-rechtliche-hinweise.rendered.html", "Rechtliche Hinweise"],
    ["gpsr", "de-gpsr.rendered.html", "GPSR"],
    ["cookie-richtlinie", "de-cookie-richtlinie.rendered.html", "Cookie-Richtlinie"]
  ];

  const legal = [];
  for (const [slug, file, fallbackTitle] of pages) {
    const html = await readFile(path.join(CACHE_DIR, file), "utf8");
    const $ = cheerio.load(html);
    const main = $("main").first();
    const title = main.find("h1").first().text().replace(/\s+/g, " ").trim() || fallbackTitle;
    main.find("h1").first().remove();
    main.find("svg").remove();
    const content = main.find(".prose").first().html() || main.html() || "";
    legal.push({ slug, title, content });
  }
  return legal;
}

async function main() {
  await mkdir(GENERATED_DIR, { recursive: true });
  await mkdir(path.join(PUBLIC_DIR, "assets"), { recursive: true });

  const products = JSON.parse(await readFile(path.join(CACHE_DIR, "products-extracted.json"), "utf8"));
  const downloads = await fetchJson("downloads", "select=*&is_published=eq.true&order=sort_order.asc,title_de.asc");
  const mediaCategories = await fetchJson("media_categories", "select=*&order=sort_order.asc,name_de.asc");
  const mediaItems = await fetchJson("media_items", "select=*&is_published=eq.true&order=sort_order.asc,title_de.asc");
  const blogPosts = await fetchJson(
    "blog_posts",
    "select=*&is_published=eq.true&order=published_at.desc.nullslast,created_at.desc"
  );
  const productCategories = await fetchJson("product_categories", "select=*&order=sort_order.asc");

  const bundle = await readFile(path.join(CACHE_DIR, "app-bundle.js"), "utf8");
  const bundleAssets = extractBundleAssets(bundle);
  for (const asset of bundleAssets) {
    await downloadAssetPath(asset);
  }

  const appBadges = {
    apple: await mirrorUrl("https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg", "badges"),
    google: await mirrorUrl("https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg", "badges")
  };

  const videoPaths = [
    "/videos/strong-energy-loop-homepage.webm",
    "/videos/strong-energy-loop-homepage.mp4",
    ...products.flatMap((product) => [product.heroVideo, product.heroVideoWebm, product.productVideoWebm]).filter(Boolean)
  ];
  for (const video of [...new Set(videoPaths)].filter((item) => item?.startsWith("/videos/"))) {
    await download(`https://strong-energy.eu${video}`, video.replace(/^\//, ""));
  }

  const mappedDownloads = [];
  for (const item of downloads) {
    mappedDownloads.push({
      ...item,
      local_file_url_de: item.file_url_de ? await mirrorUrl(item.file_url_de, "downloads") : null,
      local_file_url_en: item.file_url_en ? await mirrorUrl(item.file_url_en, "downloads") : null
    });
  }

  const mappedMedia = [];
  for (const item of mediaItems) {
    mappedMedia.push({
      ...item,
      local_file_url: item.file_url ? await mirrorUrl(item.file_url, "media") : null,
      local_thumbnail_url: item.thumbnail_url ? await mirrorUrl(item.thumbnail_url, "media") : null
    });
  }

  const mappedBlog = [];
  for (const post of blogPosts) {
    mappedBlog.push({
      ...post,
      local_cover_image_url: post.cover_image_url ? await mirrorUrl(post.cover_image_url, "blog") : null
    });
  }

  await writeFile(path.join(GENERATED_DIR, "products.json"), JSON.stringify(products, null, 2));
  await writeFile(path.join(GENERATED_DIR, "downloads.json"), JSON.stringify(mappedDownloads, null, 2));
  await writeFile(path.join(GENERATED_DIR, "media-items.json"), JSON.stringify(mappedMedia, null, 2));
  await writeFile(path.join(GENERATED_DIR, "media-categories.json"), JSON.stringify(mediaCategories, null, 2));
  await writeFile(path.join(GENERATED_DIR, "blog-posts.json"), JSON.stringify(mappedBlog, null, 2));
  await writeFile(path.join(GENERATED_DIR, "product-categories.json"), JSON.stringify(productCategories, null, 2));
  await writeFile(path.join(GENERATED_DIR, "legal-pages.json"), JSON.stringify(await extractLegalHtml(), null, 2));
  await writeFile(path.join(GENERATED_DIR, "app-badges.json"), JSON.stringify(appBadges, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

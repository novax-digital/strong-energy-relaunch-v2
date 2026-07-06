import { chromium } from "@playwright/test";
import * as cheerio from "cheerio";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE = "https://strong-energy.eu";
const ROOT = process.cwd();
const CACHE_DIR = path.join(ROOT, ".cache", "live-site");
const DOCS_DIR = path.join(ROOT, "docs");

const requiredGermanPaths = [
  "/de/",
  "/de/produkte",
  "/de/produkte/solaranlagen",
  "/de/produkte/gewerbespeicher-aio",
  "/de/produkte/gewerbespeicher-container",
  "/de/produkte/solaranlagen/alfred-10",
  "/de/produkte/gewerbespeicher-aio/star-q",
  "/de/produkte/gewerbespeicher-aio/star-h",
  "/de/produkte/solaranlagen/hochvolt-bundle",
  "/de/produkte/mobile-charging",
  "/de/produkte/mobile-charging/power-bank-s19",
  "/de/produkte/mobile-charging/cp05st-3000w",
  "/de/produkte/mobile-charging/cp03st-800w",
  "/de/produkte/mobile-charging/cp02st-500w",
  "/de/produkte/mobile-charging/cp01st-300w",
  "/de/produkte/mobile-charging/cs02st-100w",
  "/de/produkte/mobile-charging/cs03st-160w",
  "/de/ueber-uns",
  "/de/partner",
  "/de/360-app",
  "/de/blog",
  "/de/downloads",
  "/de/media",
  "/de/kontakt",
  "/de/faq",
  "/de/impressum",
  "/de/datenschutz",
  "/de/agb",
  "/de/garantiebedingungen",
  "/de/rechtliche-hinweise",
  "/de/gpsr",
  "/de/cookie-richtlinie"
];

function absoluteUrl(pathOrUrl) {
  return new URL(pathOrUrl, BASE).toString();
}

function cacheName(url, suffix) {
  const u = new URL(url);
  const normalized = `${u.pathname}${u.search}`.replace(/^\/|\/$/g, "").replace(/[^a-z0-9]+/gi, "-") || "home";
  return path.join(CACHE_DIR, `${normalized}.${suffix}`);
}

function uniq(values) {
  return [...new Set(values.filter(Boolean))];
}

function textOf($, selector) {
  return $(selector)
    .map((_, el) => $(el).text().replace(/\s+/g, " ").trim())
    .get()
    .filter(Boolean);
}

function extractHtml(url, html) {
  const $ = cheerio.load(html);
  const internalLinks = uniq(
    $("a[href]")
      .map((_, el) => $(el).attr("href") || "")
      .get()
      .filter((href) => {
        try {
          const target = new URL(href, BASE);
          return target.hostname === "strong-energy.eu" && target.pathname.startsWith("/de");
        } catch {
          return false;
        }
      })
      .map((href) => new URL(href, BASE).pathname)
  ).sort();

  const images = uniq(
    $("img[src]")
      .map((_, el) => {
        const src = $(el).attr("src") || "";
        const alt = $(el).attr("alt") || "";
        return `${new URL(src, BASE).toString()}|${alt}`;
      })
      .get()
  ).map((entry) => {
    const [src, alt] = entry.split("|");
    return { src, alt };
  });

  const videos = uniq(
    $("video source[src], video[src]")
      .map((_, el) => $(el).attr("src") || "")
      .get()
      .map((src) => new URL(src, BASE).toString())
  );

  const downloads = uniq(
    $("a[href], iframe[src]")
      .map((_, el) => $(el).attr("href") || $(el).attr("src") || "")
      .get()
      .filter((href) => /\.(pdf|zip|docx?|xlsx?|pptx?)(\?|$)/i.test(href) || href.includes("/storage/v1/object/public/downloads/"))
      .map((href) => new URL(href, BASE).toString())
  );

  return {
    url,
    title: $("title").first().text().trim(),
    description: $('meta[name="description"]').attr("content") || "",
    canonical: $('link[rel="canonical"]').attr("href") || "",
    robots: $('meta[name="robots"]').attr("content") || "",
    h1: textOf($, "h1"),
    h2: textOf($, "h2"),
    h3: textOf($, "h3"),
    internalLinks,
    images,
    videos,
    downloads,
    textLength: $("body").text().replace(/\s+/g, " ").trim().length
  };
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "StrongEnergyNextInventory/1.0"
    }
  });
  if (!response.ok) {
    throw new Error(`${url}: ${response.status} ${response.statusText}`);
  }
  return response.text();
}

async function getUrlsFromSitemap() {
  const xml = await fetchText(`${BASE}/sitemap.xml`);
  await writeFile(path.join(CACHE_DIR, "sitemap.xml"), xml);
  return uniq(
    [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
      .map((match) => match[1])
      .filter((url) => new URL(url).pathname.startsWith("/de"))
  );
}

async function renderedSnapshot(browser, url) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1100 },
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
  });
  const networkDownloads = new Set();
  page.on("response", (response) => {
    const responseUrl = response.url();
    if (/\.(pdf|zip|docx?|xlsx?|pptx?)(\?|$)/i.test(responseUrl) || responseUrl.includes("/storage/v1/object/public/downloads/")) {
      networkDownloads.add(responseUrl);
    }
  });
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
  } catch {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(4000);
  }
  await page.waitForTimeout(1500);
  const html = await page.content();
  const bodyText = await page.locator("body").innerText().catch(() => "");
  await page.close();
  return { html, bodyText, networkDownloads: [...networkDownloads] };
}

function markdownList(items, formatter = (x) => `- ${x}`) {
  return items.length ? items.map(formatter).join("\n") : "- Keine gefunden";
}

function renderInventory(records) {
  const problems = [];
  const titleCounts = new Map();
  const descCounts = new Map();
  for (const record of records) {
    titleCounts.set(record.initial.title, (titleCounts.get(record.initial.title) || 0) + 1);
    descCounts.set(record.initial.description, (descCounts.get(record.initial.description) || 0) + 1);
  }

  let md = `# Strong Energy Live-Site-Inventar\n\nQuelle: ${BASE}/de/  \nStand: ${new Date().toISOString()}\n\n`;
  md += `## Crawl-Zusammenfassung\n\n`;
  md += `Die Live-Seite wurde zweimal geprüft: einmal über den initialen HTML-Response und einmal als gerenderter Browser-DOM mit Playwright. Der initiale HTML-Response enthält auf den geprüften Routen praktisch nur den SPA-Shell-Container; sichtbare Texte, Überschriften, Links, Bilder und Downloads erscheinen erst nach JavaScript-Ausführung. Diese Inhalte wurden für die neue Next.js-Umsetzung aus dem gerenderten DOM, dem ausgelieferten Bundle und den öffentlichen Supabase-Daten rekonstruiert.\n\n`;
  md += `## Gefundene URLs\n\n${markdownList(records.map((record) => record.url))}\n\n`;

  for (const record of records) {
    const { initial, rendered } = record;
    const pageProblems = [];
    if (!initial.title) pageProblems.push("fehlender Title");
    if (!initial.description) pageProblems.push("fehlende Meta Description");
    if (!initial.canonical) pageProblems.push("fehlender Canonical");
    if (initial.h1.length !== 1) pageProblems.push(`${initial.h1.length} H1 im initialen HTML`);
    if (initial.title && titleCounts.get(initial.title) > 1) pageProblems.push("duplizierter Title");
    if (initial.description && descCounts.get(initial.description) > 1) pageProblems.push("duplizierte Meta Description");
    if (rendered.textLength > initial.textLength + 500) pageProblems.push("gerenderter Inhalt ist deutlich umfangreicher als initiales HTML");
    if (pageProblems.length) problems.push({ url: record.url, problems: pageProblems });

    md += `## ${record.url}\n\n`;
    md += `- Seitentitel: ${initial.title || "FEHLT"}\n`;
    md += `- Meta Description: ${initial.description || "FEHLT"}\n`;
    md += `- Canonical: ${initial.canonical || "FEHLT"}\n`;
    md += `- Robots: ${initial.robots || "nicht gesetzt"}\n`;
    md += `- Initialer Textumfang: ${initial.textLength} Zeichen\n`;
    md += `- Gerenderter Textumfang: ${rendered.textLength} Zeichen\n\n`;
    md += `### Initiales HTML: H1\n\n${markdownList(initial.h1)}\n\n`;
    md += `### Initiales HTML: H2\n\n${markdownList(initial.h2)}\n\n`;
    md += `### Initiales HTML: interne Links\n\n${markdownList(initial.internalLinks)}\n\n`;
    md += `### Gerenderter DOM: H1\n\n${markdownList(rendered.h1)}\n\n`;
    md += `### Gerenderter DOM: H2\n\n${markdownList(rendered.h2)}\n\n`;
    md += `### Gerenderter DOM: interne Links\n\n${markdownList(rendered.internalLinks)}\n\n`;
    md += `### Bild-Assets\n\n${markdownList(rendered.images, (image) => `- ${image.src}${image.alt ? ` (alt: ${image.alt})` : " (alt fehlt)"}`)}\n\n`;
    md += `### Video-Assets\n\n${markdownList(rendered.videos)}\n\n`;
    md += `### PDF-/Download-Assets\n\n${markdownList(uniq([...initial.downloads, ...rendered.downloads]))}\n\n`;
    md += `### SEO-Hinweise\n\n${pageProblems.length ? markdownList(pageProblems) : "- Keine offensichtlichen Probleme im Crawl"}\n\n`;
  }

  md += `## SEO-Probleme Gesamt\n\n`;
  md += problems.length
    ? problems.map((item) => `- ${item.url}: ${item.problems.join(", ")}`).join("\n")
    : "- Keine offensichtlichen Probleme im Crawl";
  md += "\n";
  return md;
}

async function main() {
  await mkdir(CACHE_DIR, { recursive: true });
  await mkdir(DOCS_DIR, { recursive: true });

  const sitemapUrls = await getUrlsFromSitemap();
  const urls = uniq([...sitemapUrls, ...requiredGermanPaths.map(absoluteUrl)]).sort();

  const browser = await chromium.launch({ headless: true });
  const records = [];

  for (const url of urls) {
    console.log(`Crawling ${url}`);
    const initialHtml = await fetchText(url);
    await writeFile(cacheName(url, "initial.html"), initialHtml);
    const initial = extractHtml(url, initialHtml);

    const renderedPage = await renderedSnapshot(browser, url);
    await writeFile(cacheName(url, "rendered.html"), renderedPage.html);
    await writeFile(cacheName(url, "rendered.txt"), renderedPage.bodyText);
    const rendered = extractHtml(url, renderedPage.html);
    rendered.downloads = uniq([...rendered.downloads, ...renderedPage.networkDownloads]);
    rendered.textLength = renderedPage.bodyText.replace(/\s+/g, " ").trim().length;

    records.push({ url, initial, rendered });
  }

  await browser.close();

  await writeFile(path.join(CACHE_DIR, "records.json"), JSON.stringify(records, null, 2));
  await writeFile(path.join(DOCS_DIR, "site-inventory.md"), renderInventory(records));

  const bundleHtml = await readFile(path.join(CACHE_DIR, "de.initial.html"), "utf8").catch(() => "");
  if (bundleHtml) {
    const $ = cheerio.load(bundleHtml);
    const js = $("script[type=module][src]").attr("src");
    const css = $("link[rel=stylesheet]").attr("href");
    if (js) await writeFile(path.join(CACHE_DIR, "app-bundle.js"), await fetchText(absoluteUrl(js)));
    if (css) await writeFile(path.join(CACHE_DIR, "app-bundle.css"), await fetchText(absoluteUrl(css)));
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

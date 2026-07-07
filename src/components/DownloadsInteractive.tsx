"use client";

import { Download, ExternalLink, FileText, Link2, Search, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { DownloadItem, Product } from "@/types/content";
import { useLiveDownloads } from "@/hooks/useLiveDownloads";
import { localizedPath, translations, type Language } from "@/lib/i18n";

const categoryOrder = [
  "Sonstiges",
  "Datenblatt",
  "Installationsanleitung",
  "Software",
  "Zertifikat",
  "Garantie",
  "Broschüre",
  "Strong Energy Products 2026 - International"
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type DownloadsInteractiveProps = {
  downloads: DownloadItem[];
  products: Product[];
  lang?: Language;
  initialItemSlug?: string;
};

export function DownloadsInteractive({ downloads, products, lang = "de", initialItemSlug }: DownloadsInteractiveProps) {
  const liveDownloads = useLiveDownloads(downloads);
  const searchParams = useSearchParams();
  const searchParamItemSlug = searchParams.get("item")?.trim();
  const resolvedInitialItemSlug = initialItemSlug || searchParamItemSlug;
  const itemRefs = useRef<Record<string, HTMLElement | null>>({});
  const t = translations[lang].downloads;

  const downloadsWithFile = useMemo(() => liveDownloads.filter((item) => hasDownloadFile(item, lang)), [liveDownloads, lang]);
  const initialItem = useMemo(
    () => (resolvedInitialItemSlug ? downloadsWithFile.find((download) => downloadSlug(download, lang) === resolvedInitialItemSlug) : undefined),
    [downloadsWithFile, lang, resolvedInitialItemSlug]
  );
  const [search, setSearch] = useState(() => (initialItem ? downloadTitle(initialItem, lang) : ""));
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const categories = useMemo(() => {
    const used = [...new Set(downloadsWithFile.map((item) => item.category))];
    return used.sort((a, b) => {
      const ai = categoryOrder.indexOf(a);
      const bi = categoryOrder.indexOf(b);
      if (ai === -1 && bi === -1) return a.localeCompare(b, "de");
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
  }, [downloadsWithFile]);
  const usedProducts = useMemo(() => {
    const usedSlugs = new Set(downloadsWithFile.flatMap((item) => item.product_slugs || []));
    return products.filter((product) => usedSlugs.has(product.slug));
  }, [downloadsWithFile, products]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return downloadsWithFile.filter((item) => {
      if (selectedCategory && item.category !== selectedCategory) return false;
      if (selectedProduct && !(item.product_slugs || []).includes(selectedProduct)) return false;
      if (!query) return true;
      return [downloadTitle(item, lang), downloadDescription(item, lang) || "", localizedCategory(item.category, lang)].some((value) => value.toLowerCase().includes(query));
    });
  }, [downloadsWithFile, lang, search, selectedCategory, selectedProduct]);

  const hasFilters = Boolean(selectedCategory || selectedProduct || search);

  useEffect(() => {
    if (!initialItem) {
      return;
    }

    window.setTimeout(() => {
      itemRefs.current[initialItem.id]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);
  }, [initialItem]);

  function fileUrl(item: DownloadItem) {
    return lang === "en" ? item.local_file_url_en || item.file_url_en || item.local_file_url_de || item.file_url_de || "#" : item.local_file_url_de || item.file_url_de || "#";
  }

  async function copyItemLink(item: DownloadItem) {
    const url = `${window.location.origin}${localizedPath("/downloads", lang)}?item=${downloadSlug(item, lang)}`;
    await navigator.clipboard.writeText(url).catch(() => undefined);
  }

  async function downloadFile(item: DownloadItem) {
    const url = fileUrl(item);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = downloadTitle(item, lang);
    anchor.target = "_blank";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

  return (
    <section className="pb-20">
      <div className="container-wide">
        <div className="flex gap-8">
          <aside className="hidden w-64 flex-shrink-0 lg:block">
            <div className="sticky top-24 space-y-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={t.search}
                  className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-3 text-sm outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-foreground">{t.categories}</h2>
                <div className="space-y-1">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(selectedCategory === category ? null : category);
                        setSelectedProduct(null);
                      }}
                      className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                        selectedCategory === category ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"
                      }`}
                      type="button"
                    >
                      {localizedCategory(category, lang)} <span className="ml-1 text-xs opacity-70">({downloadsWithFile.filter((item) => item.category === category).length})</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-foreground">{t.products}</h2>
                <div className="space-y-1">
                  {usedProducts.map((product) => (
                    <button
                      key={product.slug}
                      onClick={() => {
                        setSelectedProduct(selectedProduct === product.slug ? null : product.slug);
                        setSelectedCategory(null);
                      }}
                      className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                        selectedProduct === product.slug ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"
                      }`}
                      type="button"
                    >
                      {product.name}
                    </button>
                  ))}
                </div>
              </div>

              {hasFilters ? (
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedProduct(null);
                    setSearch("");
                  }}
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                  type="button"
                >
                  <X className="h-4 w-4" />
                  {t.reset}
                </button>
              ) : null}
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <div className="mb-6 lg:hidden">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={t.search}
                  className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-3 text-sm outline-none"
                />
              </div>
            </div>

            <p className="mb-4 text-sm text-muted-foreground">{filtered.length} Downloads</p>
            <div className="space-y-3">
              {filtered.map((item) => {
                const productNames = (item.product_slugs || []).map((slug) => products.find((product) => product.slug === slug)?.name).filter(Boolean) as string[];
                const title = downloadTitle(item, lang);
                const description = downloadDescription(item, lang);
                return (
                  <article
                    key={item.id}
                    ref={(element) => {
                      itemRefs.current[item.id] = element;
                    }}
                    className="group flex cursor-pointer items-center gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md"
                    onClick={() => window.open(fileUrl(item), "_blank", "noopener,noreferrer")}
                  >
                    <div className="flex-shrink-0 rounded-xl bg-primary/10 p-3">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-foreground">{title}</h3>
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">{localizedCategory(item.category, lang)}</span>
                      </div>
                      {description ? <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{description}</p> : null}
                      {productNames.length ? (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {productNames.map((name) => (
                            <span key={name} className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{name}</span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-2">
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          window.open(fileUrl(item), "_blank", "noopener,noreferrer");
                        }}
                        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
                        title={t.open}
                        type="button"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          copyItemLink(item);
                        }}
                        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
                        title={t.copy}
                        type="button"
                      >
                        <Link2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          downloadFile(item);
                        }}
                        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
                        title={t.download}
                        type="button"
                      >
                        <Download className="h-5 w-5" />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function downloadTitle(item: DownloadItem, lang: Language) {
  return lang === "en" ? item.title_en || item.title_de : item.title_de;
}

function downloadSlug(item: DownloadItem, lang: Language) {
  return slugify(downloadTitle(item, lang));
}

function hasDownloadFile(item: DownloadItem, lang: Language) {
  return Boolean(lang === "en" ? item.local_file_url_en || item.file_url_en || item.local_file_url_de || item.file_url_de : item.local_file_url_de || item.file_url_de);
}

function downloadDescription(item: DownloadItem, lang: Language) {
  return lang === "en" ? item.description_en || item.description_de : item.description_de;
}

function localizedCategory(category: string, lang: Language) {
  const map = translations[lang].downloads.fileCategoryMap as Record<string, string>;
  return map[category] || category;
}

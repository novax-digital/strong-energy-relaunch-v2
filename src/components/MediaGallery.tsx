"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Play, Search, X } from "lucide-react";
import type { MediaCategory, MediaItem } from "@/types/content";
import { translations, type Language } from "@/lib/i18n";

export function MediaGallery({ items, categories, lang = "de" }: { items: MediaItem[]; categories: MediaCategory[]; lang?: Language }) {
  const t = translations[lang].media;
  const rootCategories = useMemo(() => categories.filter((category) => !category.parent_id).sort((a, b) => a.sort_order - b.sort_order), [categories]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const orderedItems = useMemo(() => {
    const videoOrder = new Map([
      ["ALFRED Installation mit Timothy Weltner (Train the Trainer)", 0],
      ["ALFRED Installation vor Ort mit T&S Solar", 1],
      ["INTERSOLAR 2024", 2],
      ["Besuch bei Alfred", 3],
      ["INTERSOLAR 2025", 4],
      ["CNTE Gewerbespeicher powered by Strong Energy", 5],
      ["ALFRED Produktvideo", 6]
    ]);
    return [...items].sort((a, b) => {
      const ai = a.media_type === "video" ? videoOrder.get(a.title_de) ?? 100 : 100 + a.sort_order;
      const bi = b.media_type === "video" ? videoOrder.get(b.title_de) ?? 100 : 100 + b.sort_order;
      if (ai !== bi) return ai - bi;
      return items.indexOf(a) - items.indexOf(b);
    });
  }, [items]);
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const bySearch = orderedItems.filter((item) => {
      if (!query) return true;
      return [mediaTitle(item, lang), mediaDescription(item, lang) || ""].some((value) => value.toLowerCase().includes(query));
    });
    if (activeCategory === "all") return bySearch;
    const childIds = categories.filter((category) => category.parent_id === activeCategory).map((category) => category.id);
    return bySearch.filter((item) => item.category_id === activeCategory || childIds.includes(item.category_id || ""));
  }, [activeCategory, categories, lang, orderedItems, search]);

  const visibleGroups = useMemo(() => {
    const selectedRoots = activeCategory === "all" ? rootCategories : rootCategories.filter((category) => category.id === activeCategory);
    return selectedRoots
      .map((category) => {
        const children = categories.filter((item) => item.parent_id === category.id).sort((a, b) => a.sort_order - b.sort_order);
        return {
          category,
          directItems: filtered.filter((item) => item.category_id === category.id),
          childGroups: children
            .map((child) => ({
              category: child,
              items: filtered.filter((item) => item.category_id === child.id)
            }))
            .filter((group) => group.items.length > 0)
        };
      })
      .filter((group) => group.directItems.length > 0 || group.childGroups.length > 0);
  }, [activeCategory, categories, filtered, rootCategories]);

  return (
    <div>
      <div className="flex justify-center mb-8 px-0" role="list" aria-label="Medienkategorien">
        <div className="inline-flex items-center gap-2 p-1.5 rounded-full bg-secondary/40 border border-border backdrop-blur-sm overflow-x-auto max-w-full no-scrollbar">
        <button
          type="button"
          className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-300 ${activeCategory === "all" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-card/50"}`}
          onClick={() => setActiveCategory("all")}
        >
          {t.all}
        </button>
        {rootCategories.map((category) => (
          <button
            key={category.id}
            type="button"
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-300 ${activeCategory === category.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-card/50"}`}
            onClick={() => setActiveCategory(category.id)}
          >
            {categoryName(category, lang)}
          </button>
        ))}
        </div>
      </div>

      <div className="mb-20 flex justify-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t.search}
            className="h-10 w-full rounded-full border border-border bg-secondary/30 pl-11 pr-10 text-sm outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
          />
          {search ? (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" type="button">
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>

      <div className="space-y-20">
        {visibleGroups.map((group) => (
          <section key={group.category.id}>
            <div className="mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">{categoryName(group.category, lang)}</h2>
              <div className="mt-2 h-1 w-16 rounded-full bg-primary" />
            </div>

            <div className="space-y-12">
              {group.directItems.length ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {group.directItems.map((item) => (
                    <MediaTile item={item} key={item.id} lang={lang} />
                  ))}
                </div>
              ) : null}

              {group.childGroups.map((childGroup) => (
                <div key={childGroup.category.id}>
                  <div className="mb-5 flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-foreground">{categoryName(childGroup.category, lang)}</h3>
                    <span className="text-sm text-muted-foreground">{childGroup.items.length} {t.countLabel}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {childGroup.items.map((item) => (
                      <MediaTile item={item} key={item.id} lang={lang} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
        {!visibleGroups.length ? (
          <div className="py-20 text-center">
            <p className="text-lg text-muted-foreground">{t.noResults}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function MediaTile({ item, lang }: { item: MediaItem; lang: Language }) {
  const t = translations[lang].media;
  const src = item.local_thumbnail_url || item.local_file_url || item.thumbnail_url || item.file_url;
  if (!src) return null;
  const title = mediaTitle(item, lang);
  return (
    <article className="group cursor-pointer">
      <a href={item.video_url || item.local_file_url || item.file_url || "#"} target="_blank" rel="noopener noreferrer">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-secondary/30">
          <Image src={src} alt={title} fill sizes="(min-width: 1280px) 20vw, (min-width: 768px) 33vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
          {item.media_type === "video" ? (
            <>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-full bg-black/40 p-3 backdrop-blur-sm transition-colors group-hover:bg-primary/80">
                  <Play className="h-6 w-6 fill-white text-white" />
                </div>
              </div>
              <span className="absolute left-2 top-2 rounded-md bg-black/50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">{t.video}</span>
            </>
          ) : null}
        </div>
        <h3 className="mt-2 line-clamp-2 px-0.5 text-xs font-medium text-foreground sm:text-sm">{title}</h3>
      </a>
    </article>
  );
}

function categoryName(category: MediaCategory, lang: Language) {
  return lang === "en" ? category.name_en || category.name_de : category.name_de;
}

function mediaTitle(item: MediaItem, lang: Language) {
  return lang === "en" ? item.title_en || item.title_de : item.title_de;
}

function mediaDescription(item: MediaItem, lang: Language) {
  return lang === "en" ? item.description_en || item.description_de : item.description_de;
}

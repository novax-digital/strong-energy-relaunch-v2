"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Play, Search, X } from "lucide-react";
import { useLiveMedia } from "@/hooks/useLiveMedia";
import type { MediaCategory, MediaItem } from "@/types/content";
import { translations, type Language } from "@/lib/i18n";

export function MediaGallery({ items, categories, lang = "de" }: { items: MediaItem[]; categories: MediaCategory[]; lang?: Language }) {
  const t = translations[lang].media;
  const liveMedia = useLiveMedia(items, categories);
  const rootCategories = useMemo(() => liveMedia.categories.filter((category) => !category.parent_id).sort((a, b) => a.sort_order - b.sort_order), [liveMedia.categories]);
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
    return [...liveMedia.items].sort((a, b) => {
      const ai = a.media_type === "video" ? videoOrder.get(a.title_de) ?? 100 : 100 + a.sort_order;
      const bi = b.media_type === "video" ? videoOrder.get(b.title_de) ?? 100 : 100 + b.sort_order;
      if (ai !== bi) return ai - bi;
      return liveMedia.items.indexOf(a) - liveMedia.items.indexOf(b);
    });
  }, [liveMedia.items]);
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const bySearch = orderedItems.filter((item) => {
      if (!query) return true;
      return [mediaTitle(item, lang), mediaDescription(item, lang) || ""].some((value) => value.toLowerCase().includes(query));
    });
    if (activeCategory === "all") return bySearch;
    const childIds = liveMedia.categories.filter((category) => category.parent_id === activeCategory).map((category) => category.id);
    return bySearch.filter((item) => item.category_id === activeCategory || childIds.includes(item.category_id || ""));
  }, [activeCategory, lang, liveMedia.categories, orderedItems, search]);
  const openableItems = useMemo(() => filtered.filter((item) => Boolean(mediaContentSource(item))), [filtered]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const lightboxItem = lightboxIndex === null ? null : openableItems[lightboxIndex] || null;
  const lightboxOpen = Boolean(lightboxItem);

  const visibleGroups = useMemo(() => {
    const selectedRoots = activeCategory === "all" ? rootCategories : rootCategories.filter((category) => category.id === activeCategory);
    return selectedRoots
      .map((category) => {
        const children = liveMedia.categories.filter((item) => item.parent_id === category.id).sort((a, b) => a.sort_order - b.sort_order);
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
  }, [activeCategory, filtered, liveMedia.categories, rootCategories]);

  useEffect(() => {
    if (!lightboxOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setLightboxIndex(null);
      }
      if (event.key === "ArrowLeft") {
        setLightboxIndex((index) => (index === null || !openableItems.length ? index : (index - 1 + openableItems.length) % openableItems.length));
      }
      if (event.key === "ArrowRight") {
        setLightboxIndex((index) => (index === null || !openableItems.length ? index : (index + 1) % openableItems.length));
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxOpen, openableItems.length]);

  useEffect(() => {
    if (lightboxIndex === null || !openableItems.length) return;

    const preloadIndexes = [-2, -1, 1, 2].map((offset) => (lightboxIndex + offset + openableItems.length) % openableItems.length);
    const preloadedSources = new Set<string>();

    preloadIndexes.forEach((index) => {
      const item = openableItems[index];
      if (!item || item.media_type !== "image") return;

      const source = mediaContentSource(item);
      if (!source || preloadedSources.has(source)) return;

      preloadedSources.add(source);
      const image = document.createElement("img");
      image.decoding = "async";
      image.src = source;
    });
  }, [lightboxIndex, openableItems]);

  function openLightbox(item: MediaItem) {
    const itemIndex = openableItems.findIndex((mediaItem) => mediaItem.id === item.id);
    if (itemIndex >= 0) {
      setLightboxIndex(itemIndex);
    }
  }

  function showPreviousMedia() {
    setLightboxIndex((index) => (index === null || !openableItems.length ? index : (index - 1 + openableItems.length) % openableItems.length));
  }

  function showNextMedia() {
    setLightboxIndex((index) => (index === null || !openableItems.length ? index : (index + 1) % openableItems.length));
  }

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
                    <MediaTile item={item} key={item.id} lang={lang} onOpen={() => openLightbox(item)} />
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
                      <MediaTile item={item} key={item.id} lang={lang} onOpen={() => openLightbox(item)} />
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
      {lightboxItem ? (
        <MediaLightbox
          item={lightboxItem}
          lang={lang}
          onClose={() => setLightboxIndex(null)}
          onNext={showNextMedia}
          onPrevious={showPreviousMedia}
          showNavigation={openableItems.length > 1}
          total={openableItems.length}
          current={(lightboxIndex ?? 0) + 1}
        />
      ) : null}
    </div>
  );
}

function MediaTile({ item, lang, onOpen }: { item: MediaItem; lang: Language; onOpen: () => void }) {
  const t = translations[lang].media;
  const src = item.local_thumbnail_url || item.local_file_url || item.thumbnail_url || item.file_url;
  if (!src || !mediaContentSource(item)) return null;
  const title = mediaTitle(item, lang);
  return (
    <article className="group cursor-pointer">
      <button aria-label={`${title} öffnen`} className="block w-full text-left" onClick={onOpen} type="button">
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
      </button>
    </article>
  );
}

function MediaLightbox({
  current,
  item,
  lang,
  onClose,
  onNext,
  onPrevious,
  showNavigation,
  total
}: {
  current: number;
  item: MediaItem;
  lang: Language;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  showNavigation: boolean;
  total: number;
}) {
  const title = mediaTitle(item, lang);
  const description = mediaDescription(item, lang);
  const source = mediaContentSource(item);

  if (!source) return null;

  return (
    <div
      aria-label={`${title} Lightbox`}
      aria-modal="true"
      className="fixed inset-0 z-[140] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
      onClick={(event) => {
        if (event.currentTarget === event.target) {
          onClose();
        }
      }}
      role="dialog"
    >
      <button
        aria-label="Lightbox schließen"
        className="absolute right-4 top-4 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
        onClick={onClose}
        type="button"
      >
        <X className="h-5 w-5" />
      </button>
      {showNavigation ? (
        <button
          aria-label="Vorheriges Medium"
          className="absolute left-4 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
          onClick={(event) => {
            event.stopPropagation();
            onPrevious();
          }}
          type="button"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      ) : null}
      <div className="flex max-h-[86vh] max-w-[92vw] items-center justify-center" onClick={(event) => event.stopPropagation()}>
        <h2 className="sr-only">{title}</h2>
        {description ? <p className="sr-only">{description}</p> : null}
        {item.media_type === "video" ? (
          <div
            className="relative aspect-video overflow-hidden rounded-lg shadow-2xl"
            style={{ width: "min(92vw, 1180px, calc(82vh * 16 / 9))" }}
          >
            <LightboxVideo source={source} title={title} />
          </div>
        ) : (
          <LightboxImage source={source} title={title} onNext={showNavigation ? onNext : undefined} />
        )}
      </div>
      {showNavigation ? (
        <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
          {current} / {total}
        </div>
      ) : null}
      {showNavigation ? (
        <button
          aria-label="Nächstes Medium"
          className="absolute right-4 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
          onClick={(event) => {
            event.stopPropagation();
            onNext();
          }}
          type="button"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      ) : null}
    </div>
  );
}

function LightboxImage({ onNext, source, title }: { onNext?: () => void; source: string; title: string }) {
  // eslint-disable-next-line @next/next/no-img-element -- the lightbox should keep the image's natural aspect ratio.
  const image = <img alt={title} className="max-h-[82vh] max-w-[92vw] rounded-lg object-contain shadow-2xl" decoding="async" src={source} />;

  if (onNext) {
    return (
      <button aria-label="Nächstes Medium anzeigen" className="block cursor-pointer" onClick={onNext} type="button">
        {image}
      </button>
    );
  }

  return image;
}

function LightboxVideo({ source, title }: { source: string; title: string }) {
  const wistiaId = getWistiaId(source);
  const youtubeId = getYouTubeId(source);

  if (wistiaId) {
    return (
      <iframe
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        className="h-full w-full bg-black"
        src={`https://fast.wistia.net/embed/iframe/${wistiaId}?seo=false&videoFoam=true&autoPlay=true`}
        title={title}
      />
    );
  }

  if (youtubeId) {
    return (
      <iframe
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        allowFullScreen
        className="h-full w-full bg-black"
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
        title={title}
      />
    );
  }

  if (isVideoFile(source)) {
    return <video autoPlay className="h-full w-full bg-black object-contain" controls playsInline src={source} title={title} />;
  }

  return <iframe allow="autoplay; fullscreen; picture-in-picture" allowFullScreen className="h-full w-full bg-black" src={source} title={title} />;
}

function mediaContentSource(item: MediaItem) {
  if (item.media_type === "video") {
    return item.video_url || item.local_file_url || item.file_url;
  }

  return item.local_file_url || item.file_url;
}

function getWistiaId(source: string) {
  if (/^[a-z0-9]{10}$/i.test(source)) return source;
  if (!source.includes("wistia")) return null;
  return source.match(/\/(?:medias|iframe)\/([a-z0-9]+)/i)?.[1] || null;
}

function getYouTubeId(source: string) {
  if (!/youtu(?:be\.com|\.be)/i.test(source)) return null;
  return source.match(/(?:v=|embed\/|youtu\.be\/|shorts\/)([a-zA-Z0-9_-]{11})/)?.[1] || null;
}

function isVideoFile(source: string) {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(source);
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

"use client";

import { createElement, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Box, ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import type { Product } from "@/types/content";

type ProductModelAsset = NonNullable<Product["modelAssets"]>[number];

type GalleryItem =
  | {
      type: "image";
      src: string;
      alt: string;
    }
  | {
      type: "model";
      model: ProductModelAsset;
      alt: string;
    };

export function ProductImageGallery({
  images,
  modelAssets = [],
  name
}: {
  images: string[];
  modelAssets?: Product["modelAssets"];
  name: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const galleryItems = useMemo<GalleryItem[]>(
    () => [
      ...images.map((image, index) => ({
        type: "image" as const,
        src: image,
        alt: `${name} ${index + 1}`
      })),
      ...modelAssets.map((model) => ({
        type: "model" as const,
        model,
        alt: model.label || `${name} 3D-Modell`
      }))
    ],
    [images, modelAssets, name]
  );
  const activeItem = galleryItems[activeIndex] || galleryItems[0];
  const activeGalleryIndex = Math.max(0, galleryItems.indexOf(activeItem));
  const lightboxItem = lightboxIndex === null ? null : galleryItems[lightboxIndex] || null;

  useEffect(() => {
    if (!modelAssets.length) return;
    void import("@google/model-viewer");
  }, [modelAssets.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setLightboxIndex(null);
      }
      if (event.key === "ArrowLeft") {
        setLightboxIndex((index) => (index === null ? index : (index - 1 + galleryItems.length) % galleryItems.length));
      }
      if (event.key === "ArrowRight") {
        setLightboxIndex((index) => (index === null ? index : (index + 1) % galleryItems.length));
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [galleryItems.length, lightboxIndex]);

  function showPreviousItem() {
    setLightboxIndex((index) => (index === null ? index : (index - 1 + galleryItems.length) % galleryItems.length));
  }

  function showNextItem() {
    setLightboxIndex((index) => (index === null ? index : (index + 1) % galleryItems.length));
  }

  if (!images.length && !modelAssets.length) return null;

  return (
    <div className="space-y-4">
      {activeItem ? (
        <div className="group relative aspect-square w-full overflow-hidden rounded-[1.35rem] border border-border bg-secondary/40 shadow-sm">
          {activeItem.type === "image" ? (
            <button
              aria-label={`${name} Bild vergrößern`}
              className="absolute inset-0 block text-left"
              onClick={() => setLightboxIndex(activeGalleryIndex)}
              type="button"
            >
              <Image src={activeItem.src} alt={name} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" priority />
            </button>
          ) : (
            <ProductModelViewer className="h-full w-full" model={activeItem.model} title={activeItem.alt} />
          )}
          <button
            aria-label={activeItem.type === "model" ? `${activeItem.alt} in Lightbox öffnen` : `${name} Bild vergrößern`}
            className="absolute bottom-4 right-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/55 text-white opacity-0 shadow-lg backdrop-blur-sm transition-opacity hover:bg-black/70 group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100"
            onClick={() => setLightboxIndex(activeGalleryIndex)}
            type="button"
          >
            <Maximize2 className="h-5 w-5" />
          </button>
        </div>
      ) : null}
      <div className="flex items-start gap-3 pb-2">
        <div className="flex min-w-0 flex-1 gap-3 overflow-x-auto">
          {images.map((image, index) => {
            const selected = index === activeIndex;
            return (
              <button
                aria-label={`${name} Bild ${index + 1} anzeigen`}
                aria-pressed={selected}
                className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 bg-white shadow-sm transition-all md:h-20 md:w-20 ${
                  selected ? "border-primary shadow-md" : "border-border hover:border-primary/50"
                }`}
                key={`${image}-${index}`}
                onClick={() => setActiveIndex(index)}
                type="button"
              >
                <Image src={image} alt={`${name} ${index + 1}`} fill sizes="96px" className="object-cover" />
              </button>
            );
          })}
        </div>
        {modelAssets.length ? (
          <div className="flex flex-shrink-0 gap-3">
            {modelAssets.map((model, modelIndex) => {
              const itemIndex = images.length + modelIndex;
              const selected = itemIndex === activeIndex;
              return (
                <button
                  aria-label={`${model.label} anzeigen`}
                  aria-pressed={selected}
                  className={`flex h-16 w-16 flex-shrink-0 flex-col items-center justify-center gap-1 rounded-xl border-2 bg-white text-primary shadow-sm transition-all md:h-20 md:w-20 ${
                    selected ? "border-primary shadow-md" : "border-border hover:border-primary/50"
                  }`}
                  key={model.url}
                  onClick={() => setActiveIndex(itemIndex)}
                  type="button"
                >
                  <Box className="h-5 w-5" />
                  <span className="text-xs font-bold">3D</span>
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
      {lightboxItem ? (
        <div
          className="fixed inset-0 z-[140] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={(event) => {
            if (event.currentTarget === event.target) {
              setLightboxIndex(null);
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-label={`${name} Bildergalerie`}
        >
          <button
            aria-label="Lightbox schließen"
            className="absolute right-4 top-4 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
            onClick={() => setLightboxIndex(null)}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
          {galleryItems.length > 1 ? (
            <button
              aria-label="Vorheriges Element"
              className="absolute left-4 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
              onClick={(event) => {
                event.stopPropagation();
                showPreviousItem();
              }}
              type="button"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          ) : null}
          <div className="h-[82vh] w-full max-w-6xl" onClick={(event) => event.stopPropagation()}>
            {lightboxItem.type === "image" ? (
              <button
                aria-label={galleryItems.length > 1 ? "Nächstes Element anzeigen" : "Lightbox schließen"}
                className={`relative h-full w-full ${galleryItems.length > 1 ? "cursor-pointer" : "cursor-zoom-out"}`}
                onClick={(event) => {
                  event.stopPropagation();
                  if (galleryItems.length > 1) {
                    showNextItem();
                  } else {
                    setLightboxIndex(null);
                  }
                }}
                type="button"
              >
                <Image src={lightboxItem.src} alt={lightboxItem.alt} fill sizes="100vw" className="object-contain" priority />
              </button>
            ) : (
              <div className="h-full w-full overflow-hidden rounded-xl bg-white">
                <ProductModelViewer className="h-full w-full" model={lightboxItem.model} title={lightboxItem.alt} />
              </div>
            )}
          </div>
          {galleryItems.length > 1 ? (
            <button
              aria-label="Nächstes Element"
              className="absolute right-4 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
              onClick={(event) => {
                event.stopPropagation();
                showNextItem();
              }}
              type="button"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          ) : null}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            {(lightboxIndex ?? 0) + 1} / {galleryItems.length}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ProductModelViewer({ className, model, title }: { className: string; model: ProductModelAsset; title: string }) {
  const [viewer, setViewer] = useState<HTMLElement | null>(null);
  const captureViewer = useCallback((element: Element | null) => {
    setViewer(element as HTMLElement | null);
  }, []);

  useEffect(() => {
    if (!viewer) return;

    viewer.setAttribute("alt", title);
    viewer.setAttribute("exposure", "0.9");
    viewer.setAttribute("src", model.url);
  }, [model.url, title, viewer]);

  return createElement("model-viewer", {
    alt: title,
    "auto-rotate": true,
    "camera-controls": true,
    "camera-orbit": "35deg 68deg 160%",
    class: className,
    exposure: "0.9",
    "interaction-prompt": "none",
    "max-camera-orbit": "auto auto 280%",
    "min-camera-orbit": "auto auto 55%",
    ref: captureViewer,
    "rotation-per-second": "18deg",
    "shadow-intensity": "0.65",
    src: model.url,
    "touch-action": "pan-y"
  } as Record<string, unknown>);
}

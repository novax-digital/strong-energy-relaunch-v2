"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Box, ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import type { Product } from "@/types/content";

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
  const activeImage = images[activeIndex] || images[0];
  const lightboxImage = lightboxIndex === null ? null : images[lightboxIndex];

  useEffect(() => {
    if (lightboxIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setLightboxIndex(null);
      }
      if (event.key === "ArrowLeft") {
        setLightboxIndex((index) => (index === null ? index : (index - 1 + images.length) % images.length));
      }
      if (event.key === "ArrowRight") {
        setLightboxIndex((index) => (index === null ? index : (index + 1) % images.length));
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [images.length, lightboxIndex]);

  function showPreviousImage() {
    setLightboxIndex((index) => (index === null ? index : (index - 1 + images.length) % images.length));
  }

  function showNextImage() {
    setLightboxIndex((index) => (index === null ? index : (index + 1) % images.length));
  }

  if (!images.length && !modelAssets.length) return null;

  return (
    <div className="space-y-4">
      {activeImage ? (
        <button
          aria-label={`${name} Bild vergrößern`}
          className="group relative block aspect-square w-full overflow-hidden rounded-[1.35rem] border border-border bg-secondary/40 text-left shadow-sm"
          onClick={() => setLightboxIndex(activeIndex)}
          type="button"
        >
          <Image src={activeImage} alt={name} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" priority />
          <span className="absolute bottom-4 right-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/55 text-white opacity-0 shadow-lg backdrop-blur-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            <Maximize2 className="h-5 w-5" />
          </span>
        </button>
      ) : null}
      <div className="flex gap-3 overflow-x-auto pb-2">
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
        {modelAssets.map((model) => (
          <a
            className="flex h-16 w-16 flex-shrink-0 flex-col items-center justify-center gap-1 rounded-xl border-2 border-border bg-white text-primary shadow-sm transition-all hover:border-primary/50 md:h-20 md:w-20"
            href={model.url}
            key={model.url}
          >
            <Box className="h-4 w-4" />
            <span className="text-xs font-bold">{model.format}</span>
          </a>
        ))}
      </div>
      {lightboxImage ? (
        <div
          className="fixed inset-0 z-[140] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onMouseDown={() => setLightboxIndex(null)}
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
          {images.length > 1 ? (
            <button
              aria-label="Vorheriges Bild"
              className="absolute left-4 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
              onClick={(event) => {
                event.stopPropagation();
                showPreviousImage();
              }}
              type="button"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          ) : null}
          <div className="relative h-[82vh] w-full max-w-6xl" onMouseDown={(event) => event.stopPropagation()}>
            <Image src={lightboxImage} alt={`${name} ${(lightboxIndex ?? 0) + 1}`} fill sizes="100vw" className="object-contain" priority />
          </div>
          {images.length > 1 ? (
            <button
              aria-label="Nächstes Bild"
              className="absolute right-4 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
              onClick={(event) => {
                event.stopPropagation();
                showNextImage();
              }}
              type="button"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          ) : null}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            {(lightboxIndex ?? 0) + 1} / {images.length}
          </div>
        </div>
      ) : null}
    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { Box } from "lucide-react";
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
  const activeImage = images[activeIndex] || images[0];

  if (!images.length && !modelAssets.length) return null;

  return (
    <div className="space-y-4">
      {activeImage ? (
        <div className="relative aspect-square overflow-hidden rounded-[1.35rem] border border-border bg-secondary/40 shadow-sm">
          <Image src={activeImage} alt={name} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" priority />
        </div>
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
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Play, X } from "lucide-react";
import type { Product } from "@/types/content";

export function ProductVideoButton({
  className,
  label = "Produktvideo",
  product
}: {
  className?: string;
  label?: string;
  product: Product;
}) {
  const [open, setOpen] = useState(false);
  const poster = product.heroImage || product.images[0];
  const hasVideo = Boolean(product.productVideo || product.productVideoWebm);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!hasVideo) return null;

  return (
    <>
      <button
        className={className ?? "inline-flex items-center justify-center gap-2 rounded-full border-2 border-primary/20 bg-white px-6 py-3 text-base font-semibold text-primary shadow-sm transition hover:border-primary/40 hover:bg-primary/5"}
        onClick={() => setOpen(true)}
        type="button"
      >
        <Play className="h-4 w-4 fill-current" />
        {label}
      </button>
      {open ? (
        <div
          aria-label={`${product.name} ${label}`}
          aria-modal="true"
          className="fixed inset-0 z-[140] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={(event) => {
            if (event.currentTarget === event.target) {
              setOpen(false);
            }
          }}
          role="dialog"
        >
          <button
            aria-label="Video schließen"
            className="absolute right-4 top-4 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
            onClick={() => setOpen(false)}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="w-full max-w-6xl overflow-hidden rounded-xl bg-black shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <video autoPlay className="aspect-video w-full bg-black" controls playsInline poster={poster} preload="metadata">
              {product.productVideoWebm ? <source src={product.productVideoWebm} type="video/webm" /> : null}
              {product.productVideo ? <source src={product.productVideo} type="video/mp4" /> : null}
            </video>
          </div>
        </div>
      ) : null}
    </>
  );
}

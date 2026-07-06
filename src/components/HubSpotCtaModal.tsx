"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

const MEETINGS_SRC =
  "https://meetings-eu1.hubspot.com/nbalakowski/erstkontakt-meta-ads?uuid=053cbfa8-2585-4b17-8b90-57889c9f88eb&embed=true";
const SCRIPT_SRC = "https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js";

export function HubSpotCtaModal({ productName, onClose }: { productName?: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    if (existing) existing.remove();

    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.type = "text/javascript";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-foreground/10 bg-background shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full p-2 transition-colors hover:bg-foreground/5"
          aria-label="Schließen"
          type="button"
        >
          <X className="h-5 w-5 text-foreground" />
        </button>

        <div className="h-1.5 bg-gradient-to-r from-[#d7d42f] to-[#28a795]" />

        <div className="px-4 pb-2 pt-6 sm:px-8 sm:pt-7">
          <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground sm:text-xs">Beratungstermin</p>
          <h2 className="mt-2 text-xl font-bold leading-tight tracking-tight text-foreground sm:text-2xl">
            {productName ? `${productName} besprechen` : "Termin vereinbaren"}
          </h2>
        </div>

        <div className="px-2 pb-4 sm:px-4 sm:pb-6">
          <div className="meetings-iframe-container" data-src={MEETINGS_SRC} style={{ minHeight: "70vh" }} />
        </div>
      </div>
    </div>
  );
}

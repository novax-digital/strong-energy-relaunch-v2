"use client";

import { useEffect, useState } from "react";

const ELFSIGHT_SRC = "https://static.elfsight.com/platform/platform.js";

function WidgetPreloader({ label, loaded, cards, className = "inset-0", pill = false }: { label: string; loaded: boolean; cards: number; className?: string; pill?: boolean }) {
  return (
    <div
      aria-hidden={loaded}
      className={`absolute ${className} flex gap-5 transition-opacity duration-500 ${loaded ? "pointer-events-none opacity-0" : "opacity-100"}`}
      role="status"
    >
      {Array.from({ length: cards }, (_, index) => (
        <div key={index} className={`flex-1 animate-pulse border border-white/10 bg-white/[0.07] backdrop-blur-[2px] ${pill ? "rounded-full" : "rounded-xl"}`} />
      ))}
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function GoogleReviewsWidget({ loadingLabel }: { loadingLabel: string }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const mobileTarget = document.getElementById("rezensionen");
    const targets = [mobileTarget].filter(
      (target): target is HTMLElement => Boolean(target)
    );
    if (!targets.length) return;

    const loadWidget = () => {
      if (!document.querySelector<HTMLScriptElement>(`script[src="${ELFSIGHT_SRC}"]`)) {
        const script = document.createElement("script");
        script.src = ELFSIGHT_SRC;
        script.async = true;
        document.head.appendChild(script);
      }
    };

    const markLoadedWidgets = () => {
      const mobile = Boolean(mobileTarget?.querySelector(".es-embed-root")?.textContent?.trim());
      if (mobile) setLoaded(true);
    };

    const contentObserver = new MutationObserver(markLoadedWidgets);
    targets.forEach((target) => contentObserver.observe(target, { childList: true, subtree: true, characterData: true }));
    markLoadedWidgets();

    let intersectionObserver: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            loadWidget();
            intersectionObserver?.disconnect();
          }
        },
        { rootMargin: "200px" }
      );

      targets.forEach((target) => intersectionObserver?.observe(target));
    } else {
      loadWidget();
    }

    return () => {
      contentObserver.disconnect();
      intersectionObserver?.disconnect();
    };
  }, []);

  return (
    <div id="rezensionen" className="relative mx-4 mt-10 min-h-[38px] animate-fade-in md:hidden" style={{ animationDelay: "0.4s" }}>
      <div className={`elfsight-app-a4021fff-f31e-466a-9589-c9d439a52d91 transition-opacity duration-300 ${loaded ? "opacity-95" : "opacity-0"}`} data-elfsight-app-lazy />
      <WidgetPreloader cards={1} className="inset-y-0 left-1/2 w-[220px] -translate-x-1/2" label={loadingLabel} loaded={loaded} pill />
    </div>
  );
}

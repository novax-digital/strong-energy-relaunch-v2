"use client";

import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";

const ELFSIGHT_SRC = "https://static.elfsight.com/platform/platform.js";

function WidgetPreloader({ label, loaded }: { label: string; loaded: boolean }) {
  return (
    <div
      aria-hidden={loaded}
      className={`absolute inset-0 flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-black/15 text-sm text-white/80 backdrop-blur-sm transition-opacity duration-300 ${loaded ? "pointer-events-none opacity-0" : "opacity-100"}`}
      role="status"
    >
      <LoaderCircle className="h-4 w-4 animate-spin" />
      <span>{label}</span>
    </div>
  );
}

export function GoogleReviewsWidget({ loadingLabel }: { loadingLabel: string }) {
  const [loaded, setLoaded] = useState({ mobile: false, desktop: false });

  useEffect(() => {
    const mobileTarget = document.getElementById("rezensionen");
    const desktopTarget = document.getElementById("rezensionen-desktop");
    const targets = [mobileTarget, desktopTarget].filter(
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
      const desktop = Boolean(desktopTarget?.querySelector(".es-embed-root")?.textContent?.trim());
      setLoaded((current) => {
        const next = { mobile: current.mobile || mobile, desktop: current.desktop || desktop };
        return next.mobile === current.mobile && next.desktop === current.desktop ? current : next;
      });
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
    <>
      <div id="rezensionen" className="relative mx-4 mt-10 min-h-[38px] animate-fade-in md:hidden" style={{ animationDelay: "0.4s" }}>
        <div className={`elfsight-app-a4021fff-f31e-466a-9589-c9d439a52d91 transition-opacity duration-300 ${loaded.mobile ? "opacity-95" : "opacity-0"}`} data-elfsight-app-lazy />
        <WidgetPreloader label={loadingLabel} loaded={loaded.mobile} />
      </div>
      <div id="rezensionen-desktop" className="relative mx-auto mt-28 hidden h-[219px] w-full max-w-[1088px] overflow-hidden px-8 animate-fade-in md:block" style={{ animationDelay: "0.4s" }}>
        <div className="absolute inset-x-8 top-0 min-h-[267px]">
          <div className="absolute left-1/2 top-0 min-h-[267px] w-[121.96%] origin-top -translate-x-1/2 scale-[0.82]">
            <div className={`elfsight-app-587b08ed-ade3-4b95-a358-6583183f10fe transition-opacity duration-300 ${loaded.desktop ? "opacity-[0.92]" : "opacity-0"}`} data-elfsight-app-lazy />
          </div>
        </div>
        <WidgetPreloader label={loadingLabel} loaded={loaded.desktop} />
      </div>
    </>
  );
}

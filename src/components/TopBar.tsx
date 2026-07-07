"use client";

import { Instagram, Linkedin, Youtube } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { getLanguageFromPathname, translations } from "@/lib/i18n";

export function TopBar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const lang = getLanguageFromPathname(pathname);
  const labels = translations[lang].topbar;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed left-0 right-0 z-[52] flex h-8 items-center bg-gradient-to-r from-primary via-primary/90 to-accent text-white text-sm transition-transform duration-300 sm:h-9 ${
        scrolled ? "-translate-y-full" : "translate-y-0"
      }`}
      style={{ top: "var(--banner-offset, 0px)" }}
    >
      <div className="container-wide flex w-full items-center justify-center sm:justify-between">
        <div className="hidden sm:flex items-center gap-3">
          <span className="font-medium">{labels.followUs}</span>
          <div className="flex items-center gap-2">
            <a href={site.social[0]?.href || "#"} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="LinkedIn">
              <Linkedin size={16} />
            </a>
            <a href={site.social[1]?.href || "#"} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="YouTube">
              <Youtube size={16} />
            </a>
            <a href={site.social[2]?.href || "#"} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="Instagram">
              <Instagram size={16} />
            </a>
          </div>
        </div>
        <p className="truncate px-2 text-center text-[11px] font-medium leading-tight sm:text-sm">{labels.announcement}</p>
      </div>
    </div>
  );
}

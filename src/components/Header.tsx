"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { getLanguageFromPathname, getMainNavigation, languages, localizedPath, switchLocalePath, translations, type Language } from "@/lib/i18n";
import { TopBar } from "./TopBar";

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const lang = getLanguageFromPathname(pathname);
  const navItems = getMainNavigation(lang);
  const labels = translations[lang].nav;
  const currentLanguage = languages[lang];
  const contactHref = localizedPath("/kontakt", lang);
  const transparentPath =
    pathname === "/de" ||
    pathname === "/en" ||
    /^\/de\/produkte\/[^/]+\/[^/]+$/.test(pathname) ||
    /^\/en\/products\/[^/]+\/[^/]+$/.test(pathname) ||
    ["/de/gewerbespeicher", "/de/gewerbespeicher-hubspot", "/de/commercial", "/de/commercial-hubspot", "/en/commercial-storage", "/en/commercial-storage-hubspot", "/en/commercial", "/en/commercial-hubspot"].includes(pathname);
  const isTransparent = transparentPath && !scrolled && !mobileMenuOpen;
  const navLinkClass = isTransparent
    ? "text-white hover:text-white/80 transition-smooth text-base font-medium flex items-center gap-1 drop-shadow-sm"
    : "text-foreground/70 hover:text-primary transition-smooth text-base font-medium flex items-center gap-1";

  return (
    <header
      className={`fixed left-0 right-0 z-50 transition-[top] duration-300 ${
        scrolled ? "top-0" : "top-[calc(var(--banner-offset,0px)+2rem)] sm:top-[calc(var(--banner-offset,0px)+2.25rem)]"
      }`}
    >
      <TopBar />
      {isTransparent ? <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/55 to-transparent pointer-events-none" /> : null}
      <nav className={`relative transition-all duration-500 ${isTransparent ? "bg-transparent" : "bg-white"}`}>
        <div className="container-wide">
          <div className="flex items-center justify-between h-14 md:h-16">
          <Link href={localizedPath("/", lang)} className="flex items-center" aria-label="Strong Energy Home">
            <Image src={site.logo} alt="Strong Energy" width={180} height={52} priority className="h-9 md:h-10 w-auto" />
          </Link>

          <div className="hidden lg:flex items-center gap-8" aria-label="Hauptnavigation">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className={navLinkClass}>
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link className="btn-gradient px-5 py-2.5 rounded-lg text-sm font-semibold" href={contactHref}>
              {labels.contact}
            </Link>
            <div className="relative" onMouseEnter={() => setLangDropdownOpen(true)} onMouseLeave={() => setLangDropdownOpen(false)}>
              <button
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-smooth ${
                  isTransparent ? "text-white/80 hover:text-white hover:bg-white/10" : "text-foreground/70 hover:text-foreground hover:bg-secondary"
                }`}
                type="button"
                aria-label={`${lang === "en" ? "Current language" : "Aktuelle Sprache"} ${currentLanguage.label}`}
              >
                <span className="text-lg">{currentLanguage.flag}</span>
                <span className="hidden xl:inline">{currentLanguage.shortLabel}</span>
                <ChevronDown size={14} className={`transition-transform ${langDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {langDropdownOpen ? (
                <div className="absolute right-0 top-full pt-2 w-40 z-50">
                  <div className="bg-white border border-border rounded-lg shadow-lg overflow-hidden">
                    {(Object.keys(languages) as Language[]).map((option) => {
                      const optionConfig = languages[option];
                      const selected = option === lang;
                      return (
                        <Link
                          className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                            selected ? "bg-secondary/50 text-primary" : "text-foreground hover:bg-secondary"
                          }`}
                          href={switchLocalePath(pathname, option)}
                          hrefLang={optionConfig.htmlLang}
                          key={option}
                        >
                          <span className="text-lg">{optionConfig.flag}</span>
                          {optionConfig.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <button
            className={`lg:hidden p-2 ${isTransparent ? "text-white" : "text-foreground"}`}
            onClick={() => setMobileMenuOpen((value) => !value)}
            aria-label={mobileMenuOpen ? (lang === "en" ? "Close menu" : "Menü schließen") : lang === "en" ? "Open menu" : "Menü öffnen"}
            aria-expanded={mobileMenuOpen}
            type="button"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          </div>
        </div>

        {mobileMenuOpen ? (
          <div className="lg:hidden bg-white border-t border-border">
            <div className="container-wide py-4 space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block text-foreground/70 hover:text-primary transition-smooth text-base font-medium py-2.5 text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-border">
                <Link
                  href={contactHref}
                  className="btn-gradient w-full py-3 rounded-lg text-sm font-semibold block text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {labels.contact}
                </Link>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {(Object.keys(languages) as Language[]).map((option) => {
                    const optionConfig = languages[option];
                    return (
                      <Link
                        className={`rounded-lg border px-3 py-2 text-center text-sm font-semibold ${option === lang ? "border-primary text-primary" : "border-border text-muted-foreground"}`}
                        href={switchLocalePath(pathname, option)}
                        key={option}
                      >
                        {optionConfig.flag} {optionConfig.shortLabel}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </nav>
    </header>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, Instagram, Linkedin, Mail, Phone, Youtube } from "lucide-react";
import { usePathname } from "next/navigation";
import { site } from "@/content/site";
import { getFooterLegalNavigation, getLanguageFromPathname, getMainNavigation, localizedPath, translations } from "@/lib/i18n";
import { AppStoreButtons } from "./AppStoreButtons";

export function Footer() {
  const pathname = usePathname();
  const lang = getLanguageFromPathname(pathname);
  const t = translations[lang];
  const footerLegalNavigation = getFooterLegalNavigation(lang);
  const mainNavigation = getMainNavigation(lang);
  const socialIcons = [Linkedin, Youtube, Instagram];
  const openingHours = lang === "en" ? ["Mon-Thu: 8:00-17:00", "Fri: 8:00-15:30"] : site.openingHours;

  return (
    <footer className="bg-[#1a1f24] relative">
      <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #d7d42f, #28a795)" }} />

      <div className="container-wide py-16 md:py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1.2fr_1.2fr_1.5fr] gap-12 lg:gap-10 text-center md:text-left">
        <div className="lg:col-span-1">
          <Link href={localizedPath("/", lang)} className="inline-block mb-6">
            <Image src={site.logo} alt="Strong Energy" width={180} height={52} className="h-10 w-auto brightness-0 invert opacity-90" />
          </Link>
          <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
            {site.social.map((item, index) => {
              const Icon = socialIcons[index] || Linkedin;
              return (
              <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.label} className="text-white/60 hover:text-primary transition-smooth">
                <Icon size={20} />
              </a>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t.footer.menu}</h2>
          <ul className="space-y-3">
            {[...mainNavigation, { label: t.nav.faq, href: localizedPath("/faq", lang) }].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-white/60 hover:text-primary transition-smooth text-sm">{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t.footer.address}</h2>
          <div className="text-white/60 text-sm leading-relaxed">
            <p className="text-white/80 font-medium">{site.legalName}</p>
            <p>{site.address.street}</p>
            <p>{site.address.postalCode} {site.address.city}</p>
            <p>{lang === "en" ? "Germany" : site.address.country}</p>
          </div>
        </div>

        <div>
          <h2 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t.footer.contact}</h2>
          <div className="space-y-4 inline-flex flex-col items-center md:items-start">
            <a href={site.phoneHref} className="flex items-start gap-3 text-white/60 hover:text-primary transition-smooth text-sm">
              <Phone size={16} className="mt-0.5 shrink-0" />
              <span>
                <span className="block text-white/80 font-medium">{site.phone}</span>
                <span className="text-xs text-white/40">{t.footer.tollFree}</span>
              </span>
            </a>
            <div className="flex items-start gap-3 text-white/60 text-sm">
              <Clock size={16} className="mt-0.5 shrink-0" />
              <div>{openingHours.map((line) => <p key={line}>{line}</p>)}</div>
            </div>
            <a href={`mailto:${site.email}`} className="flex items-center gap-3 text-white/60 hover:text-primary transition-smooth text-sm">
              <Mail size={16} className="shrink-0" />
              <span>{site.email}</span>
            </a>
          </div>
        </div>

        <div>
          <h2 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t.footer.appTitle}</h2>
          <p className="text-white/60 text-sm mb-4">{t.footer.appDownload}</p>
          <div className="flex items-start justify-center md:justify-start gap-4">
            <Image src="/assets/strong-energy-360-app-C7nuayTw.webp" alt="Strong Energy 360 App" width={88} height={88} className="h-20 w-20 rounded-xl object-cover" />
            <AppStoreButtons compact />
          </div>
        </div>
      </div>

      <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-white/50 text-sm">
          <p>© 2026 Strong Energy. {t.footer.copyright}</p>
          <p className="mt-1 text-white/40 text-xs">{t.footer.disclaimer}</p>
        </div>
        <nav aria-label="Rechtliches" className="flex flex-wrap items-center justify-center md:justify-end gap-x-6 gap-y-2">
          {footerLegalNavigation.map((item) => (
            <Link key={item.href} href={item.href} className="text-white/50 hover:text-primary transition-smooth text-sm">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      </div>
    </footer>
  );
}

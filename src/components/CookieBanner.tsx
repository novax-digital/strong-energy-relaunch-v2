"use client";

import Link from "next/link";
import { BarChart3, ChevronDown, ChevronUp, Cookie, Megaphone, Shield } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { getLanguageFromPathname, localizedPath, translations } from "@/lib/i18n";

type Consent = "necessary" | "all";
const consentKey = "strong-energy-cookie-consent";
const consentEvent = "strong-energy-cookie-consent-change";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(consentEvent, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(consentEvent, callback);
  };
}

function getClientSnapshot() {
  return !window.localStorage.getItem(consentKey);
}

function getServerSnapshot() {
  return false;
}

export function CookieBanner() {
  const pathname = usePathname();
  const visible = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const lang = getLanguageFromPathname(pathname);
  const t = translations[lang].cookie;

  function saveConsent(preferences: { analytics: boolean; marketing: boolean }) {
    window.localStorage.setItem(consentKey, JSON.stringify({ necessary: true, ...preferences }));
    window.dispatchEvent(new Event(consentEvent));
  }

  function accept(consent: Consent) {
    saveConsent(consent === "all" ? { analytics: true, marketing: true } : { analytics, marketing });
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center p-4 sm:p-6 pointer-events-none" role="dialog" aria-modal="false" aria-labelledby="cookie-title">
      <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm pointer-events-auto" />
      <div className="relative pointer-events-auto w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
        <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #d7d42f, #28a795)" }} />
        <div className="p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-primary/10">
            <Cookie className="h-5 w-5 text-primary" />
          </div>
          <h2 id="cookie-title" className="text-lg font-bold text-foreground">{t.title}</h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-5">
          {t.description}{" "}
          <Link href={localizedPath("/cookie-richtlinie", lang)} className="text-primary underline hover:no-underline">{t.cookiePolicy}</Link> {t.and}{" "}
          <Link href={localizedPath("/datenschutz", lang)} className="text-primary underline hover:no-underline">{t.privacyPolicy}</Link>.
        </p>
        <button onClick={() => setSettingsOpen((value) => !value)} className="flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-smooth mb-4" type="button">
          {settingsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          {t.customize}
        </button>
        {settingsOpen ? (
          <div className="space-y-3 mb-6 animate-fade-in">
            <label className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border">
              <span className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-primary shrink-0" />
                <span>
                  <strong className="block text-sm font-semibold text-foreground">{t.necessary}</strong>
                  <span className="text-xs text-muted-foreground">{t.necessaryDesc}</span>
                </span>
              </span>
              <input type="checkbox" checked readOnly className="h-4 w-4" />
            </label>
            <label className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border">
              <span className="flex items-center gap-3">
                  <BarChart3 className="h-4 w-4 text-primary shrink-0" />
                <span>
                  <strong className="block text-sm font-semibold text-foreground">{t.analytics}</strong>
                  <span className="text-xs text-muted-foreground">{t.analyticsDesc}</span>
                </span>
              </span>
              <input type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} className="h-4 w-4" />
            </label>
            <label className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border">
              <span className="flex items-center gap-3">
                  <Megaphone className="h-4 w-4 text-primary shrink-0" />
                <span>
                  <strong className="block text-sm font-semibold text-foreground">{t.marketing}</strong>
                  <span className="text-xs text-muted-foreground">{t.marketingDesc}</span>
                </span>
              </span>
              <input type="checkbox" checked={marketing} onChange={(event) => setMarketing(event.target.checked)} className="h-4 w-4" />
            </label>
          </div>
        ) : null}
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="btn-gradient px-6 py-2.5 rounded-lg text-sm font-semibold flex-1" type="button" onClick={() => accept("all")}>
            {t.acceptAll}
          </button>
          {settingsOpen ? (
            <button className="px-6 py-2.5 rounded-lg text-sm font-semibold border border-border bg-card text-foreground hover:bg-muted transition-smooth flex-1" type="button" onClick={() => accept("necessary")}>
              {t.saveSelection}
            </button>
          ) : null}
          <button className="px-6 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth flex-1" type="button" onClick={() => {
            setAnalytics(false);
            setMarketing(false);
            saveConsent({ analytics: false, marketing: false });
          }}>
            {t.onlyNecessary}
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}

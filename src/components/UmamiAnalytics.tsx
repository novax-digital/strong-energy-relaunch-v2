"use client";

import Script from "next/script";
import { useSyncExternalStore } from "react";

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
  try {
    return window.localStorage.getItem(consentKey) || "";
  } catch {
    return "";
  }
}

function getServerSnapshot() {
  return "";
}

function hasAnalyticsConsent(consent: string) {
  if (!consent) return false;

  try {
    return Boolean((JSON.parse(consent) as { marketing?: boolean }).marketing);
  } catch {
    return false;
  }
}

export function UmamiAnalytics() {
  const consent = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const canRecord = hasAnalyticsConsent(consent);

  return (
    <>
      <Script
        defer
        src="https://stats.novax-digital.de/script.js"
        data-website-id="195f0650-7016-4467-b6bd-bcf6a213c0c6"
        strategy="afterInteractive"
      />
      {canRecord ? (
        <Script
          defer
          src="https://stats.novax-digital.de/recorder.js"
          data-website-id="195f0650-7016-4467-b6bd-bcf6a213c0c6"
          strategy="afterInteractive"
        />
      ) : null}
    </>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const PRELOADER_SRC = "/assets/preloader-CnS1gmw2.gif";
const MIN_VISIBLE_MS = 850;
const FADE_MS = 300;

export function PagePreloader() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let removeTimer: number | undefined;

    const fadeTimer = window.setTimeout(() => {
      setLeaving(true);
      removeTimer = window.setTimeout(() => setVisible(false), FADE_MS);
    }, MIN_VISIBLE_MS);

    return () => {
      window.clearTimeout(fadeTimer);
      if (removeTimer) {
        window.clearTimeout(removeTimer);
      }
    };
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[linear-gradient(135deg,#f8faf9_0%,#edf7f5_52%,#f7f5df_100%)] transition-opacity duration-300 ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-5">
        <div className="flex h-32 w-32 items-center justify-center rounded-3xl border border-white/80 bg-white/95 shadow-[0_24px_80px_rgba(13,38,35,0.16)] backdrop-blur">
          <Image
            src={PRELOADER_SRC}
            alt=""
            width={130}
            height={130}
            priority
            unoptimized
            className="h-20 w-20 md:h-24 md:w-24"
          />
        </div>
        <div className="h-1 w-36 overflow-hidden rounded-full bg-primary/10">
          <div className="h-full w-full rounded-full bg-gradient-to-r from-accent via-primary to-accent opacity-80 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

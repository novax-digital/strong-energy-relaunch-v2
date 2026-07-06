"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

const screens = [
  "/assets/app-screen-1-BfA40Vv_.webp",
  "/assets/app-screen-2-BjNoPCzE.webp",
  "/assets/app-screen-3-DUp5DYo1.webp",
  "/assets/app-screen-4-CETFmPv7.webp"
];

export function AppPhoneSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrent((screen) => (screen + 1) % screens.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="relative mx-auto w-[260px] sm:w-[280px]">
      <div className="relative overflow-hidden rounded-[2.5rem] border-[6px] border-foreground/90 bg-foreground/90 shadow-2xl">
        <div className="absolute left-1/2 top-0 z-10 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-foreground/90" />
        <div className="relative aspect-[9/19.5] overflow-hidden rounded-[2rem]">
          {screens.map((screen, index) => (
            <Image
              key={screen}
              src={screen}
              alt={`Strong Energy 360 App Screen ${index + 1}`}
              fill
              priority={index === 0}
              sizes="280px"
              className={`object-cover transition-opacity duration-700 ${index === current ? "opacity-100" : "opacity-0"}`}
            />
          ))}
        </div>
      </div>
      <div className="mt-5 flex justify-center gap-2">
        {screens.map((screen, index) => (
          <button
            key={screen}
            aria-label={`App Screen ${index + 1} anzeigen`}
            className={`h-2.5 w-2.5 rounded-full transition-all ${index === current ? "scale-110 bg-primary" : "bg-muted-foreground/30"}`}
            onClick={() => setCurrent(index)}
            type="button"
          />
        ))}
      </div>
      <button
        aria-label="Vorheriger App Screen"
        className="absolute -left-12 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-background text-muted-foreground shadow-md transition-colors hover:text-foreground md:flex"
        onClick={() => setCurrent((screen) => (screen - 1 + screens.length) % screens.length)}
        type="button"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        aria-label="Nächster App Screen"
        className="absolute -right-12 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-background text-muted-foreground shadow-md transition-colors hover:text-foreground md:flex"
        onClick={() => setCurrent((screen) => (screen + 1) % screens.length)}
        type="button"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

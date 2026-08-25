"use client";

import { useState } from "react";

export function HomeHeroVideo() {
  const [ready, setReady] = useState(false);

  return (
    <div className="absolute inset-0 bg-white">
      <video
        autoPlay
        className={`h-full w-full object-cover transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"}`}
        loop
        muted
        onCanPlay={() => setReady(true)}
        onPlaying={() => setReady(true)}
        playsInline
        preload="metadata"
      >
        <source src="/videos/website_hero_strong_energy.webm" type="video/webm" />
        <source src="/videos/website_hero_strong_energy.mp4" type="video/mp4" />
      </video>
      <div className={`absolute inset-0 bg-black/45 transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"}`} />
    </div>
  );
}

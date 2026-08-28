"use client";

import { useEffect, useRef, useState } from "react";

export function HomeHeroVideo() {
  const [ready, setReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // canPlay/playing can fire before hydration attaches the handlers.
    if ((videoRef.current?.readyState ?? 0) >= 3) setReady(true);
  }, []);

  return (
    <div className="absolute inset-0 bg-white">
      <video
        autoPlay
        className={`h-full w-full object-cover transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"}`}
        muted
        onCanPlay={() => setReady(true)}
        onEnded={(event) => {
          const video = event.currentTarget;
          if (Number.isFinite(video.duration)) {
            video.currentTime = Math.max(0, video.duration - 0.05);
          }
        }}
        onPlaying={() => setReady(true)}
        playsInline
        preload="metadata"
        ref={videoRef}
      >
        <source src="/videos/website_hero_strong_energy.webm" type="video/webm" />
        <source src="/videos/website_hero_strong_energy.mp4" type="video/mp4" />
      </video>
      <div className={`absolute inset-0 bg-black/45 transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"}`} />
    </div>
  );
}

"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function SegmentLoopVideo({ start, end, poster, children }: { start: number; end: number; poster: string; children: ReactNode }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Metadata may already be available when React hydrates the video.
    if (videoRef.current && videoRef.current.readyState >= 1) {
      videoRef.current.currentTime = start;
    }
  }, [start]);

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 w-full h-full object-cover"
      autoPlay
      muted
      playsInline
      preload="metadata"
      poster={poster}
      onLoadedMetadata={(event) => { event.currentTarget.currentTime = start; }}
      onTimeUpdate={(event) => {
        const video = event.currentTarget;
        if (!video.seeking && video.currentTime >= end) video.currentTime = start;
      }}
      onEnded={(event) => {
        const video = event.currentTarget;
        video.currentTime = start;
        void video.play().catch(() => {});
      }}
    >
      {children}
    </video>
  );
}

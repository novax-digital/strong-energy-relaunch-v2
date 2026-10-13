"use client";

import { createElement, useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { Box, DoorOpen, LoaderCircle, RotateCcw, RotateCw, ZoomIn, ZoomOut } from "lucide-react";
import type { ModelViewerElement } from "@google/model-viewer";
import keyframes from "@/content/onovo-door-keyframes.json";
import type { Language } from "@/lib/i18n";

const copy = {
  de: {
    eyebrow: "Interaktives 3D-Modell", title: "Onovo Kunstor in 3D",
    description: "Betrachten Sie das Gehäuse, die Batteriemodule und die Anschlüsse aus jeder Perspektive – auch bei geöffneter Tür.",
    loading: "3D-Modell wird geladen", ready: "Bereit zum Erkunden", progress: "Ladefortschritt des 3D-Modells",
    open: "Tür öffnen", close: "Tür schließen",
    left: "Links drehen", right: "Rechts drehen", zoomIn: "Hineinzoomen", zoomOut: "Herauszoomen",
    doorAngle: "Türöffnung", angleValue: (angle: number) => `${angle} Grad`, reset: "Ansicht zurücksetzen",
    hint: "Mit Maus oder einem Finger ziehen: drehen. Mausrad oder zwei Finger: zoomen.",
    keyboard: "Tastatur: Pfeiltasten drehen das Modell. Bild auf / Bild ab zoomen. Der Türregler lässt sich mit den Pfeiltasten bedienen.",
    reduced: "Reduzierte Bewegung aktiv: Tür und Kamera wechseln direkt.",
    alt: "Interaktives 3D-Modell des Onovo Kunstor mit fünf Batteriemodulen, Anschlüssen, Kühlgerät und beweglicher Fronttür",
    error: "Das 3D-Modell konnte nicht geladen werden. Prüfen Sie Ihre Verbindung und verwenden Sie einen Browser mit aktivierter 3D-Unterstützung.",
    animationError: "Die Türanimationen konnten nicht geladen werden. Bitte laden Sie das Modell erneut.",
    retry: "Erneut laden", announcements: "Meldungen zum 3D-Modell",
    directions: {
      left: "Ansicht von links", right: "Ansicht von rechts", front: "Ansicht von vorne", back: "Ansicht von hinten",
      "upper-left": "Ansicht von links oben", "upper-right": "Ansicht von rechts oben", "upper-front": "Ansicht von vorne oben", "upper-back": "Ansicht von hinten oben",
      "lower-left": "Ansicht von links unten", "lower-right": "Ansicht von rechts unten", "lower-front": "Ansicht von vorne unten", "lower-back": "Ansicht von hinten unten"
    }
  },
  en: {
    eyebrow: "Interactive 3D model", title: "Onovo Kunstor in 3D",
    description: "Explore the cabinet, battery modules and connections from every angle – including with the door open.",
    loading: "Loading 3D model", ready: "Ready to explore", progress: "3D model loading progress",
    open: "Open door", close: "Close door",
    left: "Rotate left", right: "Rotate right", zoomIn: "Zoom in", zoomOut: "Zoom out",
    doorAngle: "Door opening", angleValue: (angle: number) => `${angle} degrees`, reset: "Reset view",
    hint: "Drag with a mouse or one finger to rotate. Use the mouse wheel or two fingers to zoom.",
    keyboard: "Keyboard: arrow keys rotate the model. Page Up / Page Down zoom. Use the arrow keys to adjust the door slider.",
    reduced: "Reduced motion is enabled: the door and camera change instantly.",
    alt: "Interactive 3D model of the Onovo Kunstor with five battery modules, connections, cooling unit and movable front door",
    error: "The 3D model could not be loaded. Check your connection and use a browser with 3D support enabled.",
    animationError: "The door animations could not be loaded. Please reload the model.",
    retry: "Try again", announcements: "3D model announcements",
    directions: {
      left: "View from the left", right: "View from the right", front: "View from the front", back: "View from the back",
      "upper-left": "View from the upper left", "upper-right": "View from the upper right", "upper-front": "View from the upper front", "upper-back": "View from the upper back",
      "lower-left": "View from the lower left", "lower-right": "View from the lower right", "lower-front": "View from the lower front", "lower-back": "View from the lower back"
    }
  }
};

type Clip = keyof typeof keyframes;
const INITIAL_ORBIT = "34deg 77deg 145%";
const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribeToMotion(callback: () => void) {
  const query = window.matchMedia(motionQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

// Use the original GLB's keyframes so the degree slider matches its eased animation.
function interpolate(value: number, clip: Clip, input: 0 | 1) {
  const points = keyframes[clip];
  const output = input === 0 ? 1 : 0;
  for (let index = 1; index < points.length; index++) {
    const a = points[index - 1], b = points[index];
    if (value >= Math.min(a[input], b[input]) && value <= Math.max(a[input], b[input])) {
      const fraction = (value - a[input]) / (b[input] - a[input]);
      return a[output] + fraction * (b[output] - a[output]);
    }
  }
  return Math.abs(value - points[0][input]) < Math.abs(value - points.at(-1)![input]) ? points[0][output] : points.at(-1)![output];
}

export function OnovoModelViewer({ lang, src, standalone = false }: { lang: Language; src: string; standalone?: boolean }) {
  const t = copy[lang];
  const id = useId();
  const viewerRef = useRef<ModelViewerElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef(0);
  const operationRef = useRef(0);
  const angleRef = useRef(0);
  const playbackRef = useRef<{ target: number } | null>(null);
  const finishRef = useRef<(() => void) | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [progress, setProgress] = useState(0);
  const [angle, setAngle] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [animationError, setAnimationError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const reducedMotion = useSyncExternalStore(subscribeToMotion, () => window.matchMedia(motionQuery).matches, () => false);
  const ready = status === "ready";

  const updateAngle = useCallback((value: number) => {
    angleRef.current = value;
    setAngle(Math.round(value));
  }, []);

  const stopAnimation = useCallback(() => {
    operationRef.current++;
    cancelAnimationFrame(frameRef.current);
    playbackRef.current = null;
    viewerRef.current?.pause?.();
    setAnimating(false);
  }, []);

  const showAngle = useCallback(async (value: number) => {
    stopAnimation();
    const operation = operationRef.current;
    const viewer = viewerRef.current;
    if (!viewer?.loaded) return;
    updateAngle(value);
    viewer.animationName = "Door_Open";
    await viewer.updateComplete;
    if (operation !== operationRef.current) return;
    // A single, clamped playback keeps the endpoint at 115°, rather than wrapping to 0°.
    viewer.play({ repetitions: 1, pingpong: false });
    viewer.pause();
    viewer.currentTime = interpolate(value, "Door_Open", 1);
  }, [stopAnimation, updateAngle]);

  const animateDoor = useCallback(async (target: number) => {
    stopAnimation();
    const operation = operationRef.current;
    const viewer = viewerRef.current;
    if (!viewer?.loaded) return;
    const clip: Clip = target === 115 ? "Door_Open" : "Door_Close";
    viewer.animationName = clip;
    await viewer.updateComplete;
    if (operation !== operationRef.current) return;
    playbackRef.current = { target };
    setAnimating(true);
    viewer.play({ repetitions: 1, pingpong: false });
    viewer.currentTime = interpolate(angleRef.current, clip, 1);
    const sample = () => {
      if (operation !== operationRef.current || !playbackRef.current) return;
      updateAngle(interpolate(viewer.currentTime, clip, 0));
      // Also detect the clamped endpoint: a renderer can finish between animation-frame callbacks.
      if (viewer.currentTime >= keyframes[clip].at(-1)![0] - 0.0001) {
        finishRef.current?.();
        return;
      }
      frameRef.current = requestAnimationFrame(sample);
    };
    frameRef.current = requestAnimationFrame(sample);
  }, [stopAnimation, updateAngle]);

  useEffect(() => {
    const viewer = viewerRef.current;
    const section = sectionRef.current;
    if (!viewer || !section) return;
    let canceled = false;
    let loadTimeout: ReturnType<typeof setTimeout>;
    const fail = () => {
      if (canceled) return;
      clearTimeout(loadTimeout);
      stopAnimation();
      setStatus("error");
    };
    const loaded = async () => {
      if (canceled) return;
      clearTimeout(loadTimeout);
      if (!viewer.availableAnimations.includes("Door_Open") || !viewer.availableAnimations.includes("Door_Close")) {
        setAnimationError(true);
        fail();
        return;
      }
      await showAngle(0);
      if (canceled) return;
      setProgress(100);
      setStatus("ready");
    };
    const downloadProgress = (event: Event) => {
      const value = (event as CustomEvent<{ totalProgress: number }>).detail.totalProgress;
      setProgress(Math.min(99, Math.round(value * 100)));
    };
    const finished = () => {
      const playback = playbackRef.current;
      if (!playback) return;
      cancelAnimationFrame(frameRef.current);
      viewer.pause();
      playbackRef.current = null;
      updateAngle(playback.target);
      setAnimating(false);
    };
    finishRef.current = finished;
    const visibility = (event: Event) => {
      if (!(event as CustomEvent<{ visible: boolean }>).detail.visible) stopAnimation();
    };
    const load = async () => {
      observer.disconnect();
      setStatus("loading");
      setProgress(0);
      setAnimationError(false);
      try {
        await import("@google/model-viewer");
        if (canceled) return;
        viewer.a11y = { ...t.directions, "interaction-prompt": t.keyboard };
        viewer.animationCrossfadeDuration = 0;
        viewer.interpolationDecay = window.matchMedia(motionQuery).matches ? 0 : 70;
        // Our localized status is announced outside the renderer, including its load/error states.
        viewer.shadowRoot?.querySelector(".screen-reader-only")?.setAttribute("aria-hidden", "true");
        viewer.shadowRoot?.querySelector(".screen-reader-only")?.setAttribute("aria-label", t.announcements);
        viewer.addEventListener("load", loaded);
        viewer.addEventListener("progress", downloadProgress);
        viewer.addEventListener("error", fail);
        viewer.addEventListener("finished", finished);
        viewer.addEventListener("model-visibility", visibility);
        viewer.src = null;
        await viewer.updateComplete;
        if (canceled) return;
        loadTimeout = setTimeout(fail, 60_000);
        // Bypass a cached failed GLTF request when the user explicitly retries.
        viewer.src = attempt > 0 ? `${src}?retry=${attempt}` : src;
      } catch {
        fail();
      }
    };
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) void load();
    }, { rootMargin: "250px" });
    observer.observe(section);
    return () => {
      canceled = true;
      finishRef.current = null;
      observer.disconnect();
      clearTimeout(loadTimeout);
      stopAnimation();
      viewer.removeEventListener("load", loaded);
      viewer.removeEventListener("progress", downloadProgress);
      viewer.removeEventListener("error", fail);
      viewer.removeEventListener("finished", finished);
      viewer.removeEventListener("model-visibility", visibility);
    };
  }, [attempt, showAngle, src, stopAnimation, t, updateAngle]);

  useEffect(() => {
    if (customElements.get("model-viewer") && viewerRef.current) {
      viewerRef.current.interpolationDecay = reducedMotion ? 0 : 70;
      if (reducedMotion) viewerRef.current.jumpCameraToGoal();
    }
  }, [reducedMotion]);

  function rotate(direction: number) {
    const viewer = viewerRef.current;
    if (!viewer || !ready) return;
    const orbit = viewer.getCameraOrbit();
    viewer.cameraOrbit = `${orbit.theta + direction * Math.PI / 8}rad ${orbit.phi}rad ${orbit.radius}m`;
    if (reducedMotion) viewer.jumpCameraToGoal();
  }

  function zoom(direction: number) {
    const viewer = viewerRef.current;
    if (!viewer || !ready) return;
    const orbit = viewer.getCameraOrbit();
    const radius = orbit.radius * (direction > 0 ? 0.84 : 1 / 0.84);
    viewer.cameraOrbit = `${orbit.theta}rad ${orbit.phi}rad ${radius}m`;
    if (reducedMotion) viewer.jumpCameraToGoal();
  }

  const buttonClass = "flex min-h-[60px] min-w-0 flex-col items-center justify-center gap-1 rounded-xl border border-border bg-white px-2 py-2 text-xs font-semibold leading-snug text-foreground transition-colors hover:border-primary/50 hover:bg-primary/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-50 sm:flex-row sm:gap-2 sm:text-sm";

  return (
    <section id={lang === "de" ? "3d-modell" : "3d-model"} className={`container-wide w-full ${standalone ? "my-0" : "my-12 scroll-mt-28"}`} aria-labelledby={`${id}-title`} data-onovo-viewer ref={sectionRef}>
      <div className="min-w-0 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-secondary/60 via-white to-secondary/30 p-4 sm:p-6 lg:p-8">
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
          <div className="max-w-2xl">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary"><Box aria-hidden="true" className="h-4 w-4" />{t.eyebrow}</p>
            {createElement(standalone ? "h1" : "h2", { className: "mt-2 text-2xl font-bold text-foreground md:text-3xl", id: `${id}-title` }, t.title)}
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t.description}</p>
          </div>
          <p className="shrink-0 text-xs font-medium text-primary" role="status" aria-live="polite" data-model-status>
            {status === "ready" ? t.ready : status === "error" ? "" : `${t.loading}… ${progress}%`}
          </p>
        </div>
        <div className="relative h-[360px] w-full overflow-hidden rounded-2xl border border-border/60 bg-white sm:h-[440px] lg:h-[500px]" data-model-stage aria-busy={status === "loading"}>
          {createElement("model-viewer", {
            ref: viewerRef, alt: t.alt, "camera-controls": true, "camera-orbit": INITIAL_ORBIT,
            "min-camera-orbit": "auto 20deg 45%", "max-camera-orbit": "auto 160deg 300%",
            "field-of-view": "30deg", "disable-pan": true, "disable-tap": true,
            "touch-action": "none", "interaction-prompt": "none", "shadow-intensity": "0.5",
            exposure: "0.95", loading: "eager", "aria-describedby": `${id}-hint`,
            style: { display: "block", width: "100%", height: "100%", touchAction: "none", "--poster-color": "transparent" }
          }, createElement("div", { slot: "poster", "aria-hidden": true }), createElement("div", { slot: "progress-bar", "aria-hidden": true }))}
          {status !== "ready" ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white/90 px-5 text-center">
              {status === "error" ? <>
                <p className="max-w-md text-sm leading-relaxed text-destructive" role="alert">{animationError ? t.animationError : t.error}</p>
                <button type="button" className="min-h-11 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" onClick={() => setAttempt((value) => value + 1)}>{t.retry}</button>
              </> : <>
                <LoaderCircle aria-hidden="true" className="h-8 w-8 animate-spin text-primary motion-reduce:animate-none" />
                <p className="text-sm text-muted-foreground" aria-hidden="true">{t.loading}…</p>
                <progress aria-label={t.progress} max={100} value={progress} className="h-2 w-full max-w-xs accent-primary" />
              </>}
            </div>
          ) : null}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          <button type="button" className={`${buttonClass} !border-primary/30 !bg-primary/10 !text-primary`} disabled={!ready || animating} aria-busy={animating} onClick={() => {
            const target = angleRef.current > 55 ? 0 : 115;
            if (reducedMotion) void showAngle(target); else void animateDoor(target);
          }}><DoorOpen aria-hidden="true" className="h-4 w-4 shrink-0" />{angle > 55 ? t.close : t.open}</button>
          <button type="button" className={buttonClass} disabled={!ready} onClick={() => rotate(-1)}><RotateCcw aria-hidden="true" className="h-4 w-4 shrink-0" />{t.left}</button>
          <button type="button" className={buttonClass} disabled={!ready} onClick={() => rotate(1)}><RotateCw aria-hidden="true" className="h-4 w-4 shrink-0" />{t.right}</button>
          <button type="button" className={buttonClass} disabled={!ready} onClick={() => zoom(1)}><ZoomIn aria-hidden="true" className="h-4 w-4 shrink-0" />{t.zoomIn}</button>
          <button type="button" className={buttonClass} disabled={!ready} onClick={() => zoom(-1)}><ZoomOut aria-hidden="true" className="h-4 w-4 shrink-0" />{t.zoomOut}</button>
        </div>
        <div className="mt-5 rounded-xl border border-border/60 bg-white/70 px-4 py-3">
          <label htmlFor={`${id}-angle`} className="flex items-center justify-between gap-3 text-sm font-semibold text-foreground">
            {t.doorAngle}<output htmlFor={`${id}-angle`} className="tabular-nums text-primary" data-door-angle>{angle}°</output>
          </label>
          <input id={`${id}-angle`} aria-valuetext={t.angleValue(angle)} type="range" min={0} max={115} step={1} value={angle} disabled={!ready} onChange={(event) => void showAngle(Number(event.target.value))} className="mt-1 block h-11 w-full min-w-0 cursor-pointer accent-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-wait" />
          <div className="flex justify-between text-xs tabular-nums text-muted-foreground" aria-hidden="true"><span>0°</span><span>115°</span></div>
        </div>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-3xl text-xs leading-relaxed text-muted-foreground" id={`${id}-hint`}>
            <p>{t.hint}</p><p className="mt-1">{t.keyboard}</p>
            {reducedMotion ? <p className="mt-2 font-medium text-primary">{t.reduced}</p> : null}
          </div>
          <button type="button" disabled={!ready} onClick={() => {
            const viewer = viewerRef.current;
            if (!viewer) return;
            viewer.cameraOrbit = INITIAL_ORBIT;
            viewer.fieldOfView = "30deg";
            if (reducedMotion) viewer.jumpCameraToGoal();
          }} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg px-3 text-xs font-semibold text-primary hover:bg-primary/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-50"><RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />{t.reset}</button>
        </div>
      </div>
    </section>
  );
}

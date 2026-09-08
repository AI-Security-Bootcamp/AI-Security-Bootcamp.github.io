"use client";

import { useEffect, useRef, useState } from "react";
import type Hls from "hls.js";

const mediaRoot = "/video/aisb-hero-v5";
const playlist = `${mediaRoot}/master.m3u8`;
const fallback = `${mediaRoot}/fallback.mp4`;
const poster = "/images/london-sep-2026/workshop-1280.webp";

export function HeroFilm() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const intent = useRef(false);
  const start = useRef<() => Promise<void>>(async () => {});
  const [ready, setReady] = useState(false);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [mode, setMode] = useState("poster");

  useEffect(() => {
    const video = videoRef.current!;
    let disposed = false;
    let visible = true;
    let hls: Hls | null = null;
    let initialization: Promise<void> | null = null;
    let usingFallback = false;
    let changingSource = false;
    let mediaRecoveries = 0;
    let hasPlayed = false;

    // Preloading is independent of playback. Only a viewer's play action grants
    // permission to start; scrolling or returning to the tab never does.
    const play = async () => {
      if (disposed || !intent.current || document.hidden || !visible) return;
      try {
        await video.play();
        // A pause/navigation can happen while play() is still pending.
        if (disposed || !intent.current || document.hidden || !visible) video.pause();
      } catch {
        // If the browser declines playback, its normal controls remain usable.
        if (!disposed && !changingSource) setLoading(false);
      }
    };
    const switchToFallback = () => {
      if (disposed) return;
      if (usingFallback) {
        setError(true);
        setLoading(false);
        intent.current = false;
        video.pause();
        return;
      }
      const position = video.currentTime;
      changingSource = true;
      usingFallback = true;
      hls?.destroy();
      hls = null;
      setMode("mp4");
      video.src = fallback;
      video.addEventListener("loadedmetadata", () => {
        if (disposed) return;
        changingSource = false;
        if (position && position < video.duration) video.currentTime = position;
        void play();
      }, { once: true });
      video.load();
    };
    const load = async () => {
      const nativeHls = video.canPlayType("application/vnd.apple.mpegurl");
      const startNative = () => {
        setMode("native-hls");
        video.src = playlist;
      };
      if (nativeHls && navigator.vendor.includes("Apple")) { startNative(); return; }
      try {
        const { default: Player } = await import("hls.js");
        if (disposed) return;
        if (!Player.isSupported()) {
          if (nativeHls) startNative(); else switchToFallback();
          return;
        }
        hls = new Player({
          startLevel: 0,
          capLevelToPlayerSize: true,
          abrEwmaDefaultEstimate: 750_000,
          maxBufferLength: 12,
          maxMaxBufferLength: 18,
          maxBufferSize: 8 * 1024 * 1024,
          backBufferLength: 6,
          autoStartLoad: false,
        });
        setMode("hls-js");
        hls.on(Player.Events.MANIFEST_PARSED, () => {
          if (visible && !document.hidden) {
            hls?.startLoad();
            void play();
          }
        });
        hls.on(Player.Events.ERROR, (_event, data) => {
          if (!data.fatal) return;
          if (data.type === Player.ErrorTypes.MEDIA_ERROR && mediaRecoveries++ === 0) {
            hls?.recoverMediaError();
          } else switchToFallback();
        });
        hls.loadSource(playlist);
        hls.attachMedia(video);
      } catch { switchToFallback(); }
    };
    start.current = async () => {
      if (!initialization) initialization = load();
      await initialization;
      if (disposed || !intent.current || document.hidden || !visible) return;
      hls?.startLoad(-1);
      await play();
    };
    const suspend = () => {
      intent.current = false;
      video.pause();
      hls?.stopLoad();
      setLoading(false);
    };
    const visibility = () => {
      if (document.hidden || !visible) suspend();
      else if (!hasPlayed) hls?.startLoad();
    };
    const onPlay = () => {
      if (document.hidden || !visible) { suspend(); return; }
      hasPlayed = true;
      intent.current = true;
      hls?.startLoad(-1);
    };
    const onPause = () => {
      if (changingSource) return;
      intent.current = false;
      hls?.stopLoad();
      setLoading(false);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      visibility();
    }, { threshold: 0.15 });
    observer.observe(video);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("error", switchToFallback);
    document.addEventListener("visibilitychange", visibility);
    // Buffer the opening in advance, using the same bounded adaptive loader.
    // play() remains guarded by explicit intent, including native/MP4 fallback.
    initialization = load();
    setReady(true);
    return () => {
      disposed = true;
      intent.current = false;
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("error", switchToFallback);
      hls?.destroy();
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, []);

  const startFilm = () => {
    setStarted(true);
    setLoading(true);
    intent.current = true;
    videoRef.current?.focus();
    void start.current();
  };

  return (
    <figure className="w-full min-w-0" aria-label="A week at AISB — participant film">
      <div className="relative overflow-hidden border-2 border-black bg-black dark:border-white">
        <video
          ref={videoRef}
          data-testid="hero-film"
          data-playback={mode}
          width={1920}
          height={1080}
          poster={poster}
          playsInline
          controls={started}
          preload="auto"
          tabIndex={started ? 0 : -1}
          aria-label="A week at AISB: participants describe their experience. English captions are included in the picture."
          aria-describedby="hero-film-description"
          className="block aspect-video w-full object-contain"
          onLoadedData={() => { setLoading(false); setError(false); }}
          onPlaying={() => setLoading(false)}
          onEnded={() => { intent.current = false; }}
        />
        {!started && (
          <button
            type="button"
            disabled={!ready}
            onClick={startFilm}
            aria-label="Watch A week at AISB with sound"
            className="group absolute inset-0 cursor-pointer overflow-hidden text-left text-white disabled:cursor-wait focus-visible:outline focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-[#ef4444]"
            data-testid="hero-film-poster"
          >
            <img
              src={poster}
              alt=""
              width={1280}
              height={853}
              fetchPriority="high"
              className="absolute inset-0 h-full w-full object-cover object-[50%_55%]"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <span
              data-testid="hero-film-play-icon"
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center border-2 border-black bg-[#ef4444] group-hover:bg-red-600 group-focus-visible:bg-red-600 min-[400px]:h-16 min-[400px]:w-16"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 min-[400px]:h-8 min-[400px]:w-8" focusable="false">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <span className="absolute bottom-4 left-4 text-[26px] font-black leading-[0.95] tracking-tight min-[400px]:bottom-6 min-[400px]:left-6 min-[400px]:text-[34px]" aria-hidden="true">
              A week<br />at AISB
            </span>
          </button>
        )}
        {loading && !error && (
          <span className="pointer-events-none absolute inset-0 grid place-items-center bg-black/30 text-sm text-white" role="status">Loading film…</span>
        )}
      </div>
      <figcaption id="hero-film-description" className="sr-only">Participant stories from AISB in London. English captions are included in the film.</figcaption>
      {error && <p className="mt-2 text-sm" role="status">The video couldn’t load. <a className="underline" href={fallback}>Open the MP4</a>.</p>}
      <noscript><a href={fallback} className="text-sm underline">Watch the film</a></noscript>
    </figure>
  );
}

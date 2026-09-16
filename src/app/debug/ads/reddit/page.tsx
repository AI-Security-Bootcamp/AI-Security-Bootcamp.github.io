"use client";

import { useEffect, useRef, useState } from "react";
import { RedditCreative, REDDIT_FORMATS, type RedditFormat } from "./_creative";

// Reddit ad images for AISB Vegas.
// Each creative renders at exact pixel size; the gallery scales them to fit.
// To export a clean PNG: open DevTools, right-click the highlighted node
// (e.g. #reddit-landscape) → "Capture node screenshot".

// ============================================================================
// Reddit feed post mock - gives the creative context the way it'll appear in
// a promoted post. Approximates Reddit's card at ~540px wide.
// ============================================================================

const REDDIT_FONT =
  '"IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

function IconUpvote() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}
function IconDownvote() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 5v14M19 12l-7 7-7-7" />
    </svg>
  );
}
function IconComment() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
    </svg>
  );
}
function IconShare() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />
    </svg>
  );
}

function RedditPreview({ dark }: { dark: boolean }) {
  const CARD_W = 540;
  const fmt = REDDIT_FORMATS.find((f) => f.id === "landscape")!;
  const scale = CARD_W / fmt.w;

  const c = dark
    ? { card: "#1a1a1b", border: "#343536", text: "#d7dadc", muted: "#818384", chip: "#272729" }
    : { card: "#ffffff", border: "#ccc", text: "#1c1c1c", muted: "#787c7e", chip: "#f6f7f8" };

  return (
    <div
      style={{
        fontFamily: REDDIT_FONT,
        width: CARD_W,
        maxWidth: "100%",
        background: c.card,
        border: `1px solid ${c.border}`,
        borderRadius: 8,
        overflow: "hidden",
        color: c.text,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px 6px" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/aisb-icon-circle-light.svg"
          alt="AISB"
          width={24}
          height={24}
          style={{ width: 24, height: 24, borderRadius: "50%", background: "#fff", flexShrink: 0 }}
        />
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
          <span style={{ fontSize: 12, fontWeight: 700 }}>Promoted by AI Security Bootcamp</span>
          <span style={{ fontSize: 12, color: c.muted }}>Promoted &middot; aisb.dev</span>
        </div>
      </div>

      {/* Title */}
      <div style={{ padding: "2px 12px 10px" }}>
        <p style={{ margin: 0, fontSize: 17, fontWeight: 600, lineHeight: 1.3 }}>
          Fully funded, 7-day AI security bootcamp in Las Vegas - for senior security pros. Apply by June 21.
        </p>
      </div>

      {/* Creative */}
      <div style={{ width: CARD_W, height: fmt.h * scale, overflow: "hidden", background: "#000" }}>
        <div style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}>
          <RedditCreative format="landscape" dark={dark} />
        </div>
      </div>

      {/* CTA bar */}
      <a
        href="https://aisb.dev/vegas26"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 12px",
          background: c.chip,
          borderTop: `1px solid ${c.border}`,
          textDecoration: "none",
          color: c.text,
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        <span>aisb.dev/vegas26</span>
        <span style={{ color: "#fff", background: "#ef4444", borderRadius: 999, padding: "6px 14px", fontSize: 12 }}>
          Apply Now
        </span>
      </a>

      {/* Action row */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", color: c.muted, fontSize: 12, fontWeight: 700 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: c.chip, borderRadius: 999, padding: "4px 8px" }}>
          <IconUpvote /> 412 <IconDownvote />
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: c.chip, borderRadius: 999, padding: "4px 10px" }}>
          <IconComment /> 38
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: c.chip, borderRadius: 999, padding: "4px 10px" }}>
          <IconShare /> Share
        </span>
      </div>
    </div>
  );
}

// ============================================================================
// Gallery card - one creative, scaled to fit, with its screenshot target id.
// ============================================================================

function CreativeCard({ format, dark }: { format: RedditFormat; dark: boolean }) {
  const spec = REDDIT_FORMATS.find((f) => f.id === format)!;
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.4);

  useEffect(() => {
    const compute = () => {
      const cw = containerRef.current?.clientWidth ?? spec.w;
      setScale(Math.min(1, cw / spec.w));
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [spec.w]);

  const domId = `reddit-${format}`;

  return (
    <div className="border-2 border-black dark:border-white">
      <div className="flex items-center justify-between border-b-2 border-black dark:border-white px-4 py-3">
        <div>
          <p className="text-[#ef4444] font-black text-xs uppercase tracking-widest">{spec.label}</p>
          <p className="text-neutral-500 dark:text-neutral-400 text-xs mt-0.5">
            {spec.w}&times;{spec.h} &middot; {spec.note}
          </p>
        </div>
        <code className="text-[11px] text-neutral-400 dark:text-neutral-500">#{domId}</code>
      </div>
      <div
        ref={containerRef}
        className="bg-neutral-100 dark:bg-neutral-900 p-4"
        style={{ overflow: "hidden" }}
      >
        <div style={{ width: "100%", height: spec.h * scale, overflow: "hidden" }}>
          <div style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: spec.w }}>
            <RedditCreative id={domId} format={format} dark={dark} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Page
// ============================================================================

export default function RedditAdsPage() {
  const [dark, setDark] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50 text-black p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-widest text-neutral-500 font-bold mb-1">Debug · Ads</p>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">Reddit Ads</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDark((d) => !d)}
              className="border-2 border-black px-3 py-1.5 text-sm font-bold hover:bg-black hover:text-white transition-colors"
            >
              {dark ? "Light" : "Dark"} creative
            </button>
            <a href="/" className="text-xs uppercase tracking-widest text-neutral-500 font-bold hover:text-[#ef4444]">
              ← Home
            </a>
          </div>
        </div>

        <p className="text-neutral-500 mb-8 max-w-2xl leading-relaxed">
          Promoted-post creatives for AISB Vegas in Reddit&apos;s ad sizes, styled to match the
          site (monospace, AISB red, heavy rules). To export a full-resolution PNG: open DevTools,
          right-click the creative node (e.g. <code className="bg-neutral-200 px-1">#reddit-landscape</code>) →{" "}
          <em>Capture node screenshot</em>.
        </p>

        <div className="grid gap-8 lg:grid-cols-[1fr_560px] items-start">
          {/* Creatives */}
          <div className="flex flex-col gap-6 order-2 lg:order-1">
            {REDDIT_FORMATS.map((f) => (
              <CreativeCard key={f.id} format={f.id} dark={dark} />
            ))}
          </div>

          {/* Reddit feed preview */}
          <div className="order-1 lg:order-2 lg:sticky lg:top-6 flex flex-col gap-3">
            <p className="text-xs uppercase tracking-widest text-neutral-500 font-bold">In-feed preview</p>
            <RedditPreview dark={dark} />
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Approximation of a promoted post (~540px). Reddit recommends 1200&times;628 for the feed
              image/link ad; the square and vertical creatives cover other placements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Shared Reddit ad creatives for AISB Vegas.
// Imported by /debug/ads/reddit (gallery + screenshot targets) and embedded
// inside the Reddit post preview on that page.
//
// Each creative renders at its exact pixel size in its own coordinate space.
// Wrap with a scale transform on the consumer side to display it smaller.
//
// Style mirrors the live site: monospace type (the site's font-sans is remapped
// to a monospace stack in tailwind.config.js), AISB red #ef4444 accent, heavy
// black/white rules, font-black uppercase headings.

import React from "react";

const RED = "#ef4444";

// Site signature monospace stack - matches the tailwind `font-sans` remap.
const MONO =
  "'SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace";

export type RedditFormat = "landscape" | "square" | "vertical";

// Reddit ad creative specs. Landscape 1.91:1 is the recommended feed image/link
// ad; square 1:1 and vertical 4:5 cover the other feed placements.
export const REDDIT_FORMATS: {
  id: RedditFormat;
  label: string;
  w: number;
  h: number;
  note: string;
}[] = [
  { id: "landscape", label: "Landscape · 1.91:1", w: 1200, h: 628, note: "Recommended feed image / link ad" },
  { id: "square", label: "Square · 1:1", w: 1080, h: 1080, note: "Square feed placement" },
  { id: "vertical", label: "Vertical · 4:5", w: 1080, h: 1350, note: "Tall mobile feed placement" },
];

type Palette = { bg: string; text: string; muted: string; rule: string };

function palette(dark: boolean): Palette {
  return dark
    ? { bg: "#000", text: "#fff", muted: "#a3a3a3", rule: "#fff" }
    : { bg: "#fff", text: "#000", muted: "#525252", rule: "#000" };
}

// ============================================================================
// Vertical layout - used by the square (1080×1080) and vertical (1080×1350)
// formats. Both are 1080px wide; the extra height in the 4:5 flows into the
// flex spacer so the type scale stays identical between the two.
// ============================================================================

function VerticalCreative({ w, h, dark }: { w: number; h: number; dark: boolean }) {
  const p = palette(dark);
  // The 4:5 has ~270px more height than the square; spend it on a larger
  // headline plus a supporting subhead (echoing the site hero) so the extra
  // space reads as an intentional poster rather than a void.
  const tall = h >= 1300;
  return (
    <div
      style={{
        width: w,
        height: h,
        background: p.bg,
        color: p.text,
        fontFamily: MONO,
        display: "flex",
        flexDirection: "column",
        padding: 76,
        boxSizing: "border-box",
        border: `12px solid ${p.rule}`,
      }}
    >
      {/* Eyebrow */}
      <p
        style={{
          color: RED,
          fontSize: 30,
          fontWeight: 900,
          textTransform: "uppercase",
          letterSpacing: "0.18em",
          margin: 0,
        }}
      >
        Applications Open
      </p>

      {/* Headline */}
      <h1
        style={{
          fontSize: tall ? 168 : 150,
          fontWeight: 900,
          lineHeight: 0.95,
          letterSpacing: "-0.025em",
          margin: 0,
          marginTop: 28,
        }}
      >
        AI Security
        <br />
        Bootcamp
        <br />
        <span style={{ color: RED }}>Vegas</span>
      </h1>

      {/* Subhead - only the taller 4:5 has room for it */}
      {tall && (
        <p
          style={{
            fontSize: 30,
            fontWeight: 500,
            color: p.muted,
            lineHeight: 1.4,
            margin: 0,
            marginTop: 30,
            maxWidth: 760,
          }}
        >
          A 7-day intensive for security professionals securing frontier AI systems.
        </p>
      )}

      {/* Curriculum themes */}
      <p
        style={{
          fontSize: 23,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          margin: 0,
          marginTop: 34,
          whiteSpace: "nowrap",
        }}
      >
        Adversarial ML<span style={{ color: RED, margin: "0 10px" }}>|</span>
        LLM Security<span style={{ color: RED, margin: "0 10px" }}>|</span>
        Infrastructure
      </p>

      {/* Spacer absorbs the extra height in the 4:5 format */}
      <div style={{ flex: 1, minHeight: 36 }} />

      {/* Info block */}
      <div style={{ borderTop: `4px solid ${p.rule}`, paddingTop: 28 }}>
        <p
          style={{
            fontSize: 40,
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          Aug 2-8, 2026
          <span style={{ color: RED, margin: "0 14px" }}>&middot;</span>
          Las Vegas
        </p>
        <p
          style={{
            fontSize: 22,
            color: p.muted,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            margin: 0,
            marginTop: 12,
            whiteSpace: "nowrap",
          }}
        >
          7-Day Intensive
          <span style={{ color: RED, margin: "0 8px" }}>&middot;</span>
          Fully Funded
          <span style={{ color: RED, margin: "0 8px" }}>&middot;</span>
          For Security Pros
        </p>
      </div>

      {/* CTA block */}
      <div
        style={{
          borderTop: `4px solid ${p.rule}`,
          marginTop: 28,
          paddingTop: 26,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: 32,
        }}
      >
        <div>
          <p
            style={{
              fontSize: 22,
              color: p.muted,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              margin: 0,
            }}
          >
            Apply by
          </p>
          <p style={{ fontSize: 50, fontWeight: 900, margin: 0, marginTop: 8, letterSpacing: "-0.02em" }}>
            June 21, 2026
          </p>
        </div>
        <p style={{ fontSize: 36, fontWeight: 900, margin: 0, textAlign: "right", letterSpacing: "-0.02em" }}>
          aisb.dev/<span style={{ color: RED }}>vegas26</span>
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// Landscape layout - 1200×628 (1.91:1). Two columns: headline on the left,
// dates / deadline / URL in a ruled panel on the right.
// ============================================================================

function LandscapeCreative({ w, h, dark }: { w: number; h: number; dark: boolean }) {
  const p = palette(dark);
  return (
    <div
      style={{
        width: w,
        height: h,
        background: p.bg,
        color: p.text,
        fontFamily: MONO,
        display: "flex",
        padding: 48,
        gap: 44,
        boxSizing: "border-box",
        border: `10px solid ${p.rule}`,
      }}
    >
      {/* Left - headline */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <p
          style={{
            color: RED,
            fontSize: 22,
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            margin: 0,
          }}
        >
          Applications Open
        </p>
        <h1
          style={{
            fontSize: 78,
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: "-0.025em",
            margin: 0,
            marginTop: 20,
          }}
        >
          AI Security
          <br />
          Bootcamp
          <br />
          <span style={{ color: RED }}>Vegas</span>
        </h1>
        <p
          style={{
            fontSize: 17,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            margin: 0,
            marginTop: "auto",
            color: p.muted,
            whiteSpace: "nowrap",
          }}
        >
          Adversarial ML<span style={{ color: RED, margin: "0 8px" }}>|</span>
          LLM Security<span style={{ color: RED, margin: "0 8px" }}>|</span>
          Infra
        </p>
      </div>

      {/* Right - info panel */}
      <div
        style={{
          width: 372,
          flexShrink: 0,
          borderLeft: `4px solid ${p.rule}`,
          paddingLeft: 40,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <p
            style={{
              fontSize: 36,
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "0.02em",
              margin: 0,
              lineHeight: 1.05,
            }}
          >
            Aug 2-8
            <br />
            2026
          </p>
          <p
            style={{
              fontSize: 19,
              color: p.muted,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              margin: 0,
              marginTop: 14,
              lineHeight: 1.5,
            }}
          >
            Las Vegas
            <br />
            7-Day &middot; Fully Funded
          </p>
        </div>

        <div style={{ borderTop: `4px solid ${p.rule}`, paddingTop: 18 }}>
          <p
            style={{
              fontSize: 16,
              color: p.muted,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              margin: 0,
            }}
          >
            Apply by June 21
          </p>
          <p style={{ fontSize: 30, fontWeight: 900, margin: 0, marginTop: 8, letterSpacing: "-0.02em" }}>
            aisb.dev/<span style={{ color: RED }}>vegas26</span>
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Public component
// ============================================================================

export function RedditCreative({
  format,
  dark = false,
  id,
}: {
  format: RedditFormat;
  dark?: boolean;
  id?: string;
}) {
  const spec = REDDIT_FORMATS.find((f) => f.id === format) ?? REDDIT_FORMATS[0];
  const inner =
    format === "landscape" ? (
      <LandscapeCreative w={spec.w} h={spec.h} dark={dark} />
    ) : (
      <VerticalCreative w={spec.w} h={spec.h} dark={dark} />
    );
  // id wrapper kept at exact pixel size so "Capture node screenshot" exports clean.
  return <div id={id}>{inner}</div>;
}

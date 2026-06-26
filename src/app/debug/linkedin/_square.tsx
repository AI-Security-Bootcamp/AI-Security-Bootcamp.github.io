// Shared LinkedIn post image square (1080 × 1080).
// Imported by /debug/linkedin/image (preview + screenshot target)
// and by /debug/linkedin (embedded inside the post preview).
//
// The square always renders at 1080 × 1080 in its own coordinate space.
// Wrap with a scale transform on the consumer side if you need it smaller.

import React from "react";

const COLOR = "#ef4444";
const FONT =
  'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

export type LinkedinSquareProps = {
  dark?: boolean;
  id?: string;
};

export function LinkedinSquare({ dark = false, id }: LinkedinSquareProps) {
  const palette = dark
    ? { bg: "#000", text: "#fff", muted: "#a3a3a3", rule: "#fff" }
    : { bg: "#fff", text: "#000", muted: "#525252", rule: "#000" };

  return (
    <div
      id={id}
      style={{
        width: 1080,
        height: 1080,
        background: palette.bg,
        color: palette.text,
        fontFamily: FONT,
        display: "flex",
        flexDirection: "column",
        padding: 80,
        boxSizing: "border-box",
        border: `12px solid ${palette.rule}`,
      }}
    >
      {/* Eyebrow */}
      <p
        style={{
          color: COLOR,
          fontSize: 32,
          fontWeight: 900,
          textTransform: "uppercase",
          letterSpacing: "0.18em",
          margin: 0,
        }}
      >
        Applications Now Open
      </p>

      {/* Title block */}
      <h1
        style={{
          fontSize: 168,
          fontWeight: 900,
          lineHeight: 0.92,
          letterSpacing: "-0.035em",
          margin: 0,
          marginTop: 28,
        }}
      >
        AI Security
        <br />
        Bootcamp
        <br />
        <span style={{ color: COLOR }}>London</span>
      </h1>

      {/* Curriculum themes tagline */}
      <p
        style={{
          fontSize: 23.5,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          margin: 0,
          marginTop: 32,
          whiteSpace: "nowrap",
        }}
      >
        Adversarial ML<span style={{ color: COLOR, margin: "0 10px" }}>|</span>
        LLM Security<span style={{ color: COLOR, margin: "0 10px" }}>|</span>
        Infrastructure &amp; Governance
      </p>

      {/* Spacer */}
      <div style={{ flex: 1, minHeight: 28 }} />

      {/* Info block (dates + format) */}
      <div
        style={{
          borderTop: `4px solid ${palette.rule}`,
          paddingTop: 26,
        }}
      >
        <p
          style={{
            fontSize: 40,
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          Aug 30 &ndash; Sep 5, 2026
          <span style={{ color: COLOR, margin: "0 14px" }}>·</span>
          London
        </p>
        <p
          style={{
            fontSize: 22,
            color: palette.muted,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            margin: 0,
            marginTop: 10,
            whiteSpace: "nowrap",
          }}
        >
          7-Day Intensive
          <span style={{ color: COLOR, margin: "0 6px" }}>·</span>
          Fully Funded
          <span style={{ color: COLOR, margin: "0 6px" }}>·</span>
          20 Senior Security Professionals
        </p>
      </div>

      {/* CTA block */}
      <div
        style={{
          borderTop: `4px solid ${palette.rule}`,
          marginTop: 26,
          paddingTop: 24,
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
              color: palette.muted,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              margin: 0,
            }}
          >
            Apply by
          </p>
          <p
            style={{
              fontSize: 48,
              fontWeight: 900,
              margin: 0,
              marginTop: 6,
              letterSpacing: "-0.01em",
            }}
          >
            July 15, 2026
          </p>
        </div>
        <p
          style={{
            fontSize: 36,
            fontWeight: 900,
            margin: 0,
            textAlign: "right",
            letterSpacing: "-0.01em",
          }}
        >
          aisb.dev/<span style={{ color: COLOR }}>london26</span>
        </p>
      </div>
    </div>
  );
}

/**
 * LinkedinSquareScaled — wraps LinkedinSquare with a CSS scale transform so
 * it renders at a smaller display size (e.g. as a thumbnail). The inner
 * element keeps its 1080 × 1080 coordinate space so screenshotting / DOM
 * measurement still work.
 */
export function LinkedinSquareScaled({
  dark = false,
  width,
  id,
}: {
  dark?: boolean;
  width: number;
  id?: string;
}) {
  const scale = width / 1080;
  return (
    <div
      style={{
        width,
        height: width,
        overflow: "hidden",
      }}
    >
      <div style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}>
        <LinkedinSquare dark={dark} id={id} />
      </div>
    </div>
  );
}

// Shared LinkedIn post image square (1080 × 1080).
// Imported by /debug/linkedin/image (preview + screenshot target)
// and by /debug/linkedin (embedded inside the post preview).
//
// The square always renders at 1080 × 1080 in its own coordinate space.
// Wrap with a scale transform on the consumer side if you need it smaller.

import React from "react";
import {
  defaultLinkedinImageCohort,
  formatCohortDateRange,
  type LinkedinImageCohort,
} from "../../../lib/cohorts";

const COLOR = "#ef4444";
const FONT =
  'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

export type LinkedinSquareProps = {
  dark?: boolean;
  id?: string;
  cohort?: LinkedinImageCohort;
};

export function LinkedinSquare({
  dark = false,
  id,
  cohort = defaultLinkedinImageCohort,
}: LinkedinSquareProps) {
  const image = cohort.linkedinImage;
  const callToActionPath = image.callToActionPath ?? cohort.href;
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
        paddingLeft: 56,
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
        {image.eyebrow}
      </p>

      {/* Title block */}
      <h1
        style={{
          fontSize: 144,
          fontWeight: 900,
          lineHeight: 0.92,
          letterSpacing: "-0.025em",
          margin: 0,
          marginTop: 44,
        }}
      >
        AI Security
        <br />
        Bootcamp
        <br />
        <span style={{ color: COLOR, whiteSpace: "nowrap" }}>{cohort.location}</span>
      </h1>

      {/* Spacer */}
      <div style={{ flex: 1, minHeight: 28 }} />

      {/* Curriculum themes tagline */}
      <p
        style={{
          fontSize: 23.5,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          margin: 0,
          marginTop: 16,
          marginBottom: 24,
          whiteSpace: "nowrap",
        }}
      >
        {image.curriculumThemes.map((theme, index) => (
          <React.Fragment key={theme}>
            {index > 0 && <span style={{ color: COLOR, margin: "0 10px" }}>|</span>}
            {theme}
          </React.Fragment>
        ))}
      </p>

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
          {formatCohortDateRange(cohort)}
          <span style={{ color: COLOR, margin: "0 14px" }}>·</span>
          {cohort.location}
        </p>
        <p
          style={{
            fontSize: 20,
            color: palette.muted,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            margin: 0,
            marginTop: 10,
            whiteSpace: "nowrap",
          }}
        >
          {image.format}
          <span style={{ color: COLOR, margin: "0 6px" }}>·</span>
          {image.funding}
          <span style={{ color: COLOR, margin: "0 6px" }}>·</span>
          {image.audience}
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
            {image.applicationDeadline}
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
          aisb.dev<span style={{ color: COLOR }}>{callToActionPath}</span>
        </p>
      </div>
    </div>
  );
}

/**
 * LinkedinSquareScaled - wraps LinkedinSquare with a CSS scale transform so
 * it renders at a smaller display size (e.g. as a thumbnail). The inner
 * element keeps its 1080 × 1080 coordinate space so screenshotting / DOM
 * measurement still work.
 */
export function LinkedinSquareScaled({
  dark = false,
  width,
  id,
  cohort,
}: {
  dark?: boolean;
  width: number;
  id?: string;
  cohort?: LinkedinImageCohort;
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
        <LinkedinSquare dark={dark} id={id} cohort={cohort} />
      </div>
    </div>
  );
}

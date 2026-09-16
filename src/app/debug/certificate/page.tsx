"use client";
// AI Security Bootcamp - completion certificate (A4 landscape)

import { useState } from "react";

// ============================================================================
// Horizontal A4 certificate of completion for AI Security Bootcamp.
//
// A4 landscape = 297mm × 210mm. The certificate below is laid out at exactly
// those dimensions so it prints 1:1 (File → Print → A4, Landscape, margins
// "None"/"Default", background graphics ON). On screen it's scaled to fit the
// viewport via a CSS transform.
//
// The four variable fields (name, signature block, issue date, certificate
// UUID) can be filled with sample data for preview, OR swapped for Certifier
// merge tags so the design can be reproduced 1:1 inside Certifier's editor.
// ============================================================================

const RED = "#ef4444";
const INK = "#141414";
const MUTED = "#8a8a8a";

// Space Grotesk is the AISB wordmark typeface - use it for display type.
// Monospace is reserved for technical metadata (labels, date, UUID).
const DISPLAY = "'Space Grotesk', 'Helvetica Neue', Arial, sans-serif";
const MONO = "'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace";

// Certifier dynamic attributes (https://certifier.io). Adjust the credential
// id tag to match your group's attribute name if you've customised it.
const MERGE = {
  name: "{{recipient.name}}",
  date: "{{credential.issueDate}}",
  uuid: "{{credential.id}}",
};

const SAMPLE = {
  name: "Ada Lovelace",
  date: "",
  uuid: "",
};

type Mode = "sample" | "merge";

export default function CertificatePage() {
  const [mode, setMode] = useState<Mode>("sample");
  const [name, setName] = useState(SAMPLE.name);
  const [date, setDate] = useState(SAMPLE.date);
  const [uuid, setUuid] = useState(SAMPLE.uuid);

  const fields = mode === "merge" ? MERGE : { name, date, uuid };

  return (
    <div className="min-h-screen bg-neutral-100 text-black font-sans">
      {/* Space Grotesk - matches the AISB wordmark */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap"
      />
      {/* ===== print rules ===== */}
      <style>{`
        @page { size: A4 landscape; margin: 0; }
        @media print {
          .no-print { display: none !important; }
          .cert-scale { transform: none !important; }
          .cert-stage { padding: 0 !important; height: auto !important; overflow: visible !important; }
          html, body { background: #fff !important; }
        }
      `}</style>

      {/* ===== controls (screen only) ===== */}
      <div className="no-print border-b-2 border-black bg-white">
        <div className="max-w-6xl mx-auto px-6 py-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs uppercase tracking-widest text-neutral-500 font-bold mb-1">Debug</p>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight">Completion Certificate · A4 Landscape</h1>
            </div>
            <a href="/" className="text-xs uppercase tracking-widest text-neutral-500 font-bold hover:text-[#ef4444]">
              ← Home
            </a>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[auto,1fr,auto] lg:items-end">
            {/* mode toggle */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-2">Field values</p>
              <div className="inline-flex border-2 border-black text-xs font-bold uppercase tracking-widest">
                {(["sample", "merge"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={
                      "px-4 py-2 transition-colors " +
                      (mode === m ? "bg-black text-white" : "bg-white text-black hover:bg-neutral-100")
                    }
                  >
                    {m === "sample" ? "Sample data" : "Certifier merge tags"}
                  </button>
                ))}
              </div>
            </div>

            {/* sample-data inputs */}
            <div
              className={
                "grid gap-3 sm:grid-cols-3 transition-opacity " +
                (mode === "merge" ? "opacity-40 pointer-events-none" : "")
              }
            >
              <Field label="Participant name" value={name} onChange={setName} />
              <Field label="Issue date" value={date} onChange={setDate} />
              <Field label="Certificate UUID" value={uuid} onChange={setUuid} mono />
            </div>

            {/* print */}
            <button
              onClick={() => window.print()}
              className="bg-[#ef4444] text-white font-black text-xs uppercase tracking-widest px-6 py-3 hover:bg-red-600 transition-colors h-min"
            >
              Print / Save PDF
            </button>
          </div>

          <p className="text-[11px] text-neutral-500 leading-relaxed mt-4 max-w-3xl">
            {mode === "merge" ? (
              <>
                Showing Certifier merge tags. Recreate this layout in Certifier&apos;s designer and drop in these
                attributes: <code className="bg-neutral-100 px-1">{MERGE.name}</code>,{" "}
                <code className="bg-neutral-100 px-1">{MERGE.date}</code>,{" "}
                <code className="bg-neutral-100 px-1">{MERGE.uuid}</code>. Adjust the tag names if your group uses
                custom attributes.
              </>
            ) : (
              <>Fill the fields above to preview. Print to A4, landscape, margins “None”, and enable “Background graphics”.</>
            )}
          </p>
        </div>
      </div>

      {/* ===== certificate stage ===== */}
      <div className="cert-stage overflow-auto p-6 md:p-10" style={{ display: "flex", justifyContent: "center" }}>
        {/* scale wrapper: A4 landscape is 1122.5px wide at 96dpi; scale down to fit */}
        <div
          className="cert-scale"
          style={{
            transform: "scale(var(--cert-fit, 1))",
            transformOrigin: "top center",
          }}
          ref={(el) => {
            if (!el) return;
            // fit width to its parent on screen
            const parent = el.parentElement;
            if (!parent) return;
            const a4w = 1122.5; // 297mm @ 96dpi
            const avail = parent.clientWidth;
            const fit = Math.min(1, avail / a4w);
            el.style.setProperty("--cert-fit", String(fit));
          }}
        >
          <Certificate name={fields.name} date={fields.date} uuid={fields.uuid} />
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  mono,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  mono?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={
          "mt-1 w-full border-2 border-black px-3 py-2 text-sm focus:outline-none focus:border-[#ef4444] " +
          (mono ? "font-sans" : "")
        }
        spellCheck={false}
      />
    </label>
  );
}

// ============================================================================
// The certificate itself - exactly 297mm × 210mm.
// ============================================================================

function Certificate({ name, date, uuid }: { name: string; date: string; uuid: string }) {
  return (
    <div
      style={{
        width: "297mm",
        height: "210mm",
        background: "#ffffff",
        color: INK,
        position: "relative",
        boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
        overflow: "hidden",
        fontFamily: DISPLAY,
      }}
    >
      {/* full-bleed red spine, left edge */}
      <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "5mm", background: RED }} />

      {/* single restrained keyline frame */}
      <div
        style={{
          position: "absolute",
          inset: "12mm",
          left: "16mm",
          border: `0.4mm solid ${INK}`,
        }}
      />

      {/* content */}
      <div
        style={{
          position: "absolute",
          inset: "12mm",
          left: "16mm",
          padding: "14mm 26mm",
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        {/* ---- header: brand lockup, centred ---- */}
        <div
          style={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "5.5mm",
            textAlign: "left",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/aisb-logo-on-light.svg"
            alt="AISB"
            style={{ height: "26mm", width: "auto", display: "block", marginRight: "-3mm" }}
          />
          <span style={{ width: "0.3mm", height: "12mm", background: "#e2e2e2", flexShrink: 0 }} />
          <span
            style={{
              fontFamily: DISPLAY,
              fontWeight: 600,
              fontSize: "8.5mm",
              letterSpacing: "-0.015em",
              color: INK,
            }}
          >
            AI Security Bootcamp
          </span>
        </div>

        {/* ---- middle: centre block + signatures, centred together ---- */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {/* centre block: title, name, citation */}
        <div style={{ flexShrink: 0 }}>
          <p
            style={{
              fontFamily: DISPLAY,
              fontSize: "7.2mm",
              fontWeight: 600,
              letterSpacing: "0.09em",
              textTransform: "uppercase",
              color: INK,
            }}
          >
            Certificate of Completion
          </p>
          <p
            style={{
              marginTop: "3mm",
              fontFamily: MONO,
              fontSize: "4mm",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: MUTED,
            }}
          >
            awarded to
          </p>

          <p
            style={{
              marginTop: "5mm",
              fontSize: "14mm",
              fontWeight: 600,
              lineHeight: 1.02,
              letterSpacing: "-0.025em",
              wordBreak: "break-word",
            }}
          >
            {name}
          </p>

          {/* short red rule */}
          <div style={{ width: "20mm", height: "0.9mm", flexShrink: 0, background: RED, margin: "7mm auto 0" }} />

          <p
            style={{
              marginTop: "7mm",
              fontSize: "4.3mm",
              lineHeight: 1.6,
              color: "#2e2e2e",
              maxWidth: "190mm",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            For successfully completing the AI Security Bootcamp, Las Vegas (Aug 2026)
          </p>
          <p
            style={{
              marginTop: "3.5mm",
              fontSize: "3.7mm",
              lineHeight: 1.6,
              color: MUTED,
              maxWidth: "190mm",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Covering <strong style={{ fontWeight: 500, color: INK }}>frontier AI security</strong> across
            attacks, defenses, infrastructure, and governance
          </p>
        </div>

        {/* ---- signatures ---- */}
        <div style={{ flexShrink: 0, marginTop: "16mm" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              alignItems: "start",
              gap: "26mm",
              maxWidth: "200mm",
              margin: "0 auto",
            }}
          >
            <SignatureBlock value="" name="Pranav Gade" label="Program Director" valueFont={DISPLAY} valueSize="4.4mm" />
            <SignatureBlock value={date} label="Date of Issue" valueFont={MONO} valueSize="4.4mm" />
          </div>
        </div>
        </div>
      </div>

      {/* certificate id - pinned to the bottom of the page */}
      <div
        style={{
          position: "absolute",
          left: "16mm",
          right: "12mm",
          bottom: "15mm",
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          columnGap: "2.5mm",
          fontFamily: MONO,
          fontSize: "2.7mm",
          letterSpacing: "0.1em",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "2.5mm" }}>
          <span style={{ width: "1.8mm", height: "1.8mm", background: RED, flexShrink: 0 }} />
          <span style={{ color: MUTED, textTransform: "uppercase" }}>Certificate ID</span>
        </span>
        <span style={{ color: "#bbb" }}>·</span>
        <span style={{ color: "#555", justifySelf: "start" }}>{uuid}</span>
      </div>

      {/* QR to aisb.dev - bottom right */}
      <a
        href="https://aisb.dev"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "absolute",
          right: "15mm",
          bottom: "15mm",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0mm",
          textDecoration: "none",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/qr-aisb-dev.svg" alt="QR code to aisb.dev" style={{ width: "24mm", height: "24mm", display: "block" }} />
        <span
          style={{
            fontFamily: MONO,
            fontSize: "2.7mm",
            letterSpacing: "0.1em",
            color: "#555",
            marginTop: "-0.75mm",
          }}
        >
          aisb.dev
        </span>
      </a>
    </div>
  );
}

function SignatureBlock({
  value,
  name,
  label,
  valueFont,
  valueSize,
}: {
  value: string;
  name?: string;
  label: string;
  valueFont: string;
  valueSize: string;
}) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ height: "14mm", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
        <span
          style={{
            fontFamily: valueFont,
            fontSize: valueSize,
            fontWeight: 500,
            lineHeight: 1,
            paddingBottom: "1mm",
            whiteSpace: "nowrap",
          }}
        >
          {value}
        </span>
      </div>
      <div style={{ borderTop: `0.35mm solid ${INK}`, paddingTop: "2.5mm" }}>
        {name && (
          <p
            style={{
              fontFamily: DISPLAY,
              fontWeight: 600,
              fontSize: "3.8mm",
              color: INK,
              whiteSpace: "nowrap",
              marginBottom: "1.5mm",
            }}
          >
            {name}
          </p>
        )}
        <p
          style={{
            fontFamily: MONO,
            fontSize: "2.7mm",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: MUTED,
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </p>
      </div>
    </div>
  );
}

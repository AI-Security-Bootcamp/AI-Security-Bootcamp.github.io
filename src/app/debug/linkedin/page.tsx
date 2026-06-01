"use client";

import { useEffect, useRef, useState } from "react";
import { LinkedinSquare } from "./_square";

// ============================================================================
// Unicode Mathematical Alphanumeric Symbols block — LinkedIn renders these
// as "formatted" since plain LinkedIn posts don't support markdown/HTML.
// ============================================================================

type Range = { upperA?: number; lowerA?: number; zero?: number };

const BOLD: Range = { upperA: 0x1d400, lowerA: 0x1d41a, zero: 0x1d7ce };
const ITALIC: Range = { upperA: 0x1d434, lowerA: 0x1d44e };
const BOLD_ITALIC: Range = { upperA: 0x1d468, lowerA: 0x1d482 };
const MONOSPACE: Range = { upperA: 0x1d670, lowerA: 0x1d68a, zero: 0x1d7f6 };
const SANS_BOLD: Range = { upperA: 0x1d5d4, lowerA: 0x1d5ee, zero: 0x1d7ec };
const SCRIPT: Range = { upperA: 0x1d49c, lowerA: 0x1d4b6 };

function mapChar(ch: string, range: Range): string {
  const code = ch.codePointAt(0) ?? 0;
  if (range.upperA !== undefined && code >= 0x41 && code <= 0x5a) {
    return String.fromCodePoint(range.upperA + (code - 0x41));
  }
  if (range.lowerA !== undefined && code >= 0x61 && code <= 0x7a) {
    return String.fromCodePoint(range.lowerA + (code - 0x61));
  }
  if (range.zero !== undefined && code >= 0x30 && code <= 0x39) {
    return String.fromCodePoint(range.zero + (code - 0x30));
  }
  return ch;
}

const ITALIC_OVERRIDES: Record<string, string> = { h: "ℎ" };

const toBold = (s: string) => [...s].map((c) => mapChar(c, BOLD)).join("");
const toItalic = (s: string) =>
  [...s].map((c) => ITALIC_OVERRIDES[c] ?? mapChar(c, ITALIC)).join("");
const toBoldItalic = (s: string) => [...s].map((c) => mapChar(c, BOLD_ITALIC)).join("");
const toMonospace = (s: string) => [...s].map((c) => mapChar(c, MONOSPACE)).join("");
const toSansBold = (s: string) => [...s].map((c) => mapChar(c, SANS_BOLD)).join("");
const toScript = (s: string) => [...s].map((c) => mapChar(c, SCRIPT)).join("");
const toUnderline = (s: string) => [...s].map((c) => c + "̲").join("");
const toStrikethrough = (s: string) => [...s].map((c) => c + "̶").join("");

// ============================================================================
// Sample / formats / snippets
// ============================================================================

const SAMPLE = `𝗔𝗽𝗽𝗹𝗶𝗰𝗮𝘁𝗶𝗼𝗻𝘀 𝗳𝗼𝗿 𝗔𝗜𝗦𝗕 𝗩𝗲𝗴𝗮𝘀 𝗮𝗿𝗲 𝗻𝗼𝘄 𝗼𝗽𝗲𝗻!
AI Security Bootcamp is a fully funded, 7-day intensive program for security professionals focused on securing frontier AI systems from emerging threats.

Participants learn to threat-model, attack, and defend frontier AI systems, and leave with the skills and network to step into roles at the labs, agencies, and research orgs shaping the field.

We are looking for security professionals with 5+ years of hands-on experience. No AI or ML background required.

Past participants have been affiliated with Google, Meta, Apple, Microsoft, AWS, Stanford, MIT, Oxford, Cambridge, and national security agencies. This is our third iteration after London and Singapore.

We accept a small cohort and selection is competitive. Program costs are covered and travel support is available.

Applications close June 21. We review on a rolling basis and encourage you to apply as early as possible.

Apply here: [APPLICATION LINK]
Learn more: https://aisb.dev/vegas26

Know someone who would be a great fit? Tag them in the comments or share this post with them.`;

type FormatId =
  | "bold"
  | "italic"
  | "boldItalic"
  | "monospace"
  | "sansBold"
  | "script"
  | "underline"
  | "strikethrough";

const FORMATS: { id: FormatId; label: string; fn: (s: string) => string }[] = [
  { id: "bold", label: "𝐁𝐨𝐥𝐝", fn: toBold },
  { id: "italic", label: "𝐼𝑡𝑎𝑙𝑖𝑐", fn: toItalic },
  { id: "boldItalic", label: "𝑩𝒐𝒍𝒅 𝑰𝒕𝒂𝒍𝒊𝒄", fn: toBoldItalic },
  { id: "sansBold", label: "𝗦𝗮𝗻𝘀 𝗕𝗼𝗹𝗱", fn: toSansBold },
  { id: "monospace", label: "𝙼𝚘𝚗𝚘", fn: toMonospace },
  { id: "script", label: "𝒮𝒸𝓇𝒾𝓅𝓉", fn: toScript },
  { id: "underline", label: "U̲n̲d̲e̲r̲l̲i̲n̲e̲", fn: toUnderline },
  { id: "strikethrough", label: "S̶t̶r̶i̶k̶e̶", fn: toStrikethrough },
];

const SNIPPETS: { label: string; insert: string }[] = [
  { label: "• Bullet", insert: "\n• " },
  { label: "→ Arrow", insert: " → " },
  { label: "✓ Check", insert: "✓ " },
  { label: "★ Star", insert: "★ " },
  { label: "— Em-dash", insert: " — " },
];

// LinkedIn font stack (extracted from a live post)
const LI_FONT =
  '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", "Fira Sans", Ubuntu, Oxygen, "Oxygen Sans", Cantarell, "Droid Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Lucida Grande", Helvetica, Arial, sans-serif';

// ============================================================================
// Body rendering — split on URLs and #hashtags, render LinkedIn-blue
// ============================================================================

const LINK_RE = /(https?:\/\/\S+|www\.\S+|#\w+)/g;
const LI_BLUE = "#0a66c2";

function RenderedBody({ text }: { text: string }) {
  // Preserve newlines via whitespace-pre-wrap on the container.
  // Within each line, swap matches with anchor-styled spans.
  const parts = text.split(LINK_RE);
  return (
    <>
      {parts.map((p, i) => {
        if (i % 2 === 1) {
          // matched group: URL or hashtag
          return (
            <span key={i} style={{ color: LI_BLUE, fontWeight: 600 }}>
              {p}
            </span>
          );
        }
        return <span key={i}>{p}</span>;
      })}
    </>
  );
}

// LinkedIn's "see more" truncation is LINE-BASED: it shows ~3 lines of body
// text on both desktop and mobile before the "...more" link. We let the
// browser handle line wrapping (same algorithm LinkedIn uses) via CSS
// line-clamp, and overlay a "...more" pill at the end if the content
// overflows.
const MAX_VISIBLE_LINES = 3;

type ViewMode = "desktop" | "mobile";

function ClampedBody({ text, view }: { text: string; view: ViewMode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [overflowing, setOverflowing] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Re-measure whenever text or width changes
  useEffect(() => {
    if (!ref.current) return;
    if (expanded) return;
    const el = ref.current;
    setOverflowing(el.scrollHeight > el.clientHeight + 1);
  }, [text, view, expanded]);

  // Collapse again whenever the view (and thus width) changes
  useEffect(() => {
    setExpanded(false);
  }, [view]);

  const clampedStyle: React.CSSProperties = expanded
    ? {}
    : {
        display: "-webkit-box",
        WebkitLineClamp: MAX_VISIBLE_LINES,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      };

  return (
    <div style={{ position: "relative" }}>
      <div
        ref={ref}
        style={{
          ...clampedStyle,
          fontSize: 14,
          lineHeight: "20px",
          color: "rgba(0,0,0,0.9)",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        <RenderedBody text={text} />
      </div>
      {overflowing && !expanded && (
        <button
          onClick={() => setExpanded(true)}
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            paddingLeft: 32,
            background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, #fff 24px, #fff 100%)",
            color: "rgba(0,0,0,0.6)",
            fontWeight: 600,
            fontSize: 14,
            lineHeight: "20px",
            cursor: "pointer",
          }}
        >
          …more
        </button>
      )}
    </div>
  );
}

// ============================================================================
// LinkedIn-style action button icons
// ============================================================================

function IconLike() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M7 10v12" />
      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H7v-12l4.7-9.43A1.5 1.5 0 0 1 15 5.88Z" />
    </svg>
  );
}
function IconComment() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
    </svg>
  );
}
function IconRepost() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M17 1l4 4-4 4" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <path d="M7 23l-4-4 4-4" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  );
}
function IconSend() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4 20-7Z" />
    </svg>
  );
}
function IconGlobe() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm-1 17.93c-3.94-.49-7-3.86-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93ZM17.9 17.39c-.26-.81-1-1.39-1.9-1.39h-1v-3a1 1 0 0 0-1-1H8v-2h2a1 1 0 0 0 1-1V7h2a2 2 0 0 0 2-2v-.41a7.984 7.984 0 0 1 2.9 12.8Z" />
    </svg>
  );
}

// ============================================================================
// Page
// ============================================================================

export default function LinkedInFormatter() {
  const [text, setText] = useState(SAMPLE);
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState<ViewMode>("desktop");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // LinkedIn card widths (approx): web feed ~552px, mobile (iPhone-class) ~390px.
  const cardWidth = view === "mobile" ? 390 : 552;

  const applyTransform = (fn: (s: string) => string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    if (start === end) return;
    const selected = text.slice(start, end);
    const transformed = fn(selected);
    const next = text.slice(0, start) + transformed + text.slice(end);
    setText(next);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(start, start + transformed.length);
    });
  };

  const insertSnippet = (snippet: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const next = text.slice(0, start) + snippet + text.slice(end);
    setText(next);
    requestAnimationFrame(() => {
      ta.focus();
      const caret = start + snippet.length;
      ta.setSelectionRange(caret, caret);
    });
  };

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const reset = () => setText(SAMPLE);
  const clear = () => setText("");

  const charCount = [...text].length;

  return (
    <div className="min-h-screen bg-neutral-50 text-black p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-neutral-500 font-bold mb-1">Debug</p>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">LinkedIn Post Formatter</h1>
          </div>
          <a href="/" className="text-xs uppercase tracking-widest text-neutral-500 font-bold hover:text-[#ef4444]">
            ← Home
          </a>
        </div>
        <p className="text-neutral-500 mb-8 max-w-2xl">
          Select text, then click a button to convert to Unicode &quot;formatted&quot; characters that LinkedIn renders
          as bold, italic, etc. Plain text + Unicode is the only way to style LinkedIn posts.
        </p>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* ============ EDITOR ============ */}
          <div className="bg-white border-2 border-black p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest text-neutral-500 font-bold">Editor</p>
              <div className="flex gap-3 text-xs">
                <button onClick={reset} className="text-neutral-500 hover:text-black underline underline-offset-2">
                  Reset
                </button>
                <button onClick={clear} className="text-neutral-500 hover:text-black underline underline-offset-2">
                  Clear
                </button>
              </div>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-2">Format selection</p>
              <div className="flex flex-wrap gap-2">
                {FORMATS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => applyTransform(f.fn)}
                    className="border-2 border-black bg-white px-3 py-2 text-sm hover:bg-black hover:text-white transition-colors"
                    title={f.id}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-2">Insert at caret</p>
              <div className="flex flex-wrap gap-2">
                {SNIPPETS.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => insertSnippet(s.insert)}
                    className="border border-neutral-300 px-3 py-1.5 text-sm hover:border-black transition-colors"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-80 border-2 border-black p-4 font-sans text-base resize-y focus:outline-none focus:border-[#ef4444] leading-relaxed"
              spellCheck={false}
            />

            <div className="flex items-center justify-between gap-4">
              <p className="text-xs text-neutral-500 tabular-nums">
                {charCount} chars · LinkedIn limit 3,000 · &quot;see more&quot; truncates at {MAX_VISIBLE_LINES} lines
              </p>
              <button
                onClick={copy}
                className="bg-[#ef4444] text-white font-black text-xs uppercase tracking-widest px-6 py-3 hover:bg-red-600 transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          {/* ============ LINKEDIN PREVIEW ============ */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <p className="text-xs uppercase tracking-widest text-neutral-500 font-bold">LinkedIn preview</p>
              <div className="inline-flex border-2 border-black text-xs font-bold uppercase tracking-widest">
                {(["desktop", "mobile"] as const).map((v) => {
                  const active = view === v;
                  return (
                    <button
                      key={v}
                      onClick={() => setView(v)}
                      className={
                        "px-3 py-1.5 transition-colors " +
                        (active ? "bg-black text-white" : "bg-white text-black hover:bg-neutral-100")
                      }
                    >
                      {v === "desktop" ? "💻 Desktop · 552px" : "📱 Mobile · 390px"}
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              className="bg-white shadow-sm"
              style={{
                fontFamily: LI_FONT,
                color: "rgba(0,0,0,0.9)",
                border: "1px solid rgba(0,0,0,0.15)",
                borderRadius: 8,
                width: cardWidth,
                maxWidth: "100%",
              }}
            >
              {/* Post header */}
              <div className="flex items-start gap-2 p-4 pb-3">
                <a href="https://www.linkedin.com/company/ai-security-bootcamp" target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/aisb-linkedin-avatar.jpg"
                    alt="AI Security Bootcamp"
                    width={48}
                    height={48}
                    style={{ width: 48, height: 48, borderRadius: 4, objectFit: "cover" }}
                  />
                </a>
                <div className="flex-1 min-w-0">
                  <a
                    href="https://www.linkedin.com/company/ai-security-bootcamp"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "rgba(0,0,0,0.9)",
                      fontWeight: 600,
                      fontSize: 14,
                      lineHeight: "20px",
                      textDecoration: "none",
                    }}
                    className="hover:underline"
                  >
                    AI Security Bootcamp
                  </a>
                  <div style={{ color: "rgba(0,0,0,0.6)", fontSize: 12, lineHeight: "16px" }}>
                    112 followers
                  </div>
                  <div
                    style={{
                      color: "rgba(0,0,0,0.6)",
                      fontSize: 12,
                      lineHeight: "16px",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      marginTop: 2,
                    }}
                  >
                    Now <span style={{ color: "rgba(0,0,0,0.4)" }}>·</span>{" "}
                    <span style={{ color: "rgba(0,0,0,0.6)" }}>
                      <IconGlobe />
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span
                    style={{
                      color: LI_BLUE,
                      fontWeight: 600,
                      fontSize: 14,
                      padding: "6px 12px",
                      borderRadius: 16,
                      cursor: "pointer",
                    }}
                  >
                    + Follow
                  </span>
                  <button
                    style={{
                      color: "rgba(0,0,0,0.6)",
                      fontSize: 20,
                      lineHeight: 1,
                      padding: "4px 8px",
                      borderRadius: 4,
                    }}
                  >
                    ⋯
                  </button>
                </div>
              </div>

              {/* Body */}
              <div
                style={{
                  fontSize: 14,
                  lineHeight: "20px",
                  color: "rgba(0,0,0,0.9)",
                  whiteSpace: "pre-wrap",
                  padding: "0 16px 12px",
                }}
              >
                {text ? (
                  <ClampedBody text={text} view={view} />
                ) : (
                  <span style={{ color: "rgba(0,0,0,0.4)" }}>Your post will appear here…</span>
                )}
              </div>

              {/* Attached image (square — same component as /debug/linkedin/image) */}
              <div style={{ width: cardWidth, height: cardWidth, overflow: "hidden" }}>
                <div
                  style={{
                    transform: `scale(${cardWidth / 1080})`,
                    transformOrigin: "top left",
                  }}
                >
                  <LinkedinSquare />
                </div>
              </div>

              {/* Reactions strip */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 16px",
                  fontSize: 12,
                  color: "rgba(0,0,0,0.6)",
                  borderTop: "1px solid rgba(0,0,0,0.08)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ display: "inline-flex", marginRight: 4 }}>
                    <ReactionDot color="#0a66c2" emoji="👍" />
                    <ReactionDot color="#df704d" emoji="❤️" offset />
                    <ReactionDot color="#6dae4f" emoji="💡" offset />
                  </span>
                  <span>0</span>
                </div>
                <div>0 comments · 0 reposts</div>
              </div>

              {/* Action buttons */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  borderTop: "1px solid rgba(0,0,0,0.08)",
                  padding: "4px 8px",
                }}
              >
                {[
                  { icon: <IconLike />, label: "Like" },
                  { icon: <IconComment />, label: "Comment" },
                  { icon: <IconRepost />, label: "Repost" },
                  { icon: <IconSend />, label: "Send" },
                ].map((b) => (
                  <button
                    key={b.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      padding: "10px 4px",
                      borderRadius: 4,
                      color: "rgba(0,0,0,0.6)",
                      fontWeight: 600,
                      fontSize: 14,
                    }}
                    className="hover:bg-neutral-100"
                  >
                    <span aria-hidden>{b.icon}</span>
                    <span>{b.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Heads-up: Unicode formatting characters are technically symbols, not letters. Screen readers may read
              them differently (or skip them). Use sparingly for accessibility.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReactionDot({ color, emoji, offset }: { color: string; emoji: string; offset?: boolean }) {
  return (
    <span
      style={{
        width: 18,
        height: 18,
        borderRadius: "50%",
        background: color,
        color: "white",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 10,
        border: "1.5px solid white",
        marginLeft: offset ? -6 : 0,
      }}
    >
      {emoji}
    </span>
  );
}

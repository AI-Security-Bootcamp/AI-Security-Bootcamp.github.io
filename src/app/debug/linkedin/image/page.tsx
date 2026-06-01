"use client";

import { useEffect, useRef, useState } from "react";
import { LinkedinSquare } from "../_square";

// Square LinkedIn post image (1080 × 1080).
// Renders at exact pixel size; viewport-scaled for preview, screenshot the
// `#linkedin-square` node via DevTools (right-click → "Capture node screenshot")
// to export at full resolution.

export default function LinkedinImagePage() {
  const [dark, setDark] = useState(false);
  const [fit, setFit] = useState(true);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!fit) {
      setScale(1);
      return;
    }
    const compute = () => {
      const containerW = containerRef.current?.clientWidth ?? 1080;
      setScale(Math.min(1, containerW / 1080));
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [fit]);

  return (
    <div className="min-h-screen bg-neutral-100 p-6 md:p-10">
      <div className="max-w-[1180px] mx-auto">
        {/* Controls */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-neutral-500 font-bold mb-1">Debug</p>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-black">LinkedIn Post Image</h1>
            <p className="text-sm text-neutral-500 mt-1">
              1080 × 1080 square. Right-click the image → &quot;Capture node screenshot&quot; in DevTools, or screenshot at full
              size with browser zoom out.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setDark((d) => !d)}
              className="border-2 border-black px-3 py-1.5 text-sm font-bold hover:bg-black hover:text-white transition-colors text-black"
            >
              {dark ? "Light" : "Dark"} mode
            </button>
            <button
              onClick={() => setFit((f) => !f)}
              className="border-2 border-black px-3 py-1.5 text-sm font-bold hover:bg-black hover:text-white transition-colors text-black"
            >
              {fit ? "Show at 1:1" : "Fit to screen"}
            </button>
            <a
              href="/debug/linkedin"
              className="text-xs uppercase tracking-widest text-neutral-500 font-bold hover:text-[#ef4444]"
            >
              ← Formatter
            </a>
          </div>
        </div>

        {/* Sizer: occupies scaled height so layout doesn't break */}
        <div
          ref={containerRef}
          style={{
            width: "100%",
            height: 1080 * scale,
            overflow: "hidden",
          }}
        >
          <div style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}>
            <LinkedinSquare id="linkedin-square" dark={dark} />
          </div>
        </div>

        {/* Hint */}
        <p className="mt-4 text-xs text-neutral-500">
          Tip: open DevTools (⌥⌘I / Ctrl+Shift+I), right-click the <code className="bg-neutral-200 px-1">#linkedin-square</code> node →{" "}
          <em>Capture node screenshot</em> for a clean 1080×1080 PNG.
        </p>
      </div>
    </div>
  );
}

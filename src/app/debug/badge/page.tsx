"use client";

import { IBM_Plex_Mono } from "next/font/google";
import { useEffect, useRef, useState } from "react";

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const RED = "#ef4444";
const HARDWARE_SIZE = 1200;
const DISPLAY = { x: 406.63, y: 463.47, width: 417.26, height: 278.15 };

type Role = "participant" | "speaker";

function fontSizeFor(name: string, maxWidth: number) {
  const length = Math.max(name.trim().length, 1);
  return Math.max(25, Math.min(62, maxWidth / (length * 0.58)));
}

function Badge({
  id,
  firstName,
  lastName,
  role,
}: {
  id: string;
  firstName: string;
  lastName: string;
  role: Role;
}) {
  const foreground = "#000000";

  return (
    <div
      id={id}
      className={plexMono.className}
      style={{
        width: 360,
        height: 240,
        boxSizing: "border-box",
        overflow: "hidden",
        position: "relative",
        background: "#ffffff",
        color: foreground,
        border: `5px solid ${RED}`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "16px 18px",
      }}
    >
      <div
        style={{
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          aria-label={`${firstName} ${lastName}`.trim()}
          style={{
            fontSize: fontSizeFor(
              firstName.length > lastName.length ? firstName : lastName,
              314,
            ),
            fontWeight: 700,
            lineHeight: 0.92,
            letterSpacing: "-0.025em",
            textAlign: "center",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          <div>{firstName || "FIRST"}</div>
          <div style={{ color: RED, marginTop: 7 }}>{lastName || "LAST"}</div>
        </div>
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          borderTop: `3px solid ${foreground}`,
          marginTop: 42,
          paddingTop: 8,
          fontSize: 22,
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: "0.14em",
          textAlign: "center",
          textTransform: "uppercase",
        }}
      >
        {role}
      </div>

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 23,
          top: 192,
          width: 53,
          height: 18,
          overflow: "hidden",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/aisb-icon-square-light.svg"
          alt=""
          width={58}
          height={58}
          style={{
            position: "absolute",
            left: -3,
            top: -21,
            width: 58,
            height: 58,
          }}
        />
      </div>
    </div>
  );
}

function HardwarePreview({
  firstName,
  lastName,
  role,
}: {
  firstName: string;
  lastName: string;
  role: Role;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const fit = () => setScale(Math.min(1, frame.clientWidth / HARDWARE_SIZE));
    fit();

    const observer = new ResizeObserver(fit);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  const displayScale = DISPLAY.width / 360;

  return (
    <div ref={frameRef} className="w-full overflow-hidden">
      <div
        style={{
          width: HARDWARE_SIZE * scale,
          height: HARDWARE_SIZE * scale,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            position: "relative",
            width: HARDWARE_SIZE,
            height: HARDWARE_SIZE,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/debug/badge-front.svg"
            alt="Front render of the AISB Vegas 2026 PCB badge"
            width={HARDWARE_SIZE}
            height={HARDWARE_SIZE}
            style={{ display: "block", width: HARDWARE_SIZE, height: HARDWARE_SIZE }}
          />

          <div
            style={{
              position: "absolute",
              left: DISPLAY.x,
              top: DISPLAY.y,
              width: DISPLAY.width,
              height: DISPLAY.height,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: 360,
                height: 240,
                transform: `scale(${displayScale})`,
                transformOrigin: "top left",
              }}
            >
              <Badge
                id="badge-on-hardware"
                firstName={firstName}
                lastName={lastName}
                role={role}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BadgePage() {
  const [firstName, setFirstName] = useState("Pranav");
  const [lastName, setLastName] = useState("Gade");
  const [role, setRole] = useState<Role>("participant");

  return (
    <main className={`${plexMono.className} min-h-screen bg-neutral-100 text-black`}>
      <header className="border-b-2 border-black bg-white px-6 py-5">
        <div className="mx-auto flex max-w-5xl flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">
              Debug / Badge
            </p>
            <h1 className="text-2xl font-bold tracking-tight">E-paper nametag</h1>
          </div>
          <a
            href="/"
            className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-500 hover:text-[#ef4444]"
          >
            &larr; Home
          </a>
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl gap-8 px-6 py-8 lg:grid-cols-[300px_1fr] lg:items-start">
        <section className="border-2 border-black bg-white p-5" aria-label="Badge controls">
          <h2 className="mb-5 text-xs font-bold uppercase tracking-[0.18em]">
            Badge details
          </h2>

          <label className="mb-4 block">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
              First name
            </span>
            <input
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              className="w-full border-2 border-black px-3 py-2 text-sm font-semibold outline-none focus:border-[#ef4444]"
              maxLength={18}
              spellCheck={false}
            />
          </label>

          <label className="mb-5 block">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
              Last name
            </span>
            <input
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              className="w-full border-2 border-black px-3 py-2 text-sm font-semibold outline-none focus:border-[#ef4444]"
              maxLength={18}
              spellCheck={false}
            />
          </label>

          <fieldset>
            <legend className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
              Role
            </legend>
            <div className="grid grid-cols-2 border-2 border-black">
              {(["participant", "speaker"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={role === option}
                  onClick={() => setRole(option)}
                  className={`px-2 py-2.5 text-[10px] font-bold uppercase tracking-[0.08em] transition-colors first:border-r-2 first:border-black ${
                    role === option
                      ? "bg-black text-white"
                      : "bg-white text-black hover:text-[#ef4444]"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </fieldset>
        </section>

        <section aria-label="Badge preview" className="min-w-0">
          <div className="mb-3 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.18em]">
                Hardware preview
              </h2>
              <p className="mt-1 text-[11px] text-neutral-500">
                Actual PCB front render and display placement
              </p>
            </div>
            <code className="text-[11px] text-neutral-400">#badge-on-hardware</code>
          </div>

          <div className="border-2 border-black bg-[#090b0e] p-3 sm:p-5">
            <HardwarePreview firstName={firstName} lastName={lastName} role={role} />
          </div>

          <div className="mb-3 mt-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.18em]">
                Panel artwork
              </h2>
              <p className="mt-1 text-[11px] text-neutral-500">360 &times; 240 pixels</p>
            </div>
            <code className="text-[11px] text-neutral-400">#badge-render</code>
          </div>

          <div className="overflow-auto border-2 border-dashed border-neutral-300 bg-neutral-200 p-5 sm:p-8">
            <div className="w-max shadow-[0_12px_35px_rgba(0,0,0,0.18)]">
              <Badge
                id="badge-render"
                firstName={firstName}
                lastName={lastName}
                role={role}
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

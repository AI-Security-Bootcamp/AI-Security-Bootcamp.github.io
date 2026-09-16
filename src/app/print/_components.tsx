import type { ReactNode } from "react";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`physical-brand ${compact ? "physical-brand--compact" : ""}`}>
      {/* The official logo has a square artboard; the wrapper crops only its wordmark. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/aisb-logo-on-light.png" alt="AISB" />
    </div>
  );
}

export function Sheet({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <article className={`print-sheet ${className}`}>{children}</article>;
}

export function SheetHeader() {
  return (
    <header className="sheet-header">
      <BrandMark compact />
    </header>
  );
}

export function SheetFooter({ label = "AI Security Bootcamp · aisb.dev" }: { label?: string }) {
  return (
    <footer className="sheet-footer">
      <span>{label}</span>
    </footer>
  );
}

export function QrBlock({ caption = "aisb.dev/sf26", large = false }: { caption?: string; large?: boolean }) {
  return (
    <div className={`qr-block ${large ? "qr-block--large" : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/qr-sf26.svg" alt={`QR code for ${caption}`} />
      <strong>{caption}</strong>
    </div>
  );
}

export function SquareBulletList({ children }: { children: ReactNode }) {
  return <ul className="square-list">{children}</ul>;
}

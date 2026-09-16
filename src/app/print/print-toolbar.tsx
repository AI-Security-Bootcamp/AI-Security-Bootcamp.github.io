"use client";

const links = [
  ["Home", "/print"],
  ["SF26", "/print/sf26"],
  ["Mini flyers", "/print/flyers"],
  ["Foldables", "/print/foldables"],
  ["Airgapped EOI", "/print/eoi"],
  ["Print everything", "/print/all"],
];

export default function PrintToolbar() {
  return (
    <aside className="print-toolbar" aria-label="Physical edition navigation">
      <nav>
        {links.map(([label, href]) => (
          <a key={href} href={href}>{label}</a>
        ))}
      </nav>
      <button type="button" onClick={() => window.print()}>Print A4 pages</button>
    </aside>
  );
}

#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { finished } = require("stream/promises");
const { Resvg } = require("@resvg/resvg-js");
const PDFDocument = require("pdfkit");

const ROOT = path.resolve(__dirname, "../..");
const OUT = __dirname;
const LOGO_PATH = path.join(ROOT, "public/brand/aisb-logo-on-light.png");
const SPACE_GROTESK = path.join(
  ROOT,
  "hardware/vegas26-badge/assets/fonts/SpaceGrotesk-700.ttf",
);
const MONO_REGULAR = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf";
const MONO_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf";

// A4 landscape at 300 DPI. Each joined panel is exactly 4 × 6 inches.
const PAGE = { width: 3508, height: 2480 };
const PANEL = { width: 1200, height: 1800 };
const SPREAD = { x: 0, y: 0 };
const PDF_PAGE = { width: 841.8898, height: 595.2756 };

const GUESTS = [
  { first: "Marius", last: "Hobbhahn" },
  { first: "Inbar", last: "Schulman", role: "GUEST SPEAKER" },
  { first: "Alex", last: "Obadia" },
  { first: "Kristian", last: "Rönn" },
  { first: "Uri Ariel", last: "Chen" },
  { first: "Ilana", last: "Leibovich" },
  { first: "", last: "", blank: true, copy: 1 },
  { first: "", last: "", blank: true, copy: 2 },
  { first: "", last: "", blank: true, copy: 3 },
  { first: "", last: "", blank: true, copy: 4 },
  { first: "", last: "", blank: true, copy: 5 },
];

function escapeXml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;",
  })[character]);
}

function slug(guest) {
  if (guest.blank) return `blank-guest-${String(guest.copy).padStart(2, "0")}`;
  return `${guest.first}-${guest.last}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
}

function nameSize(guest) {
  const longest = Math.max(guest.first.length, guest.last.length, 1);
  return Math.max(110, Math.min(216, Math.floor(1010 / (longest * 0.61))));
}

function panelArtwork(guest, x) {
  const first = escapeXml(guest.first.toUpperCase());
  const last = escapeXml(guest.last.toUpperCase());
  const role = escapeXml((guest.role || "GUEST").toUpperCase());
  const size = nameSize(guest);
  const nameBlock = guest.blank
    ? `<g aria-label="Blank guest name area"/>`
    : `
      <g aria-label="${first} ${last}">
        <text x="600" y="905" text-anchor="middle" class="name first" font-size="${size}">${first}</text>
        <text x="600" y="1140" text-anchor="middle" class="name last" font-size="${size}">${last}</text>
      </g>`;

  return `
  <g transform="translate(${x} ${SPREAD.y})">
    <rect width="${PANEL.width}" height="${PANEL.height}" fill="#ffffff"/>
    <rect x="36" y="36" width="1128" height="1728" fill="none" stroke="#3f3f3f" stroke-width="12"/>

    <text x="72" y="108" class="website">aisb.dev</text>

    <g filter="url(#grayscale)">
      <svg x="260" y="190" width="680" height="312" viewBox="75 310 850 390" preserveAspectRatio="xMidYMid meet">
        <image width="1000" height="1000" href="${LOGO_DATA_URI}"/>
      </svg>
    </g>
    <text x="600" y="535" text-anchor="middle" class="tagline">AI SECURITY BOOTCAMP · LAS VEGAS 2026</text>

    <rect x="72" y="655" width="1056" height="900" fill="#ffffff" stroke="#4d4d4d" stroke-width="7"/>
    ${nameBlock}

    <line x1="122" y1="1355" x2="1078" y2="1355" stroke="#333333" stroke-width="5"/>
    <text x="600" y="1460" text-anchor="middle" class="role">${role}</text>
  </g>`;
}

const logoSource = fs.readFileSync(LOGO_PATH);
const LOGO_DATA_URI = `data:image/png;base64,${logoSource.toString("base64")}`;

function pageSvg(guest) {
  const label = guest.blank
    ? `BLANK GUEST ${guest.copy} OF 5`
    : `${guest.first} ${guest.last}`.toUpperCase();
  const left = SPREAD.x;
  const fold = SPREAD.x + PANEL.width;
  const right = SPREAD.x + PANEL.width * 2;
  const top = SPREAD.y;
  const bottom = SPREAD.y + PANEL.height;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="297mm" height="210mm" viewBox="0 0 ${PAGE.width} ${PAGE.height}">
  <title>AISB guest badge — ${escapeXml(label)}</title>
  <desc>A4 landscape sheet with two identical 4 by 6 inch badge faces joined for folding back to back.</desc>
  <defs>
    <filter id="grayscale" color-interpolation-filters="sRGB">
      <feColorMatrix type="matrix" values="0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0 0 0 1 0"/>
    </filter>
    <style>
      .name { font-family: "Space Grotesk"; font-weight: 700; letter-spacing: -0.035em; }
      .first { fill: #111111; }
      .last { fill: #4a4a4a; }
      .website { fill: #3f3f3f; font-family: "Space Grotesk"; font-size: 54px; font-weight: 700; letter-spacing: -0.02em; }
      .tagline { fill: #444444; font-family: "DejaVu Sans Mono"; font-size: 27px; font-weight: 700; letter-spacing: 0.08em; }
      .role { fill: #222222; font-family: "DejaVu Sans Mono"; font-size: 55px; font-weight: 700; letter-spacing: 0.2em; }
      .guide { fill: #747474; font-family: "DejaVu Sans Mono"; font-size: 24px; font-weight: 700; letter-spacing: 0.09em; }
      .cut-label { fill: #4b4b4b; font-family: "DejaVu Sans Mono"; font-size: 22px; font-weight: 700; letter-spacing: 0.12em; }
      .crop { fill: none; stroke: #6b6b6b; stroke-width: 2; }
    </style>
  </defs>

  <rect width="${PAGE.width}" height="${PAGE.height}" fill="#ffffff"/>
  <text x="2650" y="185" class="guide">A4 LANDSCAPE</text>
  <text x="2650" y="240" class="guide">PRINT AT 100%</text>
  <text x="2650" y="295" class="guide">TWO CUTS · THEN FOLD</text>
  <text x="2650" y="380" class="guide">${escapeXml(label)}</text>

  <path d="M${right} ${top}V${bottom} M${left} ${bottom}H${right}" class="crop"/>
  <path d="M${right - 28} ${bottom}h56 M${right} ${bottom - 28}v56" class="crop"/>
  <text x="${right + 72}" y="${bottom / 2}" class="cut-label" transform="rotate(90 ${right + 72} ${bottom / 2})">CUT 1</text>
  <text x="${right - 360}" y="${bottom + 105}" text-anchor="middle" class="cut-label">CUT 2</text>
  <path d="M${fold} ${bottom + 18}v80" stroke="#303030" stroke-width="4"/>
  <path d="M${fold - 18} ${bottom + 70}l18-18 18 18" fill="none" stroke="#303030" stroke-width="4"/>
  <text x="${fold}" y="${bottom + 150}" text-anchor="middle" class="cut-label">FOLD</text>

  ${panelArtwork(guest, SPREAD.x)}
  ${panelArtwork(guest, SPREAD.x + PANEL.width)}
</svg>`;
}

function renderSvg(svg) {
  const renderer = new Resvg(svg, {
    fitTo: { mode: "width", value: PAGE.width },
    font: {
      loadSystemFonts: false,
      fontFiles: [SPACE_GROTESK, MONO_REGULAR, MONO_BOLD],
      defaultFontFamily: "DejaVu Sans Mono",
    },
  });
  return renderer.render().asPng();
}

async function writePdf(pngPaths, outputPath) {
  const document = new PDFDocument({ autoFirstPage: false, compress: true });
  const stream = fs.createWriteStream(outputPath);
  document.pipe(stream);
  for (const pngPath of pngPaths) {
    document.addPage({ size: [PDF_PAGE.width, PDF_PAGE.height], margin: 0 });
    document.image(pngPath, 0, 0, {
      width: PDF_PAGE.width,
      height: PDF_PAGE.height,
    });
  }
  document.end();
  await finished(stream);
}

async function main() {
  const pngPaths = [];
  for (const guest of GUESTS) {
    const stem = `${slug(guest)}-a4`;
    const svgPath = path.join(OUT, `${stem}.svg`);
    const pngPath = path.join(OUT, `${stem}.png`);
    const pdfPath = path.join(OUT, `${stem}.pdf`);
    const svg = pageSvg(guest);
    fs.writeFileSync(svgPath, svg);
    fs.writeFileSync(pngPath, renderSvg(svg));
    await writePdf([pngPath], pdfPath);
    pngPaths.push(pngPath);
    process.stdout.write(`WROTE ${stem}.{svg,png,pdf}\n`);
  }
  await writePdf(pngPaths, path.join(OUT, "aisb-guest-badges-a4.pdf"));
  process.stdout.write("WROTE aisb-guest-badges-a4.pdf\n");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

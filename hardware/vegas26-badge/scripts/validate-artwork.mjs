import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { AISB_SILK_POLYGONS } from "./aisb-logo-geometry.mjs";
import { BADGE_QR, BADGE_QR_SELF_CHECK } from "./badge-qr-geometry.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(here, "..");
const boardPath = path.resolve(
  process.argv[2] ?? path.join(projectRoot, "vegas26-badge.kicad_pcb")
);
const board = fs.readFileSync(boardPath, "utf8");
const failures = [];

const fail = (message) => failures.push(message);
const closeEnough = (actual, expected, tolerance = 0.00011) =>
  Math.abs(actual - expected) <= tolerance;
const round4 = (value) => Number(value.toFixed(4));

function parenthesisBalance(text) {
  let depth = 0;
  let quoted = false;
  let escaped = false;

  for (const character of text) {
    if (quoted) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === '"') quoted = false;
      continue;
    }

    if (character === '"') quoted = true;
    else if (character === "(") depth += 1;
    else if (character === ")") depth -= 1;

    if (depth < 0) return depth;
  }

  return quoted ? Number.NaN : depth;
}

function balancedBlockAt(text, start) {
  let depth = 0;
  let quoted = false;
  let escaped = false;

  for (let index = start; index < text.length; index += 1) {
    const character = text[index];

    if (quoted) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === '"') quoted = false;
      continue;
    }

    if (character === '"') quoted = true;
    else if (character === "(") depth += 1;
    else if (character === ")") {
      depth -= 1;
      if (depth === 0) return text.slice(start, index + 1);
    }
  }

  return "";
}

function blocksFor(marker) {
  const blocks = [];
  let cursor = 0;

  while (cursor < board.length) {
    const start = board.indexOf(marker, cursor);
    if (start < 0) break;
    const block = balancedBlockAt(board, start);
    if (!block) {
      fail(`unterminated block beginning with ${marker}`);
      break;
    }
    blocks.push(block);
    cursor = start + block.length;
  }

  return blocks;
}

function requireIn(block, needle, description) {
  if (!block.includes(needle)) fail(`missing ${description}`);
}

const balance = parenthesisBalance(board);
if (!Number.isFinite(balance) || balance !== 0) {
  fail(`board has invalid quoted text or unbalanced s-expression (${balance})`);
}

const identifiers = [...board.matchAll(/\((?:uuid|tstamp)\s+"?([^\s")]+)"?\)/g)].map(
  (match) => match[1]
);
const duplicateIdentifiers = identifiers.filter(
  (identifier, index) => identifiers.indexOf(identifier) !== index
);
if (duplicateIdentifiers.length) {
  fail(`duplicate UUID/tstamp values: ${[...new Set(duplicateIdentifiers)].join(", ")}`);
}

const expectedLogoPoints = AISB_SILK_POLYGONS.flat().map(([x, y]) => [
  round4(x * 1.25),
  round4(y * 1.25),
]);
const logoBlocks = blocksFor('(footprint "Badge:AISB_Logo_Vector"');
if (logoBlocks.length !== 1) {
  fail(`AISB logo footprint count is ${logoBlocks.length}, expected 1`);
} else {
  const logoBlock = logoBlocks[0];
  requireIn(logoBlock, "(at 50 38)", "logo origin at 50,38 mm");
  requireIn(logoBlock, "(at 0 -9", "scaled LOGO1 reference field position");
  requireIn(logoBlock, "(at 0 9", "scaled LOGO1 value field position");

  const actualLogoPoints = [...logoBlock.matchAll(/\(xy\s+([-\d.]+)\s+([-\d.]+)\)/g)].map(
    (match) => [Number(match[1]), Number(match[2])]
  );

  if (actualLogoPoints.length !== expectedLogoPoints.length) {
    fail(
      `logo vertex count is ${actualLogoPoints.length}, expected ${expectedLogoPoints.length}`
    );
  } else {
    // KiCad may reorder footprint graphic polygons when it saves the board, so
    // compare the complete vertex multiset rather than polygon serialization order.
    const coordinateKey = ([x, y]) => `${round4(x)},${round4(y)}`;
    const actualCoordinates = actualLogoPoints.map(coordinateKey).sort();
    const expectedCoordinates = expectedLogoPoints.map(coordinateKey).sort();
    const mismatchIndex = actualCoordinates.findIndex(
      (coordinate, index) => coordinate !== expectedCoordinates[index]
    );
    if (mismatchIndex >= 0) {
      fail(
        `logo vertex geometry differs at ${actualCoordinates[mismatchIndex]}; expected ${expectedCoordinates[mismatchIndex]}`
      );
    }
  }

  if (actualLogoPoints.length) {
    const xs = actualLogoPoints.map(([x]) => 50 + x);
    const ys = actualLogoPoints.map(([, y]) => 38 + y);
    const bounds = [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
    const expectedBounds = [27.055, 30.72, 67.935, 45.28];
    if (!bounds.every((value, index) => closeEnough(value, expectedBounds[index]))) {
      fail(`logo silk bounds are ${bounds.join(", ")}; expected ${expectedBounds.join(", ")}`);
    }
  }
}

const accentBlocks = blocksFor('(footprint "Badge:Gold_Brand_Accent"');
if (accentBlocks.length !== 1) {
  fail(`gold accent footprint count is ${accentBlocks.length}, expected 1`);
} else {
  requireIn(accentBlocks[0], "(at 71.1325 43.1875)", "scaled gold accent center");
  requireIn(accentBlocks[0], "(size 3.625 3.625)", "scaled gold accent size");
}

const barcodeBlocks = blocksFor("(barcode");
if (barcodeBlocks.length !== 1) {
  fail(`native barcode count is ${barcodeBlocks.length}, expected 1`);
} else {
  const barcode = barcodeBlocks[0];
  requireIn(barcode, "(at 21 79.2 0)", "rear QR center/orientation");
  requireIn(barcode, '(layer "B.SilkS")', "rear QR B.Silkscreen layer");
  requireIn(barcode, `(size ${BADGE_QR.symbolMm} ${BADGE_QR.symbolMm})`, "20 mm QR symbol");
  requireIn(barcode, `(text "${BADGE_QR.payload}")`, "full HTTPS QR payload");
  requireIn(barcode, "(type qr)", "QR barcode type");
  requireIn(barcode, `(ecc_level ${BADGE_QR.ecc})`, "QR ECC M");
  requireIn(barcode, "(hide yes)", "hidden duplicate barcode text");
  requireIn(barcode, "(knockout yes)", "standard-polarity knockout QR");
  requireIn(barcode, "(margins 3.2 3.2)", "four-module QR quiet zone");
}

const labelBlocks = blocksFor('(gr_text "aisb.dev/badge0"');
if (labelBlocks.length !== 1) {
  fail(`rear QR label count is ${labelBlocks.length}, expected 1`);
} else {
  const label = labelBlocks[0];
  if (!/\(at 21 94\.5(?: 0)?\)/.test(label)) fail("missing rear QR label position");
  requireIn(label, '(layer "B.SilkS")', "rear QR label layer");
  requireIn(label, "(size 1 1)", "rear QR label text size");
  requireIn(label, "(thickness 0.15)", "rear QR label stroke");
  requireIn(label, "(justify mirror)", "rear-readable QR label mirroring");
}

const moduleMm = BADGE_QR.symbolMm / BADGE_QR.moduleCount;
const quietMm = BADGE_QR.quietModules * moduleMm;
const qrBounds = [
  21 - BADGE_QR.symbolMm / 2 - quietMm,
  79.2 - BADGE_QR.symbolMm / 2 - quietMm,
  21 + BADGE_QR.symbolMm / 2 + quietMm,
  79.2 + BADGE_QR.symbolMm / 2 + quietMm,
];
const expectedQrBounds = [7.8, 66, 34.2, 92.4];
if (!qrBounds.every((value, index) => closeEnough(value, expectedQrBounds[index]))) {
  fail(`rear QR outer bounds are ${qrBounds.join(", ")}`);
}
if (!closeEnough(moduleMm, 0.8) || !closeEnough(quietMm, 3.2)) {
  fail(`rear QR module/quiet-zone sizes are ${moduleMm}/${quietMm} mm`);
}

if (failures.length) {
  console.error(`Artwork validation failed for ${boardPath}:`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Artwork validation passed: ${boardPath}`);
console.log(
  `- logo: 1.25x, ${expectedLogoPoints.length} vertices, silk bounds 27.055..67.935 x 30.720..45.280 mm`
);
console.log("- gold accent: center 71.1325,43.1875 mm; 3.625 x 3.625 mm");
console.log(
  `- rear QR: ${BADGE_QR.payload}, Version ${BADGE_QR.version}-${BADGE_QR.ecc}, ${moduleMm.toFixed(1)} mm modules, ${BADGE_QR.totalMm.toFixed(1)} mm overall`
);
console.log(
  `- QR matrix self-check: ${BADGE_QR_SELF_CHECK.darkModules} dark modules; ${BADGE_QR_SELF_CHECK.matrixHash}`
);

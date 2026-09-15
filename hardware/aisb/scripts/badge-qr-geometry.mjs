import { createHash } from "node:crypto";

// Fixed QR geometry for the badge's physical rear side.
//
// Matrix convention:
//   - rows are top-to-bottom in the physical rear/scanner view;
//   - columns are left-to-right in the physical rear/scanner view;
//   - "1" is a dark QR module, implemented by exposed black solder mask;
//   - "0" and the quiet zone are printed as white B.Silkscreen.
//
// BADGE_QR_BSILK_RECTS_MM is mirrored in X for direct insertion as raw
// B.SilkS geometry in board-coordinate space.  The physical view from the
// rear mirrors it back into the scanner-view matrix above.  Do not use that
// pre-mirrored export with KiCad's native barcode object or with a footprint
// that KiCad itself flips, because either path would mirror the code again.

export const BADGE_QR = Object.freeze({
  payload: "https://aisb.dev/badge0",
  mode: "byte",
  version: 2,
  ecc: "M",
  mask: 1,
  moduleCount: 25,
  moduleMm: 0.8,
  quietModules: 4,
  symbolMm: 20,
  totalModules: 33,
  totalMm: 26.4,
});

// Generated with qrcode@1.5.4 using explicit Version 2, ECC M, mask 1.
// The fixed matrix avoids output changes caused by encoder/mask-selection
// changes while retaining the exact standards-compliant payload.
export const BADGE_QR_DARK_MATRIX = Object.freeze([
  "1111111010100010101111111",
  "1000001000110110101000001",
  "1011101010101000101011101",
  "1011101000101000001011101",
  "1011101001011001001011101",
  "1000001000011100101000001",
  "1111111010101010101111111",
  "0000000010110110000000000",
  "1010011000110001111000101",
  "1000110010111010001001111",
  "0101111111011011110110011",
  "0111010110111001001010010",
  "1100111001001111000011111",
  "1111100000100000001000101",
  "1011101100000001000111101",
  "0001000111101110100110001",
  "0100101101011111111111011",
  "0000000000110111100011101",
  "1111111001001111101010000",
  "1000001011001101100010110",
  "1011101000100001111111110",
  "1011101001110011000000101",
  "1011101010100010000001000",
  "1000001001000100100101100",
  "1111111011101110011110101",
]);

const roundMm = (value) => Number(value.toFixed(3));

function isWhiteRearCell(row, column) {
  const q = BADGE_QR.quietModules;
  const n = BADGE_QR.moduleCount;

  if (row < q || row >= q + n || column < q || column >= q + n) return true;
  return BADGE_QR_DARK_MATRIX[row - q][column - q] === "0";
}

function mergedWhiteRuns({ mirrorX = false } = {}) {
  const runs = [];
  const total = BADGE_QR.totalModules;

  for (let row = 0; row < total; row += 1) {
    let column = 0;

    while (column < total) {
      if (!isWhiteRearCell(row, column)) {
        column += 1;
        continue;
      }

      const rearStart = column;
      while (column < total && isWhiteRearCell(row, column)) column += 1;

      const length = column - rearStart;
      const start = mirrorX ? total - rearStart - length : rearStart;
      runs.push(Object.freeze({ row, start, length }));
    }
  }

  return Object.freeze(runs);
}

function runsToCenteredRects(runs) {
  const moduleMm = BADGE_QR.moduleMm;
  const halfModules = BADGE_QR.totalModules / 2;

  return Object.freeze(
    runs.map(({ row, start, length }) =>
      Object.freeze({
        x1: roundMm((start - halfModules) * moduleMm),
        y1: roundMm((row - halfModules) * moduleMm),
        x2: roundMm((start + length - halfModules) * moduleMm),
        y2: roundMm((row + 1 - halfModules) * moduleMm),
      })
    )
  );
}

// Standard physical rear/scanner view, useful for previews and decoding tests.
export const BADGE_QR_REAR_WHITE_RUNS = mergedWhiteRuns();
export const BADGE_QR_REAR_WHITE_RECTS_MM = runsToCenteredRects(
  BADGE_QR_REAR_WHITE_RUNS
);

// Direct raw KiCad B.SilkS board-coordinate geometry.  X is deliberately
// mirrored so the manufactured physical rear presents the standard matrix.
export const BADGE_QR_BSILK_WHITE_RUNS = mergedWhiteRuns({ mirrorX: true });
export const BADGE_QR_BSILK_RECTS_MM = runsToCenteredRects(
  BADGE_QR_BSILK_WHITE_RUNS
);

const EXPECTED_MATRIX_SHA256 =
  "91cb1802b56cd607b3f7bb866b9009f2384ada1ac4d2f687bd85f790b98f66a3";

function requireQr(condition, message) {
  if (!condition) throw new Error(`Badge QR geometry check failed: ${message}`);
}

function checkFinderPattern(top, left) {
  for (let row = 0; row < 7; row += 1) {
    for (let column = 0; column < 7; column += 1) {
      const expectedDark =
        row === 0 ||
        row === 6 ||
        column === 0 ||
        column === 6 ||
        (row >= 2 && row <= 4 && column >= 2 && column <= 4);
      const actualDark = BADGE_QR_DARK_MATRIX[top + row][left + column] === "1";
      requireQr(actualDark === expectedDark, `finder pattern at ${top},${left}`);
    }
  }
}

export function selfCheckBadgeQrGeometry() {
  const n = BADGE_QR.moduleCount;
  const total = BADGE_QR.totalModules;
  const payloadBytes = new TextEncoder().encode(BADGE_QR.payload).length;

  requireQr(payloadBytes === 23, `payload is ${payloadBytes} bytes, expected 23`);
  requireQr(payloadBytes > 14 && payloadBytes <= 26, "payload no longer requires Version 2-M");
  requireQr(BADGE_QR_DARK_MATRIX.length === n, "matrix row count");
  requireQr(
    BADGE_QR_DARK_MATRIX.every((row) => row.length === n && /^[01]+$/.test(row)),
    "matrix must be a 25x25 binary grid"
  );
  requireQr(
    Math.abs(BADGE_QR.symbolMm - n * BADGE_QR.moduleMm) < 1e-9,
    "symbol dimensions"
  );
  requireQr(
    Math.abs(BADGE_QR.totalMm - total * BADGE_QR.moduleMm) < 1e-9 &&
      total === n + 2 * BADGE_QR.quietModules,
    "quiet-zone dimensions"
  );

  const matrixText = BADGE_QR_DARK_MATRIX.join("\n");
  const matrixHash = createHash("sha256").update(matrixText).digest("hex");
  requireQr(matrixHash === EXPECTED_MATRIX_SHA256, "matrix checksum");

  const darkModules = [...matrixText].filter((value) => value === "1").length;
  requireQr(darkModules === 320, `dark-module count is ${darkModules}, expected 320`);

  checkFinderPattern(0, 0);
  checkFinderPattern(0, n - 7);
  checkFinderPattern(n - 7, 0);

  requireQr(BADGE_QR_REAR_WHITE_RUNS.length === 193, "merged white-run count");
  const printedWhiteCells = BADGE_QR_REAR_WHITE_RUNS.reduce(
    (sum, run) => sum + run.length,
    0
  );
  requireQr(
    printedWhiteCells === total * total - darkModules,
    "white runs do not exactly complement dark modules and quiet zone"
  );

  const boardWhite = Array.from({ length: total }, () => Array(total).fill(false));
  for (const { row, start, length } of BADGE_QR_BSILK_WHITE_RUNS) {
    for (let column = start; column < start + length; column += 1) {
      requireQr(!boardWhite[row][column], "overlapping B.SilkS white runs");
      boardWhite[row][column] = true;
    }
  }

  for (let row = 0; row < total; row += 1) {
    for (let boardColumn = 0; boardColumn < total; boardColumn += 1) {
      const rearColumn = total - 1 - boardColumn;
      requireQr(
        boardWhite[row][boardColumn] === isWhiteRearCell(row, rearColumn),
        "B.SilkS mirroring does not reconstruct the physical rear matrix"
      );
    }
  }

  return Object.freeze({
    payloadBytes,
    matrixHash,
    darkModules,
    whiteRuns: BADGE_QR_REAR_WHITE_RUNS.length,
    printedWhiteCells,
  });
}

export const BADGE_QR_SELF_CHECK = selfCheckBadgeQrGeometry();

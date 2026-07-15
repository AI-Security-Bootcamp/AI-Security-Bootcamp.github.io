import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { AISB_SILK_POLYGONS } from "./aisb-logo-geometry.mjs";
import { BADGE_QR } from "./badge-qr-geometry.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const outputRoot = process.env.BADGE_OUTPUT_ROOT
  ? path.resolve(process.env.BADGE_OUTPUT_ROOT)
  : root;

const W = 100;
const H = 145;
const LANYARD_HOLE = Object.freeze({ x: 50, y: 8, diameter: 6 });
const AISB_LOGO = Object.freeze({
  x: 50,
  y: 38,
  scale: 1.25,
  previewWidth: 37,
  previewHeight: 11.648,
  goldAccentX: 66.906,
  goldAccentY: 42.15,
  goldAccentSize: 2.9,
});
const REAR_BADGE_QR = Object.freeze({
  x: 21,
  y: 79.2,
  labelY: 94.5,
});
const PANEL = Object.freeze({
  centerX: 50,
  centerY: 94.205,
  width: 84.7,
  height: 54.41,
  activeOffsetX: 2.725,
  activeWidth: 74.51,
  activeHeight: 49.67,
  flexLength: 3.65,
  flexWidth: 12.5,
});
const PANEL_J1 = Object.freeze({
  // The FH34's signal-solder row is on the insertion side.  With the body
  // rotated 270 degrees, the opening faces right toward the panel: the body
  // stays inside x=1.70..5.50, its signal row is x=5.00, and the retention
  // row is x=1.70.  Footprint pad numbers below follow the *display* contacts
  // (pin 1 at the top of the landscape tail); the Hirose terminal numbering
  // is mirrored in this right-facing, top-contact use.
  signalRowX: 5,
  centerY: PANEL.centerY,
  rotation: 270,
});
const ESP32_BAY = Object.freeze({
  // Current Waveshare e-Paper ESP32 Driver Board Rev 3, rotated so its USB-C
  // connector faces down and remains accessible below the badge.  Waveshare
  // has no mounting holes and ships with long underside header rows, so this
  // is a header-clear cradle bay rather than a flat adhesive or unverified
  // board-to-board socket footprint.
  left: 5.5,
  top: 96.75,
  width: 29.46,
  height: 48.25,
  antennaDepth: 14.5,
});
const ESP32_MOUNT_SLOTS = Object.freeze([
  { x: 3.5, y: 131.5 },
  { x: 37, y: 131.5 },
  { x: 3.5, y: 139.5 },
  { x: 37, y: 139.5 },
]);
const ESP_RIBBON = Object.freeze({
  pin1X: 60,
  y: 140.5,
  pitch: 2.54,
});
const uidState = { value: 1 };
const uid = () =>
  `00000000-0000-0000-0000-${String(uidState.value++).padStart(12, "0")}`;
const n = (value) => Number(value.toFixed(3));
const n4 = (value) => Number(value.toFixed(4));

const scaledLogoPoint = ([x, y]) => [
  n4(x * AISB_LOGO.scale),
  n4(y * AISB_LOGO.scale),
];
const scaledGoldAccent = Object.freeze({
  x: n4(
    AISB_LOGO.x + (AISB_LOGO.goldAccentX - AISB_LOGO.x) * AISB_LOGO.scale
  ),
  y: n4(
    AISB_LOGO.y + (AISB_LOGO.goldAccentY - AISB_LOGO.y) * AISB_LOGO.scale
  ),
  size: n4(AISB_LOGO.goldAccentSize * AISB_LOGO.scale),
});

// The badge exposes only the controller-side SPI signals.  The raw panel's
// high-voltage support nodes remain local to the badge.
const nets = {
  DGND: 1,
  "3V3": 2,
  EPD_MOSI: 3,
  EPD_CLK: 4,
  EPD_CS: 5,
  EPD_DC: 6,
  EPD_RST: 7,
  EPD_BUSY: 8,
  GDR: 9,
  RESE: 10,
  SW: 11,
  CFLY: 12,
  VDHR: 13,
  VDDD: 14,
  VPP: 15,
  VSH: 16,
  VGH: 17,
  VSL: 18,
  VGL: 19,
  VCOM: 20,
  EXT_MOSI: 21,
  EXT_CLK: 22,
  EXT_CS: 23,
  EXT_DC: 24,
  EXT_RST: 25,
  EXT_BUSY: 26,
  LEGACY_NC: 27,
  AUDIO_SIG: 28,
  AUDIO_GND: 29,
  PICKUP_A: 30,
  BS: 31,
};

const netDecls = Object.entries(nets)
  .map(([name, id]) => `  (net ${id} "${name}")`)
  .join("\n");

function effects(size = 1, thickness = 0.15, justify = "") {
  return `(effects (font (size ${size} ${size}) (thickness ${thickness}))${
    justify ? ` (justify ${justify})` : ""
  })`;
}

function fpText(kind, text, x, y, layer, size = 1, justify = "") {
  return `    (fp_text ${kind} "${text}" (at ${x} ${y}) (layer "${layer}") (tstamp ${uid()})\n      ${effects(
    size,
    0.15,
    justify
  )}\n    )`;
}

// A Y-reflected rear land pattern appears as a valid 180-degree package
// rotation when the physical rear is viewed. Mark that assembly convention
// explicitly so the hand-authored B.Cu footprint cannot be placed by guess.
function rearPin1Mark(x, y, noteX, noteY) {
  return `    (fp_circle (center ${x} ${y}) (end ${n(x + 0.22)} ${y}) (stroke (width 0.18) (type default)) (fill none) (layer "B.SilkS") (tstamp ${uid()}))
    (fp_circle (center ${x} ${y}) (end ${n(x + 0.22)} ${y}) (stroke (width 0.12) (type default)) (fill none) (layer "B.Fab") (tstamp ${uid()}))
    (fp_text user "P1 / ROT180" (at ${noteX} ${noteY}) (layer "B.Fab") (tstamp ${uid()}) ${effects(0.38, 0.07, "mirror")})`;
}

function grText(text, x, y, layer, size, thickness = 0.2, justify = "") {
  return `  (gr_text "${text}" (at ${x} ${y}) (layer "${layer}") (tstamp ${uid()})\n    ${effects(
    size,
    thickness,
    justify
  )}\n  )`;
}

function segment(a, b, width, layer, net) {
  return `  (segment (start ${n(a[0])} ${n(a[1])}) (end ${n(b[0])} ${n(
    b[1]
  )}) (width ${width}) (layer "${layer}") (net ${net}) (tstamp ${uid()}))`;
}

function polyline(points, width, layer, net) {
  return points
    .slice(1)
    .map((point, i) => segment(points[i], point, width, layer, net))
    .join("\n");
}

function via(x, y, net, size = 0.7, drill = 0.35) {
  return `  (via (at ${n(x)} ${n(y)}) (size ${size}) (drill ${drill}) (layers "F.Cu" "B.Cu") (net ${net}) (tstamp ${uid()}))`;
}

function chip2(
  ref,
  value,
  x,
  y,
  leftNet,
  leftName,
  rightNet,
  rightName,
  { pkg = "0603", rotation = 0, dnp = false, solidPads = [] } = {}
) {
  const packages = {
    "0603": { spacing: 0.8, pad: [0.9, 1.0], body: [1.8, 1.0] },
    "0805": { spacing: 1.0, pad: [1.1, 1.4], body: [2.2, 1.4] },
    "1206": { spacing: 1.5, pad: [1.5, 1.8], body: [3.3, 1.8] },
    "1210": { spacing: 1.6, pad: [1.5, 2.6], body: [3.4, 2.7] },
  };
  const p = packages[pkg];
  const [pw, ph] = p.pad;
  const [bw, bh] = p.body;
  const label = dnp ? `${value} / DNP` : value;
  return `  (footprint "Badge:${pkg}_${ref}" (layer "B.Cu") (tstamp ${uid()})
    (at ${x} ${y}${rotation ? ` ${rotation}` : ""})
${fpText("reference", ref, 0, -1.35, "B.SilkS", 0.65, "mirror")}
${fpText("value", label, 0, 1.35, "B.Fab", 0.55, "mirror")}
    (fp_rect (start ${n(-bw / 2)} ${n(-bh / 2)}) (end ${n(bw / 2)} ${n(
      bh / 2
    )}) (stroke (width 0.12) (type default)) (fill none) (layer "B.SilkS") (tstamp ${uid()}))
    (pad "1" smd roundrect (at ${-p.spacing} 0) (size ${pw} ${ph}) (layers "B.Cu" "B.Paste" "B.Mask") (roundrect_rratio 0.2) (net ${leftNet} "${leftName}")${solidPads.includes(1) ? " (zone_connect 2)" : ""} (tstamp ${uid()}))
    (pad "2" smd roundrect (at ${p.spacing} 0) (size ${pw} ${ph}) (layers "B.Cu" "B.Paste" "B.Mask") (roundrect_rratio 0.2) (net ${rightNet} "${rightName}")${solidPads.includes(2) ? " (zone_connect 2)" : ""} (tstamp ${uid()}))
  )`;
}

function diode(ref, x, y, leftNet, leftName, rightNet, rightName) {
  return `  (footprint "Badge:D_SOD-123" (layer "B.Cu") (tstamp ${uid()})
    (at ${x} ${y})
${fpText("reference", ref, 0, -1.6, "B.SilkS", 0.65, "mirror")}
${fpText("value", "MBR0530", 0, 1.6, "B.Fab", 0.55, "mirror")}
    (fp_rect (start -2 -1) (end 2 1) (stroke (width 0.12) (type default)) (fill none) (layer "B.SilkS") (tstamp ${uid()}))
    (fp_line (start 0.75 -0.9) (end 0.75 0.9) (stroke (width 0.25) (type default)) (layer "B.SilkS") (tstamp ${uid()}))
    (pad "2" smd roundrect (at -1.4 0) (size 1.4 1.8) (layers "B.Cu" "B.Paste" "B.Mask") (roundrect_rratio 0.15) (net ${leftNet} "${leftName}") (tstamp ${uid()}))
    (pad "1" smd roundrect (at 1.4 0) (size 1.4 1.8) (layers "B.Cu" "B.Paste" "B.Mask") (roundrect_rratio 0.15) (net ${rightNet} "${rightName}") (tstamp ${uid()}))
  )`;
}

function mosfet() {
  // Y-reflected rear land pattern: assemble Q1 rotated 180 degrees.
  return `  (footprint "Package_TO_SOT_SMD:SOT-23" (layer "B.Cu") (tstamp ${uid()})
    (at 68 73)
${fpText("reference", "Q1", 0, 2, "B.SilkS", 0.7, "mirror")}
${fpText("value", "BSS138", 0, -2, "B.Fab", 0.6, "mirror")}
    (fp_rect (start -1.5 -1.5) (end 1.5 1.5) (stroke (width 0.12) (type default)) (fill none) (layer "B.SilkS") (tstamp ${uid()}))
${rearPin1Mark(-1.85, 1.55, 0, -1.9)}
    (pad "1" smd roundrect (at -1 0.95) (size 1.1 1) (layers "B.Cu" "B.Paste" "B.Mask") (roundrect_rratio 0.2) (net ${nets.GDR} "GDR") (tstamp ${uid()}))
    (pad "2" smd roundrect (at -1 -0.95) (size 1.1 1) (layers "B.Cu" "B.Paste" "B.Mask") (roundrect_rratio 0.2) (net ${nets.RESE} "RESE") (tstamp ${uid()}))
    (pad "3" smd roundrect (at 1 0) (size 1.1 1) (layers "B.Cu" "B.Paste" "B.Mask") (roundrect_rratio 0.2) (net ${nets.SW} "SW") (tstamp ${uid()}))
  )`;
}

function fpcConnector() {
  const map = {
    2: [nets.GDR, "GDR"],
    3: [nets.RESE, "RESE"],
    4: [nets.LEGACY_NC, "LEGACY_NC"],
    5: [nets.VDHR, "VDHR"],
    8: [nets.BS, "BS"],
    9: [nets.EPD_BUSY, "EPD_BUSY"],
    10: [nets.EPD_RST, "EPD_RST"],
    11: [nets.EPD_DC, "EPD_DC"],
    12: [nets.EPD_CS, "EPD_CS"],
    13: [nets.EPD_CLK, "EPD_CLK"],
    14: [nets.EPD_MOSI, "EPD_MOSI"],
    15: [nets["3V3"], "3V3"],
    16: [nets["3V3"], "3V3"],
    17: [nets.DGND, "DGND"],
    18: [nets.VDDD, "VDDD"],
    19: [nets.VPP, "VPP"],
    20: [nets.VSH, "VSH"],
    21: [nets.VGH, "VGH"],
    22: [nets.VSL, "VSL"],
    23: [nets.VGL, "VGL"],
    24: [nets.VCOM, "VCOM"],
  };
  const pads = Array.from({ length: 24 }, (_, i) => {
    const pin = i + 1;
    const net = map[pin];
    // Number these by panel contact, not by the connector maker's terminal
    // number. KiCad's 270-degree footprint transform maps negative local X to
    // the top of the vertical tail, so EPD pin 1 starts at -5.75 mm.
    const x = n(-5.75 + i * 0.5);
    // Hirose recommends a 0.30 x 0.80 mm copper land but a smaller
    // 0.25 x 0.65 mm metal-mask aperture with a 0.10 mm stencil.  Keep paste
    // as a separate unnumbered aperture so the reduction is anisotropic.
    return `    (pad "${pin}" smd rect (at ${x} 0 270) (size 0.3 0.8) (layers "F.Cu" "F.Mask")${
      net ? ` (net ${net[0]} "${net[1]}")` : ""
    } (tstamp ${uid()}))
    (pad "" smd rect (at ${x} 0 270) (size 0.25 0.65) (layers "F.Paste") (tstamp ${uid()}))`;
  }).join("\n");
  return `  (footprint "Badge:Hirose_FH34SRJ-24S-0.5SH_24P_P0.50mm_Horizontal" (layer "F.Cu") (tstamp ${uid()})
    (at ${PANEL_J1.signalRowX} ${PANEL_J1.centerY} ${PANEL_J1.rotation})
${fpText("reference", "J1", 0, 1.45, "F.SilkS", 0.8)}
${fpText("value", "FH34SRJ-24S-0.5SH(50)/(99) / DISPLAY-NUMBERED / VERIFY FIT", 0, -4.3, "F.Fab", 0.5)}
    (fp_rect (start -7 -3.3) (end 7 0.5) (stroke (width 0.15) (type default)) (fill none) (layer "F.SilkS") (tstamp ${uid()}))
    (fp_line (start 6.25 0.5) (end 6.25 1.05) (stroke (width 0.25) (type default)) (layer "F.SilkS") (tstamp ${uid()}))
    (fp_text user "FLEX ENTRY" (at 0 1.3) (layer "F.SilkS") (tstamp ${uid()}) ${effects(0.45, 0.08)})
${pads}
    (pad "MP" smd rect (at -6.75 -3.3 270) (size 0.8 0.8) (layers "F.Cu" "F.Paste" "F.Mask") (tstamp ${uid()}))
    (pad "MP" smd rect (at 6.75 -3.3 270) (size 0.8 0.8) (layers "F.Cu" "F.Paste" "F.Mask") (tstamp ${uid()}))
  )`;
}

function tagConnect() {
  const map = {
    1: [nets["3V3"], "3V3"],
    2: [nets.DGND, "DGND"],
    3: [nets.EXT_MOSI, "EXT_MOSI"],
    4: [nets.EXT_CLK, "EXT_CLK"],
    5: [nets.EXT_CS, "EXT_CS"],
    6: [nets.EXT_DC, "EXT_DC"],
    7: [nets.EXT_RST, "EXT_RST"],
    8: [nets.EXT_BUSY, "EXT_BUSY"],
    9: [nets.DGND, "DGND"],
    10: [nets["3V3"], "3V3"],
  };
  // This no-pop target is probed from the physical rear. Explicitly mirror
  // its keyed pattern in X; B.Cu alone does not transform local coordinates.
  const coordinates = {
    1: [2.54, 0.635],
    2: [1.27, 0.635],
    3: [0, 0.635],
    4: [-1.27, 0.635],
    5: [-2.54, 0.635],
    6: [-2.54, -0.635],
    7: [-1.27, -0.635],
    8: [0, -0.635],
    9: [1.27, -0.635],
    10: [2.54, -0.635],
  };
  const pads = Object.entries(coordinates)
    .map(([pin, [x, y]]) => {
      const [net, name] = map[pin];
      return `    (pad "${pin}" smd circle (at ${x} ${y}) (size 0.787 0.787) (layers "B.Cu" "B.Mask") (net ${net} "${name}") (tstamp ${uid()}))`;
    })
    .join("\n");
  return `  (footprint "Connector:Tag-Connect_TC2050-IDC-NL_2x05_P1.27mm_Vertical" (layer "B.Cu") (tstamp ${uid()})
    (at 90 137)
${fpText("reference", "J3", 0, -3.4, "B.SilkS", 0.75, "mirror")}
${fpText("value", "TC2050-IDC-NL / DNL", 0, 3.6, "B.Fab", 0.6, "mirror")}
    (fp_rect (start -3.1 -1.25) (end 3.1 1.25) (stroke (width 0.12) (type dash)) (fill none) (layer "B.SilkS") (tstamp ${uid()}))
    (fp_text user "NO PASTE" (at 0 2.5) (layer "B.SilkS") (tstamp ${uid()}) ${effects(0.55, 0.1, "mirror")})
${pads}
    (pad "" np_thru_hole circle (at 3.81 0) (size 0.991 0.991) (drill 0.991) (layers "*.Cu" "*.Mask") (tstamp ${uid()}))
    (pad "" np_thru_hole circle (at -3.81 1.016) (size 0.991 0.991) (drill 0.991) (layers "*.Cu" "*.Mask") (tstamp ${uid()}))
    (pad "" np_thru_hole circle (at -3.81 -1.016) (size 0.991 0.991) (drill 0.991) (layers "*.Cu" "*.Mask") (tstamp ${uid()}))
  )`;
}

function espRibbonHeader() {
  const map = {
    1: [nets["3V3"], "3V3"],
    2: [nets.DGND, "DGND"],
    3: [nets.EXT_BUSY, "EXT_BUSY"],
    4: [nets.EXT_RST, "EXT_RST"],
    5: [nets.EXT_DC, "EXT_DC"],
    6: [nets.EXT_CS, "EXT_CS"],
    7: [nets.EXT_MOSI, "EXT_MOSI"],
    8: [nets.EXT_CLK, "EXT_CLK"],
  };
  const pads = Object.entries(map)
    .map(([pinText, [net, name]]) => {
      const pin = Number(pinText);
      const x = n((pin - 1) * ESP_RIBBON.pitch);
      const shape = pin === 1 ? "rect" : "circle";
      return `    (pad "${pin}" thru_hole ${shape} (at ${x} 0) (size 2 2) (drill 1) (layers "*.Cu" "*.Mask") (net ${net} "${name}") (tstamp ${uid()}))`;
    })
    .join("\n");
  return `  (footprint "Badge:ESP_Ribbon_1x08_P2.54mm" (layer "B.Cu") (tstamp ${uid()})
    (at ${ESP_RIBBON.pin1X} ${ESP_RIBBON.y})
${fpText("reference", "J4", 8.89, -2.2, "B.SilkS", 0.7, "mirror")}
${fpText("value", "1x08 P2.54 / OPTIONAL / DNP", 8.89, 2.2, "B.Fab", 0.5, "mirror")}
    (fp_rect (start -1.2 -1.35) (end 18.95 1.35) (stroke (width 0.12) (type default)) (fill none) (layer "B.SilkS") (tstamp ${uid()}))
    (fp_text user "ESP RIBBON · 3V3 ONLY" (at 8.89 -2.2) (layer "B.SilkS") (tstamp ${uid()}) ${effects(0.54, 0.1, "mirror")})
${pads}
  )`;
}

function espMountSlots() {
  const pads = ESP32_MOUNT_SLOTS.map(
    ({ x, y }) => `    (pad "" np_thru_hole oval (at ${x} ${y}) (size 2.2 6) (drill oval 2.2 6) (layers "*.Cu" "*.Mask") (tstamp ${uid()}))`
  ).join("\n");
  return `  (footprint "Badge:ESP32_Cradle_Strap_Slots" (layer "B.Cu") (tstamp ${uid()})
    (at 0 0)
${fpText("reference", "MH1", 20.25, 124, "B.Fab", 0.5, "mirror")}
${fpText("value", "4x 2.2x6 NPTH CRADLE SLOTS", 20.25, 141.5, "B.Fab", 0.5, "mirror")}
${pads}
  )`;
}

function esp32Bay() {
  const cx = n(ESP32_BAY.left + ESP32_BAY.width / 2);
  const cy = n(ESP32_BAY.top + ESP32_BAY.height / 2);
  const hx = n(ESP32_BAY.width / 2);
  const hy = n(ESP32_BAY.height / 2);
  return `  (footprint "Badge:Waveshare_ESP32_Driver_Board_V3_Header_Clear_Cradle_Bay" (layer "B.Cu") (tstamp ${uid()})
    (at ${cx} ${cy})
${fpText("reference", "MOD1", 0, -21.4, "B.SilkS", 0.75, "mirror")}
${fpText("value", "WAVESHARE E-PAPER ESP32 DRIVER BOARD V3 / OPTIONAL", 0, 0, "B.Fab", 0.55, "mirror")}
    (fp_rect (start ${-hx} ${-hy}) (end ${hx} ${hy}) (stroke (width 0.2) (type dash)) (fill none) (layer "B.SilkS") (tstamp ${uid()}))
    (fp_rect (start ${-hx} ${-hy}) (end ${hx} ${hy}) (stroke (width 0.1) (type default)) (fill none) (layer "B.CrtYd") (tstamp ${uid()}))
    (fp_rect (start -14.15 -21) (end -12.65 21) (stroke (width 0.12) (type dash)) (fill none) (layer "B.Adhes") (tstamp ${uid()}))
    (fp_rect (start 12.65 -21) (end 14.15 21) (stroke (width 0.12) (type dash)) (fill none) (layer "B.Adhes") (tstamp ${uid()}))
    (fp_text user "OPTIONAL ESP32 BAY" (at 0 -17.8) (layer "B.SilkS") (tstamp ${uid()}) ${effects(0.8, 0.15, "mirror")})
    (fp_text user "HEADER-CLEAR SPACER" (at 0 2) (layer "B.SilkS") (tstamp ${uid()}) ${effects(0.65, 0.12, "mirror")})
    (fp_text user "NO PIN HOLES" (at 0 5) (layer "B.SilkS") (tstamp ${uid()}) ${effects(0.58, 0.1, "mirror")})
    (fp_text user "ANTENNA / REDUCED RANGE" (at 0 -12.5) (layer "B.SilkS") (tstamp ${uid()}) ${effects(0.55, 0.12, "mirror")})
    (fp_text user "USB-C DOWN · USE J4" (at 0 20.8) (layer "B.SilkS") (tstamp ${uid()}) ${effects(0.7, 0.13, "mirror")})
    (fp_line (start -2.2 ${n(hy - 1.2)}) (end 0 ${hy}) (stroke (width 0.25) (type default)) (layer "B.SilkS") (tstamp ${uid()}))
    (fp_line (start 2.2 ${n(hy - 1.2)}) (end 0 ${hy}) (stroke (width 0.25) (type default)) (layer "B.SilkS") (tstamp ${uid()}))
  )`;
}

function displayEnvelope() {
  return `  (footprint "Badge:Waveshare_3.52in_Raw_Panel" (layer "F.Cu") (tstamp ${uid()})
    (at ${PANEL.centerX} ${PANEL.centerY})
${fpText("reference", "EPD1", 0, -29.2, "F.Fab", 0.8)}
${fpText("value", "WAVESHARE 3.52in RAW E-PAPER / 240x360", 0, 29.2, "F.Fab", 0.7)}
    (fp_rect (start -42.35 -27.205) (end 42.35 27.205) (stroke (width 0.25) (type default)) (fill none) (layer "F.Fab") (tstamp ${uid()}))
    (fp_rect (start -34.53 -24.835) (end 39.98 24.835) (stroke (width 0.15) (type dash)) (fill none) (layer "Dwgs.User") (tstamp ${uid()}))
    (fp_rect (start -46 -6.25) (end -42.35 6.25) (stroke (width 0.15) (type default)) (fill none) (layer "F.Fab") (tstamp ${uid()}))
    (fp_line (start -44.5 -6.25) (end -44.5 6.25) (stroke (width 0.12) (type dash)) (layer "F.Fab") (tstamp ${uid()}))
    (fp_text user "ACTIVE AREA 74.51 x 49.67" (at 2.725 0) (layer "Dwgs.User") (tstamp ${uid()}) ${effects(0.8, 0.12)})
    (fp_text user "3.65 mm FLEX · FRONT J1" (at -44.175 0 90) (layer "F.Fab") (tstamp ${uid()}) ${effects(0.5, 0.09)})
  )`;
}

function audioPads() {
  return `  (footprint "Badge:Audio_Pigtail_2Pin" (layer "F.Cu") (tstamp ${uid()})
    (at 4.5 22)
${fpText("reference", "J2", 4, 2.5, "F.SilkS", 0.8)}
${fpText("value", "AUDIO", 4, 4.5, "F.SilkS", 0.8)}
    (pad "1" thru_hole rect (at 0 0) (size 2.6 2.6) (drill 1.2) (layers "*.Cu" "*.Mask") (net ${nets.AUDIO_SIG} "AUDIO_SIG") (tstamp ${uid()}))
    (pad "2" thru_hole circle (at 0 5) (size 2.6 2.6) (drill 1.2) (layers "*.Cu" "*.Mask") (net ${nets.AUDIO_GND} "AUDIO_GND") (tstamp ${uid()}))
  )`;
}

function pickupReferenceFootprint() {
  // The winding itself is generated as routed copper so its two series layers
  // can meet at R2.  This padless marker keeps the schematic/BOM reference
  // visible without pretending the spiral is an ordinary placed component.
  return `  (footprint "Badge:Generated_PCB_Spiral" (layer "F.Cu") (tstamp ${uid()})
    (at 50 39)
${fpText("reference", "L1", 0, 10.8, "F.Fab", 0.7)}
${fpText("value", "30T_X2_CHAMFERED_SEARCH_COIL", 0, 12.2, "F.Fab", 0.6)}
  )`;
}

function aisbLogoFootprint() {
  const polygons = AISB_SILK_POLYGONS.map(
    (polygon) => `    (fp_poly
      (pts ${polygon
        .map(scaledLogoPoint)
        .map(([x, y]) => `(xy ${x} ${y})`)
        .join(" ")})
      (stroke (width 0.01) (type default)) (fill solid) (layer "F.SilkS") (tstamp ${uid()}))`
  ).join("\n");
  return `  (footprint "Badge:AISB_Logo_Vector" (layer "F.Cu") (tstamp ${uid()})
    (at ${AISB_LOGO.x} ${AISB_LOGO.y})
${fpText("reference", "LOGO1", 0, n4(-7.2 * AISB_LOGO.scale), "F.Fab", 0.7)}
${fpText("value", "AISB OFFICIAL WORDMARK", 0, n4(7.2 * AISB_LOGO.scale), "F.Fab", 0.7)}
${polygons}
  )`;
}

function rearBadgeQrBarcode() {
  const quietMargin = n4(BADGE_QR.quietModules * BADGE_QR.moduleMm);

  return `  (barcode
    (at ${REAR_BADGE_QR.x} ${REAR_BADGE_QR.y} 0)
    (layer "B.SilkS")
    (size ${BADGE_QR.symbolMm} ${BADGE_QR.symbolMm})
    (text "${BADGE_QR.payload}")
    (text_height 1)
    (type qr)
    (ecc_level ${BADGE_QR.ecc})
    (hide yes)
    (knockout yes)
    (margins ${quietMargin} ${quietMargin})
    (tstamp ${uid()})
  )`;
}

function roundedRect(x1, y1, x2, y2, r, layer = "Edge.Cuts", width = 0.1) {
  const k = r * 0.70710678;
  return [
    `  (gr_line (start ${x1 + r} ${y1}) (end ${x2 - r} ${y1}) (stroke (width ${width}) (type default)) (layer "${layer}") (tstamp ${uid()}))`,
    `  (gr_arc (start ${x2 - r} ${y1}) (mid ${n(x2 - r + k)} ${n(y1 + r - k)}) (end ${x2} ${y1 + r}) (stroke (width ${width}) (type default)) (layer "${layer}") (tstamp ${uid()}))`,
    `  (gr_line (start ${x2} ${y1 + r}) (end ${x2} ${y2 - r}) (stroke (width ${width}) (type default)) (layer "${layer}") (tstamp ${uid()}))`,
    `  (gr_arc (start ${x2} ${y2 - r}) (mid ${n(x2 - r + k)} ${n(y2 - r + k)}) (end ${x2 - r} ${y2}) (stroke (width ${width}) (type default)) (layer "${layer}") (tstamp ${uid()}))`,
    `  (gr_line (start ${x2 - r} ${y2}) (end ${x1 + r} ${y2}) (stroke (width ${width}) (type default)) (layer "${layer}") (tstamp ${uid()}))`,
    `  (gr_arc (start ${x1 + r} ${y2}) (mid ${n(x1 + r - k)} ${n(y2 - r + k)}) (end ${x1} ${y2 - r}) (stroke (width ${width}) (type default)) (layer "${layer}") (tstamp ${uid()}))`,
    `  (gr_line (start ${x1} ${y2 - r}) (end ${x1} ${y1 + r}) (stroke (width ${width}) (type default)) (layer "${layer}") (tstamp ${uid()}))`,
    `  (gr_arc (start ${x1} ${y1 + r}) (mid ${n(x1 + r - k)} ${n(y1 + r - k)}) (end ${x1 + r} ${y1}) (stroke (width ${width}) (type default)) (layer "${layer}") (tstamp ${uid()}))`,
  ].join("\n");
}

function circularCutout(cx, cy, diameter, layer = "Edge.Cuts", width = 0.1) {
  return `  (gr_circle (center ${cx} ${cy}) (end ${n(
    cx + diameter / 2
  )} ${cy}) (stroke (width ${width}) (type default)) (fill none) (layer "${layer}") (tstamp ${uid()}))`;
}

function chamferedInwardCW(left, top, right, bottom, count, pitch, chamfer) {
  const points = [[left + chamfer, top]];
  for (let i = 0; i < count; i += 1) {
    const l = left + i * pitch;
    const t = top + i * pitch;
    const r = right - i * pitch;
    const b = bottom - i * pitch;
    points.push(
      [r - chamfer, t],
      [r, t + chamfer],
      [r, b - chamfer],
      [r - chamfer, b],
      [l + pitch + chamfer, b],
      [l + pitch, b - chamfer],
      [l + pitch, t + pitch + chamfer],
      [l + pitch + chamfer, t + pitch]
    );
  }
  return points;
}

function chamferedInwardCCW(left, top, right, bottom, count, pitch, chamfer) {
  const points = [[left + chamfer, top]];
  for (let i = 0; i < count; i += 1) {
    const l = left + i * pitch;
    const t = top + i * pitch;
    const r = right - i * pitch;
    const b = bottom - i * pitch;
    points.push(
      [l, t + chamfer],
      [l, b - chamfer],
      [l + chamfer, b],
      [r - chamfer, b],
      [r, b - chamfer],
      [r, t + pitch + chamfer],
      [r - chamfer, t + pitch],
      [l + pitch + chamfer, t + pitch]
    );
  }
  return points;
}

// A large loop maximizes flux linkage.  Thirty robust 0.30 mm turns on each
// layer are series-aiding; the 1.5 mm chamfers preserve almost all rectangular
// area while shortening copper and making the artwork less visually harsh.
const pickupDesign = {
  left: 10,
  top: 15,
  right: 90,
  bottom: 64,
  turnsPerLayer: 30,
  traceWidth: 0.3,
  spacing: 0.2,
  pitch: 0.5,
  chamfer: 1.5,
};
const coilTop = chamferedInwardCW(
  pickupDesign.left,
  pickupDesign.top,
  pickupDesign.right,
  pickupDesign.bottom,
  pickupDesign.turnsPerLayer,
  pickupDesign.pitch,
  pickupDesign.chamfer
);
const coilBottom = chamferedInwardCCW(
  pickupDesign.left,
  pickupDesign.top,
  pickupDesign.right,
  pickupDesign.bottom,
  pickupDesign.turnsPerLayer,
  pickupDesign.pitch,
  pickupDesign.chamfer
).reverse();
const coilOuter = coilTop[0];
const coilInner = coilTop.at(-1);

const pickupParts = [
  chip2("C1", "4.7uF", 7, 17, nets.AUDIO_SIG, "AUDIO_SIG", nets.PICKUP_A, "PICKUP_A", { pkg: "1206" }),
  chip2("R1", "4.99k", 7.5, 24, nets.AUDIO_SIG, "AUDIO_SIG", nets.AUDIO_GND, "AUDIO_GND", { pkg: "0805" }),
  chip2("R2", "0R", 31, 34, nets.PICKUP_A, "PICKUP_A", nets.AUDIO_GND, "AUDIO_GND", { pkg: "0805" }),
  pickupReferenceFootprint(),
  audioPads(),
].join("\n");

const pickupRoutes = [
  polyline(coilTop, pickupDesign.traceWidth, "F.Cu", nets.PICKUP_A),
  polyline(coilBottom, pickupDesign.traceWidth, "B.Cu", nets.AUDIO_GND),
  // C1 and R1 are rear SMD parts.  The first via is the deliberate layer
  // transition from the front spiral; all remaining audio routing is B.Cu.
  polyline([coilOuter, [9, 15], [8.5, 15.5], [8, 15.5]], 0.35, "F.Cu", nets.PICKUP_A),
  via(8, 15.5, nets.PICKUP_A),
  polyline([[8, 15.5], [8, 16.5], [8.5, 17]], 0.35, "B.Cu", nets.PICKUP_A),
  // Join the two aligned spirals at their inner ends through removable R2.
  polyline([coilInner, [26.5, 31], [27.5, 32]], pickupDesign.traceWidth, "F.Cu", nets.PICKUP_A),
  via(27.5, 32, nets.PICKUP_A, 0.9, 0.45),
  polyline([[27.5, 32], [27.5, 34], [30, 34]], 0.35, "B.Cu", nets.PICKUP_A),
  polyline(
    [coilBottom[0], [34, 30], [34, 34], [32, 34]],
    pickupDesign.traceWidth,
    "B.Cu",
    nets.AUDIO_GND
  ),
  polyline([coilBottom.at(-1), [9.5, 13], [9.5, 12.5], [2, 12.5], [2, 27], [4.5, 27]], 0.35, "B.Cu", nets.AUDIO_GND),
  polyline([[5.5, 17], [4.5, 17], [4.5, 22]], 0.35, "B.Cu", nets.AUDIO_SIG),
  polyline([[6.5, 24], [5.5, 24], [5.5, 22], [4.5, 22]], 0.35, "B.Cu", nets.AUDIO_SIG),
  polyline([[8.5, 24], [8.5, 27], [4.5, 27]], 0.35, "B.Cu", nets.AUDIO_GND),
].join("\n");

const rowY = (pin) => n(69 + (pin - 1) * 2.6);
const fpcPad = (pin) => [PANEL_J1.signalRowX, n(88.455 + (pin - 1) * 0.5)];
const fpcViaX = 45;
const breakX = 60.2;
const usedPins = {
  2: nets.GDR,
  3: nets.RESE,
  4: nets.LEGACY_NC,
  5: nets.VDHR,
  8: nets.BS,
  9: nets.EPD_BUSY,
  10: nets.EPD_RST,
  11: nets.EPD_DC,
  12: nets.EPD_CS,
  13: nets.EPD_CLK,
  14: nets.EPD_MOSI,
  15: nets["3V3"],
  16: nets["3V3"],
  17: nets.DGND,
  18: nets.VDDD,
  19: nets.VPP,
  20: nets.VSH,
  21: nets.VGH,
  22: nets.VSL,
  23: nets.VGL,
  24: nets.VCOM,
};
const fpcBreakout = Object.entries(usedPins)
  .flatMap(([pin, net]) => {
    const pinNumber = Number(pin);
    const start = fpcPad(pinNumber);
    const spread = [fpcViaX, rowY(pinNumber)];
    const dy = spread[1] - start[1];
    // Stagger the knees so the fine 0.5 mm connector pitch opens into a set
    // of parallel 45-degree rivers without crowding.  A common knee would
    // leave too little edge-to-edge clearance between adjacent diagonal runs.
    const leadX =
      dy < 0 ? 12 + (pinNumber - 2) * 0.15 : 14.5 - (pinNumber - 11) * 0.15;
    const frontRoute = polyline(
      [start, [n(leadX), start[1]], [n(leadX + Math.abs(dy)), spread[1]], spread],
      0.2,
      "F.Cu",
      net
    );
    let rearRoute;
    if (pinNumber === 2) {
      // R4's GDR terminal is on the right; pass above its left DGND land.
      rearRoute = polyline(
        [spread, [56.8, spread[1]], [58.3, 70.1], [breakX, 70.1], [breakX, spread[1]]],
        0.2,
        "B.Cu",
        net
      );
    } else if (pinNumber === 3) {
      // R3's RESE terminal is on the right; pass below its left DGND land.
      rearRoute = polyline(
        [spread, [56.8, spread[1]], [58.3, 75.7], [breakX, 75.7], [breakX, spread[1]]],
        0.2,
        "B.Cu",
        net
      );
    } else if (pinNumber === 23) {
      rearRoute = polyline(
        [spread, [45.8, 125.4], [52, 125.4], [52.8, spread[1]], [breakX, spread[1]]],
        0.2,
        "B.Cu",
        net
      );
    } else {
      rearRoute = segment(spread, [breakX, spread[1]], 0.2, "B.Cu", net);
    }
    return [
      frontRoute,
      via(spread[0], spread[1], net),
      rearRoute,
    ];
  })
  .join("\n");

const supportParts = [
  fpcConnector(),
  displayEnvelope(),
  tagConnect(),
  espRibbonHeader(),
  espMountSlots(),
  esp32Bay(),
  mosfet(),
  chip2("R3", "3R", 59.4, rowY(3), nets.DGND, "DGND", nets.RESE, "RESE", { solidPads: [1] }),
  chip2("R4", "10k", 59.4, rowY(2), nets.DGND, "DGND", nets.GDR, "GDR", { solidPads: [1] }),
  chip2("R5", "100R", 61, rowY(14), nets.EPD_MOSI, "EPD_MOSI", nets.EXT_MOSI, "EXT_MOSI"),
  chip2("R6", "100R", 61, rowY(13), nets.EPD_CLK, "EPD_CLK", nets.EXT_CLK, "EXT_CLK"),
  chip2("R7", "100R", 61, rowY(12), nets.EPD_CS, "EPD_CS", nets.EXT_CS, "EXT_CS"),
  chip2("R8", "100R", 61, rowY(11), nets.EPD_DC, "EPD_DC", nets.EXT_DC, "EXT_DC"),
  chip2("R9", "100R", 61, rowY(10), nets.EPD_RST, "EPD_RST", nets.EXT_RST, "EXT_RST"),
  chip2("R10", "1k", 61, rowY(9), nets.EPD_BUSY, "EPD_BUSY", nets.EXT_BUSY, "EXT_BUSY"),
  chip2("R11", "100k", 68, 96, nets.EPD_CS, "EPD_CS", nets["3V3"], "3V3"),
  chip2("R12", "100k", 68, 91, nets.EPD_RST, "EPD_RST", nets.DGND, "DGND"),
  chip2("R13", "0R", 61, rowY(8), nets.BS, "BS", nets.DGND, "DGND"),
  chip2("C2", "4.7uF 50V", 90, 70, nets["3V3"], "3V3", nets.DGND, "DGND", { pkg: "1206" }),
  chip2("C3", "4.7uF 50V", 78, 73, nets.SW, "SW", nets.CFLY, "CFLY", { pkg: "1206" }),
  chip2("C4", "1uF 25V", 61.2, rowY(5), nets.VDHR, "VDHR", nets.DGND, "DGND", { pkg: "0805" }),
  chip2("C5", "1uF 10V", 61.2, rowY(18), nets.VDDD, "VDDD", nets.DGND, "DGND", { pkg: "0805" }),
  chip2("C6", "1uF 25V", 61.2, rowY(19), nets.VPP, "VPP", nets.DGND, "DGND", { pkg: "0805" }),
  chip2("C7", "1uF 25V", 61.2, rowY(20), nets.VSH, "VSH", nets.DGND, "DGND", { pkg: "0805" }),
  chip2("C8", "1uF 25V", 61.2, rowY(21), nets.VGH, "VGH", nets.DGND, "DGND", { pkg: "0805" }),
  chip2("C9", "1uF 25V", 61.2, rowY(22), nets.VSL, "VSL", nets.DGND, "DGND", { pkg: "0805", solidPads: [2] }),
  chip2("C10", "1uF 25V", 61.2, rowY(23), nets.VGL, "VGL", nets.DGND, "DGND", { pkg: "0805" }),
  chip2("C11", "1uF 25V", 61.2, rowY(24), nets.VCOM, "VCOM", nets.DGND, "DGND", { pkg: "0805" }),
  chip2("C12", "10uF 10V", 47, 130, nets.DGND, "DGND", nets["3V3"], "3V3", { pkg: "0805" }),
  chip2("C13", "100nF", 47, 126.5, nets.DGND, "DGND", nets["3V3"], "3V3", { solidPads: [1] }),
  chip2("C14", "1uF 10V", 61.2, rowY(15), nets["3V3"], "3V3", nets.DGND, "DGND", { pkg: "0805" }),
  chip2("C15", "1uF 25V", 61.2, rowY(4), nets.LEGACY_NC, "LEGACY_NC", nets.DGND, "DGND", { pkg: "0805", dnp: true }),
  chip2("L2", "68uH", 73, 69.5, nets.SW, "SW", nets["3V3"], "3V3", { pkg: "1210" }),
  diode("D1", 84, 73, nets.CFLY, "CFLY", nets.DGND, "DGND"),
  diode("D2", 75, rowY(23), nets.VGL, "VGL", nets.CFLY, "CFLY"),
  diode("D3", 75, rowY(21), nets.SW, "SW", nets.VGH, "VGH"),
].join("\n");

const externalRows = [
  // Escape to the mirrored physical-rear TC2050 pads through parallel
  // 45-degree lanes. The intermediate targets keep the keyed-hole field clear.
  [9, nets.EXT_BUSY, [78, 128]],
  [10, nets.EXT_RST, [81.5, 130]],
  [11, nets.EXT_DC, [83, 134]],
  // Keep the final three front-side transition vias above J4.  Their rear
  // routes drop to J3 after clearing the optional through-hole header.
  [12, nets.EXT_CS, [84, 136]],
  [13, nets.EXT_CLK, [82, 137.5]],
  [14, nets.EXT_MOSI, [80.5, 139]],
];
const externalRoutes = externalRows
  .flatMap(([pin, net, target], index) => {
    const start = [64, rowY(pin)];
    // Put lower destination rows in the leftmost lanes, then rise in parallel
    // vertical trunks.  The one-millimetre 45-degree corner clips make a
    // clean routed "river" without the long diagonals crossing each other or
    // sweeping through the optional J4 through-hole pads.
    const laneX = n(72 - index * 1.2);
    return [
      segment([61.8, rowY(pin)], start, 0.25, "B.Cu", net),
      via(start[0], start[1], net),
      polyline(
        [
          start,
          [n(laneX - 1), start[1]],
          [laneX, n(start[1] + 1)],
          [laneX, n(target[1] - 1)],
          [n(laneX + 1), target[1]],
          target,
        ],
        0.25,
        "F.Cu",
        net
      ),
      via(target[0], target[1], net),
    ];
  })
  .concat([
    polyline([[78, 128], [90, 128], [90, 136.365]], 0.25, "B.Cu", nets.EXT_BUSY),
    polyline([[81.5, 130], [88.73, 130], [88.73, 136.365]], 0.25, "B.Cu", nets.EXT_RST),
    polyline([[83, 134], [87.46, 134], [87.46, 136.365]], 0.25, "B.Cu", nets.EXT_DC),
    polyline([[87.46, 137.635], [87.46, 140], [84, 140], [84, 136]], 0.25, "B.Cu", nets.EXT_CS),
    polyline([[88.73, 137.635], [88.73, 142], [82, 142], [82, 137.5]], 0.25, "B.Cu", nets.EXT_CLK),
    polyline([[90, 137.635], [90, 144], [80.5, 144], [80.5, 139]], 0.25, "B.Cu", nets.EXT_MOSI),
  ])
  .join("\n");

const espRibbonSignals = [
  [3, nets.EXT_BUSY, [[65.08, 140.5], [65.5, 140.5], [78, 128]]],
  [4, nets.EXT_RST, [[67.62, 140.5], [78.12, 130], [81.5, 130]]],
  [5, nets.EXT_DC, [[70.16, 140.5], [76.66, 134], [83, 134]]],
  [6, nets.EXT_CS, [[72.7, 140.5], [77.2, 136], [84, 136]]],
  [7, nets.EXT_MOSI, [[75.24, 140.5], [76.74, 142], [80.5, 142], [80.5, 139]]],
  [8, nets.EXT_CLK, [[77.78, 140.5], [80.78, 137.5], [82, 137.5]]],
];
const espRibbonRoutes = espRibbonSignals
  .flatMap(([, net, points]) => {
    return [polyline(points, 0.25, "B.Cu", net)];
  })
  .concat([
    // J4 pin 1 is the Waveshare board's regulated VDD3V3 output. Never route
    // its 5 V header pin to the badge. J4 pin 2 reaches the rear DGND zone.
    polyline([[ESP_RIBBON.pin1X, ESP_RIBBON.y], [58.3, 142.2], [50, 142.2]], 0.45, "B.Cu", nets["3V3"]),
    via(50, 142.2, nets["3V3"], 0.8, 0.4),
    segment([50, 142.2], [50, 142], 0.45, "F.Cu", nets["3V3"]),
  ])
  .join("\n");

const supportRoutes = [
  // Give the paste-free controller grounds explicit copper paths.  J3's two
  // contacts bridge through the pour-blocked center strip; J4 escapes north
  // to a ground via instead of relying on a thermal squeezed between pads.
  segment([91.27, 136.365], [91.27, 137.635], 0.3, "B.Cu", nets.DGND),
  segment([91.27, 137.635], [91.27, 142.5], 0.35, "B.Cu", nets.DGND),
  via(91.27, 142.5, nets.DGND, 0.8, 0.4),
  segment([62.54, 140.5], [62.54, 137], 0.35, "B.Cu", nets.DGND),
  via(62.54, 137, nets.DGND, 0.8, 0.4),
  // GDR/RESE booster control.
  segment([60.2, rowY(2)], [62.5, rowY(2)], 0.25, "B.Cu", nets.GDR),
  via(62.5, rowY(2), nets.GDR, 0.6, 0.3),
  polyline([[62.5, rowY(2)], [64.85, 73.95], [65, 73.95]], 0.25, "F.Cu", nets.GDR),
  via(65, 73.95, nets.GDR, 0.6, 0.3),
  segment([65, 73.95], [67, 73.95], 0.25, "B.Cu", nets.GDR),
  polyline([[60.2, rowY(3)], [63, rowY(3)], [63, 72.05], [67, 72.05]], 0.25, "B.Cu", nets.RESE),
  // Switch node and local charge-pump connections.
  segment([69, 73], [76.5, 73], 0.35, "B.Cu", nets.SW),
  polyline([[71.4, 69.5], [71.4, 73]], 0.35, "B.Cu", nets.SW),
  polyline([[76.5, 73], [76.5, 75.5], [78, 75.5], [78, 118], [73.6, 118], [73.6, rowY(21)]], 0.35, "B.Cu", nets.SW),
  segment([79.5, 73], [82.6, 73], 0.3, "B.Cu", nets.CFLY),
  polyline([[79.5, 73], [80.5, 74], [80.5, rowY(23)], [76.4, rowY(23)]], 0.3, "B.Cu", nets.CFLY),
  // Rail-to-diode branches avoid the grounded capacitor pads.
  polyline([[60.2, rowY(21)], [60.2, 122.3], [76.4, 122.3], [76.4, rowY(21)]], 0.3, "B.Cu", nets.VGH),
  polyline([[60.2, rowY(23)], [60.2, 124.9], [73.6, 124.9], [73.6, rowY(23)]], 0.3, "B.Cu", nets.VGL),
  // Panel CS pull-up and reset pull-down connect to the raw side of R7/R9.
  polyline([[60.2, rowY(12)], [60.2, 96], [67.2, 96]], 0.2, "B.Cu", nets.EPD_CS),
  polyline([[60.2, rowY(10)], [60.2, 91], [67.2, 91]], 0.2, "B.Cu", nets.EPD_RST),
  polyline([[68.8, 96], [70, 96], [70, 106.5], [60.2, 106.5], [60.2, rowY(15)]], 0.3, "B.Cu", nets["3V3"]),
  // J3's two 3V3 contacts join to the right of its key holes, then feed the
  // front-side rail around the display perimeter instead of crossing signals.
  polyline([[92.54, 136.365], [95.5, 133.405], [95.5, 133]], 0.45, "B.Cu", nets["3V3"]),
  polyline([[92.54, 137.635], [96.5, 141.595], [96.5, 133], [95.5, 133]], 0.45, "B.Cu", nets["3V3"]),
  via(95.5, 133, nets["3V3"], 0.8, 0.4),
  polyline([[95.5, 133], [97, 131.5], [97, 68], [74.6, 68]], 0.45, "F.Cu", nets["3V3"]),
  segment([50, 70], [50, 142], 0.5, "F.Cu", nets["3V3"]),
  // Entry decoupling.
  segment([48, 130], [50, 130], 0.45, "B.Cu", nets["3V3"]),
  via(50, 130, nets["3V3"]),
  segment([48, 126.5], [50, 126.5], 0.35, "B.Cu", nets["3V3"]),
  via(50, 126.5, nets["3V3"]),
  // Supply the panel VDD/VDDIO and local decoupling.
  via(58, rowY(15), nets["3V3"]),
  segment([58, rowY(15)], [50, rowY(15)], 0.45, "F.Cu", nets["3V3"]),
  via(58, rowY(16), nets["3V3"]),
  segment([58, rowY(16)], [50, rowY(16)], 0.45, "F.Cu", nets["3V3"]),
  // Booster supply and input capacitor.
  segment([74.6, 69.5], [74.6, 68], 0.45, "B.Cu", nets["3V3"]),
  via(74.6, 68, nets["3V3"]),
  polyline([[74.6, 68], [50, 68], [50, 70]], 0.45, "F.Cu", nets["3V3"]),
  segment([88.5, 70], [87, 70], 0.45, "B.Cu", nets["3V3"]),
  via(87, 70, nets["3V3"]),
  segment([87, 70], [50, 70], 0.45, "F.Cu", nets["3V3"]),
].join("\n");

const tagKeepout = `  (zone (net 0) (net_name "") (layers "B.Cu") (tstamp ${uid()}) (hatch edge 0.5)
    (connect_pads (clearance 0))
    (min_thickness 0.25)
    (keepout (tracks allowed) (vias not_allowed) (pads allowed) (copperpour not_allowed) (footprints allowed))
    (polygon (pts (xy 87.3 136.75) (xy 92.7 136.75) (xy 92.7 137.25) (xy 87.3 137.25)))
  )`;

const pickupKeepouts = ["F.Cu", "B.Cu"]
  .map(
    (layer) => `  (zone (net 0) (net_name "") (layers "${layer}") (tstamp ${uid()}) (hatch edge 0.5)
    (connect_pads (clearance 0))
    (min_thickness 0.25)
    (keepout (tracks allowed) (vias allowed) (pads allowed) (copperpour not_allowed) (footprints allowed))
    (polygon (pts (xy 8 13) (xy 92 13) (xy 92 65) (xy 8 65)))
  )`
  )
  .join("\n");

const espAntennaKeepouts = ["F.Cu", "B.Cu"]
  .map(
    (layer) => `  (zone (net 0) (net_name "") (layers "${layer}") (tstamp ${uid()}) (hatch edge 0.5)
    (connect_pads (clearance 0))
    (min_thickness 0.25)
    (keepout (tracks allowed) (vias allowed) (pads allowed) (copperpour not_allowed) (footprints allowed))
    (polygon (pts (xy ${ESP32_BAY.left} ${ESP32_BAY.top}) (xy ${n(
      ESP32_BAY.left + ESP32_BAY.width
    )} ${ESP32_BAY.top}) (xy ${n(ESP32_BAY.left + ESP32_BAY.width)} ${n(
      ESP32_BAY.top + ESP32_BAY.antennaDepth
    )}) (xy ${ESP32_BAY.left} ${n(ESP32_BAY.top + ESP32_BAY.antennaDepth)})))
  )`
  )
  .join("\n");

const groundZone = `  (zone (net ${nets.DGND}) (net_name "DGND") (layer "B.Cu") (tstamp ${uid()}) (hatch edge 0.5)
    (connect_pads (clearance 0.55))
    (min_thickness 0.25)
    (fill yes (thermal_gap 0.3) (thermal_bridge_width 0.3))
    (polygon (pts (xy 0.6 66) (xy 99.4 66) (xy 99.4 144.4) (xy 0.6 144.4)))
  )`;

const board = `(kicad_pcb (version 20221018) (generator vegas26_badge_generator)
  (general (thickness 1.6))
  (paper "A4")
  (layers
    (0 "F.Cu" signal)
    (31 "B.Cu" signal)
    (32 "B.Adhes" user "B.Adhesive")
    (33 "F.Adhes" user "F.Adhesive")
    (34 "B.Paste" user)
    (35 "F.Paste" user)
    (36 "B.SilkS" user "B.Silkscreen")
    (37 "F.SilkS" user "F.Silkscreen")
    (38 "B.Mask" user)
    (39 "F.Mask" user)
    (40 "Dwgs.User" user "User.Drawings")
    (41 "Cmts.User" user "User.Comments")
    (42 "Eco1.User" user "User.Eco1")
    (43 "Eco2.User" user "User.Eco2")
    (44 "Edge.Cuts" user)
    (45 "Margin" user)
    (46 "B.CrtYd" user "B.Courtyard")
    (47 "F.CrtYd" user "F.Courtyard")
    (48 "B.Fab" user)
    (49 "F.Fab" user)
  )
  (setup (pad_to_mask_clearance 0))
  (net 0 "")
${netDecls}

${supportParts}
${aisbLogoFootprint()}
${pickupParts}

${roundedRect(0, 0, W, H, 5)}
${circularCutout(
  LANYARD_HOLE.x,
  LANYARD_HOLE.y,
  LANYARD_HOLE.diameter
)}

  (gr_rect (start 0.5 65.2) (end 94.5 123.2) (stroke (width 0.2) (type dash)) (fill none) (layer "Dwgs.User") (tstamp ${uid()}))
  (gr_rect (start 7.15 66.5) (end 92.85 121.91) (stroke (width 0.15) (type dash)) (fill none) (layer "Dwgs.User") (tstamp ${uid()}))
${grText("NO-HOLE VIEWPORT 94 x 58 · REMOVABLE LEFT SERVICE SPINE", 47.5, 64.2, "Dwgs.User", 0.6, 0.1)}
${grText("AI SECURITY BOOTCAMP · LAS VEGAS 2026", 50, 47, "F.SilkS", 1.0, 0.16)}
${grText("PASSIVE EM PICKUP · 30T/LAYER", 27, 11.5, "F.SilkS", 0.85, 0.15)}
${grText("AUDIO", 5.5, 31, "F.SilkS", 0.8, 0.15)}
${grText("3.52in E-PAPER NAME BADGE", 50, 127, "F.SilkS", 1.1, 0.18)}
${grText("PROGRAM ON REAR · IMAGE STAYS WITHOUT POWER", 50, 131, "F.SilkS", 0.72, 0.12)}
${grText("REV 2 · VERIFY PANEL/J1 + ESP CRADLE", 72, 67.2, "B.SilkS", 0.7, 0.15, "mirror")}
${grText("J3 · TC2050", 90, 132.2, "B.SilkS", 0.65, 0.15, "mirror")}
${grText("ONE CONTROLLER · 3V3 ONLY", 68, 139.5, "B.SilkS", 0.62, 0.13, "mirror")}
${grText("J1 · FRONT ZIF · 3.65 mm FLEX · NO SLOT", 6.2, 103.1, "F.SilkS", 0.45, 0.08)}
${rearBadgeQrBarcode()}
${grText("aisb.dev/badge0", REAR_BADGE_QR.x, REAR_BADGE_QR.labelY, "B.SilkS", 1, 0.15, "mirror")}

  (footprint "Badge:Gold_Brand_Accent" (layer "F.Cu") (tstamp ${uid()})
    (at ${scaledGoldAccent.x} ${scaledGoldAccent.y})
    (pad "" smd roundrect (at 0 0) (size ${scaledGoldAccent.size} ${scaledGoldAccent.size}) (layers "F.Cu" "F.Mask") (roundrect_rratio 0.02) (tstamp ${uid()}))
  )

${fpcBreakout}
${externalRoutes}
${espRibbonRoutes}
${supportRoutes}
${pickupRoutes}
${tagKeepout}
${pickupKeepouts}
${espAntennaKeepouts}
${groundZone}
)
`;

const svgCoil = (points, color, opacity) =>
  `<polyline points="${points.map(([x, y]) => `${x},${y}`).join(" ")}" fill="none" stroke="${color}" stroke-width="${pickupDesign.traceWidth}" stroke-linejoin="round" opacity="${opacity}"/>`;

const wordmarkSource = fs.readFileSync(path.join(root, "assets", "aisb-wordmark.svg"), "utf8");
const wordmarkMatch = wordmarkSource.match(/<g id="aisb-wordmark"[\s\S]*?<\/g>/);
if (!wordmarkMatch) throw new Error("AISB path-only wordmark group missing");
const svgAisbLogo = (x, y, width, height, letters, accent) =>
  `<svg x="${x}" y="${y}" width="${width}" height="${height}" viewBox="0 0 2312.5 728" preserveAspectRatio="xMidYMid meet">
    ${wordmarkMatch[0]
      .replace('fill="#000000"', `fill="${letters}"`)
      .replace('fill="#ef4444"', `fill="${accent}"`)}
  </svg>`;

const preview = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="800" height="1160">
  <rect x="0.25" y="0.25" width="99.5" height="144.5" rx="5" fill="#111318" stroke="#d8bd68" stroke-width="0.5"/>
  <circle cx="${LANYARD_HOLE.x}" cy="${LANYARD_HOLE.y}" r="${
    LANYARD_HOLE.diameter / 2
  }" fill="#f3f4f6"/>
  ${svgCoil(coilBottom, "#8d7435", 0.45)}
  ${svgCoil(coilTop, "#d8bd68", 0.95)}
  ${svgAisbLogo(
    n4(AISB_LOGO.x - (AISB_LOGO.previewWidth * AISB_LOGO.scale) / 2),
    n4(AISB_LOGO.y - (AISB_LOGO.previewHeight * AISB_LOGO.scale) / 2),
    n4(AISB_LOGO.previewWidth * AISB_LOGO.scale),
    n4(AISB_LOGO.previewHeight * AISB_LOGO.scale),
    "#ffffff",
    "#d8bd68"
  )}
  <text x="50" y="47" text-anchor="middle" fill="#ffffff" font-family="Arial,sans-serif" font-size="1.65" font-weight="700">AI SECURITY BOOTCAMP · LAS VEGAS 2026</text>
  <rect x="0.5" y="65.2" width="94" height="58" rx="1.2" fill="#d7d9da" opacity="0.38" stroke="#b9c0c5" stroke-width="0.25"/>
  <rect x="7.65" y="67" width="84.7" height="54.41" rx="0.45" fill="#d9d6cc" stroke="#6b6b68" stroke-width="0.35"/>
  <rect x="15.47" y="69.37" width="74.51" height="49.67" fill="#f0eee7" stroke="#a29f96" stroke-width="0.18"/>
  <text x="52.725" y="87" text-anchor="middle" fill="#111111" font-family="Arial,sans-serif" font-size="7" font-weight="700">ALEX RIVERA</text>
  <text x="52.725" y="95" text-anchor="middle" fill="#111111" font-family="Arial,sans-serif" font-size="3.2">@alex · PARTICIPANT</text>
  <line x1="25" y1="101" x2="80" y2="101" stroke="#171717" stroke-width="0.35"/>
  <text x="52.725" y="109" text-anchor="middle" fill="#111111" font-family="Arial,sans-serif" font-size="2.6">AI SECURITY BOOTCAMP · VEGAS 2026</text>
  <rect x="0.5" y="65.2" width="6.65" height="58" rx="1.2" fill="#090a0d" opacity="0.96" stroke="#d8bd68" stroke-width="0.18"/>
  <rect x="1.7" y="87.1" width="3.8" height="14.2" rx="0.45" fill="#171a1f" stroke="#d8bd68" stroke-width="0.16"/>
  <line x1="1.7" y1="87.55" x2="1.7" y2="100.85" stroke="#9a7a31" stroke-width="0.22"/>
  <line x1="5" y1="87.55" x2="5" y2="100.85" stroke="#d8bd68" stroke-width="0.28"/>
  <path d="M5.5 88 h2.15 v12.5 H5.5" fill="none" stroke="#c87532" stroke-width="0.45"/>
  <text x="4.15" y="76.5" text-anchor="middle" fill="#d8bd68" font-family="Arial,sans-serif" font-size="1.15" font-weight="700" transform="rotate(90 4.15 76.5)">SERVICE SPINE</text>
  <text x="50" y="127.5" text-anchor="middle" fill="#ffffff" font-family="Arial,sans-serif" font-size="2.4" font-weight="700">3.52in E-PAPER NAME BADGE</text>
  <text x="50" y="132" text-anchor="middle" fill="#9ca3af" font-family="Arial,sans-serif" font-size="1.75">PROGRAM ON REAR · IMAGE STAYS WITHOUT POWER</text>
  <text x="50" y="136" text-anchor="middle" fill="#737b84" font-family="Arial,sans-serif" font-size="1.1">COIL PATH EMPHASIZED FOR CLARITY · PRODUCTION TURNS ARE MASK-COVERED</text>
</svg>
`;

fs.mkdirSync(path.join(outputRoot, "docs"), { recursive: true });
fs.writeFileSync(path.join(outputRoot, "vegas26-badge.kicad_pcb"), board);
fs.writeFileSync(path.join(outputRoot, "docs", "board-preview.svg"), preview);

const balance = [...board].reduce(
  (count, char) => count + (char === "(" ? 1 : char === ")" ? -1 : 0),
  0
);
if (balance !== 0) throw new Error(`Unbalanced KiCad s-expression: ${balance}`);
if (!board.includes('(net 30 "PICKUP_A")')) throw new Error("Expected pickup net missing");
if (!board.includes("Hirose_FH34SRJ-24S-0.5SH")) throw new Error("Expected 24-pin FPC connector missing");
if (!board.includes("Tag-Connect_TC2050-IDC-NL")) throw new Error("Expected Tag-Connect port missing");
if (!board.includes("ESP_Ribbon_1x08_P2.54mm")) throw new Error("Expected passive ESP ribbon header missing");
if (!board.includes("ESP32_Cradle_Strap_Slots")) throw new Error("Expected passive ESP cradle slots missing");
if (!board.includes("Waveshare_ESP32_Driver_Board_V3_Header_Clear_Cradle_Bay")) {
  throw new Error("Expected optional Waveshare ESP32 bay missing");
}
if (board.includes("TPS2116") || board.includes("SN74LVC541") || board.includes("SSM-119")) {
  throw new Error("Obsolete onboard ESP socket/power/buffer circuitry remains");
}
if (board.includes("FLEX SLOT") || board.includes("FH12-24S") || board.includes("EDGE-WRAP")) {
  throw new Error("Obsolete flex-slot, edge-wrap, or FH12 geometry remains");
}
if (board.includes("XIAO") || board.includes("TOUCH_")) throw new Error("Legacy controller/touch feature remains");

console.log(
  `wrote ${path.relative(process.cwd(), path.join(outputRoot, "vegas26-badge.kicad_pcb"))}`
);
console.log(
  `wrote ${path.relative(process.cwd(), path.join(outputRoot, "docs", "board-preview.svg"))}`
);

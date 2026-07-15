import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const boardPath = path.resolve(here, "..", "vegas26-badge.kicad_pcb");
const schematicPath = path.resolve(here, "..", "vegas26-badge.sch");
const board = fs.readFileSync(boardPath, "utf8");
const schematic = fs.readFileSync(schematicPath, "utf8");

const failures = [];
const requireText = (text, description) => {
  if (!board.includes(text)) failures.push(`missing ${description}`);
};

const balance = [...board].reduce(
  (count, char) => count + (char === "(" ? 1 : char === ")" ? -1 : 0),
  0
);
if (balance !== 0) failures.push(`unbalanced s-expression (${balance})`);

const timestamps = [...board.matchAll(/\(tstamp ([^)]+)\)/g)].map((match) => match[1]);
const duplicates = timestamps.filter((stamp, index) => timestamps.indexOf(stamp) !== index);
if (duplicates.length) failures.push(`duplicate timestamps: ${[...new Set(duplicates)].join(", ")}`);

const edgeLines = [...board.matchAll(
  /\(gr_line \(start ([-\d.]+) ([-\d.]+)\) \(end ([-\d.]+) ([-\d.]+)\).*?\(layer "Edge\.Cuts"\)/g
)];
for (const line of edgeLines) {
  if (Number(line[1]) === Number(line[3]) && Number(line[2]) === Number(line[4])) {
    failures.push(`zero-length Edge.Cuts line at ${line[1]},${line[2]}`);
  }
}

const edgeCircles = [...board.matchAll(
  /\(gr_circle \(center ([-\d.]+) ([-\d.]+)\) \(end ([-\d.]+) ([-\d.]+)\)[^\n]*\(layer "Edge\.Cuts"\)/g
)];
if (edgeCircles.length !== 1) {
  failures.push(`Edge.Cuts circle count is ${edgeCircles.length}, expected 1`);
} else {
  const circle = edgeCircles[0].slice(1, 5).map(Number);
  const radius = Math.hypot(circle[2] - circle[0], circle[3] - circle[1]);
  if (circle[0] !== 50 || circle[1] !== 8 || Math.abs(radius - 3) > 1e-6) {
    failures.push(
      `lanyard hole is center ${circle[0]},${circle[1]} radius ${radius}; expected 50,8 radius 3`
    );
  }
}

const inOldLanyardZone = (x, y) => x >= 38 && x <= 62 && y >= 3 && y <= 11;
for (const line of edgeLines) {
  const points = [
    [Number(line[1]), Number(line[2])],
    [Number(line[3]), Number(line[4])],
  ];
  if (points.some(([x, y]) => inOldLanyardZone(x, y))) {
    failures.push("non-circular Edge.Cuts line remains in lanyard-hole zone");
  }
}
const edgeArcs = [...board.matchAll(
  /\(gr_arc \(start ([-\d.]+) ([-\d.]+)\) \(mid ([-\d.]+) ([-\d.]+)\) \(end ([-\d.]+) ([-\d.]+)\)[^\n]*\(layer "Edge\.Cuts"\)/g
)];
for (const arc of edgeArcs) {
  const points = [
    [Number(arc[1]), Number(arc[2])],
    [Number(arc[3]), Number(arc[4])],
    [Number(arc[5]), Number(arc[6])],
  ];
  if (points.some(([x, y]) => inOldLanyardZone(x, y))) {
    failures.push("non-circular Edge.Cuts arc remains in lanyard-hole zone");
  }
}

requireText('(general (thickness 1.6))', "1.6 mm PCB thickness");
requireText('(net 30 "PICKUP_A")', "passive pickup net");
requireText('(net 31 "BS")', "panel bus-select strap net");
requireText(
  'Badge:Hirose_FH34SRJ-24S-0.5SH_24P_P0.50mm_Horizontal',
  "low-profile 24-pin 0.5 mm dual-contact panel ZIF footprint"
);
requireText(
  '(footprint "Badge:Hirose_FH34SRJ-24S-0.5SH_24P_P0.50mm_Horizontal" (layer "F.Cu")',
  "front-side panel ZIF"
);
requireText('(at 5 94.205 270)', "right-facing screen-adjacent front J1 placement");
requireText(
  '(pad "1" smd rect (at 5.75 0)',
  "display-numbered J1 pin 1 at the top of the landscape tail"
);
requireText(
  '(pad "24" smd rect (at -5.75 0)',
  "display-numbered J1 pin 24 at the bottom of the landscape tail"
);
requireText(
  'Connector:Tag-Connect_TC2050-IDC-NL_2x05_P1.27mm_Vertical',
  "zero-height TC2050 programmer footprint"
);
requireText('Badge:Waveshare_3.52in_Raw_Panel', "3.52-inch raw-panel envelope");
requireText('Badge:AISB_Logo_Vector', "font-independent AISB wordmark");
requireText(
  '(gr_text "REV 1 · PANEL/J1 FIT MUST BE VERIFIED"',
  "panel-and-connector prototype marking"
);
requireText(
  '(footprint "Badge:Waveshare_ESP32_Driver_Board_V3_Header_Clear_Cradle_Bay" (layer "B.Cu")',
  "rear optional Waveshare ESP32 driver-board bay"
);
requireText('(at 20.23 120.875)', "bottom-left ESP32 bay placement");
requireText('(fp_text user "USB-C DOWN"', "ESP32 USB-C orientation marking");
requireText('(fp_text user "HEADER-CLEAR CRADLE"', "ESP32 header-clearance warning");
requireText('(gr_text "ONE 3V3 SOURCE ONLY"', "single-source power warning");
requireText('(49 "F.Fab" user)', "standard KiCad technical layers");
requireText(
  '(gr_text "J1 · FRONT ZIF · 3.65 mm FLEX · NO SLOT"',
  "short straight-flex assembly marking"
);
requireText('(at 50 94.205)', "centered raw-panel placement");
requireText(
  '(segment (start 12 88.955) (end 29.355 71.6) (width 0.2) (layer "F.Cu") (net 9)',
  "45-degree front J1 fanout to spread-via field"
);
requireText('(via (at 45 71.6)', "front-to-rear J1 fanout via");
requireText(
  '(gr_circle (center 50 8) (end 53 8)',
  "single 6 mm circular lanyard hole"
);
requireText('(net_name "DGND") (layer "B.Cu")', "rear digital-ground zone");
requireText(
  '(keepout (tracks not_allowed) (vias not_allowed) (pads allowed) (copperpour not_allowed)',
  "TC2050 inter-row copper keepout"
);
requireText(
  '(gr_text "PASSIVE EM PICKUP · 30T/LAYER"',
  "optimized pickup turn-count marking"
);
for (const layer of ["F.Cu", "B.Cu"]) {
  requireText(
    `(zone (net 0) (net_name "") (layers "${layer}")`,
    `${layer} keepout zone`
  );
}
const pickupKeepoutPolygons = (
  board.match(/\(polygon \(pts \(xy 8 13\) \(xy 92 13\) \(xy 92 65\) \(xy 8 65\)\)\)/g) || []
).length;
if (pickupKeepoutPolygons !== 2) {
  failures.push(`pickup pour keepout count is ${pickupKeepoutPolygons}, expected 2`);
}
const espAntennaKeepoutPolygons = (
  board.match(
    /\(polygon \(pts \(xy 5\.5 96\.75\) \(xy 34\.96 96\.75\) \(xy 34\.96 111\.25\) \(xy 5\.5 111\.25\)\)\)/g
  ) || []
).length;
if (espAntennaKeepoutPolygons !== 2) {
  failures.push(
    `ESP32 antenna pour keepout count is ${espAntennaKeepoutPolygons}, expected 2`
  );
}

const fpcStart = board.indexOf(
  '(footprint "Badge:Hirose_FH34SRJ-24S-0.5SH_24P_P0.50mm_Horizontal"'
);
const fpcEnd = board.indexOf("\n  (footprint ", fpcStart + 1);
const fpcBlock = fpcStart >= 0 ? board.slice(fpcStart, fpcEnd) : "";
const fpcPasteApertures = (
  fpcBlock.match(
    /\(pad "" smd rect \(at [-\d.]+ 0\) \(size 0\.25 0\.65\) \(layers "F\.Paste"\)/g
  ) || []
).length;
if (fpcPasteApertures !== 24) {
  failures.push(`J1 reduced paste-aperture count is ${fpcPasteApertures}, expected 24`);
}
const fpcCopperPads = (
  fpcBlock.match(
    /\(pad "(?:[1-9]|1\d|2[0-4])" smd rect \(at [-\d.]+ 0\) \(size 0\.3 0\.8\) \(layers "F\.Cu" "F\.Mask"\)/g
  ) || []
).length;
if (fpcCopperPads !== 24) {
  failures.push(`J1 signal copper-pad count is ${fpcCopperPads}, expected 24`);
}
if (
  fpcBlock
    .split("\n")
    .some(
      (line) =>
        /\(pad "(?:[1-9]|1\d|2[0-4])"/.test(line) && line.includes('"F.Paste"')
    )
) {
  failures.push("J1 numbered copper pads still use unreduced F.Paste apertures");
}
requireText('(pad "24" smd rect', "FPC pin 24");
requireText('(pad "" np_thru_hole circle (at 3.81 1.016)', "TC2050 keyed alignment hole");
requireText('(layers "B.Cu" "B.Mask") (net 2 "3V3")', "paste-free TC2050 contact pad");
for (const ref of [
  "Q1",
  "L2",
  "D1",
  "D2",
  "D3",
  "R3",
  "R13",
  "C2",
  "C3",
  "C11",
  "C15",
  "L1",
  "J1",
  "J3",
  "EPD1",
]) {
  requireText(`(fp_text reference "${ref}"`, `${ref} footprint`);
}
if (board.includes('(gr_text "AISB"')) {
  failures.push("generic text AISB logo remains instead of vector wordmark");
}
for (const legacy of [
  "XIAO",
  "TOUCH_",
  "USB MIDI",
  "EPD_Wire_Header_1x08",
  "FH12-24S",
  "FLEX SLOT",
  "EDGE-WRAP",
]) {
  if (board.includes(legacy)) failures.push(`legacy feature remains: ${legacy}`);
}
if (edgeArcs.length !== 4) {
  failures.push(`Edge.Cuts arc count is ${edgeArcs.length}, expected only 4 outer-corner arcs`);
}

const schematicComponents = (schematic.match(/^\$Comp$/gm) || []).length;
const schematicComponentEnds = (schematic.match(/^\$EndComp$/gm) || []).length;
if (schematicComponents !== schematicComponentEnds) {
  failures.push(
    `schematic component-block mismatch (${schematicComponents}/${schematicComponentEnds})`
  );
}
if (!schematic.endsWith("$EndSCHEMATC\n")) failures.push("schematic terminator missing");
for (const [text, description] of [
  ['F 1 "RAW_EPD_FPC_24"', "schematic raw-panel connector"],
  ['F 1 "TC2050_IDC_NL_DNL"', "schematic programmer target"],
  ['F 1 "BSS138"', "schematic boost MOSFET"],
  ['F 1 "68uH"', "schematic boost inductor"],
  ['F 1 "1uF_25V_DNP"', "schematic pin-4 DNP option"],
  ['F 1 "4.7uF"', "schematic pickup coupling capacitor"],
  ['F 1 "PCB_SPIRAL_30T_X2"', "schematic optimized pickup winding"],
  ["No MCU, battery, MIDI, or touch circuitry on the badge", "controller-free schematic note"],
]) {
  if (!schematic.includes(text)) failures.push(`missing ${description}`);
}
for (const legacy of ["XIAO_ESP32", "TOUCH_1", "WAVESHARE_EPD", "FH12-24S"]) {
  if (schematic.includes(legacy)) failures.push(`legacy schematic feature remains: ${legacy}`);
}

const segments = [...board.matchAll(
  /\(segment \(start ([-\d.]+) ([-\d.]+)\) \(end ([-\d.]+) ([-\d.]+)\) \(width ([-\d.]+)\) \(layer "([^"]+)"\) \(net (\d+)\)/g
)].map((match, index) => ({
  index,
  a: [Number(match[1]), Number(match[2])],
  b: [Number(match[3]), Number(match[4])],
  width: Number(match[5]),
  layer: match[6],
  net: Number(match[7]),
}));

const vias = [...board.matchAll(
  /\(via \(at ([-\d.]+) ([-\d.]+)\) \(size ([-\d.]+)\).*?\(net (\d+)\)/g
)].map((match, index) => ({
  index,
  point: [Number(match[1]), Number(match[2])],
  size: Number(match[3]),
  net: Number(match[4]),
}));

const offAngleSegments = segments.filter((track) => {
  const dx = Math.abs(track.b[0] - track.a[0]);
  const dy = Math.abs(track.b[1] - track.a[1]);
  return dx > 1e-8 && dy > 1e-8 && Math.abs(dx - dy) > 1e-8;
});
if (offAngleSegments.length) {
  failures.push(
    `non-45-degree diagonal tracks remain: ${offAngleSegments
      .slice(0, 12)
      .map((track) => track.index)
      .join(", ")}${offAngleSegments.length > 12 ? "…" : ""}`
  );
}

const pointDistance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const samePoint = (a, b) => pointDistance(a, b) < 1e-8;
const pointSegmentDistance = (point, a, b) => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const denominator = dx * dx + dy * dy;
  const raw = denominator
    ? ((point[0] - a[0]) * dx + (point[1] - a[1]) * dy) / denominator
    : 0;
  const t = Math.max(0, Math.min(1, raw));
  return pointDistance(point, [a[0] + t * dx, a[1] + t * dy]);
};
const orientation = (a, b, c) =>
  (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
const properIntersection = (a, b, c, d) => {
  const [o1, o2, o3, o4] = [
    orientation(a, b, c),
    orientation(a, b, d),
    orientation(c, d, a),
    orientation(c, d, b),
  ];
  return o1 * o2 < 0 && o3 * o4 < 0;
};
const segmentDistance = (first, second) => {
  if (properIntersection(first.a, first.b, second.a, second.b)) return 0;
  return Math.min(
    pointSegmentDistance(first.a, second.a, second.b),
    pointSegmentDistance(first.b, second.a, second.b),
    pointSegmentDistance(second.a, first.a, first.b),
    pointSegmentDistance(second.b, first.a, first.b)
  );
};

// Validate the audio path as an actual layer-aware copper graph.  This catches
// the easy-to-miss case where a track ends at the XY of an SMD pad but is on
// the opposite copper layer without a via.
const coordinateKey = (point) => point.map((value) => value.toFixed(3)).join(",");
const nodeKey = (net, layer, point) => `${net}|${layer}|${coordinateKey(point)}`;
const graph = new Map();
const addGraphEdge = (a, b) => {
  if (!graph.has(a)) graph.set(a, new Set());
  if (!graph.has(b)) graph.set(b, new Set());
  graph.get(a).add(b);
  graph.get(b).add(a);
};
for (const track of segments) {
  addGraphEdge(
    nodeKey(track.net, track.layer, track.a),
    nodeKey(track.net, track.layer, track.b)
  );
}
for (const transition of vias) {
  addGraphEdge(
    nodeKey(transition.net, "F.Cu", transition.point),
    nodeKey(transition.net, "B.Cu", transition.point)
  );
}
const hasCopperPath = (net, startLayer, start, endLayer, end) => {
  const source = nodeKey(net, startLayer, start);
  const target = nodeKey(net, endLayer, end);
  if (!graph.has(source) || !graph.has(target)) return false;
  const queue = [source];
  const visited = new Set(queue);
  while (queue.length) {
    const current = queue.shift();
    if (current === target) return true;
    for (const next of graph.get(current) || []) {
      if (!visited.has(next)) {
        visited.add(next);
        queue.push(next);
      }
    }
  }
  return false;
};
for (const [net, startLayer, start, endLayer, end, description] of [
  [30, "B.Cu", [8.5, 17], "F.Cu", [11.5, 15], "C1 pad 2 to front-coil outer end"],
  [30, "B.Cu", [30, 34], "F.Cu", [26.5, 30], "R2 pad 1 to front-coil inner end"],
  [29, "B.Cu", [32, 34], "B.Cu", [4.5, 27], "R2 pad 2 through rear coil to J2.2"],
  [28, "B.Cu", [5.5, 17], "B.Cu", [4.5, 22], "C1 pad 1 to J2.1"],
  [28, "B.Cu", [6.5, 24], "B.Cu", [4.5, 22], "R1 pad 1 to J2.1"],
  [29, "B.Cu", [8.5, 24], "B.Cu", [4.5, 27], "R1 pad 2 to J2.2"],
]) {
  if (!hasCopperPath(net, startLayer, start, endLayer, end)) {
    failures.push(`pickup connectivity: ${description}`);
  }
}
if (segments.some((track) => track.net === 28 && track.layer !== "B.Cu")) {
  failures.push("AUDIO_SIG leaves the rear copper layer");
}

// Same-net DRC normally permits a short between adjacent turns, but such a
// bridge would silently reduce pickup sensitivity.  Check non-connected coil
// segments against the intended 0.20 mm physical space.
const pickupCoilSegmentCount = 240;
const orderedCoilFrom = (net, layer, firstStart, firstEnd, description) => {
  const startIndex = segments.findIndex(
    (track) =>
      track.net === net &&
      track.layer === layer &&
      samePoint(track.a, firstStart) &&
      samePoint(track.b, firstEnd)
  );
  if (startIndex < 0) {
    failures.push(`missing ${description} first winding segment`);
    return [];
  }
  const coil = segments.slice(startIndex, startIndex + pickupCoilSegmentCount);
  if (
    coil.some(
      (track) => track.net !== net || track.layer !== layer || track.width !== 0.3
    )
  ) {
    failures.push(`${description} winding sequence is not 0.30 mm ${layer} net ${net}`);
  }
  for (let index = 0; index + 1 < coil.length; index += 1) {
    if (!samePoint(coil[index].b, coil[index + 1].a)) {
      failures.push(`${description} winding sequence breaks at segment ${index}`);
      break;
    }
  }
  return coil;
};
const pickupCoils = [
  orderedCoilFrom(30, "F.Cu", [11.5, 15], [88.5, 15], "front pickup"),
  orderedCoilFrom(29, "B.Cu", [26.5, 30], [74, 30], "rear pickup"),
];
const pickupSignedAreas = [];
let pickupCopperLength = 0;
for (const [index, coil] of pickupCoils.entries()) {
  if (coil.length !== 240) {
    failures.push(`pickup layer ${index + 1} has ${coil.length} winding segments, expected 240`);
  }
  const signedArea = coil.reduce(
    (sum, track) =>
      sum + (track.a[0] * track.b[1] - track.b[0] * track.a[1]) / 2,
    0
  );
  pickupSignedAreas.push(signedArea);
  pickupCopperLength += coil.reduce(
    (sum, track) => sum + pointDistance(track.a, track.b),
    0
  );
  for (let i = 0; i < coil.length; i += 1) {
    for (let j = i + 1; j < coil.length; j += 1) {
      const connected =
        samePoint(coil[i].a, coil[j].a) ||
        samePoint(coil[i].a, coil[j].b) ||
        samePoint(coil[i].b, coil[j].a) ||
        samePoint(coil[i].b, coil[j].b);
      if (connected) continue;
      const required = coil[i].width / 2 + coil[j].width / 2 + 0.2;
      if (segmentDistance(coil[i], coil[j]) < required - 1e-8) {
        failures.push(`pickup self-clearance: layer ${index + 1}, segments ${i}/${j}`);
      }
    }
  }
}

// Lead-outs are part of the winding geometry too.  Check every other track on
// each pickup net/layer against every non-connected turn.  KiCad intentionally
// permits same-net copper to touch, so without this check a slightly wider
// fanout could silently bridge or crowd an adjacent turn.
for (const [index, coil] of pickupCoils.entries()) {
  const coilIndices = new Set(coil.map((track) => track.index));
  const routes = segments.filter(
    (track) =>
      track.net === coil[0]?.net &&
      track.layer === coil[0]?.layer &&
      !coilIndices.has(track.index)
  );
  for (const route of routes) {
    for (const turn of coil) {
      const connectedAtRouteEnd =
        pointSegmentDistance(route.a, turn.a, turn.b) < 1e-8 ||
        pointSegmentDistance(route.b, turn.a, turn.b) < 1e-8;
      if (connectedAtRouteEnd) continue;
      const required = route.width / 2 + turn.width / 2 + 0.2;
      if (segmentDistance(route, turn) < required - 1e-8) {
        failures.push(
          `pickup lead-out clearance: layer ${index + 1}, route ${route.index}, turn ${turn.index}`
        );
      }
    }
  }
}
if (pickupSignedAreas[0] <= 0 || pickupSignedAreas[1] <= 0) {
  failures.push(
    `pickup layers are not series-aiding (${pickupSignedAreas
      .map((area) => area.toFixed(1))
      .join("/")} mm2-turn signed area)`
  );
}
const pickupTurnArea = pickupSignedAreas.reduce((sum, area) => sum + area, 0) * 1e-6;
if (Math.abs(pickupTurnArea - 0.138318) > 0.00001) {
  failures.push(`pickup turn-area changed to ${pickupTurnArea.toFixed(6)} m2-turn`);
}
if (Math.abs(pickupCopperLength / 1000 - 11.729) > 0.002) {
  failures.push(`pickup copper length changed to ${(pickupCopperLength / 1000).toFixed(3)} m`);
}

// Conservative generator-level check: 0.20 mm copper clearance. This checks
// generated tracks and vias only; KiCad DRC is still required for pads, holes,
// board edges, courtyard rules and the fabricator's exact constraints.
const clearance = 0.2;
for (let i = 0; i < segments.length; i += 1) {
  for (let j = i + 1; j < segments.length; j += 1) {
    const first = segments[i];
    const second = segments[j];
    if (first.layer !== second.layer || first.net === second.net) continue;
    const required = first.width / 2 + second.width / 2 + clearance;
    if (segmentDistance(first, second) < required - 1e-8) {
      failures.push(`track clearance: segments ${first.index}/${second.index}`);
    }
  }
}

for (const via of vias) {
  for (const segment of segments) {
    if (via.net === segment.net) continue;
    const required = via.size / 2 + segment.width / 2 + clearance;
    if (pointSegmentDistance(via.point, segment.a, segment.b) < required - 1e-8) {
      failures.push(`via/track clearance: via ${via.index}, segment ${segment.index}`);
    }
  }
}

for (let i = 0; i < vias.length; i += 1) {
  for (let j = i + 1; j < vias.length; j += 1) {
    if (vias[i].net === vias[j].net) continue;
    const required = vias[i].size / 2 + vias[j].size / 2 + clearance;
    if (pointDistance(vias[i].point, vias[j].point) < required - 1e-8) {
      failures.push(`via/via clearance: vias ${vias[i].index}/${vias[j].index}`);
    }
  }
}

// Pickup-specific pad checks supplement the general track/via checks above.
// The generator knows these custom-footprint pad sizes and absolute positions,
// so include them in the same 0.20 mm clearance audit.
const pickupPads = [
  { ref: "C1.1", net: 28, center: [5.5, 17], size: [1.5, 1.8], shape: "rect" },
  { ref: "C1.2", net: 30, center: [8.5, 17], size: [1.5, 1.8], shape: "rect" },
  { ref: "R1.1", net: 28, center: [6.5, 24], size: [1.1, 1.4], shape: "rect" },
  { ref: "R1.2", net: 29, center: [8.5, 24], size: [1.1, 1.4], shape: "rect" },
  { ref: "R2.1", net: 30, center: [30, 34], size: [1.1, 1.4], shape: "rect" },
  { ref: "R2.2", net: 29, center: [32, 34], size: [1.1, 1.4], shape: "rect" },
  { ref: "J2.1", net: 28, center: [4.5, 22], size: [2.6, 2.6], shape: "rect" },
  { ref: "J2.2", net: 29, center: [4.5, 27], size: [2.6, 2.6], shape: "circle" },
];
const pointRectDistance = (point, pad) => {
  const dx = Math.max(Math.abs(point[0] - pad.center[0]) - pad.size[0] / 2, 0);
  const dy = Math.max(Math.abs(point[1] - pad.center[1]) - pad.size[1] / 2, 0);
  return Math.hypot(dx, dy);
};
const segmentRectDistance = (track, pad) => {
  if (pointRectDistance(track.a, pad) === 0 || pointRectDistance(track.b, pad) === 0) {
    return 0;
  }
  const [cx, cy] = pad.center;
  const [hx, hy] = [pad.size[0] / 2, pad.size[1] / 2];
  const corners = [
    [cx - hx, cy - hy],
    [cx + hx, cy - hy],
    [cx + hx, cy + hy],
    [cx - hx, cy + hy],
  ];
  const edges = corners.map((corner, index) => ({
    a: corner,
    b: corners[(index + 1) % corners.length],
  }));
  return Math.min(...edges.map((edge) => segmentDistance(track, edge)));
};
const padTrackGap = (pad, track) =>
  pad.shape === "circle"
    ? pointSegmentDistance(pad.center, track.a, track.b) - pad.size[0] / 2 - track.width / 2
    : segmentRectDistance(track, pad) - track.width / 2;
const padPointGap = (pad, point, radius) =>
  pad.shape === "circle"
    ? pointDistance(pad.center, point) - pad.size[0] / 2 - radius
    : pointRectDistance(point, pad) - radius;
for (const pad of pickupPads) {
  for (const track of segments) {
    if (track.layer !== "B.Cu" || track.net === pad.net) continue;
    if (padTrackGap(pad, track) < clearance - 1e-8) {
      failures.push(`pickup pad/track clearance: ${pad.ref}, segment ${track.index}`);
    }
  }
  for (const transition of vias) {
    if (transition.net === pad.net) continue;
    if (padPointGap(pad, transition.point, transition.size / 2) < clearance - 1e-8) {
      failures.push(`pickup pad/via clearance: ${pad.ref}, via ${transition.index}`);
    }
  }
}
const padPadGap = (first, second) => {
  if (first.shape === "circle" && second.shape === "circle") {
    return (
      pointDistance(first.center, second.center) - first.size[0] / 2 - second.size[0] / 2
    );
  }
  if (first.shape === "circle" || second.shape === "circle") {
    const circle = first.shape === "circle" ? first : second;
    const rectangle = first.shape === "rect" ? first : second;
    return pointRectDistance(circle.center, rectangle) - circle.size[0] / 2;
  }
  const dx = Math.max(
    Math.abs(first.center[0] - second.center[0]) - (first.size[0] + second.size[0]) / 2,
    0
  );
  const dy = Math.max(
    Math.abs(first.center[1] - second.center[1]) - (first.size[1] + second.size[1]) / 2,
    0
  );
  return Math.hypot(dx, dy);
};
for (let i = 0; i < pickupPads.length; i += 1) {
  for (let j = i + 1; j < pickupPads.length; j += 1) {
    if (pickupPads[i].net === pickupPads[j].net) continue;
    if (padPadGap(pickupPads[i], pickupPads[j]) < clearance - 1e-8) {
      failures.push(`pickup pad/pad clearance: ${pickupPads[i].ref}/${pickupPads[j].ref}`);
    }
  }
}

if (failures.length) {
  console.error(`generated-board checks failed:\n- ${failures.join("\n- ")}`);
  process.exitCode = 1;
} else {
  console.log(
    `generated hardware checks passed (${segments.length} tracks, ${vias.length} vias, ${timestamps.length} unique timestamps, ${schematicComponents} schematic components, ${pickupTurnArea.toFixed(3)} m2-turn pickup)`
  );
  console.log("KiCad DRC and physical prototype validation are still required.");
}

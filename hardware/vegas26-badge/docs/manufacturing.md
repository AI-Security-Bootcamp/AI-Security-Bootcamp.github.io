# Manufacturing split and cost model

## What the PCB/PCBA supplier can deliver

A normal PCB/assembly supplier can:

- fabricate the 100 x 145 mm, 1.6 mm two-layer board with rounded corners,
  one centred 6 mm circular lanyard hole, logo artwork, and passive pickup
  coil; there is no internal display-flex cutout;
- apply black solder mask, white silkscreen, and ENIG to intentional exposed
  pads/artwork;
- keep continuous black solder mask over every pickup turn; do not create a
  mask opening or apply ENIG to the winding itself;
- preserve the pickup's 0.30 mm traces and 0.20 mm spaces, and add no copper
  balancing, thieving, pour, metal label, or closed conductive loop within its
  `x=8..92`, `y=13..65` keepout on either copper layer;
- assemble the low-profile 24-pin ZIF on the front immediately left of the
  glass envelope, plus the MOSFET, inductor, Schottky diodes, resistors, and
  capacitors on the rear;
- leave the `J3` Tag-Connect target as exposed ENIG pads with no solder paste
  or loaded part, and keep its alignment holes open;
- preserve the rear `MOD1` dashed `29.46 x 48.25 mm` optional ESP32 bay and its
  two-layer antenna-area copper-pour keep-out; it is a padless mechanical
  reservation and receives no part during normal PCBA; and
- perform optical inspection and basic continuity/short testing.

Use the connector manufacturer's `0.10 mm` stencil recommendation for `J1`.
The generated footprint keeps the `0.30 x 0.80 mm` copper lands but supplies
separate reduced `0.25 x 0.65 mm` paste apertures for its 24 signal contacts;
do not expand those apertures back to copper size during CAM cleanup.

Request Gerber/drill, assembly drawing, BOM, centroid/position data, and a
panelization plan only after the KiCad source passes review. Call out the 6 mm
lanyard hole as a non-plated internal cutout and confirm that there is no
internal display-flex cutout. Ask the assembler to confirm the front-side `J1`
position, 270-degree/right-facing orientation, and exact MPN in writing; a
reversed FPC connector can destroy the panel.

## What remains a box-build/manual operation

For each badge:

1. Dry-fit the glass, short electrical FPC, front-side `J1`, bezel, lens, and
   service spine. Confirm that the FPC reaches the connector mouth while
   remaining straight and unstressed.
2. While the panel is still off-board, write its final or placeholder name with
   a tested Driver HAT station, deep-sleep and power it off, then visually
   inspect and label it for its assigned badge.
3. Apply the thin perimeter transfer-adhesive frame and black PETG
   spacer/bezel to the front PCB, keeping the connector service area clear.
4. Align the landscape glass at `x=7.65..92.35` mm, insert its short FPC
   straight into front-side `J1`, close the latch, and set the glass onto its
   perimeter support without bending or pulling the tail.
5. Add the 0.5 mm clear hard-coated polycarbonate lens without loading the
   active area, then fit the opaque removable left service spine.
6. Attach a short twisted or shielded audio pigtail (if used), add strain
   relief, and attach the lanyard.
7. Only on a `CUSTOM-PASS` unit, seat the reusable TC2050 probe for any required
   later update, deep-sleep and depower it, then remove the probe.
8. Verify the retained image and passive audio pickup. Mark the traveler
   `CUSTOM-PASS` or `HAT-ONLY`.

An optional ESP32 module is a participant/manual add-on after the base badge
passes. Dry-fit the exact USB-C V3 board in `MOD1` with its connector protruding
below the lower edge. Its two stock underside male-header rows prevent a flat
foam mount: use a measured all-plastic cradle/standoff that clears every pin,
or have a qualified assembler remove the headers. The module has no mounting
holes and the badge intentionally adds none. Do not ask the PCBA vendor to
populate, socket, or permanently glue it without a separately approved fixture.

Until the custom circuit passes its first-article rail and refresh tests, keep
the `J1` latch accessible beneath the removable left service spine and use
removable Kapton rather than permanent potting. If the custom circuit fails,
the panel can remain mechanically mounted while its flex is removed from the
fully unpowered badge and written directly with the official Waveshare Driver
HAT. `J3` cannot serve as a HAT bypass; see `hat-fallback.md` for the power-off
and flex-service sequence.

Populate the full custom circuit on the production PCBAs, but reserve the first
five identical boards as engineering units. Do not apply display power to the
remaining units until those five pass. A HAT-written panel remains useful even
if the populated badge circuit is never powered.

The badge does not need a permanently installed controller or programming
connector. A contract manufacturer can perform the panel/protector operations
as a custom box build, but hand assembly is sensible for the first 3-5 units.
Expect roughly 5-10 minutes per badge after fixtures and alignment procedures
are stable.

## Panel and flex handling

- Reserve a 84.70 x 54.41 x 1.30 mm mechanical envelope even though the current
  product page lists 1.18 mm thickness; measure the purchased lot.
- The current panel drawing shows only `3.65 +/- 0.30 mm` of actual electrical
  FPC beyond the glass. Its separate 10.00 mm feature is a removable
  adhesive-tape pull-tab, not usable electrical cable length.
- The panel therefore stays centred at `(50.00, 94.205)` mm, spanning
  `x=7.65..92.35` mm. Front-side `J1` is immediately left of it, with its mouth
  facing right near `x=5.50`, body at approximately `x=1.70..5.50`, signal-pad
  row near `x=5.00`, and retention row near `x=1.70`. The inserted tail tip is
  at `x=4.00`, providing 1.50 mm nominal insertion past the mouth. Do not
  substitute a distant, rear, or oppositely oriented connector position.
- `J1` footprint pad numbers follow the Waveshare panel contacts, not the
  mirrored Hirose terminal sequence in this right-facing orientation. Treat
  the PCB panel-pin mark as authoritative and continuity-map the unpowered
  first sample before fitting the display.
- Support the glass on the solid PCB and press only around its perimeter.
- Use a 0.05-0.10 mm adhesive frame, not blobs of liquid adhesive.
- Keep the FPC flat and straight; do not fold, crease, or route it around a PCB
  edge. Validate its reach and connector insertion depth on the first physical
  panel before repeating the assembly.
- Do not solder the raw flex. A low-profile ZIF is repairable and avoids
  applying soldering heat or strain to the polymer tail.
- Do not connect/disconnect either the panel or Tag-Connect probe while powered.

## No-hole instrument viewport

The screen mount uses no screws or magnets:

- a thin perimeter transfer-adhesive frame locates the panel without loading
  the active area;
- a black PETG spacer/bezel masks the glass edge and makes the screen look like
  an instrument viewport;
- a 0.5 mm clear hard-coated polycarbonate lens protects the fragile glass; and
- an opaque removable all-plastic black service spine, keyed to the bezel at
  the left side, covers the front connector and straight FPC while leaving the
  `J1` latch serviceable.

Keep adhesive off the active area, connector latch, and service-spine joint. Do
not use magnetic catches, magnets, or steel clips anywhere in this stack: they
would couple strongly into the badge's passive magnetic pickup.

## Optional rear ESP32 bay

The rear bay spans `x=5.50..34.96`, `y=96.75..145.00` mm. Its top `14.5 mm`
has copper-pour keep-outs on both layers to reduce antenna loading, but existing
display traces remain beneath that area, so WiFi/Bluetooth range must be tested
on a populated first article. The USB-C edge is flush with the badge bottom and
nominally accessible while worn. Keep the lower `12-14 mm` around its centre
unobstructed and dry-fit a real USB-C plug/overmold; the cradle must not wrap
that edge. Size the cradle from a physical sample with clearance, because the
published `29.46 x 48.25 mm` outline has no stated production tolerance.

The antenna zone is a **pour keep-out, not an RF copper keep-out**. Front display
fanout traces cross beneath it. Do not promise WiFi/Bluetooth range; test it on
the actual stacked badge both idle and during a refresh.

The bay is not an electrical footprint. Use the ESP32 board's supplied adapter
and FFC only with the panel disconnected from badge `J1`. A bare GPIO-to-`J3`
harness is not released; it needs a separate reviewed, keyed, load-switched,
back-power-protected adapter. Verify cable reach around the outside left edge;
do not add an unreviewed flex slot, drill, or raw-panel splitter at CAM time.

## Prototype release gates

The Waveshare V1.1 documentation combines a current 24-pin table with an older
application-circuit drawing that is not pin-for-pin identical. This design uses
the current 24-pin table plus the UC8253/reference boost topology; current pin 4
is left open and `C15` is DNP.

Before any production build:

- continuity-map the physical flex and verify pin 1/contact side;
- verify `J1` mating/contact direction, its exact land pattern, and the
  straight-tail reach with the panel and board at full-size;
- scope 3V3, GDR, RESE, VGH, VGL, VCOM, and BUSY during a full refresh;
- validate deep sleep and retained image with the programmer disconnected;
- cycle at least one panel through repeated insertions and updates;
- dry-fit one exact USB-C ESP32 driver-board sample in `MOD1` and, if that
  optional path will be offered, prove its cable/harness, mode switch, antenna
  range, power isolation, and repeated 3.52-inch refreshes; and
- run KiCad DRC plus an independent electrical/manufacturing review.

## Pickup-coil acceptance

The optimized pickup is 30 turns per layer, 0.30 mm trace / 0.20 mm space,
with its two layers series-aiding through `R2`. Before panel installation:

- measure from `C1` pad 2 to `J2` pin 2; accept approximately 15-25 ohms and
  reject opens or suspiciously low values that indicate shorted turns;
- inspect the full spiral at magnification for nicks, shorts, and unwanted
  copper thieving;
- measure inductance on prototype boards (expected order of magnitude
  0.2-0.3 mH) and require self-resonance above 200 kHz; and
- perform a repeatable 60 Hz / 1 kHz / 10 kHz functional test with an insulated,
  low-voltage driven test loop at fixed distance and orientation.

`AUDIO_GND` must remain isolated from `DGND`. Do not refresh the display during
an audio test; the panel boost converter is deliberately easy for the search
coil to hear. See `pickup-design.md` for the calculation and fixture guidance.

## Brand accent colour

The AISB letterforms use path-based artwork, including both counters in the
`B`. Standard black solder mask and white silkscreen can reproduce the letters,
but cannot reproduce the official red accent. The fabricated exposed accent is
gold with ENIG. Specify UV printing or add a red decal/inlay if the physical
badge must match the official `#EF4444` red.

## Approximate unit economics

Planning assumptions: 100 x 145 mm, two layers, 1.6 mm FR-4, black solder mask,
white silkscreen, ENIG, passive PCBA, front-mounted panel and `J1`, black PETG
bezel/spacer and service spine, 0.5 mm polycarbonate lens, and lanyard. Waveshare
listed the raw panel at US$10.99 for one and US$10.31 at 100+ on 2026-07-14.
All other figures are broad planning ranges, not quotes.

| Quantity | Bare art PCB | raw panel | components + mechanical | assembly/box-build | estimated unit total* |
|---:|---:|---:|---:|---:|---:|
| 5 | $12-25 | about $11 | $5-10 | self-assemble | $28-46 |
| 25 | $6-12 | about $11 | $4-8 | $3-8 | $24-39 |
| 100 | $3-8 | about $10.31 | $3-6 | $2-6 | $18-30 |

\*Before tax/duty, expedited shipping, failed panels, prototype re-spins,
test-fixture labour, and design review.

The reusable programmers are separate tooling, not a cost on every badge. Two
Universal Driver HATs plus one optional ESP32 board list for about US$34.97 on
2026-07-15 before shipping, tax, and HAT hosts. For the full redundant
dual-track set in `bom-tooling.csv`, budget roughly $200-600 for two
TC2050/XIAO custom stations, two Universal Driver HAT/host stations, the ESP32
sample, power, cabling, a simple alignment fixture, and one or two complete HAT references.
Existing Raspberry Pi hosts put the total near the low end; confirm live prices
before purchase.

Budget another $300-800 for two prototype spins, spare displays, review, and
international shipping. The raw panel saves the on-badge controller/module
cost, but it moves more validation responsibility into this PCB and fixture.

## Source references

- Waveshare product and current dimensions: <https://www.waveshare.com/3.52inch-e-paper.htm>
- Waveshare current V1.1 panel drawing/pin table: <https://files.waveshare.com/wiki/3.52inch%20e-Paper%20HAT/3.52inch%20e-Paper%20V1.1.pdf>
- Waveshare 3.52-inch manual and examples: <https://www.waveshare.com/wiki/3.52inch_e-Paper_HAT_Manual>
- Waveshare Universal Driver HAT: <https://www.waveshare.com/e-paper-driver-hat.htm>
- Waveshare ESP32 Driver Board and revision/pin documentation: <https://www.waveshare.com/e-paper-esp32-driver-board.htm> and <https://www.waveshare.com/wiki/E-Paper_ESP32_Driver_Board>
- Hirose FH34SRJ connector/stencil catalog: <https://www.hirose.com/en/product/document?clcode=&documentid=en_FH34_CAT&documenttype=Catalog&lang=en&productname=&series=FH34SRJ>
- UC8253 controller datasheet: <https://files.waveshare.com/wiki/3.52inch%20e-Paper%20HAT/UC8253c.pdf>
- Tag-Connect no-legs probe: <https://www.tag-connect.com/product/tc2050-idc-nl-10-pin-no-legs-cable-with-ribbon-connector>
- Tag-Connect target-footprint drawing: <https://www.tag-connect.com/wp-content/uploads/bsk-pdf-manager/TC2050-IDC-NL_Datasheet_8.pdf>

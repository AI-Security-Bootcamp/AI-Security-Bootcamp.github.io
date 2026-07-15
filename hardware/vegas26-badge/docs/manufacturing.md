# Manufacturing split and cost model

> **NOT PRODUCTION RELEASED:** The optional passive `J4` harness and removable
> Waveshare V3 mount have not passed electrical, mechanical, USB, drop, or RF
> qualification. Leave the 1 x 8 header DNP unless the pilot procedure in this
> document is completed and signed off.

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
  glass envelope plus the raw-panel support parts on the rear;
- leave the `J3` Tag-Connect target as exposed ENIG pads with no solder paste
  or loaded part, and keep its alignment holes open;
- preserve the rear `MOD1` dashed `29.46 x 48.25 mm` optional ESP32 bay, its
  reviewed passive mounting slots, optional 1 x 8 `J4` plated holes, and the
  two-layer antenna-area copper-pour keep-out; leave the J4 header DNP for the
  default assembly variant; and
- perform optical inspection and basic continuity/short testing.

Use the connector manufacturer's `0.10 mm` stencil recommendation for `J1`.
The generated footprint keeps the `0.30 x 0.80 mm` copper lands but supplies
separate reduced `0.25 x 0.65 mm` paste apertures for its 24 signal contacts;
do not expand those apertures back to copper size during CAM cleanup.

Request Gerber/drill, assembly drawing, BOM, centroid/position data, and a
panelization plan only after the imported schematic passes KiCad ERC, the
generated board passes KiCad DRC, and an independent reviewer has reconciled
the two. Do **not** use Update PCB from Schematic: the legacy schematic is an
electrical reference, not the generated board's netlist source. Plot fresh
Gerbers and Excellon drill/route files and inspect them in a second viewer
before transmitting a release ZIP. Call out the 6 mm lanyard hole as a
non-plated internal cutout and confirm that there is no internal display-flex
cutout. Ask the assembler to confirm the front-side `J1` position,
270-degree/right-facing orientation, and exact MPN in writing; a reversed FPC
connector can destroy the panel.

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

An optional ESP32 module is a participant/manual add-on only after the base
badge, passive harness, and removable mount pass. Fit a breakaway 1 x 8 male
header at badge `J4`, or solder the eight wires directly into its plated holes.
Use a short female-female 2.54 mm Dupont ribbon with the module end split into
individual labelled sockets. Continuity-test the exact map in
[`pinout.md`](pinout.md), mark badge pin 1, and provide strain relief.

Slide the V3 into the reviewed passive carrier slots and fit the nonconductive
spacer/retainer with USB-C accessible below the badge edge and the antenna end
clear. Do not remove its stock headers and do not use them as the mechanical
mount. The module's own 24-pin FPC connector remains empty; the raw panel stays
connected only to badge front `J1`. Set USB-to-UART switch 2 **ON** for CH343
programming. Power the module only through its USB-C connector. Keep the J3
Tag-Connect probe detached whenever the harness is installed or USB is powered.

Until the custom circuit passes its first-article rail and refresh tests, keep
the `J1` latch accessible beneath the removable left service spine and use
removable Kapton rather than permanent potting. If the custom circuit fails,
the panel can remain mechanically mounted while its flex is removed from the
fully unpowered badge and written directly with the official Waveshare Driver
HAT. `J3` cannot serve as a HAT bypass; see
[`hat-fallback.md`](hat-fallback.md) for the power-off and flex-service
sequence.

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
unobstructed and dry-fit the largest intended USB-C plug/overmold. Size every
retainer from a physical sample with clearance, because the published
`29.46 x 48.25 mm` outline has no stated production tolerance.

The mount is entirely passive: reviewed carrier slots locate a removable
nonconductive PETG/nylon spacer or retainer around the module edges. It must not
load the USB-C connector, headers, components, or antenna, and it must be
removable without flexing the module. Measure at least three delivered Rev 3
boards for outline, component height, USB-C overhang, and dimensional spread,
then fit-test the spacer and a real cable before repeating it.

The electrical path is also intentionally simple:

```text
module USB-C -> module VDD3V3 output -> passive J4-1 -> badge 3V3
module GPIO/GND headers -> passive 8-wire harness -> badge J4-2..8
```

Badge `J4` is one row of eight 2.54 mm through-holes, ordered
`3V3, GND, BUSY, RST, DC, CS, MOSI, SCLK`. Its male header is optional/DNP and
direct-soldered wires are also allowed. A short 8-way female-female Dupont
ribbon may stay grouped at the badge and split into individual female sockets
at the module. The module-side map is:

| Badge J4 | Waveshare V3 header |
|---:|---|
| 1 | J3-1 `VDD3V3` |
| 2 | J3-14 `GND` |
| 3 | J3-9 / GPIO25 `BUSY` |
| 4 | J3-10 / GPIO26 `RST` |
| 5 | J3-11 / GPIO27 `DC` |
| 6 | J4-16 / GPIO15 `CS` |
| 7 | J3-12 / GPIO14 `MOSI` |
| 8 | J3-15 / GPIO13 `SCLK` |

There is no current limiter, reverse-current block, power mux, logic buffer, or
controller arbitration. Module USB-C is its only power input; do not power its
`VDD3V3` pin from the badge. Remove the J3 Tag-Connect probe before installing
the harness, connect or disconnect only while every source is off, and never
attach or power two controllers. Continuity-test and label every harness.

Waveshare's published Rev 3 schematic marks GPIO4 link `R35` NC/DNP, and badge
J4 does not carry GPIO4. The module firmware target leaves GPIO4 untouched and
cannot turn off USB or badge 3V3. `OK SLEEP USB_POWERED` means the panel is in
deep sleep while the module and badge remain powered; unplug USB-C before
removing the harness. The module's onboard 24-pin FPC connector stays empty.

The antenna zone is a **pour keep-out, not an RF copper keep-out**. Front display
fanout traces cross beneath it. Do not promise WiFi/Bluetooth range; test it on
the actual stacked badge both idle and during a refresh.

Treat the module as service-removable, not frequently swappable. Mark USB-C
orientation and both harness ends, run retainer insertion/removal, harness
strain, USB side-load, shake, and worn-badge drop tests. Use only all-plastic or
removable polymer retention below the antenna. Do not add a magnet, steel clip,
unreviewed slot, drill, or panel splitter at CAM time.

## Prototype release gates

The Waveshare V1.1 documentation combines a current 24-pin table with an older
application-circuit drawing that is not pin-for-pin identical. This design uses
the current 24-pin table plus the UC8253/reference boost topology; current pin 4
is left open and `C15` is DNP.

Before any production build, treat every item below as a release gate rather
than an advisory check. Do not send manufacturing files until the KiCad and
CAM gates pass; do not populate or rely on optional J4 until all physical
harness/mount/FPC/electrical/RF gates pass:

- import/open the legacy schematic in KiCad, save a converted review copy, run
  ERC, and resolve every error; independently reconcile it to the generated
  board without using Update PCB from Schematic;
- refill all zones, run KiCad board DRC, and resolve every error;
- plot fresh Gerber and Excellon files, inspect copper, mask, paste, silkscreen,
  outline, the single lanyard hole, and drill/route output in a second viewer,
  then record the reviewed fabrication-ZIP checksum;
- continuity-map the physical flex and verify pin 1/contact side;
- verify `J1` mating/contact direction, its exact land pattern, and the
  straight-tail reach with the panel and board at full-size;
- scope 3V3, GDR, RESE, VGH, VGL, VCOM, and BUSY during a full refresh;
- validate deep sleep and retained image with the programmer disconnected;
- cycle at least one panel through repeated insertions and updates;
- measure three exact USB-C Rev 3 modules and pass the passive slot,
  spacer/retainer, cable-clearance, and harness-strain fit checks;
- with the module FPC connector empty and every source off, continuity-check
  the exact eight-wire map and shorts between adjacent conductors; then verify
  CH343 upload, module-USB-derived badge 3V3, all six logic signals, deep sleep,
  BUSY-timeout recovery, and complete depowering by USB-C removal;
- complete at least 20 module-driven refresh/sleep cycles, then USB cable
  side-load, insertion/removal, shake/drop, and worn-badge WiFi/Bluetooth range
  tests both idle and during a refresh; and
- obtain independent electrical/manufacturing sign-off on the ERC, DRC, CAM,
  physical FPC/harness/mount, single-controller power procedure, refresh, and
  RF evidence.

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
coil to hear. See [`pickup-design.md`](pickup-design.md) for the calculation
and fixture guidance.

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
| 5 | $12-25 | about $11 | $4-8 | self-assemble | $27-44 |
| 25 | $6-12 | about $11 | $3-7 | $3-8 | $23-38 |
| 100 | $3-8 | about $10.31 | $2.50-5 | $2-6 | $18-29 |

\*Before tax/duty, expedited shipping, failed panels, prototype re-spins,
test-fixture labour, design review, and the optional controller kit.

The optional V3 kit adds no controller ICs or power-protection parts to routine
PCBAs. Its per-equipped-badge extras are one removable module, an inexpensive
1 x 8 header or eight direct wires, a short passive harness, and a printed
spacer/retainer. The Waveshare V3 module was US$14.99 at quantity one on
2026-07-15; allow a broad **US$1-7** more for the commodity connector, harness,
labels, and low-volume printed mount before labour, freight, and tax. These are
dated planning observations, not quotations, and optional J4 remains DNP on
routine badges.

The reusable programmers are separate tooling, not a cost on every badge. Two
Universal Driver HATs at US$9.99 plus three optional ESP32 boards at the
US$14.39 three-unit break list for about **US$63.15** on 2026-07-15 before
shipping, tax, HAT hosts, passive harnesses, and printed retainers. For the full redundant
dual-track set in `bom-tooling.csv`, budget roughly $200-600 for two
TC2050/Seeed XIAO ESP32-S3 custom stations, two Universal Driver HAT/host backup
stations, three ESP32 validation/removable-controller units, three labelled
harnesses and retainers, power, cabling, a simple alignment fixture, and one or two complete
HAT references. Existing Raspberry Pi hosts put the total near the low end;
confirm live prices and physically allocated stock before purchase. The Seeed
XIAO ESP32-S3 is the primary Tag-Connect station; the repository also builds
the optional USB-powered Waveshare V3 harness target. Other controllers require
their own firmware, wiring, power, and first-article qualification.

Budget another $300-800 for two prototype spins, spare displays, review, and
international shipping. The raw panel saves the on-badge controller/module
cost, but it moves more validation responsibility into this PCB and fixture.

## Source references

- Waveshare product and current dimensions: <https://www.waveshare.com/3.52inch-e-paper.htm>
- Waveshare current V1.1 panel drawing/pin table: <https://files.waveshare.com/wiki/3.52inch%20e-Paper%20HAT/3.52inch%20e-Paper%20V1.1.pdf>
- Waveshare 3.52-inch manual and examples: <https://www.waveshare.com/wiki/3.52inch_e-Paper_HAT_Manual>
- Waveshare Universal Driver HAT: <https://www.waveshare.com/e-paper-driver-hat.htm>
- Waveshare ESP32 Driver Board and revision/pin documentation: <https://www.waveshare.com/e-paper-esp32-driver-board.htm> and <https://www.waveshare.com/wiki/E-Paper_ESP32_Driver_Board>
- Waveshare ESP32 Driver Board V3 schematic: <https://files.waveshare.com/wiki/E-Paper-ESP32-Driver-Board/E-Paper_ESP32_Driver_Board_V3.pdf>
- Hirose FH34SRJ connector/stencil catalog: <https://www.hirose.com/en/product/document?clcode=&documentid=en_FH34_CAT&documenttype=Catalog&lang=en&productname=&series=FH34SRJ>
- UC8253 controller datasheet: <https://files.waveshare.com/wiki/3.52inch%20e-Paper%20HAT/UC8253c.pdf>
- Tag-Connect no-legs probe: <https://www.tag-connect.com/product/tc2050-idc-nl-10-pin-no-legs-cable-with-ribbon-connector>
- Tag-Connect target-footprint drawing: <https://www.tag-connect.com/wp-content/uploads/bsk-pdf-manager/TC2050-IDC-NL_Datasheet_8.pdf>
- Seeed XIAO ESP32-S3: <https://www.seeedstudio.com/XIAO-ESP32S3-p-5627.html>

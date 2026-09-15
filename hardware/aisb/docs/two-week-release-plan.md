# Two-week release plan

This plan assumes a hard usable-badge deadline of **2026-07-28**.  The carrier
PCB is now feature-frozen.  Do not add another electronic feature or depend on
a PCB respin.

> **NOT PRODUCTION RELEASED:** The removable Waveshare V3 interface is an
> optional pilot, not a deadline dependency. If its harness, passive mount, or
> physical tests miss a gate, leave the 1 x 8 J4 header DNP and continue with
> the two proven Driver HAT stations, Tag-Connect-qualified badges, and printed
> inserts.

## Release decision

Use one carrier PCB with three independent completion paths and one optional
add-on:

1. **Primary hardware path:** populate the custom on-board raw-panel support
   circuit across the build and use `J3` for convenient name changes. Mark the
   first five identical PCBAs as engineering units and do not power the rest
   until those units pass.
2. **Independent HAT path:** pre-write every raw panel off-board before it is
   mounted. If the custom circuit fails, unplug the raw panel flex from `J1`,
   connect that flex directly to a known-working Waveshare e-Paper Driver HAT,
   write the name, completely power down, and mount or park the panel
   unpowered. The HAT does not connect through `J3`; see
   [`hat-fallback.md`](hat-fallback.md).
3. **Guaranteed passive path:** every fabricated carrier still has the AISB
   artwork and passive pickup. A matte printed name insert under the clear
   protector remains the last-resort option for late arrivals or damaged glass.
4. **Optional removable V3 pilot:** only after harness, passive-mount, and
   first-article approval, fit the Waveshare ESP32 Driver Board V3 in the
   carrier slots/spacer and connect its headers to optional badge `J4` with the
   passive eight-wire harness. Its own FPC connector stays empty. USB-C is its
   only power source, and only one controller may be connected or powered.

The [Waveshare raw panel](https://www.waveshare.com/3.52inch-e-paper.htm) is a
display without a driver board.  Waveshare explicitly lists its
[Universal e-Paper Driver HAT](https://www.waveshare.com/e-paper-driver-hat.htm)
as compatible with the 3.52-inch raw panel.  Buy two driver HATs so a damaged
connector or station does not stop name production.  One complete
[3.52-inch e-Paper HAT](https://www.waveshare.com/3.52inch-e-paper-hat.htm) is
also useful as a known-working electrical and software reference, but its
40-pin header makes it too bulky to be the default wearable assembly.

Also buy at least three
[ESP32 Driver Board V3](https://www.waveshare.com/e-paper-esp32-driver-board.htm)
samples, three labelled passive 8-wire harnesses, optional 1 x 8 breakaway
headers, and three nonconductive spacer/retainer samples. This is a `29.46 x 48.25 mm`
USB-C/WiFi/Bluetooth participant-add-on experiment, not a schedule-critical
fallback. The raw panel's page recommends it, but the ESP32 product page's
current supported list omits 3.52 inches; require all gates below before
offering it to participants.

## Hard gates

### July 15: freeze, buy, and release

- Freeze the carrier outline, pickup, logo, and display envelope.
- Order exact raw panels in quantity `N + max(5, ceil(0.15N))`, two Universal
  Driver HATs, at least three ESP32 Driver Board V3 samples, three short 8-way
  female-female Dupont harnesses, optional 1 x 8 headers, three removable
  nonconductive spacer/retainer samples, one or two complete 3.52-inch HATs,
  two tested HAT host/controller setups, and two
  [Seeed XIAO ESP32-S3](https://www.seeedstudio.com/XIAO-ESP32S3-p-5627.html)
  custom-programmer controllers,
  lanyards, audio pigtails, 0.5 mm hard-coated polycarbonate lens stock, black
  PETG bezel/service-spine material, transfer adhesive, Kapton, and printable
  matte stock.
- Choose express shipping from stock that is physically available; obtain
  written allocation/tracking before release and do not use an estimated
  restock date.
- Arrange an experienced PCB/EE review immediately.

Before exporting files in KiCad:

1. Close or reload any stale open board, then regenerate the PCB.
2. Press `B` to fill the rear `DGND` zone and save the board.
3. Confirm the project minimum copper clearance is 0.20 mm.
4. Open/import the legacy schematic in KiCad, save a converted review copy, run
   ERC, and resolve every error. Independently reconcile it to the generated
   board; do not use Update PCB from Schematic.
5. Run the full board Design Rules Checker and resolve every error.
6. Verify `J1` against the physical connector and panel flex if the custom
   display circuit will be assembled.
7. Plot and visually inspect Gerber copper, solder mask, paste, silkscreen, outline,
   the single circular lanyard hole, front-side `J1`, and Excellon drill/route
   output in a second viewer. Confirm there is no internal display-flex cutout;
   record the reviewed fabrication-ZIP checksum.
8. Request no copper thieving or balancing inside the pickup keepout.
9. Verify optional J4 has one 1 x 8 row of 2.54 mm plated holes in the order
   `3V3, GND, BUSY, RST, DC, CS, MOSI, SCLK`; verify its pin-1 mark, the reviewed
   passive mounting slots, module/USB outline, and antenna pour keep-out.

If the assembler can provide a rapid first article without delaying the batch,
approve five fully populated units first. Otherwise assemble the full circuit
across the run, reserve five identical PCBAs as engineering units, and do not
power the production units until the engineering units pass. HAT-program the
raw panels before mounting regardless of the custom-circuit result. Order
10-15% spare carrier boards and use expedited fabrication and courier delivery.

### July 16: HAT and mechanical go/no-go

- Refresh a purchased raw panel with the official Driver HAT and official
  example software.
- Display a real landscape name card, power down, disconnect the flex, and
  confirm retention.
- Repeat at least 20 refresh/sleep/power-off cycles on one panel.
- Make a full-size paper/PETG mock-up and verify the centred glass at
  `x=7.65..92.35` mm, `3.65 +/- 0.30 mm` electrical FPC reach straight into
  front-side `J1`, adhesive frame, black bezel, 0.5 mm lens, removable opaque
  left service spine, circular lanyard hole, and lanyard placement. Do not
  mistake the separate 10 mm adhesive pull-tab for electrical FPC length.
- Measure three exact ESP32 V3 boards: outline, component heights, USB-C
  overhang, header access, and dimensional spread. Fit-test the passive carrier
  slots, spacer/retainer, and harness strain relief. The stock headers remain
  on the module but do not carry mechanical load.
- Dry-fit USB-C down with the largest intended cable and the lower 12-14 mm
  approach unobstructed. The module's own FPC connector stays empty; do not use
  its supplied adapter/FFC and do not add a flex slot.
- Continuity-test the harness from badge J4-1..8 to Waveshare
  `J3-1, J3-14, J3-9, J3-10, J3-11, J4-16, J3-12, J3-15`, with no adjacent
  shorts. Set USB-to-UART switch 2 ON and verify CH343 upload/serial, module
  USB-derived badge 3V3, and all six logic signals. Published module R35 is DNP;
  badge J4 does not use GPIO4 and firmware must leave it untouched.
- Complete at least 20 module-driven full refresh/sleep cycles and a BUSY-timeout
  recovery before qualifying the option. `OK SLEEP USB_POWERED` means the panel
  is asleep but the USB-powered module and badge rail remain on; unplug USB-C
  before removing the harness.
- Time the complete off-board program-and-mount operation.
- Freeze one canonical 360 x 240 one-bit PBM and prove that both HAT stations
  write it with the same orientation.

If either HAT station is not repeatable, fix or replace that station immediately
and keep the other station untouched as the known-good reference. Printed
inserts become the primary identity surface if panel stock, glass handling, or
mechanical fit fails this gate.

### Within 24 hours of PCBA arrival: custom-circuit gate

Complete this no later than July 22. Use only the five labeled engineering
PCBAs and HAT-proven raw panels:

1. Physically verify `J1` pin 1, exposed-contact side, latch direction,
   insertion depth, and the complete straight short-tail fit before inserting
   a panel.
2. Power the first badge from a current-limited 3.3 V source. Measure 3V3, GDR,
   RESE, VGH, VGL, VCOM, and BUSY during one full refresh and compare them with
   the known-good HAT/panel behavior.
3. Write the canonical PBM through `J3`, confirm its orientation and retained
   image, and repeat 20 refresh/sleep/power-off cycles on one engineering unit.
4. Perform at least one full write/sleep/power-off cycle on each of the other
   four engineering PCBAs.
5. An experienced reviewer signs off the measurements before any production
   badge circuit is powered.

If the optional module is still in scope, then on one separately marked pilot:

6. Inspect the optional J4 header or direct-wire joints, verify the complete
   Waveshare J3/J4-to-badge J4 harness mapping by continuity, and confirm the
   passive spacer/retainer leaves USB-C and the antenna clear.
7. Remove the Tag-Connect probe, connect the harness while unpowered, then power
   only through module USB-C. Verify badge 3V3, refresh, deep sleep, and complete
   power removal after unplugging USB-C. Never operate two controllers together.
8. Perform retainer insertion/removal, harness strain, USB side-load,
   shake/drop, and worn-badge WiFi/Bluetooth range tests both idle and during a
   display refresh.

If any unexplained short, rail, BUSY, orientation, heat, or retention problem
appears, stop using `J3`, label the production units `HAT-ONLY`, and do not power
their badge display circuits. Continue with the already-proven HAT workflow; do
not attempt a PCB respin on this schedule.

### July 17-23: build

- Inspect incoming boards before mounting glass.
- Dry-fit the centred panel and straight short FPC into front-side `J1` before
  applying permanent display adhesive.
- HAT-program and visually inspect every raw panel before inserting its flex
  into a badge; keep the panel/badge identity together through assembly.
- Measure `C1.2` to `J2.2`; accept approximately 15-25 ohms.
- Function-test the passive pickup on every assembled board.
- Print all known names and several blank/late-registration inserts.
- Use the custom circuit for units that passed the gate. Use the independent
  HAT workflow for the rest; fully power down before moving any flex.
- Leave the J4 header DNP on routine units unless the optional pilot received
  explicit mechanical and electrical approval. Direct-soldered harnesses also
  require inspection and strain relief.
- Label the travelers for each badge `CUSTOM-PASS` or `HAT-ONLY`; never power a
  `HAT-ONLY` badge display circuit.
- Finish all routine assembly by July 23.

### July 24-26: QA

- Inspect every display/insert, bezel and lens edge, removable left service
  spine, straight unstrained FPC, pigtail strain relief, circular lanyard hole,
  and audio output.
- On every approved V3 pilot, confirm USB-C accessibility, empty module FPC
  connector, switch 2 ON, passive retention, labelled harness map, cable
  clearance, single-controller warning, and reduced-range label.
- Keep 10-15% finished spares and spare printed inserts.
- Pack raw-glass units so nothing presses on the active display area.

### July 27-28: contingency only

No redesigns.  Replace a failed e-paper assembly with a printed insert and
ship the functional passive-pickup carrier.

## Release files still required

The repository currently contains design sources, not a manufacturer release.
The KiCad review must produce and inspect the following. ERC/DRC sign-off,
second-viewer Gerber/drill inspection and the physical
FPC/harness/mount/electrical/RF tests remain release gates, not post-order TODOs:

- Gerber layers and Excellon drill/route files;
- a fabrication ZIP and checksum;
- an ERC/DRC report and signed independent review record;
- a fabrication/drill drawing and a front-side `J1` orientation callout;
- for the populated hardware path, exact-MPN BOM, pick-and-place/CPL, paste output,
  assembly/DNP drawing, a single-controller/no-hot-plug warning, and a connector
  callout distinguishing badge J3/J4 from Waveshare J3/J4; and
- cut files for the black PETG spacer/bezel, 0.5 mm polycarbonate lens,
  perimeter adhesive frame, and removable left service spine.

Do not use the descriptive prototype `bom.csv` as a production purchasing BOM.
It intentionally contains candidate parts that still require physical
verification.

For `N` required finished badges, order full PCBAs and raw panels in quantity
`N + max(5, ceil(0.15N))`; order protectors, lanyards, and audio leads in
quantity `N + max(5, ceil(0.10N))`. The fixed tooling is two complete Driver
HAT backup stations, two Seeed XIAO ESP32-S3 custom-programmer stations, three
ESP32-board validation/removable-controller units, three labelled harnesses and
passive retainers, and one or two complete 3.52-inch HAT references.
Other controller boards require separate qualification. See
[`bom-tooling.csv`](../bom-tooling.csv).

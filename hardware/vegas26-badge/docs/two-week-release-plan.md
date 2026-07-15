# Two-week release plan

This plan assumes a hard usable-badge deadline of **2026-07-28**.  The carrier
PCB is now feature-frozen.  Do not add another electronic feature or depend on
a PCB respin.

## Release decision

Use one carrier PCB with three independent completion paths:

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

The [Waveshare raw panel](https://www.waveshare.com/3.52inch-e-paper.htm) is a
display without a driver board.  Waveshare explicitly lists its
[Universal e-Paper Driver HAT](https://www.waveshare.com/e-paper-driver-hat.htm)
as compatible with the 3.52-inch raw panel.  Buy two driver HATs so a damaged
connector or station does not stop name production.  One complete
[3.52-inch e-Paper HAT](https://www.waveshare.com/3.52inch-e-Paper-HAT.htm) is
also useful as a known-working electrical and software reference, but its
40-pin header makes it too bulky to be the default wearable assembly.

Also buy one
[ESP32 Driver Board V3](https://www.waveshare.com/e-paper-esp32-driver-board.htm)
now. It is a `29.46 x 48.25 mm` USB-C/WiFi/Bluetooth participant-add-on
experiment for the new rear bay, not a schedule-critical fallback. The raw
panel's page recommends it, but the ESP32 product page's current supported list
omits 3.52 inches; require a physical fit and repeated full-refresh test before
offering it to participants.

## Hard gates

### July 15: freeze, buy, and release

- Freeze the carrier outline, pickup, logo, and display envelope.
- Order exact raw panels in quantity `N + max(5, ceil(0.15N))`, two Universal
  Driver HATs, one ESP32 Driver Board V3, one or two complete 3.52-inch HATs,
  two tested HAT host/controller setups,
  lanyards, audio pigtails, 0.5 mm hard-coated polycarbonate lens stock, black
  PETG bezel/service-spine material, transfer adhesive, Kapton, and printable
  matte stock.
- Choose express shipping from stock that is physically available; do not use
  an estimated restock date.
- Arrange an experienced PCB/EE review immediately.

Before exporting files in KiCad:

1. Close or reload any stale open board, then regenerate the PCB.
2. Press `B` to fill the rear `DGND` zone and save the board.
3. Confirm the project minimum copper clearance is 0.20 mm.
4. Run the full Design Rules Checker and resolve every error.
5. Verify `J1` against the physical connector and panel flex if the custom
   display circuit will be assembled.
6. Plot and visually inspect Gerber copper, solder mask, silkscreen, outline,
   the single circular lanyard hole, front-side `J1`, and Excellon drill/route
   output. Confirm there is no internal display-flex cutout.
7. Request no copper thieving or balancing inside the pickup keepout.

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
- Dry-fit the exact ESP32 V3 board in rear bay `MOD1`, USB-C down. Measure its
  long underside header projection and mock up a tolerant all-plastic cradle;
  do not use a flat foam mount. Test a real USB-C cable with the lower 12-14 mm
  approach unobstructed, check antenna behavior, and confirm the supplied
  adapter/FFC reaches around the outside left edge without a crease. Do not add
  a flex slot or depend on the module if any part of this fails.
- On the bench, make the ESP32 board complete at least 20 full refreshes of the
  exact 3.52-inch panel before qualifying its direct-FFC use. Do not release a
  GPIO-to-`J3` participant harness on this schedule.
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
- Label the travelers for each badge `CUSTOM-PASS` or `HAT-ONLY`; never power a
  `HAT-ONLY` badge display circuit.
- Finish all routine assembly by July 23.

### July 24-26: QA

- Inspect every display/insert, bezel and lens edge, removable left service
  spine, straight unstrained FPC, pigtail strain relief, circular lanyard hole,
  and audio output.
- Keep 10-15% finished spares and spare printed inserts.
- Pack raw-glass units so nothing presses on the active display area.

### July 27-28: contingency only

No redesigns.  Replace a failed e-paper assembly with a printed insert and
ship the functional passive-pickup carrier.

## Release files still required

The repository currently contains design sources, not a manufacturer release.
The KiCad review must produce and inspect:

- Gerber layers and Excellon drill/route files;
- a fabrication ZIP and checksum;
- a fabrication/drill drawing and a front-side `J1` orientation callout;
- for the populated hardware path, exact-MPN BOM, pick-and-place/CPL, paste output,
  assembly/DNP drawing, and connector orientation callout; and
- cut files for the black PETG spacer/bezel, 0.5 mm polycarbonate lens,
  perimeter adhesive frame, and removable left service spine.

Do not use the descriptive prototype `bom.csv` as a production purchasing BOM.
It intentionally contains candidate parts that still require physical
verification.

For `N` required finished badges, order full PCBAs and raw panels in quantity
`N + max(5, ceil(0.15N))`; order protectors, lanyards, and audio leads in
quantity `N + max(5, ceil(0.10N))`. The fixed tooling is two complete Driver
HAT stations, two custom-programmer stations, one ESP32-board fit/test sample,
and one or two complete 3.52-inch HAT references. See
[`bom-tooling.csv`](../bom-tooling.csv).

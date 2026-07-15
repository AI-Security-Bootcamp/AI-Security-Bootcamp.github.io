# OpenSCAD badge model

`vegas26-badge.scad` is a parametric, assembled preview of the 100 x 145 mm
AISB Vegas badge. Open it in OpenSCAD, press **F5** for a quick preview, and
drag to orbit the model. Press **F6** for a full render.

`viewport-cut-template.svg` is a one-to-one millimetre, layered template for
the clear lens, black spacer, underside black print, and an orange prototype
transfer-adhesive frame. The adhesive frame has a 13.50 mm open notch around
the 12.50 mm FPC so adhesive cannot cross the straight tail or J1 service path.
Its 0.25 mm edge inset and 1.50 mm rails are starting dimensions, not released
production dimensions: cut one sample and verify the actual panel lot, cutter
kerf, squeeze-out, adhesive thickness, latch access, and FPC clearance. Hide
the guide and unused fabrication groups before sending one layer to a cutter
or printer.
The small service spine is three-dimensional and should be exported from the
OpenSCAD model instead of cut from this plan view.

The Customizer variables at the top of the file let you:

- switch `mode` between `assembled`, `pcb_only`, `exploded`, and the printable
  `service_spine` part;
- change `badge_name` and `badge_handle` on the e-paper placeholder;
- adjust the separation in the exploded view; and
- hide the pickup coil, protector, labels, or ghosted removable module for a
  cleaner mechanical view; and
- set `show_j4_header = true` to preview a populated 1x8 rear header instead of
  the default unpopulated plated-hole footprint.

If the Customizer panel is hidden, enable **Window > Customizer**. Changes can
also be made directly in the first few lines of the `.scad` file.

With the OpenSCAD command-line tool installed, an STL can be exported with:

```bash
cd hardware/vegas26-badge/cad
openscad -o vegas26-badge-assembled.stl \
  -D 'mode="assembled"' vegas26-badge.scad
```

Export just the removable left connector cover with:

```bash
openscad -o vegas26-badge-service-spine.stl \
  -D 'mode="service_spine"' vegas26-badge.scad
```

STL discards the preview colours and text materials. Keep the `.scad` file for
the useful interactive, coloured assembly view.

## Model scope

The model shows the proposed carrier mechanical revision: a 1.6 mm, R5 PCB;
one centred 6 mm circular lanyard hole, AISB artwork and passive pickup, the
raw-panel support network on the rear, and a raw Waveshare 3.52-inch panel
mounted on the front of solid FR-4. There is no onboard microcontroller,
ESP32 socket pair, controller power mux, or controller-side buffer. The
84.70 x 54.41 mm glass occupies `x=7.65..92.35`, `y=67.00..121.41`; its
74.51 x 49.67 mm active area occupies `x=15.47..89.98`,
`y=69.37..119.04`.

The optimized pickup is shown as a chamfered 30-turn-per-layer spiral in the
80 x 49 mm upper winding envelope. Both physical copper layers are modelled;
the rear model also places C1, R1, and R2 at their current KiCad coordinates.
The muted winding colour is a visualization cue: production copper remains
covered by continuous black solder mask.
See `../docs/pickup-design.md` for its electrical calculations and test plan.

There is no internal display-flex slot or edge wrap. The high-resolution panel
drawing identifies the electrical FPC protrusion as only `3.65 +/- 0.30 mm`;
the nearby `10.00 mm` callout belongs to the removable adhesive tape tab, not
the electrical tail. A front-side, low-profile Hirose
FH34SRJ-24S-0.5SH dual-contact ZIF therefore sits immediately left of the
glass. Its mouth is approximately at `x=5.50` and faces right toward the panel,
leaving a straight 2.15 mm exposed flex span to the glass edge at `x=7.65`.
The tail continues 1.5 mm into the connector to its tip at `x=4.00`. The body
spans about `x=1.70..5.50`; its signal-pad row is at approximately `x=5.00`
on the right/insertion side, while its retention row is approximately `x=1.70`
on the left. It is centred at `y=94.205`. The dual-contact part avoids
committing the PCB to only a top- or bottom-contact flex orientation.

The display mount is a no-hole "instrument viewport": a nominal 1.48 mm black spacer/printed
bezel masks the inactive glass, and a 0.5 mm clear polycarbonate lens protects
the face. A raised, removable black service spine bridges the lens's left edge
and hides the front connector and short straight flex inside a shallow cavity.
It can be a small 3D print or laminated laser-cut part retained by its rail
geometry and a narrow strip of removable transfer adhesive. It adds no PCB
fastener holes and uses no magnets, which is important next to the passive
electromagnetic pickup. The black border can be printed on the lens underside
for a durable, crisp finish.

Rear mechanical envelopes retain the raw-panel boost/rail network and the
zero-height TC2050-IDC-NL programming target centred at `(90,137)`. An
optional Waveshare e-Paper ESP32 Driver Board V3 is shown translucently in the
bay centred at `(20.23,120.875)`. Its `29.46 x 48.25 mm` PCB reaches the lower
badge edge, with the antenna up and USB-C exposed below. It is removable and
is not electrically or mechanically socketed to the carrier.

The carrier has four vertical, routed NPTH ovals for the insulating cradle:
`(3.5,131.5)`, `(37,131.5)`, `(3.5,139.5)`, and `(37,139.5)`. Each finished
slot is `2.2 x 6.0 mm`. Two non-metallic straps pass through the left/right
slot pairs. Narrow PETG/PA12 side rails with thin closed-cell foam caps support
only the module PCB edge strips; the populated centre and both stock 1x19 male
header rows remain above open air. The model uses a provisional 9.40 mm
carrier-to-module gap. Trim the rail/foam stack only after measuring the
longest header pin and tallest underside component on the purchased V3 lot.
No module pin may touch or pass through the carrier.

Keep the lower module edge and the centreline beneath it clear for the USB-C
plug and cable overmold. Use plastic/foam retention only—no metal clip or
magnet beside the passive pickup. Dry-fit the module and largest intended USB
cable, then perform shake, worn-badge drop, cable side-load, and radio-range
tests before making multiple cradles.

J4 is a horizontal 1x8, 2.54 mm-pitch 3.3 V SPI interface at `y=140.5`, with
pin centres from `x=60.00` through `x=77.78`. Its order is `3V3`, `GND`,
`BUSY`, `RST`, `DC`, `CS`, `MOSI`, `CLK`. The default model shows only the
plated holes; set `show_j4_header = true` to preview a populated body. Connect
the optional module using an external eight-wire female ribbon/harness and
never route its 5 V pin to J4.

The TC2050 target consists of ten exposed 0.787 mm contact pads, three 0.991 mm
non-plated alignment holes, and its 6.2 x 2.5 mm rear-silkscreen envelope; the
reusable spring-pin probe and cable are tooling, not badge components. The
ghost module omits its supplied display adapter/FFC, switches, and many small
parts. Exact FH34SRJ footprint dimensions, FPC contact side and reach, module
pin projection, cradle height, adhesive stack, and service-spine clearances
remain subject to physical first-article measurement.

This model is for visualization and preliminary mechanical fit checking. It is
not a printable enclosure and must not be used to generate PCB fabrication
data. The generated KiCad PCB is the current electrical revision and remains
authoritative for copper, drills, footprints, and fabrication outputs.

# OpenSCAD badge model

`vegas26-badge.scad` is a parametric, assembled preview of the 100 x 145 mm
AISB Vegas badge. Open it in OpenSCAD, press **F5** for a quick preview, and
drag to orbit the model. Press **F6** for a full render.

`viewport-cut-template.svg` is a one-to-one millimetre, layered template for
the clear lens, black spacer, and underside black print. Hide the guide and
unused fabrication groups before sending one layer to a cutter or printer.
The small service spine is three-dimensional and should be exported from the
OpenSCAD model instead of cut from this plan view.

The Customizer variables at the top of the file let you:

- switch `mode` between `assembled`, `pcb_only`, `exploded`, and the printable
  `service_spine` part;
- change `badge_name` and `badge_handle` on the e-paper placeholder;
- adjust the separation in the exploded view; and
- hide the pickup coil, protector, or labels for a cleaner mechanical view; or
- set `show_esp32_driver = true` to fit-check the optional rear USB-C module.

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

The model shows the proposed controller-free mechanical revision: a 1.6 mm,
R5 PCB; one centred 6 mm circular lanyard hole, AISB artwork and passive pickup;
and a raw Waveshare 3.52-inch panel mounted on the front of solid FR-4. The 84.70 x
54.41 mm glass occupies `x=7.65..92.35`, `y=67.00..121.41`; its 74.51 x
49.67 mm active area occupies `x=15.47..89.98`, `y=69.37..119.04`.

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

Rear mechanical envelopes also reserve space for the raw-panel driver passives,
the zero-height rear TC2050-IDC-NL programming target centred at `(90,137)`,
and the padless optional ESP32 bay at `(20.23,120.875)`. The bay is exactly
`29.46 x 48.25 mm`, reaches the lower badge edge so USB-C remains accessible,
and adds no mounting holes. The interactive ESP32 body is hidden by default;
enable `show_esp32_driver` to see its approximate board, antenna, can, and USB
envelopes. The model now includes a conservative 10 mm underside-header
projection and two header-clear support rails; measure the purchased board and
give a real cradle assembly clearance rather than using a zero-clearance
`29.46 x 48.25 mm` pocket. Keep the lower 12-14 mm around USB-C unobstructed so
a real cable overmold can enter. A qualified assembler may instead remove the
stock headers after electrical inspection.

The TC2050 target consists of ten exposed 0.787 mm contact pads, three 0.991 mm
non-plated alignment holes, and its 6.2 x 2.5 mm rear-silkscreen envelope; the
reusable spring-pin probe and cable are tooling, not badge components. The
ESP32 bay is likewise only a mechanical reservation: the model does not imply
an electrical socket, cable path, final cradle geometry, or qualified 3.52-inch
firmware. It omits the supplied FFC/adapter, switches, and some small parts.
Exact FH34SRJ footprint dimensions, FPC contact side and reach, component heights,
adhesive stack, and spine clearances remain subject to measurement of a
physical panel and connector before fabrication.

This model is for visualization and preliminary mechanical fit checking. It is
not a printable enclosure and must not be used to generate PCB fabrication
data. The generated KiCad PCB is the current electrical revision and remains
authoritative for copper, drills, footprints, and fabrication outputs.

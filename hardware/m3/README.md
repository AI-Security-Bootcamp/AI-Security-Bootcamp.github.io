# M3 e-paper badge

Open `m3.kicad_pro` in KiCad to edit `m3.kicad_pcb`. This is the saved M3
London design under a stable filename. Keep future revisions in Git; see the
[hardware history](../README.md#revision-history).

The common electrical-reference schematic, bills of materials, assembly notes,
CAD, and programmer firmware live under [`../aisb/`](../aisb/README.md). This
project references `../aisb/aisb.kicad_sch`; open that schematic directly when
needed. It is a reference and must not be used to overwrite the manually edited
M3 board with **Update PCB from Schematic**.

## Render badge images

With Python 3 and Pillow installed, run from the repository root:

```bash
python3 hardware/m3/scripts/render-m3-badge.py \
  --first-name Example --last-name Person --role participant
```

The renderer uses the shared `../aisb/assets/fonts/SpaceGrotesk-700.ttf` and
draws the M³ footer directly. `assets/m3-icon.svg` is the vector brand source.
`--font` and `--output-dir` can override the defaults.

Black/red flashing planes and a preview are written to the ignored `out/flash/`
directory. Existing local M3 previews are retained there. The shared three-color
panel writer is [`../aisb/scripts/write_image_b.py`](../aisb/scripts/write_image_b.py).
Latest available fabrication exports are in the ignored `out/gerbers/` directory.

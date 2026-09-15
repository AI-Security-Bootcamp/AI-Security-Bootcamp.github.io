# JLCPCB assembly files

These CSVs are the manually curated JLCPCB assembly variant for the current
saved board:

- `jlcpcb-bom.csv` selects exact JLCPCB/LCSC part numbers.
- `jlcpcb-cpl.csv` contains 33 machine placements: J1 on the front and 32
  components on the rear.

The assembly variant excludes C15, EPD1, J2, J3, J4, L1, MH1, and MOD1. The
display and audio pigtail are manual items; J3 and L1 are fabricated PCB
features; J4 and C15 are DNP; MH1 and MOD1 are mechanical-only footprints.

The CPL uses the same coordinate system as KiCad's current all-sides placement
export. Its rear rotations and J1 center follow JLCPCB Fabrication Toolkit
translation behavior, so they intentionally differ from the raw KiCad `.pos`
values. Always inspect J1, Q1, and D1-D3 in JLCPCB's placement preview.

These files are an ordering snapshot, not proof that the board is released.
Confirm live part inventory and resolve the documented J1 mechanical fit and
orientation issue before paying for assembly. Generated Gerbers, drill files,
placement exports, reports, and ZIP archives belong in the ignored `out/`
directory.

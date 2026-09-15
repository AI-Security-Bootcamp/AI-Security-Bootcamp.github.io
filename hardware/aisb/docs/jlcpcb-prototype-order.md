# JLCPCB engineering-prototype order

This design is **not released for a production-quantity order**. The first
order should be five identical engineering PCBAs. Do not power any additional
assembled units until those five pass the electrical and display tests in
[`two-week-release-plan.md`](two-week-release-plan.md).

The repository's `bom.csv` is a descriptive prototype BOM. It is **not** a
JLCPCB assembly BOM: it includes the display, tooling, and manually fitted
mechanical parts. The controlled machine-assembly snapshot is in
[`assembly/jlcpcb-bom.csv`](../assembly/jlcpcb-bom.csv), paired with
[`assembly/jlcpcb-cpl.csv`](../assembly/jlcpcb-cpl.csv). Confirm its live part
inventory again at upload time.

## Release gates before export

- Save and close every KiCad window so an old in-memory board cannot overwrite
  the generated board.
- Run `node scripts/generate-board.mjs` followed by
  `node scripts/validate-generated.mjs` from the badge directory.
- Reopen the generated PCB, press **B** to refill the rear `DGND` zone, and save.
- Run **Inspect > Design Rules Checker**. Resolve every error and every
  unconnected item; save the report.
- Correct J3 before regenerating the release candidate: remove the `DGND`
  bridge that currently crosses between J3 pads 2 and 9, prohibit tracks and
  vias in Tag-Connect's official shaded center keepout, and escape both ground
  contacts outward independently. Verify at least 0.508 mm clearance from each
  contact pad to every unrelated track or signal.
- Open/import the legacy schematic as a review copy and run ERC. Reconcile the
  result to the generated PCB manually. Do **not** use **Update PCB from
  Schematic**.
- Physically verify the exact raw-panel revision and J1 connector: FPC contact
  side, pin 1, connector mouth direction, insertion depth, and straight
  `3.65 +/- 0.30 mm` tail reach.
- Obtain written DFM/assembly acceptance for J1. Its body is intentionally
  close to the finished left board edge, while JLCPCB's general assembly terms
  request 2.5 mm body-to-edge clearance. A carrier rail, fixture, or separate
  hand-placement operation may be required.
- Replace every populated line in the descriptive BOM with an approved exact
  MPN and JLCPCB/LCSC part number. Confirm live stock before ordering.
- Encode DNP/DNL and mechanical-only references with KiCad
  `exclude_from_bom` / `exclude_from_pos_files` attributes, or generate a
  controlled assembly variant that proves the same exclusions.
- Leave J3, J4, C15, L1, EPD1, MOD1, J2 wiring, and all mechanical/tooling rows
  out of the machine-placement BOM. J3 and L1 are fabricated PCB features; J4
  and C15 are DNP; the rest are manual/off-board items.

## Gerber and drill export

In PCB Editor choose **File > Fabrication Outputs > Gerbers (.gbr)**.

1. Use a new, empty output directory.
2. Plot `F.Cu`, `B.Cu`, `F.Paste`, `B.Paste`, `F.Silkscreen`,
   `B.Silkscreen`, `F.Mask`, `B.Mask`, and `Edge.Cuts`.
3. Enable reference designators, **Check zone fills before plotting**, Protel
   filename extensions, and **Subtract soldermask from silkscreen**.
4. Plot the files.
5. Choose **Generate Drill Files**. Use millimetres, absolute origin, decimal
   format, and the alternate/oval-hole drill mode. Generate the drill map too.
6. Keep the plated and non-plated drill outputs. The 6 mm lanyard cutout and
   four 2.2 x 6 mm cradle slots must appear as non-plated mechanical features.
7. Zip only the Gerber and drill fabrication files. Do not upload the KiCad
   project or this repository as the fabrication ZIP.

Open the ZIP in KiCad GerbView and a second independent viewer before upload.
Check all of the acceptance points below at high zoom.

## Expected PCB order settings

Use the values detected from the fabrication ZIP where available, then confirm:

| Option | Value |
|---|---|
| Base material | FR-4 |
| Layers | 2 |
| Finished size | 100 x 145 mm |
| Different designs | 1 |
| Delivery format | Single PCB |
| PCB thickness | 1.6 mm |
| Copper weight | 1 oz |
| Solder mask | Black |
| Silkscreen | White |
| Surface finish | ENIG |
| Via covering | Tented / follow Gerbers |
| Impedance control | No |
| Gold fingers | No |
| Castellated holes | No |
| Edge plating | No |
| Mark on PCB | None |
| Initial quantity | 5 engineering units |

ENIG is intentional for the exposed Tag-Connect pads and gold artwork. Current
JLCPCB policy adds no board mark by default, so do not add the obsolete
`JLCJLCJLCJLC` placeholder.

## PCBA files and options

For assembled prototypes, select **Standard PCBA** and **both-side assembly**:
J1 is on the front and the remaining populated SMD parts are on the back.

Upload the controlled files:

- [`assembly/jlcpcb-bom.csv`](../assembly/jlcpcb-bom.csv), with `Comment`,
  `Designator`, `Footprint`, and exact `JLCPCB Part #` fields; and
- [`assembly/jlcpcb-cpl.csv`](../assembly/jlcpcb-cpl.csv), with `Designator`,
  `Mid X`, `Mid Y`, `Rotation`, and `Layer`, in millimetres.

Every populated reference must occur exactly once in both files. Review every
automatic part match rather than accepting substitutions by value alone.
Explicitly inspect the displayed position, side, and rotation of J1, Q1, and
D1-D3. J1 must be the exact approved connector on the front with its mouth
facing the display; Q1 and every diode are polarity-sensitive.

If the exact J1 is not in JLCPCB's public assembly library, use an approved
pre-order/global-sourcing/consigned-part workflow or arrange a separately
reviewed hand-placement operation. Do not substitute another 24-pin connector
based only on pitch and pin count.

## CAM and placement acceptance checklist

- One watertight 100 x 145 mm outline with four rounded outer corners.
- Exactly one centred 6 mm circular lanyard cutout.
- Exactly four non-plated 2.2 x 6 mm rounded cradle slots.
- No display-flex slot or other unintended internal cutout.
- Complete `B.Cu` ground fill below the display circuitry, with the intended
  pickup and ESP antenna keepouts preserved.
- Both 30-turn pickup spirals present as 0.30 mm covered traces with 0.20 mm
  spacing; no copper balancing, thieving, label, or closed conductive loop in
  the `x=8..92 mm`, `y=13..65 mm` pickup keepout.
- Continuous black mask over the pickup winding.
- Correct exposed ENIG Tag-Connect contacts and AISB accent artwork.
- J1's 24 front pads, reduced paste apertures, mounting pads, orientation, and
  pin-1 marking visible and aligned.
- J3 has no paste or placed component. J4 and C15 remain unpopulated.
- The AISB `B` contains both intended counters.
- No vendor-added barcode, serial number, or other artwork.

## Suggested order remark

Use a concise remark only after the files themselves are correct:

> Five engineering prototypes. Follow the supplied copper, solder-mask, paste,
> outline, and drill files exactly. Do not add copper thieving/balancing or a
> conductive loop inside x=8..92 mm, y=13..65 mm. Preserve black mask over both
> pickup spirals. J1 is the exact front-side FPC connector and its reduced paste
> apertures must be preserved. J3 is a bare no-paste probe target; J4 and C15
> are DNP. Confirm one 6 mm NPTH lanyard cutout, four 2.2 x 6 mm NPTH slots, and
> no display-flex cutout. Please request approval for any proposed CAM change.

Do not approve payment solely because JLCPCB's automated viewer accepts the
ZIP. Save screenshots of the final CAM and placement previews, the confirmed
part table, and any engineering questions with the release checksum.

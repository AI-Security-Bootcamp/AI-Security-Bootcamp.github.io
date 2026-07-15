# Waveshare driver fallback and optional ESP32 add-on

The badge supports two independent ways to write the same 3.52-inch raw panel.
The custom circuit is the primary path; the official Waveshare Driver HAT is
the recovery path.

Program **every raw panel with its final or placeholder name on a Driver HAT
before it is mounted**. E-paper retains that valid image with no power. The
custom circuit can then provide convenient later updates, while an unpowered
or failed badge circuit cannot take away the already-written name.

```text
primary:  laptop -> XIAO -> Tag-Connect J3 -> badge support circuit/J1 -> panel
fallback: host   -> Driver HAT -----------> raw 24-pin flex directly -> panel
optional: phone/laptop -> ESP32 board ----> raw flex directly (after unplugging J1)
```

Only one path may be electrically connected to the panel at a time.

## What to buy

Buy both universal-driver types for this two-week build, but give them different
jobs:

- buy **two Universal Driver HATs** plus two tested hosts as the production and
  recovery stations;
- buy **one ESP32 Driver Board V3** as the physical fit sample and experimental
  participant add-on; and
- optionally keep one complete 3.52-inch HAT as a known-working reference.

At Waveshare's 2026-07-15 single-unit prices, two Driver HATs plus one ESP32
board are about **US$34.97 before shipping/tax/hosts**. If only one purchase is
possible, get the Driver HAT first because Waveshare explicitly lists the
3.52-inch raw panel for that path and it works with a Raspberry Pi. A HAT is not
stand-alone; the ESP32 board is, once its USB-C firmware/display compatibility
has been proved.

## What the three driver products do

- The [Universal e-Paper Driver HAT](https://www.waveshare.com/e-paper-driver-hat.htm)
  is reusable bench tooling. Waveshare lists the 3.52-inch raw panel as a
  supported display. Buy two programming stations.
- The [Universal ESP32 Driver Board](https://www.waveshare.com/e-paper-esp32-driver-board.htm)
  is a `29.46 x 48.25 mm` wireless/USB-programmable controller that Waveshare
  sells with an adapter board and FFC. The raw panel's own product page
  recommends it, and the 2024-12-30 hardware revision uses USB-C. However, the
  ESP32 board's current supported-model table omits 3.52 inches, so it remains
  an experimental path until the exact panel and board complete a repeated
  refresh test.
- The complete [3.52-inch e-Paper HAT](https://www.waveshare.com/3.52inch-e-Paper-HAT.htm)
  includes a display and driver PCB. Keep one or two as known-working reference
  assemblies or emergency complete-display replacements. Its official board
  outline is 86.5 x 57 mm, but its 40-pin header and rear components make it
  substantially thicker than the raw-panel badge.

The Universal Driver HAT, Universal ESP32 board, and complete 3.52-inch HAT are
different products. The first is the useful fallback production tool for the
thin badge; the second is the optional participant experiment.

The Driver HAT and complete HAT need a tested host/controller, power supply,
cable/adapter, and 3.52-inch software. A bare HAT on the shelf is not a working
fallback. The ESP32 board contains its controller but still needs qualified
firmware, USB power, and a proven panel/cable connection.

## Important electrical limitation

`J3` is **not** a HAT-bypass port. It exposes low-voltage power, SPI, reset,
and BUSY for the badge's own raw-panel support circuit. Connecting the HAT's
SPI input to `J3` would still depend on the badge boost/charge-pump circuit and
would not recover a failed display supply.

For a truly independent fallback, the raw panel flex must be electrically
disconnected from badge connector `J1` and connected to the HAT's raw-panel
adapter. The panel may remain adhered to the front of the badge while its tail
is serviced beneath the removable left service spine. `J1` sits on the front
immediately left of the glass because the actual electrical FPC is only
`3.65 +/- 0.30 mm` long beyond the glass. The drawing's separate 10 mm feature
is an adhesive-tape pull-tab, not extra electrical cable.

## Fallback programming procedure

1. Remove the Tag-Connect probe and disconnect every power source from the
   badge and Driver HAT.
2. Wait at least 30 seconds for the badge rail capacitors to discharge.
3. Remove the left service spine, support the glass, open `J1` without pulling
   on the tail, and slide the FPC straight out without folding or creasing it.
4. Connect the flex to the correct 24-pin/0.5-mm HAT adapter, verifying pin 1,
   exposed-contact side, and latch orientation.
5. Connect the HAT to its controller and run Waveshare's official 3.52-inch
   example once before using the custom name-writing workflow.
6. Write the 360 x 240 one-bit landscape name image, issue deep
   sleep/power-off, and confirm the HAT supply is actually off. Do not run the
   example's final `Clear()` operation after the name write.
7. Disconnect the flex only while unpowered.
8. If `J1` orientation and pin mapping have been physically verified, reinsert
   the flex straight into the unpowered badge, close its latch, and refit the
   removable service spine without pinching the flex. Otherwise insulate the
   contacts and secure the tail with removable Kapton without creasing it.
9. Confirm the retained image and do not reconnect `J3` on a failed custom
   circuit until that circuit has been diagnosed.

Never place the panel flex in the badge and HAT connectors at the same time,
use a passive splitter, or hot-plug either connector.

## Mechanical serviceability

- The board reserves an empty rear bottom-left bay for the `29.46 x 48.25 mm`
  ESP32 board. Its stock underside male headers prevent flat mounting; use a
  measured all-plastic header-clear cradle/standoff, or have a qualified
  assembler remove the headers. The module has no mounting holes; the badge
  adds none. Keep a real USB-C plug's lower 12-14 mm approach clear. The bay
  alone does not connect any signals.
- Before relying on the ESP32 board's supplied adapter/FFC, verify that it can
  reach the short panel tail around the outside left edge without folding,
  trapping, or rubbing the flex. There is intentionally no flex slot.
- Do not permanently pot, glue, or trap the `J1` latch before final electrical
  acceptance.
- Use removable Kapton for the first build. The black left service spine must
  come off without disturbing the adhered glass and leave enough access to
  operate the latch with a plastic tool.
- Support the display glass on the carrier while moving the flex; do not use
  the glass as a handle.
- Keep the bezel, lens, and service spine nonmagnetic; do not use magnets or
  steel clips near the passive pickup.
- The complete HAT can fit inside the badge's 100-mm width, but it is not a
  drop-in mechanical replacement for the raw panel. Use it as a bench reference
  unless a physical sample and bracket have been fit-tested.

## Station redundancy

Prepare two Driver HAT stations and program a known test image on both before
badge assembly starts. Keep a known-good panel with each station so a damaged
flex or adapter can be distinguished from a software problem. Use the same
canonical PBM file with both the HAT script and custom XIAO script so the two
paths do not produce different rotations or images.

The pinned helper in `firmware/examples/write_with_waveshare_hat.py` uses
Waveshare's official Python driver without clearing the retained image. The
corresponding software revision and invocation are documented in
`firmware/README.md`.

# Waveshare driver fallback and optional ESP32 add-on

> **NOT PRODUCTION RELEASED:** The removable ESP32 path is optional and remains
> behind harness, passive-mount, electrical, USB, drop, and RF gates. The two
> proven Driver HAT stations remain the two-week schedule fallback.

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
optional: laptop -> USB-C/CH343/ESP32 -> passive harness/J4 -> support/J1 -> panel
```

The optional ESP32 module's own FPC connector stays empty. Only one controller
may be attached and powered at a time. There is no onboard protection,
source-selection, or multi-controller arbitration.

## What to buy

Buy both universal-driver types for this two-week build, but give them different
jobs:

- buy **two Universal Driver HATs** plus two tested hosts as the production and
  recovery stations;
- buy **at least three ESP32 Driver Board V3 samples** if the optional path is
  schedule-feasible, plus three short labelled 8-way female-female Dupont
  harnesses, optional 1 x 8 breakaway headers, and three nonconductive
  spacer/retainer samples; and
- optionally keep one complete 3.52-inch HAT as a known-working reference.

At the official product prices displayed on 2026-07-15, two Driver HATs at
US$9.99 and three ESP32 boards at the US$14.39 three-unit break total about
**US$63.15 before shipping, tax, and HAT hosts**. Allow roughly US$1-7 per
equipped badge for the commodity header/harness, labels, and low-volume printed
retainer, before labour. If only one path can be purchased and proved, choose
the HAT: Waveshare explicitly lists the 3.52-inch raw panel for that path. A
HAT still needs a tested host.

## What the three driver products do

- The [Universal e-Paper Driver HAT](https://www.waveshare.com/e-paper-driver-hat.htm)
  is reusable bench tooling. Waveshare lists the 3.52-inch raw panel as a
  supported display. Buy two programming stations.
- The [Universal ESP32 Driver Board](https://www.waveshare.com/e-paper-esp32-driver-board.htm)
  is a `29.46 x 48.25 mm` wireless/USB-programmable controller that Waveshare
  sells with an adapter board and FFC. Those flex parts are not used in the
  passive-harness badge topology: the module's onboard FPC connector stays empty. The
  raw panel's product page recommends this controller and the 2024-12-30
  revision uses USB-C, but its current supported-model table omits 3.52 inches.
  It remains experimental until the exact panel, carrier, and board pass the
  repeated refresh and protection tests.
- The complete [3.52-inch e-Paper HAT](https://www.waveshare.com/3.52inch-e-paper-hat.htm)
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
firmware, USB power, the passive eight-wire carrier harness, and CH343 serial access.
Set its USB-to-UART switch 2 to **ON** and install the CH343 VCP driver if the
host operating system does not enumerate it.

The released custom-programmer tooling is specifically the
[Seeed XIAO ESP32-S3](https://www.seeedstudio.com/XIAO-ESP32S3-p-5627.html)
running the repository's built target. A generic ESP32, RP2040, STM32, or other
controller is not a drop-in substitute; qualify its firmware, wiring, voltage,
power sequence, and a first article before using it on badges.

## Important electrical limitation

`J3` is **not** a HAT-bypass port. It exposes low-voltage power, SPI, reset,
and BUSY for the badge's own raw-panel support circuit. Connecting the HAT's
SPI input to `J3` would still depend on the badge boost/charge-pump circuit and
would not recover a failed display supply.

Badge `J4` is likewise not a raw-panel connector. It is an optional 1 x 8
2.54 mm passive interface ordered `3V3, GND, BUSY, RST, DC, CS, MOSI, SCLK`.
The removable V3 is powered only through USB-C, and its `VDD3V3` output powers
the badge through J4-1. The remaining conductors directly carry ground and the
six logic signals. There is no reverse-current block, source priority, buffer,
or hot-plug protection.

Use a short female-female Dupont ribbon, grouped at the badge and split into
labelled individual sockets at the module. Map badge J4-1..8 to Waveshare
`J3-1, J3-14, J3-9, J3-10, J3-11, J4-16, J3-12, J3-15` respectively, and
continuity-test every conductor. Published module `R35` is NC/DNP; badge J4
does not carry GPIO4 and firmware does not claim to switch USB power. The
module and badge remain powered after `OK SLEEP USB_POWERED` until USB-C is
unplugged.

For a truly independent fallback, the raw panel flex must be electrically
disconnected from badge connector `J1` and connected to the HAT's raw-panel
adapter. The panel may remain adhered to the front of the badge while its tail
is serviced beneath the removable left service spine. `J1` sits on the front
immediately left of the glass because the actual electrical FPC is only
`3.65 +/- 0.30 mm` long beyond the glass. The drawing's separate 10 mm feature
is an adhesive-tape pull-tab, not extra electrical cable.

## Fallback programming procedure

1. Unplug optional-module USB-C, disconnect its J4 harness, remove the
   Tag-Connect probe, then disconnect every power source from the badge and
   Driver HAT.
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

- The proposed rear mount uses reviewed carrier slots plus a removable,
  nonconductive PETG/nylon spacer or retainer. The stock module headers are
  electrical connection points only, not the mechanical mount.
- Measure at least three Rev 3 boards and fit-test their outline, component
  heights, USB-C overhang, passive retainer, and harness strain relief before
  offering the add-on.
- Keep a real USB-C plug's lower 12-14 mm approach clear. Perform USB side-load,
  insertion/removal, shake, and worn-badge drop tests. Add only a nonmagnetic
  all-plastic or removable polymer keeper below the antenna if required.
- Leave the module FPC connector empty. There is no reason for the supplied
  adapter/FFC in the passive-harness topology.
- Do not permanently pot, glue, or trap the `J1` latch before final electrical
  acceptance.
- Use removable Kapton for the first build. The black left service spine must
  come off without disturbing the adhered glass and leave enough access to
  operate the latch with a plastic tool.
- Support the display glass on the carrier while moving the flex; do not use
  the glass as a handle.
- Keep the bezel, lens, and service spine nonmagnetic; do not use magnets or
  steel clips near the passive pickup.
- Range-test WiFi/Bluetooth on the fully stacked, worn badge both idle and
  during display refresh. The display fan-out copper remains close to the
  module antenna, so reduced range is possible.
- The complete HAT can fit inside the badge's 100-mm width, but it is not a
  drop-in mechanical replacement for the raw panel. Use it as a bench reference
  unless a physical sample and bracket have been fit-tested.

## Station redundancy

Prepare two Driver HAT stations and program a known test image on both before
badge assembly starts. Keep a known-good panel with each station so a damaged
flex or adapter can be distinguished from a software problem. Use the same
canonical PBM file with both the HAT script and custom XIAO script so the two
paths do not produce different rotations or images.

The pinned
[`write_with_waveshare_hat.py`](../firmware/examples/write_with_waveshare_hat.py)
helper uses Waveshare's official Python driver without clearing the retained
image. The corresponding software revision and invocation are documented in
the [firmware README](../firmware/README.md).

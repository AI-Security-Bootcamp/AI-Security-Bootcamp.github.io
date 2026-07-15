# Pin allocation

## Reusable programmer target J3

`J3` is the bare PCB footprint for a Tag-Connect TC2050-IDC-NL cable. There is
no connector, microcontroller, USB port, or permanent power source on a badge.
The cable's 2 x 5 IDC end connects to the reusable programmer.

| J3 pin | Signal | Direction at badge | Notes |
|---:|---|---|---|
| 1 | 3V3 | power in | regulated 3.3 V only; never 5 V |
| 2 | GND | power return | digital/display ground |
| 3 | MOSI / DIN | input | SPI display data through 100 ohm series resistor |
| 4 | SCLK | input | SPI clock through 100 ohm series resistor |
| 5 | CS_N | input | active low; 100k pull-up on panel side |
| 6 | D/C | input | command/data select |
| 7 | RST_N | input | active low; 100k pull-down on panel side |
| 8 | BUSY_N | output | active low; 1k series protection |
| 9 | GND | power return | second ground contact |
| 10 | 3V3 | power in | second 3.3 V contact |

The interface is write-only SPI: there is no MISO signal. Use SPI mode 0 and
begin at 2 MHz; increase only after prototype signal-integrity testing. The
panel/controller limit is 4 MHz.

### Safe update sequence

1. Seat the spring-pin probe while programmer power is off.
2. Enable a regulated, current-limited 3.3 V supply and wait at least 1 ms.
3. Drive reset high for 200 ms, low for at least 2 ms, then high for 200 ms.
4. Initialize and refresh the display, waiting whenever `BUSY_N` is low.
5. Send deep sleep command `0x07`, followed by check byte `0xA5`.
6. Wait at least 2 seconds, disable 3.3 V, wait another 2 seconds, then lift
   the probe.

Do not hot-plug the raw panel or the programming probe while powered. The image
persists after power is removed.

### Optional Waveshare ESP32 board in rear bay

The `MOD1` outline at the rear bottom-left is mechanical only. It fits the
current `29.46 x 48.25 mm` Waveshare e-Paper ESP32 Driver Board V3 with its
USB-C connector facing down past the badge edge, but it has no pads, socket, or
automatic electrical connection. This deliberate separation avoids committing
the two-week PCB build to an unverified module revision or putting through-hole
socket joints beneath the front display glass.

The lowest-risk electrical use is the way Waveshare designed the ESP32 board:
completely disconnect the raw panel from badge `J1`, place the supplied
24-pin adapter beside the short panel tail, and connect that adapter to the
ESP32 board with its supplied FFC. Confirm the cable reaches around the left
outside edge without a crease before attaching the module. There is no flex
slot. Never connect the raw panel to `J1` and the ESP32 driver simultaneously.

Do **not** make a bare GPIO-to-`J3` participant harness. Waveshare specifies the
ESP32 driver board as a 5 V/USB-powered product, while badge `J3` accepts only a
regulated 3.3 V target rail. The module pin labelled `VCC 3V3` is documented as
part of its e-paper interface, not as a general-purpose USB-powered output for
the badge. Direct jumper wires would also have no keying, current limiting,
power sequencing, output isolation, or protection against back-power through
the SPI/control pins.

A future `J3` accessory needs a reviewed adapter schematic and PCB with the
exact V3 header positions, keyed badge connection, both badge ground contacts,
both badge 3V3 contacts, USB/5 V module power, a separately load-switched and
current-limited 3.3 V badge rail, and defined GPIO isolation/tri-state behavior
through power-up and power-down. It also needs module-specific firmware and a
20-cycle bench qualification. Until that exists, `J3` remains for the tested
external registration-station programmer only; the optional ESP32 module uses
the direct-FFC method above.

The ESP32 product page's current supported-model table omits the 3.52-inch
panel even though Waveshare's 3.52-inch raw-panel page recommends this driver.
Treat the module, mode switch, firmware, cable reach, antenna range, and a full
refresh as a bench qualification gate before letting participants install one.

### Independent Driver HAT recovery

`J3` is not a bypass for the badge display-power circuit. A Driver HAT wired
to `J3` would still use the badge's boost and charge-pump parts, so it would
not recover a failure in those parts.

For the independent path, completely power down both systems, wait for the
badge rail capacitors to discharge, remove the left service spine, remove
the raw panel flex from `J1`, and connect that flex directly to the Waveshare
Driver HAT's raw-panel adapter.
Never connect the panel to the badge and HAT simultaneously, share their power
rails, use a passive splitter, or hot-plug the flex. If the badge circuit is
suspect, keep the programmed flex out of `J1`, insulate its exposed contacts,
and secure it without creasing it. See [`hat-fallback.md`](hat-fallback.md).

## Raw panel ZIF J1

The display flex has 24 contacts at 0.5 mm pitch. Although the product is
described as SPI, only pins 9-14 are logic/control signals. The remaining pins
include locally generated display rails and must connect to the passive support
circuit on the badge; do not wire the raw flex directly to an MCU header.

This table follows the current Waveshare V1.1 24-pin pin table. Pin 1, flex
contact side, ZIF contact direction, and insertion direction must all be checked
against the exact purchased sample before fabrication release.

The current board candidate is Hirose
[`FH34SRJ-24S-0.5SH(50)`](https://www.hirose.com/en/product/p/CL0580-1255-6-50)
or the `(99)`
packaging variant: 24 positions, 0.5 mm pitch, dual top/bottom contact,
0.3 mm FPC support, and 1.0 mm mounted height. It is placed on the front
immediately left of the centred glass, rotated 270 degrees so its mouth faces
right. The connector mouth is near `x=5.50`, its body spans approximately
`x=1.70..5.50`, its signal-pad row is near `x=5.00`, and its retention row is
near `x=1.70`. With the glass beginning at `x=7.65`, the inserted tail tip is
at `x=4.00`, giving 1.50 mm nominal insertion past the mouth while the
`3.65 +/- 0.30 mm` electrical FPC remains straight.
The 10.00 mm feature shown separately on the panel drawing is only a removable
adhesive-tape pull-tab, not usable FPC length. The Waveshare drawing calls out
`LUS67-35024-3100`, but that 2 mm-high part is not presently available. The
Hirose remains a candidate until its land pattern, contact geometry, pin 1,
latch access, insertion depth, and complete dry fit have all been checked with
physical parts.

The custom KiCad footprint is numbered by the **Waveshare panel contacts** so
the table below remains literal: panel pin 1 is the top contact of the
landscape tail. With the FH34 opening facing right, this ordering is mirrored
relative to Hirose's connector-terminal sequence. Do not use the molded Hirose
polarity mark as the panel-pin reference; continuity-map all 24 positions on
the first unpowered sample.

| J1 pin | Panel name | Badge connection |
|---:|---|---|
| 1 | NC | no connection |
| 2 | GDR | Q1 gate; R4 10k to ground |
| 3 | RESE | Q1 source; R3 3 ohm to ground |
| 4 | NC | no connection; C15 legacy option is DNP |
| 5 | VDHR | C4 1uF to ground |
| 6 | TSCL | no connection |
| 7 | TSDA | no connection |
| 8 | BS | ground through R13 0 ohm for 4-wire SPI |
| 9 | BUSY_N | J3 pin 8 through R10 1k |
| 10 | RST_N | J3 pin 7 through R9 100 ohm; R12 100k to ground |
| 11 | D/C | J3 pin 6 through R8 100 ohm |
| 12 | CSB / CS_N | J3 pin 5 through R7 100 ohm; R11 100k to 3V3 |
| 13 | SCL / SCLK | J3 pin 4 through R6 100 ohm |
| 14 | SDA / MOSI | J3 pin 3 through R5 100 ohm |
| 15 | VDDIO | 3V3; joined with VDD and decoupled by C14 |
| 16 | VDD | 3V3; joined with VDDIO and decoupled by C14 |
| 17 | VSS | ground |
| 18 | VDDD | C5 1uF to ground |
| 19 | VPP | C6 1uF to ground |
| 20 | VSH | C7 1uF to ground |
| 21 | VGH | C8 1uF to ground; D3 cathode |
| 22 | VSL | C9 1uF to ground |
| 23 | VGL | C10 1uF to ground; D2 anode |
| 24 | VCOM | C11 1uF to ground |

The current FH34 candidate's metal anchor lands are mechanical and intentionally
unconnected. Do not tie them to ground unless the exact selected connector's
documentation explicitly permits it.

## Passive boost/charge-pump connections

These parts reproduce the raw panel's required supply support. They do not
contain firmware and do not make the 24-pin flex into a conventional 8-pin
module.

| Path | Connection |
|---|---|
| boost input | 3V3 -> L2 68uH -> SW |
| switch | Q1 BSS138: drain=SW, source=RESE, gate=GDR |
| fly node | C3 4.7uF/50V from SW to CFLY |
| D1 | anode=CFLY, cathode=GND |
| D2 | anode=VGL, cathode=CFLY |
| D3 | anode=SW, cathode=VGH |
| input reservoir | C2 4.7uF/50V from 3V3 to GND |

### Accessible first-article probe points

This revision has no dedicated high-voltage test-point array. Use the listed
component pads with a fine insulated probe, a current-limited supply, and the
board restrained in a nonconductive fixture. Do not bridge adjacent pads.

| Signal | Accessible pad |
|---|---|
| 3V3 | C2 pad 1 |
| GDR | R4 pad 2 or Q1 gate |
| RESE | R3 pad 2 or Q1 source |
| SW | L2 pad 1 or Q1 drain |
| VSH | C7 pad 1 |
| VGH | C8 pad 1 |
| VSL | C9 pad 1 |
| VGL | C10 pad 1 |
| VCOM | C11 pad 1 |
| BUSY_N | R10 pad 1 |
| DGND reference | pad 2 of the matching rail capacitor |

Record the rail waveforms on a known-working official HAT with the same panel
and image, then compare the first badge articles. Exact acceptance voltages
must follow the purchased panel revision; do not infer them only from the
older, internally inconsistent application drawing.

## Passive pickup J2

| J2 pin | Signal |
|---:|---|
| 1 | audio signal / microphone input |
| 2 | audio ground |

For a TS microphone or instrument cable, connect pin 1 to tip and pin 2 to
sleeve. For a CTIA TRRS plug, connect pin 1 to microphone (sleeve) and pin 2 to
headset ground (ring 2); the left/right headphone contacts remain unused. Do
not wire the pickup to the headphone outputs.

Use a short twisted pair or shielded pigtail. A microphone input or small USB
microphone adapter with adjustable gain is the most predictable option; a line
input may be too insensitive. Keep `R1=4.99k` for headset-microphone detection.
It may be DNP for a verified high-impedance line/instrument-input build, with
the trade-off that a phone/combo jack may no longer recognize a microphone.

The 30-turn-per-layer coil responds to magnetic flux normal to the badge face,
so rotate and tilt the upper half of the badge near the source. Do not update
the e-paper while recording. Detailed geometry and tests are in
`docs/pickup-design.md`.

# Pin allocation

> **NOT PRODUCTION RELEASED:** The optional Waveshare V3 harness and passive
> mount are prototype features. Leave badge `J4` DNP unless its exact pin map,
> strain relief, USB clearance, retention, and first-article refresh tests have
> passed with the purchased module and panel revisions.

## Reusable programmer target J3

Badge `J3` is the bare PCB footprint for a Tag-Connect TC2050-IDC-NL cable. It
is unrelated to the Waveshare module connector also named `J3`. The cable's
2 x 5 IDC end connects to the reusable programmer.

| J3 pin | Signal | Direction at badge | Notes |
|---:|---|---|---|
| 1 | 3V3 | power in | regulated, current-limited 3.3 V only; never 5 V |
| 2 | GND | power return | digital/display ground |
| 3 | MOSI / DIN | input | SPI display data through 100 ohm series resistor |
| 4 | SCLK | input | SPI clock through 100 ohm series resistor |
| 5 | CS_N | input | active low; 100k pull-up on panel side |
| 6 | D/C | input | command/data select |
| 7 | RST_N | input | active low; 100k pull-down on panel side |
| 8 | BUSY_N | output | active low; 1k series protection |
| 9 | GND | power return | second ground contact |
| 10 | 3V3 | power in | second contact for the same badge rail |

The interface is write-only SPI: there is no MISO signal. Use SPI mode 0 and
begin at 2 MHz; increase only after prototype signal-integrity testing. The
panel/controller limit is 4 MHz.

The released controller for this interface is the
[Seeed XIAO ESP32-S3](https://www.seeedstudio.com/XIAO-ESP32S3-p-5627.html)
running the repository's built firmware target. Any generic ESP32, RP2040,
STM32, Raspberry Pi, or other controller requires separate wiring, voltage,
power-sequence, firmware, and first-article qualification before badge use.

### Safe update sequence

1. Seat the spring-pin probe while programmer power is off.
2. Enable a regulated, current-limited 3.3 V supply and wait at least 1 ms.
3. Drive reset high for 200 ms, low for at least 2 ms, then high for 200 ms.
4. Initialize and refresh the display, waiting whenever `BUSY_N` is low.
5. Send deep sleep command `0x07`, followed by check byte `0xA5`.
6. Wait at least 2 seconds, disable 3.3 V, wait another 2 seconds, then lift
   the probe.

Do not hot-plug the raw panel or the programming probe while powered. There is
no source selection or reverse-current protection between `J3` and optional
`J4`: the Waveshare harness must be disconnected and its USB-C unplugged before
the Tag-Connect probe is seated. The image persists after power is removed.

### Optional Waveshare ESP32 board and passive J4 harness

Badge `J4` is a single 1 x 8 row of 2.54 mm plated through-holes. It may receive
a breakaway male header, or an eight-wire harness may be soldered directly to
the holes. Both are optional/DNP. A short female-female Dupont ribbon is a
practical prototype harness: keep the badge end as a 1 x 8 shell and split the
module end into individually labelled female sockets.

The names `J3` and `J4` in the **Waveshare header** column refer to connectors
printed on the Waveshare ESP32 Driver Board V3, not badge Tag-Connect `J3` or
badge harness `J4`. Follow this literal map and continuity-test it before power:

| Badge J4 pin | Badge signal | Waveshare header pin | ESP32 GPIO / role |
|---:|---|---|---|
| 1 | 3V3 | J3-1 `VDD3V3` | USB-derived 3.3 V output powers the badge |
| 2 | GND | J3-14 `GND` | common return |
| 3 | BUSY_N | J3-9 | GPIO25 |
| 4 | RST_N | J3-10 | GPIO26 |
| 5 | D/C | J3-11 | GPIO27 |
| 6 | CS_N | J4-16 | GPIO15 |
| 7 | MOSI / DIN | J3-12 | GPIO14 |
| 8 | SCLK | J3-15 | GPIO13 |

The module is mechanically removable. Passive carrier slots and a
nonconductive spacer/retainer support it with USB-C accessible and the antenna
clear; there are no electrical module sockets. Size the retainer from the
purchased board and provide harness strain relief without loading the headers.

#### Power and connection rules

This interface has no current limiter, power mux, logic buffer, or automatic
arbitration. The Waveshare board is powered **only through its own USB-C**. Its
`VDD3V3` output then powers the badge through `J4-1`; never inject power into
that module pin from Tag-Connect or another supply.

1. Unplug module USB-C and remove the badge `J3` Tag-Connect probe.
2. With everything unpowered, connect the labelled J4 harness.
3. Set the module's USB-to-UART switch 2 **ON**, then connect module USB-C.
4. Program and wait for the firmware's `OK SLEEP USB_POWERED` response.
5. Unplug USB-C before disconnecting the harness.

Never connect or power the Tag-Connect programmer and Waveshare controller at
the same time, and never hot-plug the harness or raw panel. The Waveshare
module's onboard 24-pin FPC connector remains **empty**: the only raw panel
stays connected to front-side badge `J1`. Do not install a second panel or use
the module's supplied adapter/FFC in this topology.

Published Rev 3 hardware marks GPIO4 link `R35` NC/DNP. Badge J4 does not carry
GPIO4, and the Waveshare firmware target deliberately treats power-enable as a
no-op. Deep sleep stops the panel update but neither USB-C power nor the badge
3V3 rail. The CH343 serial bridge may require Waveshare's VCP driver on Windows
or macOS.

Before participant use, measure at least three delivered Rev 3 modules, verify
the entire harness map and absence of shorts, and complete at least 20
program/refresh/sleep cycles plus BUSY-timeout recovery. Also test USB cable
clearance and side-load, harness strain, retainer insertion/removal, shake/drop,
and worn-badge WiFi/Bluetooth range. Until those gates pass, leave J4 DNP and
use Tag-Connect or the independent HAT path.

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
| 9 | BUSY_N | J3 pin 8 and optional J4 pin 3 through R10 1k |
| 10 | RST_N | J3 pin 7 and optional J4 pin 4 through R9 100 ohm; R12 100k to ground |
| 11 | D/C | J3 pin 6 and optional J4 pin 5 through R8 100 ohm |
| 12 | CSB / CS_N | J3 pin 5 and optional J4 pin 6 through R7 100 ohm; R11 100k to 3V3 |
| 13 | SCL / SCLK | J3 pin 4 and optional J4 pin 8 through R6 100 ohm |
| 14 | SDA / MOSI | J3 pin 3 and optional J4 pin 7 through R5 100 ohm |
| 15 | VDDIO | 3V3 from J3 pins 1/10 or optional J4 pin 1; joined with VDD and decoupled by C14 |
| 16 | VDD | 3V3 from J3 pins 1/10 or optional J4 pin 1; joined with VDDIO and decoupled by C14 |
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
[`pickup-design.md`](pickup-design.md).

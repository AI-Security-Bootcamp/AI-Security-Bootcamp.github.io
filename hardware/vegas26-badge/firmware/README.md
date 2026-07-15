# Shared and removable 3.52-inch e-paper programmer

This firmware turns one Seeed XIAO ESP32-S3 into the registration-station
programmer. The XIAO is **not installed on each badge**. Each badge contains the
raw Waveshare 3.52-inch black/white panel, the panel's required support circuit,
and a detachable 3.3 V SPI programming port.

The same source has build targets for the shared XIAO ESP32-S3 station and the
optional removable Waveshare e-Paper ESP32 Driver Board V3. The latter connects
through a passive eight-wire harness to badge `J4` and is powered only through
its own USB-C connector. Neither target has yet been tested on a physical
3.52-inch panel. Waveshare's current panel documentation contains revision and
pin-description inconsistencies, so validate an exact purchased panel before
ordering production badges.

> **NOT PRODUCTION RELEASED:** Leave the optional J4 header DNP until the exact
> Rev 3 module, harness map, passive mount, 3.52-inch refresh, USB/drop behavior,
> and worn-badge RF range have all passed physical testing.

## Programmer wiring

| Signal | XIAO pin | Function |
| --- | --- | --- |
| `EPD_CS_N` | D5 | chip select, active low |
| `EPD_DIN` | D6 | SPI MOSI |
| `EPD_SCLK` | D7 | SPI clock |
| `EPD_DC` | D8 | data/command select |
| `EPD_RST_N` | D9 | panel reset, active low |
| `EPD_BUSY_N` | D10 | panel busy, active low |
| `TARGET_POWER_EN` | D4 | active-high enable for the programmer adapter's 3.3 V load switch |
| `3V3` | 3V3 | switched/current-limited badge power |
| `GND` | GND | common ground |

The badge-side port is an input to its support circuit. Do not wire the raw
24-pin panel flex directly to these eight XIAO signals. Do not apply 5 V to the
badge's `3V3` input.

`BUSY_N` is treated as a push-pull output and the XIAO input has no pull-up. A
programmer-side pull-up could phantom-power an unplugged badge through its I/O
protection. If hardware bias is required, use a weak pull-up to the badge's
switched 3.3 V rail.

The recommended programmer adapter uses D4 to enable a current-limited 3.3 V
load switch. Firmware enables it immediately before programming and disables it
after either success or timeout. For a first wired prototype, the badge may be
powered directly from 3V3 and D4 left unconnected; deep sleep still makes probe
removal safe after a successful update.

## Optional Waveshare ESP32 module

The `waveshare_esp32_driver_v3` build uses the V3 board's fixed e-paper pins:

| Badge J4 pin | Function | ESP32 GPIO | Waveshare module header/pin |
| ---: | --- | ---: | --- |
| 1 | badge `3V3` from module | — | J3-1 `VDD3V3` |
| 2 | `GND` | — | J3-14 `GND` |
| 3 | `EPD_BUSY_N` | 25 | J3-9 |
| 4 | `EPD_RST_N` | 26 | J3-10 |
| 5 | `EPD_DC` | 27 | J3-11 |
| 6 | `EPD_CS_N` | 15 | J4-16 |
| 7 | `EPD_DIN` | 14 | J3-12 |
| 8 | `EPD_SCLK` | 13 | J3-15 |

Badge `J4` is a single optional/DNP 1 x 8 row of 2.54 mm holes in the fixed
order `3V3, GND, BUSY, RST, DC, CS, MOSI, SCLK`. Populate a male header or
solder wires directly. A short 8-way female-female Dupont ribbon can remain in
one shell at the badge end and split into individually labelled female sockets
at the module. The Waveshare `J3/J4` names in the table refer to the module's
two stock header rows, not badge Tag-Connect `J3` or badge harness `J4`.
Continuity-test the complete harness and adjacent-pin isolation before power.

The Waveshare board is powered **only through USB-C**. Its USB-derived
`VDD3V3` output supplies the badge through J4-1; never inject power into that
pin from Tag-Connect or another source. This passive interface has no current
limiter, reverse-current block, power mux, signal buffer, or controller
arbitration. Remove the Tag-Connect probe before attaching the harness, connect
or disconnect only while unpowered, and never attach or power two controllers.

Published Rev 3 hardware marks `R35` DNP. Badge J4 does not carry GPIO4, and the
Waveshare firmware build deliberately leaves GPIO4 untouched. It cannot switch
off USB or badge 3V3: after a successful update it reports
`OK SLEEP USB_POWERED`. The panel is asleep, but the module and badge rail stay
powered until USB-C is unplugged. The module's onboard 24-pin FPC connector
must remain empty; do not attach a second raw panel or use the supplied
adapter/FFC while it drives the panel in badge `J1`.

The ESP32 module communicates over the CH343 USB-to-UART interface, so it often
appears as `/dev/ttyUSB0` on Linux rather than the XIAO's `/dev/ttyACM0`. Its
USB-C connector must remain accessible beyond the badge edge. Keep the shared
Tag-Connect probe detached while using the removable ESP32.
Set the module's USB-to-UART switch 2 to **ON**. Windows or macOS may require
Waveshare's linked CH343 VCP driver before the serial port appears.

The driver uses four-wire SPI mode 0 at 2 MHz. It follows Waveshare's reference
initialization and GC/full-refresh waveform, waits for active-low `BUSY_N` to
return high, sends deep sleep after every successful update, waits two seconds
for deep sleep to settle, and then reports that USB power remains present. The
XIAO build separately disables its D4-controlled target supply and waits another
two seconds before reporting `POWER_OFF`.

## Build and flash

From this directory:

```sh
pio run
pio run -e xiao_esp32s3_programmer --target upload
pio run -e waveshare_esp32_driver_v3 --target upload
pio device monitor
```

The XIAO native-USB target identifies itself as `3.52in e-Paper Programmer`.
The Waveshare target enumerates as its generic CH343 USB-to-UART bridge; the
firmware identity is returned by the `INFO` command instead. No MIDI or
capacitive-touch USB interfaces are present.

## Serial protocol

The USB CDC command protocol is intentionally small:

| Command | Result |
| --- | --- |
| `PING` | replies `PONG` |
| `INFO` | reports geometry, byte count, SPI rate and BUSY polarity |
| `WHITE` | performs a full white refresh and sleeps |
| `FRAME 10800` | replies `SEND 10800`, receives exactly 10,800 binary bytes, then refreshes; XIAO replies `OK SLEEP POWER_OFF`, Waveshare replies `OK SLEEP USB_POWERED` |

Frames use the panel's native 240 × 360 row-major layout. The most-significant
bit is the leftmost pixel in each byte; `1` is white and `0` is black. The
programmer rejects all other frame lengths and times out an incomplete upload
after 15 seconds.

For the XIAO station, remove the programmer probe only after
`OK SLEEP POWER_OFF`; its BUSY timeout response is
`ERR BUSY_TIMEOUT POWER_OFF`. For the Waveshare target,
`OK SLEEP USB_POWERED` or `ERR BUSY_TIMEOUT USB_POWERED` explicitly means power
is still present: unplug USB-C before touching or removing the harness. A
missing badge, reversed BUSY polarity, or stalled refresh returns the relevant
timeout response rather than hanging. Do not send another command until the
wiring and panel revision have been checked.

For the independent Waveshare Driver HAT fallback, do not connect the HAT to
badge `J3`. Fully depower both systems, remove the raw panel flex from `J1`, and
connect that flex directly to the HAT adapter. See the
[HAT fallback procedure](../docs/hat-fallback.md).

## Driver HAT fallback script

Prepare and prove two identical HAT stations before badge assembly. The helper
uses Waveshare's official Raspberry Pi Python driver pinned to repository
commit `500fa7c6f57b786102cccb866682f8cc43e08996`. On each Raspberry Pi:

```sh
git clone https://github.com/waveshareteam/e-Paper.git
cd e-Paper
git checkout 500fa7c6f57b786102cccb866682f8cc43e08996
python3 -m pip install pillow spidev RPi.GPIO
export WAVESHARE_EPD_LIB="$PWD/RaspberryPi_JetsonNano/python/lib"
python3 /path/to/vegas26-badge/firmware/examples/write_with_waveshare_hat.py \
  /path/to/badge-name.pbm
```

The input is the same 360 x 240 landscape or 240 x 360 portrait one-bit image
accepted by the custom-programmer workflow. The helper writes, performs the GC
full refresh, enters deep sleep, and powers off. It intentionally does not call
Waveshare's demo `Clear()` at the end, because the name must remain displayed.
For 360 x 240 files, both helpers default to clockwise rotation; pass
`--rotation ccw` to both if the physical panel is mounted the other way around.
Confirm the HAT revision's switches/cables and run the official example on a
spare panel before relying on the helper.

## Send a PBM image

`examples/send_pbm.py` accepts a binary PBM (`P4`) image and sends it over USB.
It accepts either the native portrait geometry or the intended 360 × 240 badge
landscape geometry. Landscape images rotate clockwise by default.

Install its sole host dependency and run:

```sh
python3 -m pip install pyserial
python3 examples/send_pbm.py /dev/ttyACM0 badge-name.pbm
```

Use `--rotation ccw` if the first physical prototype is mounted with the flex
tail in the opposite direction. Use `--clear` to request the built-in white
frame without providing an image.

The panel driver is adapted from Waveshare's MIT-licensed
[`EPD_3in52`](https://github.com/waveshareteam/e-Paper/tree/master/Arduino/epd3in52)
reference source.

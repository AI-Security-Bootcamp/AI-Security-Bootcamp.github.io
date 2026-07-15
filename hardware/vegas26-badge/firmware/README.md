# Shared 3.52-inch e-paper programmer

This firmware turns one Seeed XIAO ESP32-S3 into the registration-station
programmer. The XIAO is **not installed on each badge**. Each badge contains the
raw Waveshare 3.52-inch black/white panel, the panel's required support circuit,
and a detachable 3.3 V SPI programming port.

The code has been compiled for the XIAO ESP32-S3 but has not yet been tested on
a physical 3.52-inch panel. Waveshare's current panel documentation contains
revision and pin-description inconsistencies, so validate an exact purchased
panel before ordering production badges.

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

The driver uses four-wire SPI mode 0 at 2 MHz. It follows Waveshare's reference
initialization and GC/full-refresh waveform, waits for active-low `BUSY_N` to
return high, sends deep sleep after every successful update, waits two seconds
for deep sleep to settle, disables target power, and waits another two seconds
before reporting that probe removal is safe.

## Build and flash

From this directory:

```sh
pio run
pio run --target upload
pio device monitor
```

The USB device identifies itself as `3.52in e-Paper Programmer`. No MIDI or
capacitive-touch USB interfaces are present.

## Serial protocol

The USB CDC command protocol is intentionally small:

| Command | Result |
| --- | --- |
| `PING` | replies `PONG` |
| `INFO` | reports geometry, byte count, SPI rate and BUSY polarity |
| `WHITE` | performs a full white refresh and sleeps |
| `FRAME 10800` | replies `SEND 10800`, receives exactly 10,800 binary bytes, refreshes, then replies `OK SLEEP POWER_OFF` |

Frames use the panel's native 240 × 360 row-major layout. The most-significant
bit is the leftmost pixel in each byte; `1` is white and `0` is black. The
programmer rejects all other frame lengths and times out an incomplete upload
after 15 seconds.

Only remove the programmer probe after `OK SLEEP POWER_OFF`. The programmer
requires `BUSY_N` to assert low and then return high; a missing badge, reversed
BUSY polarity, or stalled refresh produces `ERR BUSY_TIMEOUT POWER_OFF` rather
than hanging. Do not send another command until the wiring and panel revision
have been checked.

For the independent Waveshare Driver HAT fallback, do not connect the HAT to
badge `J3`. Fully depower both systems, remove the raw panel flex from `J1`, and
connect that flex directly to the HAT adapter. See `docs/hat-fallback.md`.

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

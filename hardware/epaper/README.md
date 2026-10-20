# Raspberry Pi badge-software recovery

Recovery kit for the **Waveshare 3.52-inch B red/black/white (360 × 240)**
and **2.13-inch V4 monochrome (250 × 122)** displays, with separate writers.
This is not the monochrome/custom-PCB firmware in `hardware/aisb/firmware/`.

## Restore after reimaging

Enable SSH, configure Wi-Fi, and ensure Raspberry Pi OS has booted. On the
local machine, from the repository root:

```bash
# Once per fresh OS install (prompts for the Pi's password):
ssh-copy-id -i ./codex_rpi_ed25519.pub pi@pihat.local

# Build a fresh archive, upload it, install dependencies, enable SPI, and test:
python3 hardware/epaper/recovery.py restore --host pi@pihat.local
```

The default SSH key is the existing, gitignored `codex_rpi_ed25519` when present;
use `--identity /path/to/key` to override it. Credentials are **not** included
in the bundle. If SSH reports a changed host key after a reimage, verify the
host really is your Pi before replacing that host's known_hosts entry.

The Pi installation is `~/aisb-epaper`. Existing installs are moved into a
uniquely named `~/aisb-epaper-backup.*/aisb-epaper`, and their `rendered/` images
are copied forward. The original SPI boot configuration is retained as
`/boot/firmware/config.txt.before-aisb-epaper` (or `/boot/config.txt...` on older
OS versions). No automatic reboot, refresh, or shutdown is performed.

The Pi needs passwordless sudo. Missing OS packages are installed from apt:
`python3-pil`, `python3-spidev`, `python3-gpiozero`, `python3-lgpio`,
`raspi-config`. Internet is needed **only if these packages need installing**;
the font, logo, Python scripts, and display driver are in the recovery bundle.
If runtime SPI enabling is unavailable, setup asks for a reboot and stops;
reboot, then rerun restore. Log in again if newly added GPIO/SPI groups are needed.

## Local copy

```bash
python3 hardware/epaper/recovery.py build
```

Produces `hardware/epaper/out/aisb-epaper-recovery.tar.gz` and its `.sha256`
file. It contains exact copies of the canonical AISB/M3 scripts from the repo,
the original square AISB logo, IBM Plex Mono Bold, pinned Waveshare code,
setup/render/flash/check helpers, and a file-by-file SHA256 manifest.
Generated archives are gitignored; commit the source kit plus the canonical
scripts/assets, or copy the archive somewhere separate from the Pi.
This is an application recovery kit, not an SD-card/Wi-Fi/OS backup.

The archive also works without the repository:

```bash
sha256sum -c aisb-epaper-recovery.tar.gz.sha256
tar -xzf aisb-epaper-recovery.tar.gz
cd aisb-epaper
sha256sum -c SHA256SUMS
bash setup-pi.sh  # On the Raspberry Pi only.
```

## Render, inspect, then flash

On the Pi, or in a locally extracted bundle with Python/Pillow installed:

```bash
cd ~/aisb-epaper
./render-badge.sh --first-name Pranav --last-name Gade --role speaker
# Inspect rendered/pranav-gade-speaker-preview.png before flashing.
./flash-badge.sh rendered/pranav-gade-speaker
```

`render-badge.sh --m3 ...` selects the M3 renderer. It explicitly selects IBM
Plex Mono Bold, the original square AISB icon, and the local `rendered/` folder;
use this wrapper rather than relying on the repo-relative defaults of the
underlying renderer. AISB roles: `participant`, `speaker`, `guest-speaker`,
`operations`, `guest`, `bestie`. M3 roles: `participant`, `speaker`,
`guest-speaker`. Names containing spaces/hyphens/accents should be quoted.
The renderer prints the exact filenames; accented-name stems may be simplified.

The flash wrapper validates both planes, prevents concurrent refreshes, uses
the established 180-degree rotation, then deep-sleeps the display and drives
PWR/RST/DC low. Optional `--robust` uses 500 kHz SPI and extra settling delays.
The writer retains BUSY timeouts/stable-ready checks and VCOM setting `0x87`.
It does not power off the Pi. To shut down, use `sudo poweroff` afterward.
Deep sleep is **not electrical isolation**: shut down and disconnect power
before changing the HAT, jumper wires, or display ribbon.

`python3 check-install.py --require-spi` checks dependencies, driver presence,
Python syntax, SPI device existence, and renders AISB/M3 test cases including
accents, hyphens, and the long guest-speaker footer. It does not import the
GPIO-initializing driver or send any display commands. A successful software
check cannot confirm the physical panel/wiring without an actual refresh.

## Small monochrome artwork

The bundle also includes `render-small-badge.py` for name-only **250 × 122**
black/white PNGs, using the same IBM Plex Mono Bold font:

```bash
python3 render-small-badge.py --name "Byron Alvarez"
```

Files go to `rendered/small/`. For the confirmed **2.13-inch V4 black/white**
panel, use its separate writer after inspecting the PNG:

```bash
./flash-small-badge.sh rendered/small/byron-alvarez-250x122.png
```

Use **Display Config A (3Ω), Interface Config 0** on the Waveshare Universal
Driver HAT ([manufacturer's settings](https://www.waveshare.com/wiki/E-Paper_Driver_HAT)).
Change switches/ribbons only with power disconnected. The V4 writer performs
one standard full refresh, waits for BUSY **high** to become low, and then
deep-sleeps the panel. The Pi stays on. Optional `--rotate-180` flips the image.
`python3 write_image_2in13_v4.py IMAGE.png --dry-run` validates without GPIO.
Do **not** use `flash-badge.sh` or `write_image_b.py` for this smaller panel,
and do not use the V4 writer for an unconfirmed V1/V2 or color variant.

## Nine-wire HAT connection

| HAT signal | BCM GPIO | Physical Pi pin |
| --- | --- | --- |
| VCC | 3.3 V | 1 |
| GND | Ground | 6 |
| DIN | 10 / MOSI | 19 |
| CLK | 11 / SCLK | 23 |
| CS | 8 / CE0 | 24 |
| DC | 25 | 22 |
| RST | 17 | 11 |
| BUSY | 24 | 18 |
| PWR | 18 | 12 |

The last reported switch positions were Display Config **B**, Interface **0**.
Confirm the switches/contact direction against the exact HAT and panel revision;
do not assume they apply to every replacement board. Never use 5 V logic.

## Vendored dependency provenance

The unmodified Waveshare modules `epd3in52b.py` and `epdconfig.py` come from
[waveshareteam/e-Paper](https://github.com/waveshareteam/e-Paper/tree/a794fbc39656b0f93938d1ffb3fdc77eaed9e9fc/E-paper_Separate_Program/3in52_e-Paper_B/RaspberryPi_JetsonNano/python/lib/waveshare_epd),
commit `a794fbc39656b0f93938d1ffb3fdc77eaed9e9fc`. Their license notices remain
in the source; the package initializer is local. Only the required Raspberry Pi
Python modules are bundled, not the entire multi-platform upstream repository.

The unmodified monochrome V4 module `epd2in13_V4.py` comes from the
[same pinned upstream commit](https://github.com/waveshareteam/e-Paper/blob/a794fbc39656b0f93938d1ffb3fdc77eaed9e9fc/RaspberryPi_JetsonNano/python/lib/waveshare_epd/epd2in13_V4.py).
It shares the existing Pi GPIO adapter; no panel-voltage or waveform changes
are made to the V4 driver.

IBM Plex Mono Bold and its OFL license come from
[google/fonts](https://github.com/google/fonts/tree/9710da1eacb3be272583c3224dcb70f9da6eadbb/ofl/ibmplexmono),
commit `9710da1eacb3be272583c3224dcb70f9da6eadbb`. Upstream files are vendored
locally so a future restore does not depend on a moving branch or font URL.

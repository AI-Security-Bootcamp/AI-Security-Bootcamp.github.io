#!/usr/bin/env python3
"""Full-refresh one 250x122 monochrome image on Waveshare 2.13-inch V4 only."""

from __future__ import annotations

import argparse
from pathlib import Path
import sys
import time

from PIL import Image


ROOT = Path(__file__).resolve().parent
DRIVER_LIB = ROOT / "driver/RaspberryPi_JetsonNano/python/lib"
if not DRIVER_LIB.is_dir():
    DRIVER_LIB = ROOT.parent.parent / "epaper/vendor"
SIZE = (250, 122)


def load_image(path: Path, rotate: bool = False) -> Image.Image:
    with Image.open(path) as source:
        if source.size != SIZE or source.mode != "1":
            raise ValueError(f"Expected 250x122 1-bit PNG, got {source.size}, mode {source.mode}")
        result = source.copy()
    return result.transpose(Image.Transpose.ROTATE_180) if rotate else result


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("image", type=Path)
    parser.add_argument("--rotate-180", action="store_true")
    parser.add_argument("--dry-run", action="store_true", help="Validate image only; never import GPIO or touch display")
    args = parser.parse_args()
    try:
        image = load_image(args.image, args.rotate_180)
    except (ValueError, OSError) as error:
        parser.error(str(error))
    if args.dry_run:
        print("VALID_250X122_MONOCHROME_NO_HARDWARE_ACCESSED", flush=True)
        return 0

    # Validate the file before importing Waveshare's GPIO-initializing package.
    sys.path.insert(0, str(DRIVER_LIB))
    from waveshare_epd import epd2in13_V4 as driver

    class EPDWithTimeout(driver.EPD):
        def ReadBusy(self):
            # V4 BUSY is HIGH while working (opposite to the 3.52-inch B panel).
            driver.epdconfig.delay_ms(100)
            deadline = time.monotonic() + 20
            ready_since = None
            while True:
                now = time.monotonic()
                if driver.epdconfig.digital_read(self.busy_pin) == 0:
                    if ready_since is None:
                        ready_since = now
                    elif now - ready_since >= 0.05:
                        return
                else:
                    ready_since = None
                if now >= deadline:
                    raise TimeoutError("2.13-inch V4 BUSY did not become ready within 20 seconds")
                driver.epdconfig.delay_ms(10)

    try:
        epd = EPDWithTimeout()
        buffer = epd.getbuffer(image)
        if len(buffer) != 4000:  # 250 rows of 122 pixels, padded to 16 bytes/row.
            raise ValueError(f"Unexpected V4 buffer length: {len(buffer)}")
        print("INITIALIZING_2IN13_V4", flush=True)
        if epd.init() != 0:
            raise RuntimeError("2.13-inch V4 initialization failed")
        print("FULL_REFRESH_MONOCHROME", flush=True)
        epd.display(buffer)
        print("ENTERING_DEEP_SLEEP", flush=True)
        epd.sleep()
    finally:
        driver.epdconfig.module_exit(cleanup=True)
    print("WROTE_2IN13_V4_DISPLAY_ASLEEP_PI_STILL_ON", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

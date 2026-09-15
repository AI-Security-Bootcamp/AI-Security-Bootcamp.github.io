#!/usr/bin/env python3
"""Write one retained 3.52-inch image with Waveshare's official HAT driver."""

from __future__ import annotations

import argparse
import os
from pathlib import Path
import sys


EXPECTED_SIZES = {(360, 240), (240, 360)}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Write a 360x240 or 240x360 one-bit image and leave it displayed."
    )
    parser.add_argument("image", type=Path, help="PBM/PNG image to write")
    parser.add_argument(
        "--waveshare-lib",
        type=Path,
        default=os.environ.get("WAVESHARE_EPD_LIB"),
        help="path containing the waveshare_epd package (or set WAVESHARE_EPD_LIB)",
    )
    parser.add_argument(
        "--rotation",
        choices=("auto", "none", "cw", "ccw"),
        default="auto",
        help="landscape-to-native rotation (default: auto/cw, matching send_pbm.py)",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    if args.waveshare_lib is None:
        raise SystemExit("set --waveshare-lib or WAVESHARE_EPD_LIB")

    library_path = Path(args.waveshare_lib).expanduser().resolve()
    if not (library_path / "waveshare_epd" / "epd3in52.py").is_file():
        raise SystemExit(f"epd3in52.py not found under {library_path}")
    sys.path.insert(0, str(library_path))

    # Import only after adding the pinned official library to sys.path.
    from waveshare_epd import epd3in52  # type: ignore[import-not-found]

    try:
        from PIL import Image
    except ImportError as error:
        raise SystemExit("Pillow is required: python3 -m pip install pillow") from error

    with Image.open(args.image) as source:
        if source.size not in EXPECTED_SIZES:
            raise SystemExit(
                f"expected 360x240 landscape or 240x360 portrait, got {source.size}"
            )
        image = source.convert("1")

    # Convert landscape explicitly to native portrait pixels. Waveshare's
    # getbuffer() otherwise applies a fixed counter-clockwise rotation, while
    # the custom programmer's canonical default is clockwise.
    if image.size == (360, 240):
        rotation = "cw" if args.rotation == "auto" else args.rotation
        if rotation == "cw":
            image = image.transpose(Image.Transpose.ROTATE_270)
        elif rotation == "ccw":
            image = image.transpose(Image.Transpose.ROTATE_90)
        else:
            raise SystemExit("360x240 images require --rotation cw or ccw")
    elif args.rotation not in ("auto", "none"):
        raise SystemExit("240x360 images only support --rotation none")

    epd = epd3in52.EPD()
    initialized = False
    slept = False
    try:
        if epd.init() != 0:
            raise RuntimeError("Waveshare driver initialization failed")
        initialized = True
        epd.display(epd.getbuffer(image))
        epd.lut_GC()
        epd.refresh()
        # sleep() sends 0x07/0xA5, waits two seconds, and powers the module off.
        epd.sleep()
        slept = True
    finally:
        if initialized and not slept:
            # Best-effort safe power-down after an exception. Do not Clear(): the
            # last valid e-paper image must remain available as the fallback.
            try:
                epd.sleep()
            except Exception:
                epd3in52.epdconfig.module_exit()

    print(f"WROTE SLEPT POWER_OFF {args.image}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

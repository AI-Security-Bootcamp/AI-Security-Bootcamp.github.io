#!/usr/bin/env python3
"""Write a retained image to the Waveshare 3.52-inch red/black/white panel."""

from __future__ import annotations

import argparse
from pathlib import Path
import sys
import time

from PIL import Image


ROOT = Path(__file__).resolve().parent
DRIVER_LIB = ROOT / "driver" / "RaspberryPi_JetsonNano" / "python" / "lib"
SIZE = (360, 240)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "image",
        type=Path,
        nargs="?",
        help="360x240 black-plane PNG/PBM (omit with --clear)",
    )
    parser.add_argument(
        "--red",
        type=Path,
        help="optional 360x240 red-plane PNG/PBM; white pixels mean no red",
    )
    parser.add_argument(
        "--rotate-180",
        action="store_true",
        help="rotate landscape artwork before the driver's landscape transform",
    )
    parser.add_argument(
        "--clear",
        action="store_true",
        help="perform a full white conditioning refresh instead of writing artwork",
    )
    parser.add_argument(
        "--robust",
        action="store_true",
        help="use slower SPI and extra power/data settling delays",
    )
    args = parser.parse_args()
    if args.clear and (args.image or args.red):
        parser.error("--clear cannot be combined with image-plane arguments")
    if not args.clear and args.image is None:
        parser.error("image is required unless --clear is used")
    return args


def load_plane(path: Path) -> Image.Image:
    with Image.open(path) as source:
        if source.size != SIZE:
            raise SystemExit(f"expected {SIZE[0]}x{SIZE[1]}, got {source.size}")
        return source.convert("1")


def main() -> int:
    args = parse_args()
    sys.path.insert(0, str(DRIVER_LIB))
    from waveshare_epd import epd3in52b  # type: ignore[import-not-found]

    if args.robust:
        original_module_init = epd3in52b.epdconfig.module_init

        def robust_module_init(*module_args, **module_kwargs):
            result = original_module_init(*module_args, **module_kwargs)
            if result == 0 and not module_kwargs.get("cleanup", False):
                epd3in52b.epdconfig.implementation.SPI.max_speed_hz = 500_000
                epd3in52b.epdconfig.delay_ms(500)
            return result

        epd3in52b.epdconfig.module_init = robust_module_init

    class EPDWithTimeout(epd3in52b.EPD):
        def ReadBusyH(self) -> None:
            # Some panels assert BUSY shortly after a command rather than
            # synchronously. Give the controller time to enter its busy state
            # so an initially-high pin is not mistaken for completed work.
            epd3in52b.epdconfig.delay_ms(1000)
            deadline = time.monotonic() + 45
            high_since = None
            while True:
                now = time.monotonic()
                if epd3in52b.epdconfig.digital_read(self.busy_pin) != 0:
                    if high_since is None:
                        high_since = now
                    elif now - high_since >= 0.25:
                        break
                else:
                    high_since = None

                if now >= deadline:
                    raise TimeoutError("e-paper BUSY stayed low for 45 seconds")
                epd3in52b.epdconfig.delay_ms(5)
            epd3in52b.epdconfig.delay_ms(200)

        def display(self, imageblack, imagered) -> None:
            if not args.robust:
                super().display(imageblack, imagered)
                return

            black_buffer = [(~value) & 0xFF for value in imageblack]
            red_buffer = [(~value) & 0xFF for value in imagered]
            self.send_command(0x10)
            self.send_data2(black_buffer)
            epd3in52b.epdconfig.delay_ms(250)
            self.send_command(0x13)
            self.send_data2(red_buffer)
            epd3in52b.epdconfig.delay_ms(250)
            self.TurnOnDisplay()

    if args.clear:
        black = Image.new("1", SIZE, 1)
        red = Image.new("1", SIZE, 1)
    else:
        black = load_plane(args.image)
        red = load_plane(args.red) if args.red else Image.new("1", SIZE, 1)
    if args.rotate_180:
        black = black.transpose(Image.Transpose.ROTATE_180)
        red = red.transpose(Image.Transpose.ROTATE_180)

    epd = EPDWithTimeout()
    try:
        if args.robust:
            print("ROBUST_MODE_500KHZ", flush=True)
        print("INITIALIZING_3IN52_B", flush=True)
        if epd.init() != 0:
            raise RuntimeError("e-paper initialization failed")
        # Current Waveshare releases set VCOM/data interval to 0x87 during
        # initialization. Repeat it here so older vendored drivers produce the
        # same panel-driving waveform.
        epd.send_command(0x50)
        epd.send_data(0x87)
        if args.clear:
            print("WRITING_FULL_WHITE_PLANES", flush=True)
        else:
            print("WRITING_BLACK_AND_RED_PLANES", flush=True)
        epd.display(epd.getbuffer(black), epd.getbuffer(red))
        print("ENTERING_DEEP_SLEEP", flush=True)
        epd.sleep()
    except BaseException:
        try:
            epd3in52b.epdconfig.module_exit(cleanup=True)
        except Exception:
            pass
        raise

    print("WROTE_SLEPT_POWER_OFF", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

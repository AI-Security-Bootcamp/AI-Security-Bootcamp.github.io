#!/usr/bin/env python3
"""Send a binary PBM image to the shared AISB e-paper programmer."""

from __future__ import annotations

import argparse
from pathlib import Path
import sys
import time

try:
    import serial
except ImportError as exc:
    raise SystemExit(
        "pyserial is required; install it with: python3 -m pip install pyserial"
    ) from exc


NATIVE_WIDTH = 240
NATIVE_HEIGHT = 360
LANDSCAPE_WIDTH = 360
LANDSCAPE_HEIGHT = 240
FRAME_BYTES = NATIVE_WIDTH * NATIVE_HEIGHT // 8


def _next_token(data: bytes, offset: int) -> tuple[bytes, int]:
    while offset < len(data):
        if data[offset] == ord("#"):
            newline = data.find(b"\n", offset)
            if newline < 0:
                raise ValueError("unterminated PBM comment")
            offset = newline + 1
        elif chr(data[offset]).isspace():
            offset += 1
        else:
            break

    start = offset
    while offset < len(data) and not chr(data[offset]).isspace():
        offset += 1
    if start == offset:
        raise ValueError("truncated PBM header")
    return data[start:offset], offset


def read_pbm(path: Path) -> tuple[int, int, bytes]:
    data = path.read_bytes()
    magic, offset = _next_token(data, 0)
    width_token, offset = _next_token(data, offset)
    height_token, offset = _next_token(data, offset)

    if magic != b"P4":
        raise ValueError("image must be a binary PBM (P4)")

    width = int(width_token)
    height = int(height_token)
    if offset >= len(data) or not chr(data[offset]).isspace():
        raise ValueError("PBM header is missing its binary-data separator")

    # Consume exactly one separator (or one CRLF pair). Binary raster data is
    # allowed to begin with a byte that also represents ASCII whitespace.
    if data[offset : offset + 2] == b"\r\n":
        offset += 2
    else:
        offset += 1

    row_bytes = (width + 7) // 8
    expected = row_bytes * height
    raster = data[offset : offset + expected]
    if len(raster) != expected:
        raise ValueError(
            f"truncated PBM raster: expected {expected} bytes, got {len(raster)}"
        )
    return width, height, raster


def pbm_pixel(raster: bytes, width: int, x: int, y: int) -> int:
    row_bytes = (width + 7) // 8
    source = raster[y * row_bytes + x // 8]
    return (source >> (7 - (x % 8))) & 1


def set_panel_black(frame: bytearray, x: int, y: int) -> None:
    offset = y * (NATIVE_WIDTH // 8) + x // 8
    frame[offset] &= ~(1 << (7 - (x % 8)))


def convert_frame(
    width: int, height: int, raster: bytes, rotation: str
) -> bytes:
    frame = bytearray(b"\xff" * FRAME_BYTES)

    if (width, height) == (NATIVE_WIDTH, NATIVE_HEIGHT):
        if rotation not in ("auto", "none"):
            raise ValueError("native 240x360 PBM only supports --rotation none")
        for index, value in enumerate(raster):
            # PBM uses 1=black; the panel uses 0=black.
            frame[index] = value ^ 0xFF
        return bytes(frame)

    if (width, height) != (LANDSCAPE_WIDTH, LANDSCAPE_HEIGHT):
        raise ValueError("PBM must be 360x240 landscape or 240x360 native")

    if rotation == "auto":
        rotation = "cw"
    if rotation not in ("cw", "ccw"):
        raise ValueError("360x240 PBM requires --rotation cw or ccw")

    for source_y in range(height):
        for source_x in range(width):
            if pbm_pixel(raster, width, source_x, source_y) == 0:
                continue
            if rotation == "cw":
                target_x = NATIVE_WIDTH - 1 - source_y
                target_y = source_x
            else:
                target_x = source_y
                target_y = NATIVE_HEIGHT - 1 - source_x
            set_panel_black(frame, target_x, target_y)

    return bytes(frame)


def wait_for_line(port: serial.Serial, prefixes: tuple[str, ...], timeout: float) -> str:
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        raw = port.readline()
        if not raw:
            continue
        line = raw.decode("utf-8", errors="replace").strip()
        if line:
            print(line)
        if line.startswith(prefixes):
            return line
    raise TimeoutError(f"timed out waiting for one of: {', '.join(prefixes)}")


def send_clear(port: serial.Serial) -> None:
    port.write(b"WHITE\n")
    port.flush()
    result = wait_for_line(port, ("OK ", "ERR "), 30)
    if result.startswith("ERR "):
        raise RuntimeError(result)


def send_frame(port: serial.Serial, frame: bytes) -> None:
    port.write(f"FRAME {len(frame)}\n".encode("ascii"))
    port.flush()
    ready = wait_for_line(port, ("SEND ", "ERR "), 5)
    if ready.startswith("ERR "):
        raise RuntimeError(ready)
    port.write(frame)
    port.flush()
    result = wait_for_line(port, ("OK ", "ERR "), 30)
    if result.startswith("ERR "):
        raise RuntimeError(result)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("port", help="USB serial port, for example /dev/ttyACM0")
    parser.add_argument("image", nargs="?", type=Path, help="binary PBM image")
    parser.add_argument(
        "--rotation",
        choices=("auto", "none", "cw", "ccw"),
        default="auto",
        help="landscape-to-native rotation (default: auto/cw)",
    )
    parser.add_argument(
        "--clear", action="store_true", help="write an all-white frame"
    )
    args = parser.parse_args()

    if args.clear == (args.image is not None):
        parser.error("provide exactly one image or --clear")

    frame = None
    if args.image is not None:
        width, height, raster = read_pbm(args.image)
        frame = convert_frame(width, height, raster, args.rotation)

    with serial.Serial(args.port, 115200, timeout=0.25, write_timeout=5) as port:
        # Opening native USB CDC can reset the XIAO. Allow enumeration and then
        # use INFO as a deterministic handshake even if the boot banner passed.
        time.sleep(1.5)
        port.reset_input_buffer()
        port.write(b"INFO\n")
        port.flush()
        wait_for_line(port, ("INFO ",), 5)

        if args.clear:
            send_clear(port)
        else:
            assert frame is not None
            send_frame(port, frame)
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (OSError, ValueError, RuntimeError, TimeoutError) as error:
        print(f"error: {error}", file=sys.stderr)
        raise SystemExit(1)

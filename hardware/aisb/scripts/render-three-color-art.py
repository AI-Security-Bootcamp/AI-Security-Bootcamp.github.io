#!/usr/bin/env python3
"""Render a source image as black/red/white e-paper planes."""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image


SIZE = (360, 240)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("--output-dir", type=Path, required=True)
    parser.add_argument("--stem", default="neutral-art")
    parser.add_argument(
        "--crop",
        type=int,
        nargs=4,
        metavar=("LEFT", "TOP", "RIGHT", "BOTTOM"),
        help="optional source crop before scaling",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    args.output_dir.mkdir(parents=True, exist_ok=True)

    with Image.open(args.source) as opened:
        source = opened.convert("RGB")
    if args.crop:
        source = source.crop(tuple(args.crop))

    max_size = (324, 216)
    source.thumbnail(max_size, Image.Resampling.LANCZOS)
    left = (SIZE[0] - source.width) // 2
    top = (SIZE[1] - source.height) // 2

    preview = Image.new("RGB", SIZE, "white")
    black = Image.new("1", SIZE, 1)
    red = Image.new("1", SIZE, 1)
    preview_pixels = preview.load()
    black_pixels = black.load()
    red_pixels = red.load()

    for y in range(source.height):
        for x in range(source.width):
            r, g, b = source.getpixel((x, y))
            target = (left + x, top + y)
            is_red = r >= 105 and r >= g * 1.35 and r >= b * 1.35
            is_black = not is_red and (r + g + b) / 3 < 165
            if is_red:
                red_pixels[target] = 0
                preview_pixels[target] = (196, 0, 0)
            elif is_black:
                black_pixels[target] = 0
                preview_pixels[target] = (0, 0, 0)

    outputs = {
        "preview": preview,
        "black": black,
        "red": red,
    }
    for suffix, image in outputs.items():
        path = args.output_dir / f"{args.stem}-{suffix}.png"
        image.save(path)
        print(f"WROTE {path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

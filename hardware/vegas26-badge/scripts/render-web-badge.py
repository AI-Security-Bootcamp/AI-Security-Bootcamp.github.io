#!/usr/bin/env python3
"""Render the 360x240 /debug/badge design into three-color e-paper planes."""

from __future__ import annotations

import argparse
from pathlib import Path
import re

from PIL import Image, ImageDraw, ImageFont


SIZE = (360, 240)
RED = (239, 68, 68)
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--first-name", default="Pranav")
    parser.add_argument("--last-name", default="Gade")
    parser.add_argument(
        "--role",
        choices=("participant", "speaker", "operations", "guest", "bestie"),
        default="speaker",
    )
    parser.add_argument("--font", type=Path, required=True)
    parser.add_argument("--logo", type=Path, required=True)
    parser.add_argument("--output-dir", type=Path, required=True)
    return parser.parse_args()


def tracked_width(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.FreeTypeFont, tracking: float) -> float:
    if not text:
        return 0
    return sum(draw.textlength(character, font=font) for character in text) + tracking * (len(text) - 1)


def draw_tracked_text(
    draw: ImageDraw.ImageDraw,
    position: tuple[float, float],
    text: str,
    font: ImageFont.FreeTypeFont,
    fill: tuple[int, int, int],
    tracking: float,
) -> None:
    x, visible_top = position
    cap_ink_bounds = font.getmask("H").getbbox()
    cap_ink_height = (
        cap_ink_bounds[3] - cap_ink_bounds[1] if cap_ink_bounds is not None else font.size
    )
    for character in text:
        bounds = draw.textbbox((0, 0), character, font=font)
        character_top = visible_top
        if character in "-–—":
            ink_bounds = font.getmask(character).getbbox()
            if ink_bounds is not None:
                ink_height = ink_bounds[3] - ink_bounds[1]
                character_top += (cap_ink_height - ink_height) / 2
        draw.text(
            (x - bounds[0], character_top - bounds[1]),
            character,
            font=font,
            fill=fill,
        )
        x += draw.textlength(character, font=font) + tracking


def draw_centered_tracked_text(
    draw: ImageDraw.ImageDraw,
    visible_top: float,
    text: str,
    font: ImageFont.FreeTypeFont,
    fill: tuple[int, int, int],
    tracking: float,
) -> None:
    x = (SIZE[0] - tracked_width(draw, text, font, tracking)) / 2
    draw_tracked_text(draw, (x, visible_top), text, font, fill, tracking)


def fitted_font(
    draw: ImageDraw.ImageDraw,
    font_path: Path,
    lines: tuple[str, ...],
    max_width: int,
) -> ImageFont.FreeTypeFont:
    for size in range(62, 24, -1):
        font = ImageFont.truetype(str(font_path), size)
        tracking = -0.025 * size
        if all(tracked_width(draw, line, font, tracking) <= max_width for line in lines):
            return font
    return ImageFont.truetype(str(font_path), 25)


def split_planes(preview: Image.Image) -> tuple[Image.Image, Image.Image]:
    black = Image.new("L", preview.size, 255)
    red = Image.new("L", preview.size, 255)
    preview_pixels = preview.load()
    black_pixels = black.load()
    red_pixels = red.load()

    for y in range(preview.height):
        for x in range(preview.width):
            r, g, b = preview_pixels[x, y]
            if r > 70 and r > g * 1.6 and r > b * 1.6:
                red_pixels[x, y] = 0
            elif (r * 299 + g * 587 + b * 114) // 1000 < 128:
                black_pixels[x, y] = 0

    return black.convert("1"), red.convert("1")


def slug(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.strip().lower()).strip("-") or "name"


def main() -> int:
    args = parse_args()
    args.output_dir.mkdir(parents=True, exist_ok=True)

    foreground = BLACK
    preview = Image.new("RGB", SIZE, WHITE)
    draw = ImageDraw.Draw(preview)

    # Five-pixel red perimeter, matching the browser's border-box rendering.
    for inset in range(5):
        draw.rectangle((inset, inset, SIZE[0] - 1 - inset, SIZE[1] - 1 - inset), outline=RED)

    first = args.first_name.strip().upper() or "FIRST"
    last = args.last_name.strip().upper() or "LAST"
    name_font = fitted_font(draw, args.font, (first, last), 314)
    name_tracking = -0.025 * name_font.size
    draw_centered_tracked_text(draw, 55, first, name_font, foreground, name_tracking)
    draw_centered_tracked_text(draw, 106, last, name_font, RED, name_tracking)

    with Image.open(args.logo) as source:
        logo = source.convert("RGB").resize((58, 58), Image.Resampling.LANCZOS)
    # Crop the icon asset's internal square whitespace so the visible mark,
    # rather than its 58px source canvas, has equal top and left offsets.
    logo = logo.crop((3, 21, 56, 39))
    preview.paste(logo, (23, 192))

    draw.rectangle((23, 181, 336, 183), fill=foreground)
    role_font = ImageFont.truetype(str(args.font), 22)
    draw_centered_tracked_text(
        draw,
        193,
        args.role.upper(),
        role_font,
        foreground,
        0.14 * role_font.size,
    )

    black, red = split_planes(preview)
    stem = f"{slug(args.first_name)}-{slug(args.last_name)}-{args.role}"
    preview_path = args.output_dir / f"{stem}-preview.png"
    black_path = args.output_dir / f"{stem}-black.png"
    red_path = args.output_dir / f"{stem}-red.png"
    preview.save(preview_path)
    black.save(black_path)
    red.save(red_path)
    print(f"WROTE {preview_path} {black_path} {red_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

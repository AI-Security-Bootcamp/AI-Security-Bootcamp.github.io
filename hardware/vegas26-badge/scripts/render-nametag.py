#!/usr/bin/env python3
"""Render a high-contrast 360x240 AISB badge nametag."""

from __future__ import annotations

import argparse
import re
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


WIDTH = 360
HEIGHT = 240
ROOT = Path(__file__).resolve().parent.parent
DISPLAY_FONT = ROOT / "assets" / "fonts" / "SpaceGrotesk-700.ttf"
MONO_BOLD_CANDIDATES = (
    Path("/usr/share/fonts/truetype/liberation/LiberationMono-Bold.ttf"),
    Path("/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf"),
)
MONO_REGULAR_CANDIDATES = (
    Path("/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf"),
    Path("/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"),
)


def first_existing(candidates: tuple[Path, ...]) -> Path:
    for candidate in candidates:
        if candidate.is_file():
            return candidate
    raise FileNotFoundError(f"none of these fonts exist: {candidates}")


def font_that_fits(
    draw: ImageDraw.ImageDraw,
    text: str,
    font_path: Path,
    max_width: int,
    start_size: int,
    minimum_size: int,
) -> ImageFont.FreeTypeFont:
    for size in range(start_size, minimum_size - 1, -1):
        font = ImageFont.truetype(str(font_path), size)
        box = draw.textbbox((0, 0), text, font=font)
        if box[2] - box[0] <= max_width:
            return font
    return ImageFont.truetype(str(font_path), minimum_size)


def split_name(name: str) -> tuple[str, ...]:
    words = name.upper().split()
    if len(words) <= 1:
        return tuple(words)
    if len(words) == 2:
        return words[0], words[1]

    best_index = min(
        range(1, len(words)),
        key=lambda index: abs(
            len(" ".join(words[:index])) - len(" ".join(words[index:]))
        ),
    )
    return " ".join(words[:best_index]), " ".join(words[best_index:])


def draw_top_aligned_text(
    draw: ImageDraw.ImageDraw,
    position: tuple[int, int],
    text: str,
    font: ImageFont.FreeTypeFont,
    fill: int,
) -> None:
    box = draw.textbbox((0, 0), text, font=font)
    draw.text(
        (position[0] - box[0], position[1] - box[1]),
        text,
        font=font,
        fill=fill,
    )


def render(name: str, badge_number: str) -> Image.Image:
    if not DISPLAY_FONT.is_file():
        raise FileNotFoundError(f"missing display font: {DISPLAY_FONT}")

    mono_bold_path = first_existing(MONO_BOLD_CANDIDATES)
    mono_regular_path = first_existing(MONO_REGULAR_CANDIDATES)

    canvas = Image.new("L", (WIDTH, HEIGHT), 255)
    draw = ImageDraw.Draw(canvas)

    # Instrument-style clipped-corner perimeter from the badge viewport.
    frame = [
        (18, 8),
        (342, 8),
        (352, 18),
        (352, 222),
        (342, 232),
        (18, 232),
        (8, 222),
        (8, 18),
        (18, 8),
    ]
    draw.line(frame, fill=0, width=2, joint="curve")

    # Participant classification tab with a clipped trailing corner.
    draw.polygon([(20, 18), (177, 18), (187, 28), (177, 43), (20, 43)], fill=0)
    header_font = ImageFont.truetype(str(mono_bold_path), 13)
    draw_top_aligned_text(
        draw,
        (29, 25),
        f"PARTICIPANT // {badge_number}",
        header_font,
        255,
    )

    # Registration bars echo the PCB render and badge programming marks.
    bar_x = 296
    for width, height in ((3, 25), (7, 18), (2, 25), (5, 14), (2, 25)):
        draw.rectangle((bar_x, 18, bar_x + width - 1, 18 + height), fill=0)
        bar_x += width + 5
    draw.line((20, 54, 340, 54), fill=0, width=1)
    draw.rectangle((334, 50, 340, 56), fill=0)

    # The PCB already carries the AISB wordmark, so the screen is dominated by
    # the person's name. Two lines keep longer names legible at distance.
    name_lines = split_name(name)
    if not name_lines:
        raise ValueError("name must contain at least one visible character")

    name_area_width = 292
    if len(name_lines) == 1:
        font = font_that_fits(draw, name_lines[0], DISPLAY_FONT, 310, 82, 42)
        box = draw.textbbox((0, 0), name_lines[0], font=font)
        height = box[3] - box[1]
        draw_top_aligned_text(
            draw, (22, 63 + (104 - height) // 2), name_lines[0], font, 0
        )
    else:
        fonts = [
            font_that_fits(draw, line, DISPLAY_FONT, name_area_width, 66, 38)
            for line in name_lines[:2]
        ]
        top_positions = (65, 119)
        for line, font, y in zip(name_lines[:2], fonts, top_positions):
            draw_top_aligned_text(draw, (22, y), line, font, 0)

    # Right-side signal motif keeps the large name block visually anchored.
    for y in (68, 80, 92):
        draw.rectangle((329, y, 335, y + 6), fill=0)
    draw.line((332, 107, 332, 164), fill=0, width=2)
    draw.line((327, 164, 337, 164), fill=0, width=2)

    micro_font = ImageFont.truetype(str(mono_regular_path), 11)
    micro_bold_font = ImageFont.truetype(str(mono_bold_path), 11)
    draw_top_aligned_text(draw, (22, 177), "AI SECURITY BOOTCAMP", micro_bold_font, 0)
    badge_label = f"BADGE {badge_number}"
    badge_box = draw.textbbox((0, 0), badge_label, font=micro_font)
    draw_top_aligned_text(
        draw,
        (338 - (badge_box[2] - badge_box[0]), 177),
        badge_label,
        micro_font,
        0,
    )

    # Persistent event footer, styled like the black PCB / white silkscreen.
    draw.polygon([(20, 197), (332, 197), (342, 207), (332, 221), (20, 221)], fill=0)
    footer = "LAS VEGAS // 2026"
    footer_font = ImageFont.truetype(str(mono_bold_path), 16)
    footer_box = draw.textbbox((0, 0), footer, font=footer_font)
    footer_width = footer_box[2] - footer_box[0]
    draw_top_aligned_text(
        draw,
        ((WIDTH - footer_width) // 2, 202),
        footer,
        footer_font,
        255,
    )

    # Use an explicit threshold so no gray/dither enters the one-bit panel.
    return canvas.point(lambda pixel: 255 if pixel >= 150 else 0, mode="1")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("name", nargs="?", default="Pranav Gade")
    parser.add_argument("--badge-number", default="001")
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=ROOT / "assets",
    )
    args = parser.parse_args()

    args.output_dir.mkdir(parents=True, exist_ok=True)
    slug = re.sub(r"[^a-z0-9]+", "-", args.name.lower()).strip("-")
    image = render(args.name, args.badge_number)
    rotated = image.transpose(Image.Transpose.ROTATE_180)

    image.save(args.output_dir / f"nametag-{slug}.png")
    image.save(args.output_dir / f"nametag-{slug}.pbm")
    rotated.save(args.output_dir / f"nametag-{slug}-rotated-180.png")
    rotated.save(args.output_dir / f"nametag-{slug}-rotated-180.pbm")


if __name__ == "__main__":
    main()

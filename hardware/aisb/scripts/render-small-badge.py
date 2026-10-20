#!/usr/bin/env python3
"""Render a name-only 250x122 monochrome badge; never accesses the display."""

from __future__ import annotations

import argparse
from pathlib import Path
import re
import unicodedata

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parent
SIZE = (250, 122)
PADDING = 10
LINE_GAP = 8
FONT_NAME = "IBMPlexMono-Bold.ttf"
BUNDLED = (ROOT / "fonts" / FONT_NAME).is_file()
DEFAULT_FONT = (
    ROOT / "fonts" / FONT_NAME
    if BUNDLED
    else ROOT.parent.parent / "epaper" / "fonts" / FONT_NAME
)
DEFAULT_OUTPUT = ROOT / "rendered/small" if BUNDLED else ROOT.parent / "out/small"


def ink_mask(text: str, font: ImageFont.FreeTypeFont) -> Image.Image:
    """Measure actual binary ink, keeping native baselines and accent placement."""
    left, top, right, bottom = font.getbbox(text)
    mask = Image.new("L", (max(1, right - left), max(1, bottom - top)), 0)
    ImageDraw.Draw(mask).text((-left, -top), text, font=font, fill=255)
    # No grey or dithering: this exact raster is used for fitting and output.
    binary = mask.point(lambda pixel: 255 if pixel >= 128 else 0, mode="1")
    bounds = binary.getbbox()
    if bounds is None:
        raise ValueError("The name contains no visible characters")
    return binary.crop(bounds)


def render_name(name: str, font_path: Path = DEFAULT_FONT):
    name = unicodedata.normalize("NFC", " ".join(name.split())).upper()
    if not name:
        raise ValueError("A non-empty name is required")
    words = name.split()
    candidates = [(name,)] + [
        (" ".join(words[:index]), " ".join(words[index:]))
        for index in range(1, len(words))
    ]
    available_width = SIZE[0] - 2 * PADDING
    available_height = SIZE[1] - 2 * PADDING

    for size in range(72, 7, -1):
        font = ImageFont.truetype(str(font_path), size)
        fitting = []
        # Cache repeated lines across candidate word breaks at this font size.
        masks = {line: ink_mask(line, font) for lines in candidates for line in lines}
        for lines in candidates:
            line_masks = tuple(masks[line] for line in lines)
            height = sum(mask.height for mask in line_masks) + LINE_GAP * (len(lines) - 1)
            widths = [mask.width for mask in line_masks]
            if max(widths) <= available_width and height <= available_height:
                fitting.append((max(widths) - min(widths), lines, line_masks, height))
        if not fitting:
            continue
        # For equally large type, prefer the most balanced word break.
        _, lines, line_masks, height = min(fitting, key=lambda item: item[0])
        image = Image.new("1", SIZE, 255)
        y = (SIZE[1] - height) // 2
        boxes = []
        for mask in line_masks:
            x = (SIZE[0] - mask.width) // 2
            image.paste(0, (x, y), mask)
            boxes.append((x, y, x + mask.width, y + mask.height))
            y += mask.height + LINE_GAP
        return image, {"lines": lines, "font_size": size, "ink_boxes": boxes}
    raise ValueError("Name cannot fit legibly in 250x122; supply a shorter display name")


def slug(name: str) -> str:
    ascii_name = unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", ascii_name.lower()).strip("-") or "name"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--name", required=True, help="Full display name; wraps at word boundaries")
    parser.add_argument("--font", type=Path, default=DEFAULT_FONT)
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT)
    args = parser.parse_args()
    try:
        image, layout = render_name(args.name, args.font)
    except (ValueError, OSError) as error:
        parser.error(str(error))
    args.output_dir.mkdir(parents=True, exist_ok=True)
    output = args.output_dir / f"{slug(args.name)}-250x122.png"
    image.save(output)
    print(f"WROTE {output} (250x122, 1-bit; {layout['font_size']}px IBM Plex Mono Bold)")
    print("LINES: " + " / ".join(layout["lines"]))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

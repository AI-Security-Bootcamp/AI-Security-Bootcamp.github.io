#!/usr/bin/env python3
"""Run with: python3 hardware/aisb/scripts/test-small-badge.py"""

import importlib.util
from pathlib import Path
import tempfile
import unittest

from PIL import Image, ImageChops


spec = importlib.util.spec_from_file_location(
    "small_badge", Path(__file__).with_name("render-small-badge.py")
)
badge = importlib.util.module_from_spec(spec)
spec.loader.exec_module(badge)


class SmallBadgeTests(unittest.TestCase):
    def test_names_fit_binary_canvas(self):
        for name in (
            "Byron Alvarez", "Ryan Nigro", "André Dias", "Peter Hladký",
            "Li-Lian Ang", "Marnick Jean-Pierre L. Vandecauter",
            "Jose Johny Pulickal", "Sai Praveen Reddy", "Cher",
        ):
            with self.subTest(name=name):
                image, layout = badge.render_name(name)
                self.assertEqual(image.size, (250, 122))
                self.assertEqual(image.mode, "1")
                self.assertEqual(image.getextrema(), (0, 255))
                self.assertEqual(" ".join(layout["lines"]), name.upper())
                self.assertLessEqual(len(layout["lines"]), 2)
                for left, top, right, bottom in layout["ink_boxes"]:
                    self.assertGreaterEqual(left, badge.PADDING)
                    self.assertGreaterEqual(top, badge.PADDING)
                    self.assertLessEqual(right, 250 - badge.PADDING)
                    self.assertLessEqual(bottom, 122 - badge.PADDING)
                    self.assertLessEqual(abs(left - (250 - right)), 1)
                boxes = layout["ink_boxes"]
                self.assertLessEqual(abs(boxes[0][1] - (122 - boxes[-1][3])), 1)
                if len(boxes) == 2:
                    self.assertEqual(boxes[1][1] - boxes[0][3], badge.LINE_GAP)
                # No border, label, logo, or other pixels outside the name boxes.
                remaining = image.copy()
                for box in boxes:
                    remaining.paste(255, box)
                self.assertIsNone(ImageChops.invert(remaining).getbbox())

    def test_byron_lines_and_png_mode(self):
        image, layout = badge.render_name("Byron Alvarez")
        self.assertEqual(layout["lines"], ("BYRON", "ALVAREZ"))
        with tempfile.TemporaryDirectory() as folder:
            output = Path(folder) / "badge.png"
            image.save(output)
            with Image.open(output) as reopened:
                self.assertEqual(reopened.mode, "1")
                self.assertEqual(reopened.size, (250, 122))
                self.assertEqual(reopened.tobytes(), image.tobytes())

    def test_empty_name_rejected(self):
        with self.assertRaises(ValueError):
            badge.render_name("   ")

    def test_accents_normalized(self):
        composed, _ = badge.render_name("André Dias")
        decomposed, _ = badge.render_name("Andre\u0301 Dias")
        self.assertEqual(composed.tobytes(), decomposed.tobytes())
        self.assertEqual(badge.slug("André Dias"), "andre-dias")


if __name__ == "__main__":
    unittest.main()

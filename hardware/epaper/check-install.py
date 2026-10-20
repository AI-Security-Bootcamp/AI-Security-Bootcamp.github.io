#!/usr/bin/env python3
"""Check software and renderers without importing GPIO-initializing drivers."""

import argparse
import importlib
from pathlib import Path
import stat
import subprocess
import tempfile

from PIL import Image, ImageChops, ImageFont


ROOT = Path(__file__).resolve().parent


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--require-spi', action='store_true')
    args = parser.parse_args()
    for module in ('PIL', 'spidev', 'gpiozero', 'lgpio'):
        importlib.import_module(module)
        print(f'OK dependency: {module}', flush=True)
    for source in ROOT.rglob('*.py'):
        compile(source.read_bytes(), str(source), 'exec')
    ImageFont.truetype(str(ROOT / 'fonts/IBMPlexMono-Bold.ttf'), 22)
    driver = ROOT / 'driver/RaspberryPi_JetsonNano/python/lib/waveshare_epd'
    for name in ('__init__.py', 'epd3in52b.py', 'epdconfig.py'):
        if not (driver / name).is_file():
            raise SystemExit(f'Missing driver file: {name}')

    if args.require_spi:
        spi = Path('/dev/spidev0.0')
        if not spi.exists() or not stat.S_ISCHR(spi.stat().st_mode):
            raise SystemExit('SPI enabled in configuration but /dev/spidev0.0 is missing. Reboot, then rerun this check.')
        print('OK SPI device: /dev/spidev0.0 (not opened)', flush=True)

    cases = [
        (False, 'Pranav', 'Gade', 'speaker'),
        (False, 'Peter', 'Hladký', 'participant'),
        (False, 'Li-Lian', 'Ang', 'bestie'),
        (False, 'Michael', 'Mulet', 'guest-speaker'),
        (True, 'Fernando', 'Smith', 'speaker'),
    ]
    for m3, first, last, role in cases:
        with tempfile.TemporaryDirectory(prefix='aisb-render-check-') as output:
            subprocess.run([
                'bash', str(ROOT / 'render-badge.sh'), *(['--m3'] if m3 else []),
                '--first-name', first, '--last-name', last, '--role', role,
                '--output-dir', output,
            ], check=True, stdout=subprocess.DEVNULL)
            black_path, = Path(output).glob('*-black.png')
            red_path, = Path(output).glob('*-red.png')
            preview_path, = Path(output).glob('*-preview.png')
            with Image.open(black_path) as black, Image.open(red_path) as red, Image.open(preview_path) as preview:
                for plane in (black, red):
                    if plane.size != (360, 240) or plane.mode != '1' or plane.getextrema() != (0, 255):
                        raise SystemExit(f'Invalid or empty image plane for {first} {last}')
                if preview.size != (360, 240) or preview.mode != 'RGB':
                    raise SystemExit(f'Invalid preview for {first} {last}')
                # Ink is represented by zero in both planes; it must not overlap.
                overlap = ImageChops.invert(ImageChops.logical_or(black, red))
                if overlap.getbbox() is not None:
                    raise SystemExit(f'Black/red ink overlaps for {first} {last}')
            print(f'OK render: {first} {last} / {role}', flush=True)
    print('PASS: software checks complete; no display commands sent.', flush=True)


if __name__ == '__main__':
    main()

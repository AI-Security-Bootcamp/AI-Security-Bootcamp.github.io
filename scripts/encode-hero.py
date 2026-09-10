#!/usr/bin/env python3
"""Compatibility entry point; the canonical encoder is videos/encode_web.py."""
from pathlib import Path
import runpy

if __name__ == '__main__':
    runpy.run_path(str(Path(__file__).resolve().parents[1]/'videos/encode_web.py'), run_name='__main__')

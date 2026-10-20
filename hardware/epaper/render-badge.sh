#!/usr/bin/env bash
# Run from the extracted recovery bundle / Pi install, not the source folder.
set -euo pipefail
badge_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
badge_renderer=render-web-badge.py
if [[ "${1:-}" == --m3 ]]; then
    badge_renderer=render-m3-badge.py
    shift
fi
exec python3 "$badge_root/$badge_renderer" \
    --font "$badge_root/fonts/IBMPlexMono-Bold.ttf" \
    --logo "$badge_root/aisb-icon-square-light.png" \
    --output-dir "$badge_root/rendered" "$@"

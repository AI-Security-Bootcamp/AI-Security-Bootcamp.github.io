#!/usr/bin/env bash
# Deliberately separate from rendering: inspect the preview before calling this.
set -euo pipefail
badge_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
if (($# < 1)) || [[ "$1" == --help ]]; then
    echo 'Usage: ./flash-badge.sh rendered/NAME-ROLE [--robust]'
    echo 'Uses the established 180-degree rotation. Does not shut down the Pi.'
    exit 0
fi
badge_stem="$1"
shift
python3 - "$badge_stem" <<'PY'
import sys
from PIL import Image
for plane in ('black', 'red'):
    path = f'{sys.argv[1]}-{plane}.png'
    with Image.open(path) as image:
        if image.size != (360, 240) or image.mode != '1':
            raise SystemExit(f'Invalid plane {path}: expected 360x240, mode 1')
        image.load()
print('Image planes validated.', flush=True)
PY
# Prevent two flash processes from using the panel simultaneously.
exec 9>"$badge_root/.display.lock"
flock -n 9 || { echo 'Another display refresh is already running.' >&2; exit 1; }
sudo -n true
function badge_power_low() {
    if command -v pinctrl >/dev/null; then
        for pin in 18 17 25; do
            sudo -n pinctrl set "$pin" op dl || true
        done
    fi
}
trap badge_power_low EXIT
sudo -n python3 "$badge_root/write_image_b.py" --rotate-180 \
    --red "${badge_stem}-red.png" "${badge_stem}-black.png" "$@"

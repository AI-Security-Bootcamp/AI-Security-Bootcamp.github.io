#!/usr/bin/env bash
# Only for the Waveshare 2.13-inch V4 monochrome panel, not the 3.52-inch B.
set -euo pipefail
badge_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
if (($# < 1)) || [[ "$1" == --help ]]; then
    echo 'Usage: ./flash-small-badge.sh rendered/small/NAME-250x122.png [--rotate-180]'
    echo 'Requires the 2.13-inch V4 monochrome panel; HAT Display Config A, Interface 0.'
    exit 0
fi
python3 "$badge_root/write_image_2in13_v4.py" --dry-run "$@"
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
sudo -n python3 "$badge_root/write_image_2in13_v4.py" "$@"

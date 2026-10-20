#!/usr/bin/env bash
# Idempotent setup only: never initializes or refreshes the display.
set -euo pipefail
badge_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
badge_user="${SUDO_USER:-$(id -un)}"
sudo -n true

badge_packages=(python3-pil python3-spidev python3-gpiozero python3-lgpio raspi-config)
badge_missing=()
for package in "${badge_packages[@]}"; do
    if ! dpkg-query -W -f='${Status}' "$package" 2>/dev/null | grep -qx 'install ok installed'; then
        badge_missing+=("$package")
    fi
done
if ((${#badge_missing[@]})); then
    sudo apt-get update
    sudo env DEBIAN_FRONTEND=noninteractive apt-get install -y "${badge_missing[@]}"
fi
sudo usermod -aG spi,gpio "$badge_user"

badge_config=/boot/firmware/config.txt
[[ -f "$badge_config" ]] || badge_config=/boot/config.txt
sudo cp -an "$badge_config" "${badge_config}.before-aisb-epaper"
sudo raspi-config nonint do_spi 0
mkdir -p "$badge_root/rendered"
python3 "$badge_root/check-install.py" --require-spi
echo 'Software ready. No display refresh or reboot was performed.'

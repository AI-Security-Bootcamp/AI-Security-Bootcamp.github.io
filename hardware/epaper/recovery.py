#!/usr/bin/env python3
"""Build a self-contained badge-software archive, or restore it over SSH."""

import argparse
import gzip
import hashlib
import io
from pathlib import Path
import shlex
import subprocess
import tarfile


ROOT = Path(__file__).resolve().parent
REPO = ROOT.parent.parent
ARCHIVE = ROOT / 'out/aisb-epaper-recovery.tar.gz'


def build():
    files = {}
    for name in ('README.md', 'setup-pi.sh', 'render-badge.sh', 'flash-badge.sh', 'flash-small-badge.sh', 'check-install.py'):
        files[name] = ROOT / name
    for name in ('render-web-badge.py', 'render-small-badge.py', 'render-three-color-art.py', 'write_image_b.py', 'write_image_2in13_v4.py'):
        files[name] = REPO / 'hardware/aisb/scripts' / name
    files['render-m3-badge.py'] = REPO / 'hardware/m3/scripts/render-m3-badge.py'
    files['aisb-icon-square-light.png'] = REPO / 'public/brand/aisb-icon-square-light.png'
    for path in sorted((ROOT / 'fonts').iterdir()):
        if path.is_file():
            files[f'fonts/{path.name}'] = path
    for path in sorted((ROOT / 'vendor/waveshare_epd').glob('*.py')):
        files[f'driver/RaspberryPi_JetsonNano/python/lib/waveshare_epd/{path.name}'] = path
    data = {name: path.read_bytes() for name, path in files.items()}
    # Keep the exact content snapshot plus a verifiable payload manifest.
    data['SOURCE-MAP.txt'] = ''.join(
        f'{name} <- {path.relative_to(REPO)}\n' for name, path in sorted(files.items())
    ).encode()
    data['SHA256SUMS'] = ''.join(
        f'{hashlib.sha256(content).hexdigest()}  {name}\n'
        for name, content in sorted(data.items())
    ).encode()
    stream = io.BytesIO()
    with tarfile.open(fileobj=stream, mode='w') as archive:
        for name, content in sorted(data.items()):
            info = tarfile.TarInfo(f'aisb-epaper/{name}')
            info.size = len(content)
            info.mode = 0o755 if name.endswith('.sh') else 0o644
            archive.addfile(info, io.BytesIO(content))
    ARCHIVE.parent.mkdir(parents=True, exist_ok=True)
    ARCHIVE.write_bytes(gzip.compress(stream.getvalue(), mtime=0))
    digest = hashlib.sha256(ARCHIVE.read_bytes()).hexdigest()
    ARCHIVE.with_name(ARCHIVE.name + '.sha256').write_text(f'{digest}  {ARCHIVE.name}\n')
    print(f'Built {ARCHIVE} ({ARCHIVE.stat().st_size:,} bytes)\nSHA256 {digest}', flush=True)
    return digest


def restore(host, identity, digest):
    options = ['-o', 'BatchMode=yes', '-o', 'ConnectTimeout=10', '-o', 'StrictHostKeyChecking=accept-new']
    if identity:
        options += ['-i', str(identity)]
    ssh = ['ssh', *options, host]
    staging = subprocess.check_output([
        *ssh, 'mktemp -d /tmp/aisb-restore.XXXXXXXX'
    ], text=True).strip()
    # Only use the literal mktemp result as a shell operand after validating it.
    if not staging.startswith('/tmp/aisb-restore.') or any(c not in '/.-_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' for c in staging):
        raise RuntimeError(f'Unexpected staging path: {staging!r}')
    subprocess.run(['scp', *options, str(ARCHIVE), f'{host}:{staging}/bundle.tar.gz'], check=True)
    command = r'''set -eu
cd "$1"
printf '%s  bundle.tar.gz\n' "$2" | sha256sum --check --status
tar -xzf bundle.tar.gz
cd aisb-epaper
sha256sum --check --status SHA256SUMS
bash setup-pi.sh
cd
badge_target="$PWD/aisb-epaper"
if [ -e "$badge_target" ] || [ -L "$badge_target" ]; then
    badge_backup="$(mktemp -d "$PWD/aisb-epaper-backup.XXXXXXXX")"
    # Preserve previous rendered images in both the backup and the new install.
    if [ -d "$badge_target/rendered" ]; then
        cp -a "$badge_target/rendered/." "$1/aisb-epaper/rendered/"
    fi
    mv "$badge_target" "$badge_backup/aisb-epaper"
    printf 'Previous installation saved at %s/aisb-epaper\n' "$badge_backup"
fi
mv "$1/aisb-epaper" "$badge_target"
printf 'RESTORED %s\nRecovery upload retained at %s\n' "$badge_target" "$1"
'''
    subprocess.run([
        *ssh, f'bash -s -- {shlex.quote(staging)} {shlex.quote(digest)}'
    ], input=command, text=True, check=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('action', choices=('build', 'restore'))
    parser.add_argument('--host', default='pi@pihat.local')
    default_key = REPO / 'codex_rpi_ed25519'
    parser.add_argument('--identity', type=Path, default=default_key if default_key.exists() else None)
    args = parser.parse_args()
    if args.host.startswith('-') or ':' in args.host or any(c.isspace() for c in args.host):
        parser.error('--host must be a hostname/IPv4 address, optionally prefixed with user@')
    digest = build()
    if args.action == 'restore':
        restore(args.host, args.identity, digest)


if __name__ == '__main__':
    main()

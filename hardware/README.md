# Hardware badges

There are two active badge projects:

| Folder | Current board | Purpose |
| --- | --- | --- |
| [aisb](aisb/README.md) | `aisb/aisb.kicad_pcb` | AISB badge, common hardware notes, programming tools, and font |
| [m3](m3/README.md) | `m3/m3.kicad_pcb` | M3 badge and M3 image renderer |

Open each folder's matching `.kicad_pro` in KiCad. Keep design filenames stable
and commit revisions to Git instead of making event, version, or backup folders.

## Sources and outputs

- `assets/` holds source artwork and fonts.
- `scripts/` holds rendering and programming tools.
- Each badge's ignored `out/flash/` holds black/red image planes and one retained
  preview per badge. Existing local flashing images were moved here.
- Each badge's ignored `out/gerbers/` holds its latest available fabrication
  exports. The retained ZIPs are unchanged order snapshots and retain their
  original internal filenames; re-export from the current board for a new order.
- `aisb/cad/viewport-cut-template.svg` remains available for cutting/printing.
- Paper badge PDFs, editable SVGs, and print images remain in the repository's
  [`print/`](../print/) directory. Website images remain under `public/`.

Generated outputs are local and can be recreated. Commit source changes;
generate new outputs into `out/` rather than `assets/` or the repository root.
Shared programming tools live under `aisb/` and can also be used for M3.

## Revision history

`c8e74b9` captures the original folder, including the previously untracked London
AISB and M3 designs and fabrication exports, before this reorganization.
The active AISB board comes from the latest saved `vegas26-badge.kicad_pcb`;
the active M3 board comes from `london26-m3.kicad_pcb`.

```bash
git log --follow -- hardware/aisb/aisb.kicad_pcb
git log --follow -- hardware/m3/m3.kicad_pcb
git show c8e74b9:hardware/vegas26-badge/london26-badge.kicad_pcb
```

The 446 KiCad local-history commits were imported into this repository under
the `hardware-kicad-history` tag. Original save tags are preserved as
`hardware-kicad/*`. Their paths retain the original project filenames:

```bash
git log hardware-kicad-history -- london26-m3.kicad_pcb
git show hardware-kicad-history:london26-m3.kicad_pcb
```

Redundant image previews, obsolete design renders, and unused reference photos
were removed from the working folders. A local recovery copy of the original
files is stored in `.git/hardware-cleanup-backup/before.tar.gz`.

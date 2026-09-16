# AISB conference print pack

A4 materials for the Vegas AI Security Forum, focused on the San Francisco
2026 AI Security Bootcamp. The layouts use the AISB website's official logo,
type hierarchy, red accent, neutral text, square buttons, and two-pixel rules.
Attendee-facing copy is taken directly from the current AISB homepage and
`/sf26` page; the booth-notes sheet adds clearly marked internal prompts.

## What to print

- `sf26-poster-a4.pdf` — one-page SF26 hero poster; print 1–2 copies for display.
- `sf26-program-a4.pdf` — SF26 program and audience overview; print 10–20 handouts.
- `aisb-overview-a4.pdf` — general AISB overview with the current SF26 call to action;
  print 5–10 copies.
- `sf26-mini-flyers-a4.pdf` — four mini-flyers per sheet; print 5–10 sheets and
  cut on the center marks for 20–40 takeaways.
- `sf26-table-sign-a4.pdf` — large QR sign for an A4 stand or clipboard; print one.
- `sf26-booth-notes-a4.pdf` — internal briefing sheet with the pitch, key facts,
  useful questions, and important caveats; print one per person staffing the table.
- `aisb-conference-pack-a4.pdf` — all six sheets in one PDF, in that order.

The generator writes SVG artwork and 300 dpi PNG previews beside the PDFs.
These generated files are ignored by Git; the generator and QR source are tracked.

## Printer settings

- Paper: A4, portrait
- Scale: 100% / actual size
- Color: black and white or monochrome. The source retains the official AISB red;
  the design remains legible when the printer converts it to grayscale.
- Sides: single-sided
- Turn off browser headers and footers
- Avoid “fit to printable area” if the printer supports borderless-safe A4;
  every important element is already inside a generous safe margin.

The layouts intentionally avoid photographs, background fields, and large solid
fills so they remain crisp and reasonably toner-efficient on an office printer.
The QR code and printed fallback URL both point to `https://aisb.dev/sf26`.

## Regenerate

From the repository root:

```sh
npm install --no-save --package-lock=false @resvg/resvg-js pdfkit
node print/conference-pack/generate.js
```

The generator also needs the DejaVu Sans and DejaVu Sans Mono regular and bold
fonts in `/usr/share/fonts/truetype/dejavu/` (the `fonts-dejavu-core` package on
Debian/Ubuntu).

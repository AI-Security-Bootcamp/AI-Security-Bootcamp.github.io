# AISB guest badges

Each PDF is an A4 landscape sheet containing two identical 4 × 6 inch badge
faces side by side. The spread is aligned to the paper’s top-left corner, so
the top and left paper edges are already finished edges. Make the marked right
and bottom cuts, then fold at the center mark so the badge reads correctly from
either side.

Print with:

- A4 paper
- Landscape orientation
- 100% / Actual size (do not use “Fit to page”)
- Grayscale or black-and-white printing

`aisb-guest-badges-a4.pdf` contains the guests listed in `generate.js` followed by
five blank-name backup sheets. The individual PDFs are useful when reprinting
only one badge. Generated PDFs, PNGs, and SVGs are local files ignored by Git.

Edit `generate.js` to change the layout or guest list, then regenerate the SVG,
PNG, and PDF files from the repository root:

```sh
npm install --no-save --package-lock=false @resvg/resvg-js pdfkit
node print/guest-badges/generate.js
```

The generator uses the tracked Space Grotesk font and the system DejaVu Sans Mono
regular and bold fonts in `/usr/share/fonts/truetype/dejavu/`.

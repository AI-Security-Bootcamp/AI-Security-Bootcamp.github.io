# AI Security Bootcamp

Website for the AI Security Bootcamp, built with [Next.js](https://nextjs.org).

**Live site:** https://ai-security-bootcamp.github.io/

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3333](http://localhost:3333) to view the site.

## Deployment

The site automatically deploys to GitHub Pages when changes are pushed to the `main` branch via GitHub Actions.

To build locally:

```bash
npm run build
```

Static files are output to the `out/` directory.

## City program shortcuts

`/london`, `/sf` (or `/san-francisco`), `/vegas`, and
`/singapore` show that city's latest program and update the URL to its dated
program page, preserving query parameters and anchors. The latest program is
the one with the greatest start date across all years, including past, current,
and upcoming cohorts, regardless of whether applications are open.

City routes are generated from `src/lib/cohorts.ts` during each build. Register
each program component in `src/app/_program-pages.ts`; new location slugs get
their own city shortcut automatically. Alternate city names are defined in
`src/lib/city-programs.ts`. Year-specific aliases such as `/london26` and `/sf26`
continue to point to their original cohorts.

## Homepage film

The homepage uses `src/components/HeroFilm.tsx` and the versioned, static media
package in `public/video/aisb-hero-v5/`. No streaming service or server runtime is
needed: these files are included in the normal GitHub Pages export.

- The workshop thumbnail stays still and is clickable. The opening preloads
  through the bounded adaptive buffer, but playback requires a click or Enter.
- Playback starts with sound and the browser's standard controls; no duplicate
  toolbar, silent looping preview or automatic restart on scroll/tab return.
- The film pauses when offscreen or in a hidden tab. Resume is always explicit.
- Native HLS where supported; otherwise dynamically loaded `hls.js`, with
  automatic 360p/540p/720p/1080p quality switching and aligned two-second segments.
- The JavaScript player starts at 360p and caps quality to the displayed size;
  Safari's native player manages its own quality selection. A 540p
  fast-start MP4 is the fallback for unsupported HLS or fatal streaming errors.
- The same opt-in behavior applies to reduced motion, Save-Data and 2G users.
- The thumbnail is keyboard accessible and transfers focus to the native player.
  Burned-in captions and the music attribution in the media package remain.
  No separate transcript/credits row is displayed beneath the hero.

The thumbnail uses the original workshop photograph: instructor, raised hand and
attendees, with “A week at AISB” and a centered red, square play overlay rendered as HTML/CSS.
There is no location label or duration badge. The photograph and encoded film are unchanged.
On phones, the original larger typography is restored, with side-by-side buttons
and reduced top padding. Text, video and carousel follow their natural content
height with 24 px around the video, without stretching to fill tall screens.
The theme toggle floats independently with a 44 px touch target; desktop keeps the
spacious two-column hero.
The player preserves the full 16:9 picture rather than cropping the speakers or
captions. All 29 caption boxes have equal 16 px vertical padding in the master.

To encode a replacement from a corrected master and its lossless audio mix:

```bash
python3 videos/encode_web.py path/to/master.mp4 \
  --audio-master path/to/delivery-master.wav \
  --timeline path/to/timeline.json \
  --output public/video/aisb-hero-v6
```

Requires FFmpeg/ffprobe and Python 3.11+. The encoder refuses to overwrite an
existing package and verifies full decoding, aligned keyframes, source hashes,
and the MP4 fast-start header. Update `mediaRoot` in `HeroFilm.tsx` to the new
version after encoding. The current package's `encoding.json` records sizes and
checks. Retain the transcript and music credit when moving the files; an external
media host would also need appropriate CORS and HLS/MP4 content types.

The TypeScript browser suite covers preloading, responsive/dark-mode thumbnails,
keyboard activation, sound-on playback, seeking, no looping, explicit resume,
reduced motion/data saving, declined playback, HLS failure fallback, and a real
throttled bandwidth downshift. Native Safari playback still needs a real-device
check. Local tests and builds do not publish the site.

## Testing

Use Node.js 20.19+ (or 22.12+ / 24+) and npm. Install the test browser once:

```bash
npm ci
npx playwright install --with-deps --only-shell chromium
```

```bash
npm test                 # Vitest unit and server-rendered component tests
npm run test:watch       # Watch unit tests while editing
npm run typecheck        # Check application code, tests, and test configs
npm run test:e2e         # Build, start a static preview, run Chromium, then stop it
npm run test:e2e:ui      # Playwright's interactive test runner
npm run test:hero        # Only the homepage layout and video browser tests
npm run test:all         # Typecheck, unit tests, and all browser tests
```

Tests live in `tests/unit/*.test.ts` and `tests/e2e/*.spec.ts`. Vitest handles
TypeScript and JSX directly. Playwright provides isolated browser contexts,
shared fixtures, named tests, failure screenshots/traces, and an HTML report.
Browser tests serve the production export to exercise the same directory routes
as GitHub Pages. They block external requests, including analytics and live forms.
The slower bandwidth-adaptation check is included in the normal browser suite.

To target specific tests or use an existing server:

```bash
npm test -- city-programs
npm run test:e2e -- city-aliases
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3333 npm run test:e2e
npx playwright show-report
```

Set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` only if using an existing Chromium binary.
Artifacts go to ignored `test-results/` and `playwright-report/` directories.
Pull requests run typechecking, lint, unit tests, and browser tests. Main-branch
builds pass the same checks before deployment.

## Video-generation source

The reusable renderers, edit plans, selections and review templates are in
[videos/](videos/README.md), with one flat folder per edit and shared helpers.
Run `python3 videos/run.py list` to see the available commands. Raw/private inputs
and generated assets stay in the ignored media workspace; they are not needed in
Git. The previous `scripts/encode-hero.py` command remains a compatibility wrapper.

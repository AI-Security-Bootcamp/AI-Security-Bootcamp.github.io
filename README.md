# AI Security Bootcamp

Website for the AI Security Bootcamp, built with [Next.js](https://nextjs.org).

**Live site:** https://ai-security-bootcamp.github.io/

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Deployment

The site automatically deploys to GitHub Pages when changes are pushed to the `main` branch via GitHub Actions.

To build locally:

```bash
npm run build
```

Static files are output to the `out/` directory.

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
python3 scripts/encode-hero.py path/to/master.mp4 \
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

Browser checks (run with the dev server or a static preview already running):

```bash
npx playwright install chromium
npm run test:hero
# Or: HERO_TEST_URL=http://127.0.0.1:3335/ npm run test:hero
```

Results and screenshots go to ignored `test-results/hero/`. Tests cover preloading
without autoplay, responsive/dark-mode thumbnails, keyboard activation,
sound-on playback, explicit pause/resume, seeking, no looping, reduced motion/data
saving, declined playback, HLS failure fallback and a real throttled bandwidth
downshift. Native Safari playback still warrants a real-device check.
Local integration/builds do not themselves publish the site or resolve any
outstanding participant-release permissions.

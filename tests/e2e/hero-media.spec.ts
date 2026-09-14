import { test, expect } from "./fixtures";
import { expectPlaying, expectPreloaded, mediaRequest, playButton, videoState } from "./helpers/hero";

test.use({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 });

test("the poster preloads the opening without autoplay", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", (request) => { if (mediaRequest(request.url())) requests.push(request.url()); });
  await page.goto("/");
  await expect(playButton(page)).toBeEnabled();
  await expectPreloaded(page);
  expect(await videoState(page)).toMatchObject({ paused: true, time: 0, autoplay: false, loop: false, controls: false, preload: "auto" });
  expect(requests.some((url) => url.endsWith(".m4s"))).toBe(true);
  await expect(page.getByTestId("hero-film-poster").locator("img")).toHaveJSProperty("naturalWidth", 1280);
  await expect(playButton(page)).toHaveText("A weekat AISB");
  await expect(page.getByTestId("hero-film-play-icon")).toBeVisible();
  await expect(playButton(page).locator("svg")).toHaveCount(1);
  await expect(page.getByText("Transcript & credits", { exact: true })).toHaveCount(0);
  await expect(page.getByText("London · In person", { exact: true })).toHaveCount(0);
});

test("a program film starts when its play button scrolls into view on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/2026/apr/singapore/");
  await expect(playButton(page)).toBeEnabled();
  const film = page.getByTestId("hero-film");
  await expect(film).not.toBeInViewport({ ratio: 0.15 });
  await expect(film).toHaveJSProperty("paused", true);

  await playButton(page).click();
  await expectPlaying(page);
  await expect(film).toHaveJSProperty("controls", true);
  await expect(film).toHaveJSProperty("playsInline", true);
});

test("keyboard playback uses native controls, pauses offscreen, seeks and ends without looping", async ({ page, request }) => {
  const requests: string[] = [];
  page.on("request", (request) => { if (mediaRequest(request.url())) requests.push(request.url()); });
  await page.goto("/");
  await expect(playButton(page)).toBeEnabled();
  await playButton(page).focus();
  await page.keyboard.press("Enter");
  await expectPlaying(page);
  const state = await videoState(page);
  expect(state).toMatchObject({ mode: "hls-js", muted: false, loop: false, controls: true, autoplay: false, error: undefined });
  expect(Math.abs(state.duration - 87.72)).toBeLessThan(0.15);
  expect(requests.find((url) => url.endsWith(".m4s"))).toContain("/360/");
  expect(requests.some((url) => url.endsWith("/fallback.mp4"))).toBe(false);
  await expect(page.getByTestId("hero-film-poster")).toHaveCount(0);
  await expect(page.getByRole("button", { name: /^(Play film|Pause film|Mute|Full screen|Watch from start with sound)$/ })).toHaveCount(0);
  const film = page.getByTestId("hero-film");
  await expect(film).toBeFocused();

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(film).toHaveJSProperty("paused", true);
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(film).toBeInViewport();
  // Observe a window after re-entry to catch unintended resume behavior.
  await page.waitForTimeout(500);
  await expect(film).toHaveJSProperty("paused", true);
  await film.evaluate((v: HTMLVideoElement) => v.play());
  await expectPlaying(page);
  await film.evaluate((v: HTMLVideoElement) => v.pause());
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(film).not.toBeInViewport();
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(film).toBeInViewport();
  await page.waitForTimeout(500);
  await expect(film).toHaveJSProperty("paused", true);
  await film.evaluate((v: HTMLVideoElement) => v.play());
  await expectPlaying(page);
  await film.evaluate((v: HTMLVideoElement) => { v.currentTime = 65; });
  await expect.poll(async () => (await videoState(page)).time).toBeGreaterThan(65.1);
  await film.evaluate((v: HTMLVideoElement) => { v.muted = true; });
  await expect(film).toHaveJSProperty("muted", true);
  await film.evaluate((v: HTMLVideoElement) => { v.currentTime = v.duration - 0.4; });
  await expect(film).toHaveJSProperty("ended", true);
  await expect(film).toHaveJSProperty("paused", true);
  expect(await (await request.get("/video/aisb-hero-v5/transcript.txt")).text()).toContain("Scott Buckley");
});

for (const preference of ["reduced-motion", "save-data", "slow-2g"] as const) {
  test(`${preference} allows preloading and explicit playback`, async ({ page }) => {
    if (preference === "reduced-motion") await page.emulateMedia({ reducedMotion: "reduce" });
    else await page.addInitScript((kind) => {
      Object.defineProperty(navigator, "connection", {
        configurable: true,
        value: { saveData: kind === "save-data", effectiveType: kind === "slow-2g" ? "2g" : "4g" },
      });
    }, preference);
    await page.goto("/");
    await expectPreloaded(page);
    await expect(page.getByTestId("hero-film")).toHaveJSProperty("paused", true);
    await playButton(page).click();
    await expectPlaying(page);
  });
}

test("declined playback leaves usable native controls", async ({ page }) => {
  await page.addInitScript(() => {
    const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      return document.documentElement.dataset.allowTestPlay === "true"
        ? play.call(this) : Promise.reject(new DOMException("Playback blocked", "NotAllowedError"));
    };
  });
  await page.goto("/");
  await playButton(page).click();
  const film = page.getByTestId("hero-film");
  await expect(film).toHaveJSProperty("controls", true);
  await expectPreloaded(page);
  await expect(film).toHaveJSProperty("paused", true);
  await film.evaluate((v: HTMLVideoElement) => {
    document.documentElement.dataset.allowTestPlay = "true";
    return v.play();
  });
  await expectPlaying(page);
});

for (const nativeHls of [false, true]) {
  test(`${nativeHls ? "native HLS" : "HLS.js"} failure falls back to the MP4`, async ({ page }) => {
    if (nativeHls) await page.addInitScript(() => {
      Object.defineProperty(navigator, "vendor", { configurable: true, value: "Apple Computer, Inc." });
      const canPlay = HTMLMediaElement.prototype.canPlayType;
      HTMLMediaElement.prototype.canPlayType = function (type) {
        return type === "application/vnd.apple.mpegurl" ? "maybe" : canPlay.call(this, type);
      };
    });
    await page.route("**/video/aisb-hero-v5/master.m3u8", (route) => route.fulfill({ status: 404, body: "Not found" }));
    await page.goto("/");
    await playButton(page).click();
    await expectPlaying(page);
    expect(await videoState(page)).toMatchObject({ mode: "mp4", height: 540, muted: false });
  });
}

test("total media failure provides an accessible fallback link", async ({ page }) => {
  await page.route("**/video/aisb-hero-v5/**", (route) => route.fulfill({ status: 404, body: "Not found" }));
  await page.goto("/");
  await playButton(page).click();
  await expect(page.getByRole("status").filter({ hasText: "The video couldn’t load" })).toBeVisible({ timeout: 30_000 });
  await expect(page.getByTestId("hero-film")).toHaveJSProperty("paused", true);
  await expect(page.getByRole("link", { name: "Open the MP4", exact: true })).toBeVisible();
});

test("adaptive playback lowers resolution when bandwidth drops", async ({ page }) => {
  test.setTimeout(90_000);
  const segments: { height: number; at: number }[] = [];
  page.on("request", (request) => {
    const match = request.url().match(/\/(360|540|720|1080)\/segment-/);
    if (match) segments.push({ height: Number(match[1]), at: Date.now() });
  });
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Network.enable");
  const setBandwidth = (throughput: number) => cdp.send("Network.emulateNetworkConditions", {
    offline: false, latency: 50, downloadThroughput: throughput, uploadThroughput: throughput,
  });
  await setBandwidth(1_250_000);
  await page.goto("/");
  await playButton(page).click();
  await expectPlaying(page);
  await expect.poll(async () => (await videoState(page)).height, { timeout: 30_000 }).toBeGreaterThanOrEqual(540);
  const drop = Date.now();
  await setBandwidth(100_000);
  await expect.poll(async () => (await videoState(page)).height, { timeout: 45_000 }).toBe(360);
  expect(segments.some((segment) => segment.height >= 540)).toBe(true);
  expect(segments.some((segment) => segment.height === 360 && segment.at > drop)).toBe(true);
  expect((await videoState(page)).error).toBeUndefined();
});

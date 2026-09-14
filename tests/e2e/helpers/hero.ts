import type { Page } from "@playwright/test";
import { expect } from "../fixtures";

export const mediaRequest = (url: string) => url.includes("/video/aisb-hero-v5/");
export const playButton = (page: Page) => page.getByRole("button", { name: "Watch A week at AISB with sound", exact: true });

export async function videoState(page: Page) {
  return page.getByTestId("hero-film").evaluate((element) => {
    const video = element as HTMLVideoElement;
    return {
      paused: video.paused, muted: video.muted, time: video.currentTime,
      duration: video.duration, width: video.videoWidth, height: video.videoHeight,
      preload: video.preload, buffered: video.buffered.length ? video.buffered.end(video.buffered.length - 1) : 0,
      controls: video.controls, loop: video.loop, autoplay: video.autoplay,
      mode: video.dataset.playback, error: video.error?.message,
    };
  });
}

export async function expectPlaying(page: Page) {
  await expect.poll(async () => {
    const video = await videoState(page);
    return !video.paused && video.time > 0.15;
  }, { timeout: 30_000 }).toBe(true);
}

export async function expectPreloaded(page: Page) {
  await expect.poll(async () => (await videoState(page)).buffered, { timeout: 30_000 }).toBeGreaterThan(0);
}

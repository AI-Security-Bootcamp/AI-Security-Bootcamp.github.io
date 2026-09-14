import { test, expect } from "./fixtures";
import { playButton } from "./helpers/hero";

test("the film stays paused with a centered square overlay at every width", async ({ page }, testInfo) => {
  await page.goto("/");
  await expect(playButton(page)).toBeEnabled();
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    const film = page.getByTestId("hero-film");
    await film.scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await page.getByTestId("hero-topics").isVisible()).toBe(width >= 768);
    const filmBox = (await film.boundingBox())!;
    expect(Math.abs(filmBox.width / filmBox.height - 16 / 9)).toBeLessThan(0.02);
    const poster = (await playButton(page).boundingBox())!;
    const icon = page.getByTestId("hero-film-play-icon");
    const iconBox = (await icon.boundingBox())!;
    expect(iconBox.width).toBe(iconBox.height);
    await expect(icon).toHaveCSS("border-radius", "0px");
    expect(Math.abs(iconBox.x + iconBox.width / 2 - poster.x - poster.width / 2)).toBeLessThan(1);
    expect(Math.abs(iconBox.y + iconBox.height / 2 - poster.y - poster.height / 2)).toBeLessThan(1);
    await expect(film).toHaveJSProperty("paused", true);
    await page.screenshot({ path: testInfo.outputPath(`${width}.png`), animations: "disabled" });
  }
});

test("mobile hero flows naturally without overlapping controls or stretched spacing", async ({ page }, testInfo) => {
  test.setTimeout(90_000);
  await page.goto("/");
  await expect(playButton(page)).toBeEnabled();
  const layouts = new Map<number, { filmTop: number; carouselTop: number }>();
  for (const [width, height] of [[320, 568], [360, 640], [375, 548], [375, 667], [390, 664], [390, 844], [430, 932]]) {
    await page.setViewportSize({ width, height });
    await page.evaluate(() => window.scrollTo(0, 0));
    const headingLocator = page.getByRole("heading", { level: 1 });
    const heading = (await headingLocator.boundingBox())!;
    const film = (await playButton(page).boundingBox())!;
    const carouselLocator = page.getByTestId("hero-affiliations");
    const carousel = (await carouselLocator.boundingBox())!;
    const hero = (await page.getByTestId("homepage-hero").boundingBox())!;
    const theme = page.getByRole("button", { name: "Switch to dark mode", exact: true });
    const themeBox = (await theme.boundingBox())!;
    expect(heading.y).toBeLessThanOrEqual(56);
    expect(heading.y + heading.height).toBeLessThan(film.y);
    expect(film.y + film.height).toBeLessThan(carousel.y);
    expect(Math.abs(carousel.y + carousel.height - hero.y - hero.height)).toBeLessThan(1);
    const actions = page.getByTestId("hero-actions");
    const actionsBox = (await actions.boundingBox())!;
    expect(film.y - actionsBox.y - actionsBox.height).toBeLessThanOrEqual(28);
    expect(carousel.y - film.y - film.height).toBeLessThanOrEqual(28);
    const buttons = await actions.locator("a,button").all();
    expect(buttons).toHaveLength(2);
    const [first, second] = await Promise.all(buttons.map(async (button) => (await button.boundingBox())!));
    expect(Math.abs(first.y - second.y)).toBeLessThan(1);
    expect(first.x + first.width).toBeLessThanOrEqual(second.x);
    for (const button of buttons) {
      expect(await button.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true);
      await expect(button).toHaveCSS("white-space", "nowrap");
    }
    await expect(carouselLocator).toHaveCSS("position", "static");
    await expect(page.getByTestId("homepage-hero").locator("p").first()).toHaveCSS("font-size", "18px");
    await expect(theme).toHaveCSS("position", "fixed");
    expect(themeBox.width).toBeGreaterThanOrEqual(44);
    expect(themeBox.height).toBeGreaterThanOrEqual(44);
    const textRight = await headingLocator.evaluate((el) => {
      const range = document.createRange();
      range.selectNodeContents(el);
      return range.getBoundingClientRect().right;
    });
    expect(textRight < themeBox.x || heading.y >= themeBox.y + themeBox.height).toBe(true);
    for (const control of await page.getByTestId("homepage-hero").locator("a,button").all()) {
      expect((await control.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByTestId("hero-film")).toHaveJSProperty("paused", true);
    const previous = layouts.get(width);
    if (previous) {
      expect(Math.abs(previous.filmTop - film.y)).toBeLessThan(1);
      expect(Math.abs(previous.carouselTop - carousel.y)).toBeLessThan(1);
    }
    layouts.set(width, { filmTop: film.y, carouselTop: carousel.y });
    await page.screenshot({ path: testInfo.outputPath(`${width}x${height}.png`), animations: "disabled" });
  }
  await page.getByRole("button", { name: "Switch to dark mode", exact: true }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.screenshot({ path: testInfo.outputPath("dark.png"), animations: "disabled" });
  await page.getByRole("button", { name: "Switch to light mode", exact: true }).click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
});

test.describe("dark mode", () => {
  test.use({ colorScheme: "dark", viewport: { width: 390, height: 900 } });
  test("system preference shows a paused poster", async ({ page }, testInfo) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/dark/);
    await expect(playButton(page)).toBeEnabled();
    await expect(page.getByTestId("hero-film")).toHaveJSProperty("paused", true);
    await page.screenshot({ path: testInfo.outputPath("dark-poster.png"), animations: "disabled" });
  });
});

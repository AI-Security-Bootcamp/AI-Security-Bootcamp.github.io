import { gunzipSync } from "node:zlib";
import type { Page } from "@playwright/test";
import { test, expect } from "./fixtures";

const homeFlag = "signup-home-decision-info-v1";
const sfFlag = "signup-sf-decision-info-v1";
const mobileFlag = "signup-sf-mobile-apply-v1";
const sfPath = "/2027/jan/san-francisco/";
type Event = { event: string; properties: Record<string, unknown> };

// Exercise the SDK's normal capture path; headless user agents are bot-filtered.
test.use({ userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36" });

async function mockPostHog(page: Page, flags: Record<string, string | boolean>, waitForFlags?: Promise<void>) {
  const events: Event[] = [];
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false });
    Object.defineProperty(navigator, "userAgentData", { get: () => undefined });
  });
  await page.clock.install({ time: new Date("2026-10-21T12:00:00Z") });
  await page.route("https://ph.aisb.dev/**", async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname.includes("/flags/")) {
      await waitForFlags;
      return route.fulfill({ json: { featureFlags: flags, featureFlagPayloads: {} } });
    }
    if (url.pathname === "/e/") {
      const buffer = route.request().postDataBuffer()!;
      let body = url.searchParams.get("compression") === "gzip-js" ? gunzipSync(buffer).toString() : buffer.toString();
      if (body.startsWith("data=")) body = Buffer.from(new URLSearchParams(body).get("data")!, "base64").toString();
      const data = JSON.parse(body) as Event | Event[];
      events.push(...(Array.isArray(data) ? data : [data]));
    }
    return route.fulfill({ json: {} });
  });
  return events;
}

const exposures = (events: Event[]) => events.filter((event) => event.event === "signup_experiment_exposed");

async function clickWithoutLeaving(page: Page, selector: string) {
  await page.locator(selector).evaluate((element) => element.addEventListener("click", (event) => event.preventDefault(), { once: true }));
  await page.locator(selector).click();
}

test("open cohorts lead the carousel and programme menu, with explicit statuses", async ({ page }) => {
  await mockPostHog(page, {});
  await page.goto("/");
  const cards = page.locator("#cohorts a");
  await expect(cards.first()).toHaveAttribute("href", "/2027/jan/san-francisco");
  await expect(cards.first()).toContainText("Applications open");
  await expect(cards.nth(1)).toHaveAttribute("href", "/2026/dec/london");
  await expect(cards.nth(1)).toContainText("Applications closed");
  await page.getByTestId("hero-actions").getByRole("button", { name: "View programmes", exact: true }).click();
  const menu = page.getByRole("dialog", { name: "Programmes" }).getByRole("link");
  await expect(menu.first()).toHaveAttribute("href", "/2027/jan/san-francisco");
  await expect(menu.first()).toContainText("Applications open");
  await expect(menu.nth(1)).toContainText("Applications closed");
});

for (const variant of ["control", "test"] as const) {
  test(`homepage ${variant} records one exposure and keeps cohort navigation distinct from form clicks`, async ({ page }) => {
    const events = await mockPostHog(page, { [homeFlag]: variant });
    await page.goto("/");
    await expect.poll(() => exposures(events).length).toBe(1);
    expect(exposures(events)[0].properties).toMatchObject({ experiment: homeFlag, variant, page: "home", [`$feature/${homeFlag}`]: variant });
    await expect(page.getByTestId("decision-summary")).toHaveCount(variant === "test" ? 1 : 0);
    if (variant === "test") await expect(page.getByTestId("homepage-hero").getByTestId("decision-summary")).toContainText("Need-based travel support");
    await clickWithoutLeaving(page, '[data-testid="hero-actions"] a');
    await expect.poll(() => events.filter((event) => event.event === "clicked_apply_now").length).toBe(1);
    await expect.poll(() => events.some((event) => event.event === "$autocapture" && event.properties.$event_type === "click" && JSON.stringify(event.properties.$elements).includes("/2027/jan/san-francisco"))).toBe(true);
    expect(events.find((event) => event.event === "clicked_apply_now")!.properties).toMatchObject({ destination: "latest-program", href: "/2027/jan/san-francisco" });
    expect(events.some((event) => event.event === "application_form_clicked")).toBe(false);
    expect(exposures(events)).toHaveLength(1);
  });

  test(`mobile SF information ${variant} and sticky Apply work together without obstructing the footer`, async ({ page, context }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const events = await mockPostHog(page, { [sfFlag]: variant, [mobileFlag]: "test" });
    await page.goto(sfPath);
    await expect.poll(() => exposures(events).length).toBe(2);
    await expect(page.getByTestId("decision-summary")).toHaveCount(variant === "test" ? 1 : 0);
    await expect(page.getByTestId("mobile-apply")).toBeVisible();
    const funding = page.getByTestId("mobile-funding-apply");
    await expect(page.locator("#who-should-attend").getByTestId("mobile-funding-apply")).toHaveCount(1);
    for (const width of [320, 390]) {
      await page.setViewportSize({ width, height: 844 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const button = (await page.getByTestId("mobile-apply").getByRole("link").boundingBox())!;
      expect(button.height).toBeGreaterThanOrEqual(44);
      expect(button.y + button.height).toBeLessThanOrEqual(844);
    }
    await page.screenshot({ path: testInfo.outputPath("mobile-hero.png"), animations: "disabled" });
    await clickWithoutLeaving(page, '[data-testid="mobile-apply"] a');
    await clickWithoutLeaving(page, '[data-testid="mobile-funding-apply"] a');
    await expect.poll(() => events.filter((event) => event.event === "application_form_clicked").length).toBe(2);
    await expect.poll(() => events.filter((event) => event.event === "$autocapture" && event.properties.$event_type === "click" && JSON.stringify(event.properties.$elements).includes("airtable.com")).length).toBe(2);
    expect(events.filter((event) => event.event === "application_form_clicked").map((event) => event.properties.location)).toEqual(["sf27_mobile_sticky", "sf27_after_funding"]);
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await expect.poll(async () => (await page.locator("footer").last().boundingBox())!.y + (await page.locator("footer").last().boundingBox())!.height).toBeLessThanOrEqual((await page.getByTestId("mobile-apply").boundingBox())!.y);
    await page.evaluate(() => document.documentElement.classList.add("dark"));
    await expect(page.getByTestId("mobile-apply")).toHaveCSS("background-color", "rgb(0, 0, 0)");
    await funding.screenshot({ path: testInfo.outputPath("funding-dark.png"), animations: "disabled" });
    await page.setViewportSize({ width: 1024, height: 900 });
    await expect(page.getByTestId("mobile-apply")).toBeHidden();
    await expect(funding).toBeHidden();
    expect(exposures(events)).toHaveLength(2);
    expect((await context.cookies()).filter((cookie) => cookie.name.startsWith("ph_"))).toEqual([]);
    expect(await page.evaluate(() => Object.keys(localStorage).filter((key) => key.startsWith("ph_")))).toEqual([]);
  });
}

test("mobile control preserves the existing two CTAs and counts an assigned control exposure", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const events = await mockPostHog(page, { [mobileFlag]: "control" });
  await page.goto(sfPath);
  await expect.poll(() => exposures(events).length).toBe(1);
  expect(exposures(events)[0].properties).toMatchObject({ experiment: mobileFlag, variant: "control" });
  await expect(page.getByRole("link", { name: "Apply Now", exact: true })).toHaveCount(2);
});

test("desktop SF is excluded from the mobile test", async ({ page }) => {
  const events = await mockPostHog(page, { [sfFlag]: "test", [mobileFlag]: "test" });
  await page.goto(sfPath);
  await expect.poll(() => exposures(events).length).toBe(1);
  expect(exposures(events)[0].properties.experiment).toBe(sfFlag);
  await expect(page.getByTestId("program-hero").getByTestId("decision-summary")).toBeVisible();
  await expect(page.getByTestId("mobile-apply")).toHaveCount(0);
  await expect(page.getByTestId("mobile-funding-apply")).toHaveCount(0);
});

test("disabled flags and delayed responses never create false control exposures", async ({ page }) => {
  let release!: () => void;
  const ready = new Promise<void>((resolve) => { release = resolve; });
  const events = await mockPostHog(page, { [homeFlag]: "test" }, ready);
  await page.goto("/");
  await expect(page.getByTestId("hero-actions")).toBeVisible();
  await expect(page.getByTestId("decision-summary")).toHaveCount(0);
  expect(exposures(events)).toHaveLength(0);
  release();
  await expect(page.getByTestId("decision-summary")).toBeVisible();
  await expect.poll(() => exposures(events).length).toBe(1);
  expect(exposures(events)[0].properties.variant).toBe("test");
  await page.goto(sfPath);
  await expect(page.getByRole("link", { name: "Apply Now", exact: true })).toHaveCount(2);
  expect(exposures(events)).toHaveLength(1);
});

test("campaign treatments and enrollment stop after the application deadline", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const events = await mockPostHog(page, { [sfFlag]: "test", [mobileFlag]: "test" });
  await page.clock.setSystemTime(new Date("2026-11-09T00:00:00Z"));
  await page.goto(sfPath);
  await expect(page.getByRole("link", { name: "Apply Now", exact: true })).toHaveCount(2);
  await expect(page.getByTestId("decision-summary")).toHaveCount(0);
  await clickWithoutLeaving(page, '[data-testid="program-hero"] a[href*="airtable"]');
  await expect.poll(() => events.some((event) => event.event === "application_form_clicked")).toBe(true);
  expect(exposures(events)).toHaveLength(0);
});

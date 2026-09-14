import { test, expect } from "./fixtures";

const programs = [
  { id: "sf-2026", href: "/2026/oct/san-francisco/", city: "San Francisco", interest: "san-francisco", aliases: ["/sf26/", "/2026/oct/"] },
  { id: "vegas-2026", href: "/2026/aug/vegas/", city: "Las Vegas", interest: "vegas", aliases: ["/vegas26/"] },
  { id: "london-2026", href: "/2026/aug/london/", city: "London", interest: "london", aliases: ["/sept26/", "/london26/"] },
  { id: "singapore-2026", href: "/2026/apr/singapore/", city: "Singapore", interest: "singapore", aliases: ["/2026/apr/"] },
  { id: "london-2025", href: "/2025/", city: "London", interest: "london", aliases: [] },
];

for (const colorScheme of ["light", "dark"] as const) {
  test.describe(colorScheme, () => {
    test.use({ colorScheme });
    for (const program of programs) {
      test(`${program.id} offers the latest program and city updates at all viewport sizes`, async ({ page }, testInfo) => {
        await page.goto(program.href);
        await page.evaluate((dark) => document.documentElement.classList.toggle("dark", dark), colorScheme === "dark");
        const blocks = page.getByTestId("closed-applications");
        await expect(blocks).toHaveCount(2);
        await expect(page.getByRole("link", { name: "Apply Now", exact: true })).toHaveCount(0);
        await expect(page.locator('a[href*="airtable.com"]')).toHaveCount(0);
        await expect(page.locator("body")).not.toContainText(/Application Deadline|Applications close in|please apply early|upcoming (Vegas|London) bootcamp/i);
        for (const block of await blocks.all()) {
          await expect(block).toHaveAttribute("data-cohort", program.id);
          await expect(block.locator("p")).toHaveText(/Applications for this cohort are closed\.\s+Now accepting applications for AISB London\./, { useInnerText: true });
          const explore = block.getByRole("link", { name: "Explore AISB London", exact: true });
          await expect(explore).toHaveAttribute("href", "/2026/dec/london");
          await expect(explore).toHaveCSS("background-color", "rgb(239, 68, 68)");
          await expect(explore).toHaveCSS("color", "rgb(255, 255, 255)");
          await expect(explore).toHaveCSS("border-radius", "0px");
          await expect(block.getByRole("link", { name: "Get notified of future cohorts", exact: true })).toHaveAttribute("href", `/eoi?interest=${program.interest}`);
        }
        if (program.id === "sf-2026") {
          await expect(page.getByText("Applications Closed", { exact: true })).toHaveCount(1);
          await expect(page.getByText("Oct 4-10, 2026", { exact: true })).toHaveCount(1);
        }
        if (program.id === "london-2025") {
          await expect(blocks.first().locator("p")).toHaveCSS("color", "rgb(82, 82, 82)");
        }
        for (const width of [320, 390, 768, 1440]) {
          await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
          for (const link of await blocks.locator("a").all()) {
            const box = await link.boundingBox();
            expect(box).not.toBeNull();
            expect(box!.x).toBeGreaterThanOrEqual(0);
            expect(box!.x + box!.width).toBeLessThanOrEqual(width);
            expect(box!.height).toBeGreaterThanOrEqual(44);
            expect(await link.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true);
          }
          await blocks.first().screenshot({ path: testInfo.outputPath(`${width}.png`), animations: "disabled" });
        }
      });
    }
  });
}

for (const program of programs) {
  test(`${program.id} preserves the chosen city in the interest form`, async ({ page }) => {
    await page.goto(program.href);
    await page.getByRole("link", { name: "Get notified of future cohorts", exact: true }).first().click();
    await expect(page.getByRole("heading", { name: `Future ${program.city} cohorts`, exact: true })).toBeVisible();
    const frame = page.locator('iframe[title="Expression of Interest Form"]');
    await expect(frame).toBeAttached();
    const form = new URL((await frame.getAttribute("src"))!);
    expect(form.searchParams.get("entry.1785871862")).toBe(`I'm interested in future AISB ${program.city} cohorts.`);
    expect(form.searchParams.get("entry.1899923949")).toBeNull();
    await expect(page.locator("section").first()).toContainText(/not an application or confirmation/);
  });

  for (const alias of program.aliases) {
    test(`${alias} keeps its original cohort without a second document request`, async ({ page }) => {
      let documents = 0;
      page.on("request", (request) => {
        if (request.isNavigationRequest() && request.frame() === page.mainFrame()) documents++;
      });
      await page.goto(`${alias}?source=check#overview`);
      await expect(page).toHaveURL((url) => url.pathname === program.href && url.search === "?source=check" && url.hash === "#overview");
      expect(documents).toBe(1);
      await expect(page.getByTestId("closed-applications")).toHaveCount(2);
    });
  }
}

test("the latest program link works with the keyboard", async ({ page }) => {
  await page.goto("/2026/oct/san-francisco/");
  await page.getByRole("link", { name: "Explore AISB London", exact: true }).first().focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/2026\/dec\/london\/?$/);
  await expect(page.getByRole("link", { name: "Apply Now", exact: true })).toHaveCount(2);
});

test("general and unknown-city interest forms do not prefill a city", async ({ page }) => {
  for (const query of ["", "?interest=unknown"]) {
    await page.goto(`/eoi/${query}`);
    await expect(page.getByRole("heading", { name: "Expression of Interest", exact: true })).toBeVisible();
    const frame = page.locator('iframe[title="Expression of Interest Form"]');
    await expect(frame).toBeAttached();
    expect(new URL((await frame.getAttribute("src"))!).searchParams.get("entry.1785871862")).toBeNull();
  }
});

test("the homepage application link opens the latest program", async ({ page }) => {
  await page.goto("/");
  const actions = page.getByTestId("hero-actions");
  await expect(actions.getByRole("link", { name: "Apply Now", exact: true })).toHaveAttribute("href", "/2026/dec/london");
  await expect(actions.getByRole("button", { name: "Past Programs", exact: true })).toBeVisible();
  await expect(page.getByTestId("closed-applications")).toHaveCount(0);
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("interest and program links remain usable", async ({ page }) => {
    await page.goto("/eoi/");
    await expect(page.getByRole("link", { name: /Open the expression of interest form/ })).toBeVisible();
    await page.goto("/2026/oct/san-francisco/");
    await expect(page.getByRole("link", { name: "Explore AISB London", exact: true })).toHaveCount(2);
  });
});

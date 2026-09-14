import { test, expect } from "./fixtures";

const aliases = [
  { path: "/london", target: "/2026/dec/london/" },
  { path: "/sf", target: "/2026/oct/san-francisco/" },
  { path: "/san-francisco", target: "/2026/oct/san-francisco/" },
  { path: "/vegas", target: "/2026/aug/vegas/" },
  { path: "/singapore", target: "/2026/apr/singapore/" },
];

for (const { path, target } of aliases) {
  test(`${path} opens the latest city program and preserves query and anchor`, async ({ page }) => {
    for (const slash of ["", "/"]) {
      const response = await page.goto(`${path}${slash}?source=city-test#overview`);
      expect(response?.status()).toBe(200);
      await expect(page).toHaveURL((url) =>
        url.pathname === target && url.search === "?source=city-test" && url.hash === "#overview",
      );
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", target.replace(/\/$/, ""));
      await page.reload();
      await expect(page).toHaveURL((url) => url.pathname === target);
    }
  });
}

test("unknown city shortcuts return 404", async ({ request }) => {
  for (const path of ["/unknown-city/", "/las-vegas/"]) {
    expect((await request.get(path)).status()).toBe(404);
  }
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  for (const { path } of aliases) {
    test(`${path} contains the program content`, async ({ page }) => {
      expect((await page.goto(`${path}/`))?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      if (path === "/london") await expect(page.getByText("Dec 6-12, 2026", { exact: true })).toBeVisible();
      else await expect(page.getByTestId("closed-applications")).toHaveCount(2);
    });
  }
});

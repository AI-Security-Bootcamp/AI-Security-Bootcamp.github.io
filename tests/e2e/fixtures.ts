import { test as base, expect } from "@playwright/test";

export const test = base.extend<{ browserErrors: string[] }>({
  context: async ({ context, baseURL }, runFixture) => {
    const origin = new URL(baseURL!).origin;
    // Test local assets and form URLs without sending analytics or loading live forms.
    await context.route("**/*", (route) =>
      new URL(route.request().url()).origin === origin ? route.continue() : route.abort(),
    );
    await runFixture(context);
  },
  browserErrors: [async ({ page }, runFixture) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await runFixture(errors);
    expect(errors, "uncaught browser errors").toEqual([]);
  }, { auto: true }],
});

export { expect };

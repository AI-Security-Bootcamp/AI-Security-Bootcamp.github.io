/* Run against a dev server or static export: SF_TEST_URL=http://127.0.0.1:3336 node scripts/check-sf.cjs */
const { chromium } = require('@playwright/test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const base = process.env.SF_TEST_URL || 'http://127.0.0.1:3333';
const output = path.resolve('test-results/sf-applications');
const sfPath = '/2026/oct/san-francisco/';
const londonPath = '/2026/dec/london';

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.HERO_BROWSER_EXECUTABLE ||
      (fs.existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined),
    args: ['--no-sandbox'],
  });
  const errors = [];
  const report = { checks: [] };
  try {
    for (const colorScheme of ['light', 'dark']) {
      const context = await browser.newContext({ colorScheme });
      // Never send analytics or submit/visit a live form during UI checks.
      await context.route('https://**/*', route => route.abort());
      const page = await context.newPage();
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`${base}${sfPath}`, { waitUntil: 'networkidle' });
      await page.getByRole('button', { name: /Switch to .* mode/ }).waitFor();
      assert.equal(await page.getByText('Applications Closed', { exact: true }).count(), 1);
      assert.equal(await page.getByRole('link', { name: /Apply now/i }).count(), 0);
      assert.equal(await page.locator('a[href*="airtable.com"]').count(), 0);
      assert.equal(await page.getByText('Oct 4-10, 2026', { exact: true }).count(), 1);

      const blocks = page.getByTestId('closed-applications');
      assert.equal(await blocks.count(), 2);
      for (const block of await blocks.all()) {
        assert.match(await block.locator('p').innerText(), /Applications for this cohort are closed\.\s+Now accepting applications for AISB London\./);
        const explore = block.getByRole('link', { name: 'Explore AISB London', exact: true });
        assert.equal(await explore.getAttribute('href'), londonPath);
        assert.equal((await explore.textContent()).trim(), 'Explore AISB London');
        const updates = block.getByRole('link', { name: 'Get notified of future cohorts', exact: true });
        assert.equal(await updates.getAttribute('href'), '/eoi?interest=san-francisco');
        assert.equal((await updates.textContent()).trim(), 'Get notified of future cohorts');
        const style = await explore.evaluate(el => {
          const s = getComputedStyle(el);
          return { background: s.backgroundColor, radius: s.borderRadius, color: s.color };
        });
        assert.deepEqual(style, { background: 'rgb(239, 68, 68)', radius: '0px', color: 'rgb(255, 255, 255)' });
      }

      for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow: ${width}/${colorScheme}`);
        for (const link of await blocks.locator('a').all()) {
          const box = await link.boundingBox();
          assert(box.height >= 44 && box.x >= 0 && box.x + box.width <= width, `CTA outside viewport: ${width}/${colorScheme}`);
          assert(await link.evaluate(el => el.scrollWidth <= el.clientWidth), 'CTA text overflows');
        }
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
        await page.screenshot({ path: path.join(output, `sf-${colorScheme}-${width}.png`), animations: 'disabled' });
      }
      await blocks.last().screenshot({ path: path.join(output, `sf-bottom-${colorScheme}.png`), animations: 'disabled' });
      await blocks.first().getByRole('link', { name: 'Explore AISB London', exact: true }).focus();
      await page.keyboard.press('Enter');
      await page.waitForURL(url => url.pathname.replace(/\/$/, '') === londonPath);
      await page.getByRole('link', { name: 'Apply Now', exact: true }).first().waitFor();
      assert.equal(await page.getByRole('link', { name: 'Apply Now', exact: true }).count(), 2);
      report.checks.push({ colorScheme, widths: [320, 390, 768, 1440], bothCtas: true, keyboardOpensLondonPage: true });
      await context.close();
    }

    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await context.route('https://**/*', route => route.abort());
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    for (const alias of ['/sf26/', '/2026/oct/']) {
      let documents = 0;
      const onRequest = request => {
        if (request.isNavigationRequest() && request.frame() === page.mainFrame()) documents++;
      };
      page.on('request', onRequest);
      await page.goto(`${base}${alias}?source=check#overview`, { waitUntil: 'networkidle' });
      await page.waitForURL(url => url.pathname === sfPath);
      assert.equal(new URL(page.url()).search, '?source=check');
      assert.equal(new URL(page.url()).hash, '#overview');
      assert.equal(documents, 1, 'Alias made a second document navigation');
      assert.equal(await page.getByTestId('closed-applications').count(), 2);
      page.off('request', onRequest);
    }
    report.checks.push({ legacyAndMonthAliases: true, preserveQueryAndHash: true, noNavigationRedirect: true });

    await page.getByRole('link', { name: 'Get notified of future cohorts', exact: true }).first().click();
    await page.waitForURL(url => url.pathname === '/eoi/' && url.search === '?interest=san-francisco');
    await page.getByRole('heading', { name: 'Future San Francisco cohorts', exact: true }).waitFor();
    const frame = page.locator('iframe[title="Expression of Interest Form"]');
    await frame.waitFor();
    const form = new URL(await frame.getAttribute('src'));
    assert.equal(form.searchParams.get('entry.1785871862'), "I'm interested in future AISB San Francisco cohorts.");
    assert.equal(form.searchParams.get('entry.1899923949'), null, 'Do not infer the visitor’s location');
    assert.match(await page.locator('main, section').first().innerText(), /not an application or confirmation/);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.screenshot({ path: path.join(output, 'sf-updates-mobile.png'), animations: 'disabled' });
    for (const query of ['', '?interest=unknown']) {
      await page.goto(`${base}/eoi/${query}`, { waitUntil: 'networkidle' });
      await page.getByRole('heading', { name: 'Expression of Interest', exact: true }).waitFor();
      await frame.waitFor();
      assert.equal(new URL(await frame.getAttribute('src')).searchParams.get('entry.1785871862'), null);
    }
    report.checks.push({ sfInterestPrefilled: true, generalEoiUnchanged: true, noFormSubmitted: true });

    await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
    const homeApply = page.getByTestId('hero-actions').getByRole('link', { name: 'Apply Now', exact: true });
    await homeApply.waitFor();
    assert.equal(await homeApply.getAttribute('href'), londonPath);
    assert.equal(await page.getByTestId('hero-actions').getByRole('button', { name: 'Past Programs', exact: true }).count(), 1);
    assert.equal(await page.getByTestId('closed-applications').count(), 0);
    report.checks.push({ homepageCtasUnchanged: true });
    const noScriptContext = await browser.newContext({ javaScriptEnabled: false });
    await noScriptContext.route('https://**/*', route => route.abort());
    const noScriptPage = await noScriptContext.newPage();
    await noScriptPage.goto(`${base}/eoi/`);
    assert(await noScriptPage.getByRole('link', { name: /Open the expression of interest form/ }).isVisible());
    await noScriptPage.goto(`${base}${sfPath}`);
    assert.equal(await noScriptPage.getByRole('link', { name: 'Explore AISB London', exact: true }).count(), 2);
    report.checks.push({ noJavaScriptLinksWork: true });
    await noScriptContext.close();
    assert.deepEqual(errors, [], 'Browser errors');
    fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });

import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// Run the local Next.js server first: npm run dev
const baseUrl = process.argv[2] || 'http://localhost:3333';
const output = resolve(process.argv[3] || 'projects/certificates/2026');
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1400, height: 1100 },
  deviceScaleFactor: 3.125,
  colorScheme: 'light',
});

try {
  await page.goto(`${baseUrl}/debug/certificate/`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Background only', exact: true }).click();
  await page.addStyleTag({ content: `
    .no-print { display: none !important; }
    .cert-scale { transform: none !important; }
    #certificate-artwork {
      position: fixed !important; top: 0 !important; left: 0 !important;
      width: 1122.56px !important; height: 793.6px !important;
    }
  ` });
  const renders = [];
  for (const cohort of ['london', 'sf']) {
    await page.locator('select').selectOption(cohort, { force: true });
    await page.evaluate(() => document.fonts.ready);
    if (!(await page.evaluate(() => document.fonts.check('16px "Space Grotesk"')))) {
      throw new Error('Space Grotesk did not load');
    }
    await page.locator('#certificate-artwork').getByText(cohort === 'london'
      ? 'For successfully completing the AI Security Bootcamp, London (Sept 2026)'
      : 'For successfully completing the AI Security Bootcamp, San Francisco (Oct 2026)',
    { exact: true }).waitFor();
    const filename = `aisb-${cohort}-2026-background.png`;
    const png = await page.screenshot({
      path: resolve(output, filename), type: 'png', scale: 'device',
      clip: { x: 0, y: 0, width: 1122.56, height: 793.6 },
    });
    renders.push({ cohort, filename, width: png.readUInt32BE(16), height: png.readUInt32BE(20) });
  }
  await writeFile(resolve(output, 'renders.json'), JSON.stringify(renders, null, 2));
  console.log(renders);
} finally {
  await browser.close();
}

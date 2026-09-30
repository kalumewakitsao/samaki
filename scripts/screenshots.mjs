/**
 * Curated before/after screenshots for docs/screenshots.
 *   node scripts/screenshots.mjs <afterBase> [beforeBase]
 */
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const after = process.argv[2] ?? 'http://localhost:4000';
const before = process.argv[3];
const out = 'docs/screenshots';
mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const vps = { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844 } };

async function shoot(url, file, vp, theme = 'light', { full = false, prep } = {}) {
  const ctx = await browser.newContext({
    viewport: vps[vp],
    colorScheme: theme,
    reducedMotion: 'reduce',
  });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  if (prep) await prep(page);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${out}/${file}.png`, fullPage: full });
  await ctx.close();
}

if (before) {
  for (const [r, n] of [
    ['/', 'home'],
    ['/about', 'about'],
    ['/contacts', 'contact'],
  ]) {
    await shoot(before + r, `before-${n}-desktop`, 'desktop');
    await shoot(before + r, `before-${n}-mobile`, 'mobile');
  }
}

for (const theme of ['light', 'dark']) {
  await shoot(after + '/', `after-home-desktop-${theme}`, 'desktop', theme);
  await shoot(after + '/', `after-home-mobile-${theme}`, 'mobile', theme);
  await shoot(after + '/products', `after-products-desktop-${theme}`, 'desktop', theme);
  await shoot(
    after + '/products/dissolved-oxygen-analyzer',
    `after-offering-desktop-${theme}`,
    'desktop',
    theme,
  );
  await shoot(
    after + '/products/dissolved-oxygen-analyzer',
    `after-offering-mobile-${theme}`,
    'mobile',
    theme,
  );
  await shoot(after + '/quote?item=fingerlings', `after-quote-mobile-${theme}`, 'mobile', theme, {
    full: true,
    prep: async (p) => {
      await p.waitForSelector('.item');
      await p.getByLabel('Quantity or details').first().fill('3,000');
      await p.getByLabel(/Town or county/).fill('Kisumu');
    },
  });
  await shoot(after + '/contact', `after-contact-desktop-${theme}`, 'desktop', theme);
}
await shoot(after + '/does-not-exist', 'after-404-desktop-light', 'desktop');
await browser.close();
console.log('screenshots written');

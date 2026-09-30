/**
 * Keyboard, focus, theme persistence and reduced-motion checks.
 *   node scripts/a11y-interactions.mjs [baseUrl]
 */
import { chromium } from 'playwright';

const base = process.argv[2] ?? 'http://localhost:4000';
const browser = await chromium.launch();
const assert = (c, m) => {
  console.log(`${c ? 'ok  ' : 'FAIL'} ${m}`);
  if (!c) process.exitCode = 1;
};

// Keyboard and focus, desktop.
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  await page.keyboard.press('Tab');
  assert(
    await page.evaluate(() => document.activeElement?.textContent?.trim() === 'Skip to content'),
    'first Tab reaches the skip link',
  );
  await page.keyboard.press('Enter');
  assert(
    await page.evaluate(() => document.activeElement?.id === 'main'),
    'skip link moves focus to main content',
  );
  await page.getByRole('link', { name: 'Products', exact: true }).first().focus();
  await page.keyboard.press('Enter');
  await page.waitForURL('**/products');
  await page.waitForTimeout(300);
  assert(
    await page.evaluate(() => document.activeElement?.tagName === 'H1'),
    'after navigation focus lands on the new page heading',
  );
  const ring = await page.evaluate(() => {
    const b = document.querySelector('.chip');
    b.focus();
    return getComputedStyle(b).boxShadow;
  });
  await page.keyboard.press('Tab');
  const ring2 = await page.evaluate(() => getComputedStyle(document.activeElement).boxShadow);
  assert(ring2 !== 'none', `keyboard focus is visible (${ring2.slice(0, 40)})`);
  await page.getByRole('button', { name: /Testing/ }).press('Enter');
  await page.waitForURL(/category=testing/);
  assert(
    (await page.locator('sx-offering-card').count()) === 4,
    'category filter works from the keyboard and updates the URL',
  );
  await page.reload({ waitUntil: 'networkidle' });
  assert((await page.locator('sx-offering-card').count()) === 4, 'filtered view survives reload');
  await page.close();
}

// Mobile menu: open, Escape closes, focus returns.
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  const btn = page.getByRole('button', { name: 'Open menu' });
  await btn.focus();
  await page.keyboard.press('Enter');
  await page.getByRole('dialog').waitFor();
  assert(
    await page.getByRole('dialog').getByRole('link', { name: 'Services' }).isVisible(),
    'mobile menu opens from the keyboard',
  );
  await page.keyboard.press('Escape');
  await page
    .getByRole('dialog')
    .waitFor({ state: 'detached', timeout: 3000 })
    .catch(() => {});
  assert((await page.getByRole('dialog').count()) === 0, 'Escape closes the menu');
  assert(
    await page.evaluate(() => document.activeElement?.classList.contains('menu-btn')),
    'focus returns to the menu button',
  );
  await btn.click();
  await page.getByRole('dialog').getByRole('link', { name: 'FAQ' }).click();
  await page.waitForURL('**/faq');
  await page
    .getByRole('dialog')
    .waitFor({ state: 'detached', timeout: 3000 })
    .catch(() => {});
  assert((await page.getByRole('dialog').count()) === 0, 'menu closes after choosing a page');
  const bar = await page.locator('sx-action-bar').boundingBox();
  assert(bar && bar.height <= 90, `mobile contact bar is compact (${bar?.height}px)`);
  await page.goto(base + '/quote', { waitUntil: 'networkidle' });
  await page.getByLabel(/Your name/).focus();
  await page.waitForTimeout(400);
  const hidden = await page.evaluate(() =>
    document.querySelector('sx-action-bar').classList.contains('is-hidden'),
  );
  assert(hidden, 'contact bar steps aside while typing in a form');
  await page.close();
}

// Theme: system preference first, manual choice remembered, applied before hydration.
{
  const ctx = await browser.newContext({ colorScheme: 'dark' });
  const page = await ctx.newPage();
  const early = [];
  page.on('domcontentloaded', async () =>
    early.push(await page.evaluate(() => document.documentElement.dataset.theme)),
  );
  await page.goto(base + '/about', { waitUntil: 'networkidle' });
  assert(early[0] === 'dark', 'system dark preference applied before the app starts');
  await page.getByRole('button', { name: 'Switch to light theme' }).click();
  assert(
    (await page.evaluate(() => document.documentElement.dataset.theme)) === 'light',
    'manual switch changes the theme',
  );
  early.length = 0;
  await page.reload({ waitUntil: 'networkidle' });
  assert(
    early[0] === 'light',
    'manual choice remembered on reload, with no flash of the dark theme',
  );
  await ctx.close();
}

// Reduced motion: no running animations.
{
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  const running = await page.evaluate(
    () =>
      document.getAnimations().filter((a) => {
        const t = a.effect?.getTiming();
        return (
          a.playState === 'running' && (t?.iterations === Infinity || Number(t?.duration) > 50)
        );
      }).length,
  );
  assert(running === 0, `reduced motion leaves no running animations (${running})`);
  await ctx.close();
}

await browser.close();

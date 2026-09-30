/**
 * Visual and runtime QA. Loads every route on mobile and desktop in light and
 * dark themes, records console errors, failed requests and horizontal
 * overflow, and saves full-page screenshots.
 *
 *   node scripts/qa.mjs [baseUrl] [outDir]
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright';

const base = process.argv[2] ?? 'http://localhost:4000';
const out = process.argv[3] ?? 'qa-output';
mkdirSync(out, { recursive: true });

const routes = [
  '/', '/products', '/products?category=testing', '/products/fingerlings', '/products/dissolved-oxygen-analyzer',
  '/services', '/services/on-site-farm-support', '/quote', '/about', '/contact', '/faq', '/privacy', '/does-not-exist',
];
const viewports = { mobile: { width: 390, height: 844 }, desktop: { width: 1440, height: 900 } };
const themes = ['light', 'dark'];

const browser = await chromium.launch();
const report = [];
for (const [vpName, viewport] of Object.entries(viewports)) {
  for (const theme of themes) {
    const ctx = await browser.newContext({ viewport, colorScheme: theme, deviceScaleFactor: vpName === 'mobile' ? 2 : 1, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    for (const route of routes) {
      const issues = [];
      page.removeAllListeners('console');
      page.removeAllListeners('pageerror');
      page.removeAllListeners('requestfailed');
      page.on('console', (m) => m.type() === 'error' && issues.push(`console: ${m.text()}`));
      page.on('pageerror', (e) => issues.push(`pageerror: ${e.message}`));
      page.on('requestfailed', (r) => issues.push(`requestfailed: ${r.url()}`));
      const res = await page.goto(base + route, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const m = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        theme: document.documentElement.dataset.theme,
        h1: document.querySelectorAll('h1').length,
        title: document.title,
      }));
      if (m.overflow > 0) issues.push(`horizontal overflow ${m.overflow}px`);
      if (m.theme !== theme) issues.push(`theme is ${m.theme}`);
      if (m.h1 !== 1) issues.push(`${m.h1} h1 elements`);
      const name = `${vpName}-${theme}-${route.replace(/[/?=]+/g, '_').replace(/^_|_$/g, '') || 'home'}.png`;
      await page.screenshot({ path: `${out}/${name}`, fullPage: true });
      report.push({ route, viewport: vpName, theme, status: res?.status(), title: m.title, issues });
    }
    await ctx.close();
  }
}
await browser.close();
writeFileSync(`${out}/report.json`, JSON.stringify(report, null, 2));
const bad = report.filter((r) => r.issues.length);
console.log(`${report.length} page views, ${bad.length} with issues`);
for (const r of bad) console.log(`${r.viewport} ${r.theme} ${r.route}: ${r.issues.join('; ')}`);

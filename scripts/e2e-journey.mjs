/**
 * End-to-end check of the main conversion journey against a running server:
 * home -> product -> quote -> delivered lead, plus back/forward and reload.
 *
 *   node scripts/e2e-journey.mjs [baseUrl] [expect=success|unavailable|failed] [screenshotDir]
 */
import { chromium } from 'playwright';

const base = process.argv[2] ?? 'http://localhost:4000';
const expect = process.argv[3] ?? 'success';
const shots = process.argv[4];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
const events = [];
await page.exposeFunction('__record', (e) => events.push(e));
await page.addInitScript(() => window.addEventListener('samaki:analytics', (e) => window.__record(e.detail.event)));
const step = (m) => console.log(`- ${m}`);
const assert = (c, m) => { if (!c) { console.error(`FAIL: ${m}`); process.exitCode = 1; } else step(m); };

await page.goto(base + '/', { waitUntil: 'networkidle' });
await page.getByRole('link', { name: 'Fingerlings', exact: true }).first().click();
await page.waitForURL('**/products/fingerlings');
assert((await page.locator('h1').innerText()) === 'Fingerlings', 'opened the Fingerlings page from the home page');

await page.reload({ waitUntil: 'networkidle' });
assert((await page.locator('h1').innerText()) === 'Fingerlings', 'reload keeps the product page');

await page.getByRole('button', { name: /Request a quote for Fingerlings/ }).click();
await page.waitForURL('**/quote');
assert(await page.getByText('Fingerlings', { exact: true }).first().isVisible(), 'quote form carries the selected product');

await page.goBack();
await page.waitForURL('**/products/fingerlings');
await page.goForward();
await page.waitForURL('**/quote');
assert(true, 'browser back and forward work');

await page.getByLabel('Quantity or details').first().fill('3,000');
await page.getByLabel(/Town or county/).fill('Kisumu');
await page.getByLabel(/Your name/).fill('Achieng Test');
await page.getByLabel(/Phone number/).fill('0712 345 678');
await page.waitForTimeout(2600);
if (shots) await page.screenshot({ path: `${shots}/journey-filled.png`, fullPage: true });
await page.getByRole('button', { name: /Send quote request/ }).click();

if (expect === 'success') {
  await page.getByRole('heading', { name: 'Your request is on its way' }).waitFor();
  const ref = await page.locator('.ref dd').first().innerText();
  assert(/^SX-\d{6}-[0-9A-F]{6}$/.test(ref), `success shows reference ${ref}`);
  assert(await page.evaluate(() => document.activeElement?.classList.contains('success')), 'focus moves to the confirmation');
  const count = await page.evaluate(() => JSON.parse(localStorage.getItem('samaki-quote-list') ?? '[]').length);
  assert(count === 0, 'quote list is emptied after delivery');
  if (shots) await page.screenshot({ path: `${shots}/journey-success.png`, fullPage: true });
  await page.goto(base + '/quote', { waitUntil: 'networkidle' });
  assert(await page.getByRole('button', { name: /Repeat my last request/ }).isVisible(), 'returning visitor can repeat the last request');
} else {
  await page.locator('.problem').waitFor();
  const text = await page.locator('.problem').innerText();
  assert(/Nothing (has been|was) sent/.test(text), `error explains nothing was sent (${expect})`);
  assert((await page.getByLabel(/Your name/).inputValue()) === 'Achieng Test', 'inputs are preserved after the failure');
  assert(await page.getByRole('link', { name: /Send by email/ }).isVisible(), 'email fallback offered');
  if (shots) await page.screenshot({ path: `${shots}/journey-${expect}.png`, fullPage: true });
}

assert(errors.length === 0, `no page errors ${errors.join(' ')}`);
console.log(`analytics events: ${events.join(', ')}`);
await browser.close();

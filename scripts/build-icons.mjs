/**
 * Renders the PNG icons from SVG sources with
 * Playwright's Chromium. Run with `npm run icons` after changing the mark.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright';

const mark = readFileSync('public/favicon.svg', 'utf8').replace(
  /@media[^}]*\}[^}]*\}[^}]*\}[^}]*\}/,
  '',
);
const browser = await chromium.launch();
const page = await browser.newPage();

async function png(html, size, file, height = size) {
  await page.setViewportSize({ width: size, height });
  await page.setContent(`<html><body style="margin:0">${html}</body></html>`);
  await page.evaluate(() => document.fonts.ready);
  const buf = await page.screenshot({
    omitBackground: true,
    clip: { x: 0, y: 0, width: size, height },
  });
  writeFileSync(file, buf);
  return buf;
}

const markAt = (s, pad = 0, bg = 'transparent') =>
  `<div style="width:${s}px;height:${s}px;display:grid;place-items:center;background:${bg}">
     <div style="width:${s - pad * 2}px;height:${s - pad * 2}px">${mark.replace('<svg ', '<svg width="100%" height="100%" ')}</div></div>`;

await png(markAt(180), 180, 'public/apple-touch-icon.png');
await png(markAt(192), 192, 'public/icon-192.png');
await png(markAt(512), 512, 'public/icon-512.png');
await png(markAt(512, 70, '#0b6e5f'), 512, 'public/icon-maskable-512.png');
const ico32 = await png(markAt(32), 32, '/tmp/icon-32.png');
const ico16 = await png(markAt(16), 16, '/tmp/icon-16.png');

// favicon.ico holding two PNG images (16 and 32 px).
const images = [ico16, ico32];
const header = Buffer.alloc(6 + images.length * 16);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(images.length, 4);
let offset = header.length;
images.forEach((img, i) => {
  const size = i === 0 ? 16 : 32;
  const e = 6 + i * 16;
  header.writeUInt8(size, e);
  header.writeUInt8(size, e + 1);
  header.writeUInt16LE(1, e + 4);
  header.writeUInt16LE(32, e + 6);
  header.writeUInt32LE(img.length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += img.length;
});
writeFileSync('public/favicon.ico', Buffer.concat([header, ...images]));

// The social artwork is maintained separately as public/og-samaki-farm-support-v2.png.
// Keep icon regeneration from replacing the approved share-card design.

await browser.close();
console.log('Icons written to public/');

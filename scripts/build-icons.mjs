/**
 * Renders the PNG icons and the social preview image from SVG sources with
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

// Social preview, 1200 x 630.
const fonts = `
  @font-face { font-family: B; src: url(data:font/woff2;base64,${readFileSync('public/fonts/bricolage-latin-wght.woff2').toString('base64')}) format('woff2'); font-weight: 200 800; }
  @font-face { font-family: I; src: url(data:font/woff2;base64,${readFileSync('public/fonts/inter-latin-wght.woff2').toString('base64')}) format('woff2'); font-weight: 100 900; }`;
await png(
  `<style>${fonts}</style>
  <div style="width:1200px;height:630px;box-sizing:border-box;padding:72px 80px;background:#0b2b2e;color:#e9f3ef;font-family:I;position:relative;overflow:hidden">
    <svg style="position:absolute;left:0;bottom:0" width="1200" height="260" viewBox="0 0 1200 260">
      <path d="M0 60 Q100 40 200 60 T400 60 T600 60 T800 60 T1000 60 T1200 60 V260 H0 Z" fill="#14484c"/>
      <path d="M0 170 Q100 152 200 170 T400 170 T600 170 T800 170 T1000 170 T1200 170 V260 H0 Z" fill="#1f7d6d" opacity=".7"/>
      <g transform="translate(960 130) scale(2.4)"><path d="M-27 0 L-44 -13 Q-39 0 -44 13 Z" fill="#e39a3b"/><path d="M-30 0 C-18 -17 10 -19 30 0 C10 19 -18 17 -30 0 Z" fill="#f5c15a"/><circle cx="19" cy="-3" r="3" fill="#0b2b2e"/></g>
      <g transform="translate(1110 200) scale(1.3)"><path d="M-27 0 L-44 -13 Q-39 0 -44 13 Z" fill="#e39a3b"/><path d="M-30 0 C-18 -17 10 -19 30 0 C10 19 -18 17 -30 0 Z" fill="#f5c15a"/><circle cx="19" cy="-3" r="3" fill="#0b2b2e"/></g>
    </svg>
    <div style="display:flex;align-items:center;gap:18px">
      <div style="width:64px;height:64px">${mark.replace('<svg ', '<svg width="100%" height="100%" ')}</div>
      <div style="font-family:B;font-size:40px;letter-spacing:-.03em"><b style="font-weight:780">Samaki</b> <span style="font-weight:480;color:#7be6cb">Express</span></div>
    </div>
    <div style="font-family:B;font-weight:740;font-size:76px;line-height:1.04;letter-spacing:-.035em;margin-top:56px;max-width:820px;position:relative">Fingerlings, feeds and expert help for your fish farm.</div>
    <div style="font-size:28px;color:#a8c4bd;margin-top:24px;position:relative">Request a quote at samakiexpress.co.ke</div>
  </div>`,
  1200,
  'public/og-image.png',
  630,
);

await browser.close();
console.log('Icons and social image written to public/');

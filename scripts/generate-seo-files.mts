/**
 * Writes robots.txt, sitemap.xml and _redirects into public/ from the same
 * catalogue and redirect data the app uses. Runs before every build.
 */
import { writeFileSync } from 'node:fs';
import { PRODUCTS, SERVICES } from '../src/app/core/data/catalogue.ts';
import { REDIRECTS } from '../src/server/redirects.ts';

const SITE = 'https://www.samakiexpress.co.ke';
const today = new Date().toISOString().slice(0, 10);

const pages: [string, string][] = [
  ['/', '1.0'],
  ['/products', '0.9'],
  ['/services', '0.9'],
  ['/quote', '0.8'],
  ['/about', '0.6'],
  ['/contact', '0.7'],
  ['/faq', '0.6'],
  ['/privacy', '0.2'],
  ...PRODUCTS.map((p): [string, string] => [`/products/${p.slug}`, '0.7']),
  ...SERVICES.map((s): [string, string] => [`/services/${s.slug}`, '0.7']),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(([p, pr]) => `  <url><loc>${SITE}${p === '/' ? '/' : p}</loc><lastmod>${today}</lastmod><priority>${pr}</priority></url>`).join('\n')}
</urlset>
`;

const robots = `User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${SITE}/sitemap.xml
`;

// Netlify / Cloudflare Pages style redirects, for static hosting without the Node server.
const redirects = [
  ...Object.entries(REDIRECTS).flatMap(([from, to]) => [`${from} ${to} 301`, `${from}/ ${to} 301`]),
  ...['/products', '/services', '/about', '/contact', '/quote', '/faq', '/privacy'].map((p) => `${p}/ ${p} 301`),
].join('\n');

writeFileSync('public/sitemap.xml', sitemap);
writeFileSync('public/robots.txt', robots);
writeFileSync('public/_redirects', redirects + '\n');
console.log(`SEO files written: ${pages.length} URLs in sitemap.xml`);

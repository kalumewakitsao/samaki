/**
 * Permanent redirects from URLs that existed before the redesign.
 * The live site used trailing slashes (/about/); the new site drops them, and
 * the server strips any trailing slash with a 301 as well (see server.ts).
 * Keep this file free of runtime imports: scripts/generate-seo-files.mts reads it.
 */
export const REDIRECTS: Readonly<Record<string, string>> = {
  '/home': '/',
  '/index.html': '/',
  '/contacts': '/contact',
  '/contact-us': '/contact',
  '/get-a-quote': '/quote',
  '/request-a-quote': '/quote',
  '/shop': '/products',
  '/product': '/products',
  '/service': '/services',
  '/faqs': '/faq',
  '/privacy-policy': '/privacy',
};

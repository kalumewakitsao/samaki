# Build, migration and verification results

Run on 30 September 2026 against a production build served by the SSR server (`node dist/samaki/server/server.mjs`).

## Migration

| From | To |
|---|---|
| Angular 17.3, `@angular-devkit/build-angular` browser build, zone.js | Angular 21.2.24, `@angular/build` application builder, zoneless change detection, SSR with prerendering (`@angular/ssr`, Express 5) |
| Bootstrap 5.3 CSS and JS | Removed. One design system in CSS layers (`reset, tokens, primeng, base, layout, components, utilities`), so PrimeNG and site styles never fight and no `!important` overrides are needed |
| No component library | PrimeNG 21.1.10 with `@primeuix/themes` 2.0.3: an Aura preset mapped to the site's CSS variables. PrimeNG 22 requires Angular 22, so 21.1 is the matching line |
| Karma and Jasmine | Vitest 4.0 via `@angular/build:unit-test` (the Angular 21 default) |
| NgModule-era file names, eager routes | Standalone components, signals, lazy-loaded routes, `withComponentInputBinding`, view transitions |

28 routes are prerendered at build time (8 pages, 13 products, 7 services); unknown URLs render on the server and return 404.

## Automated checks

| Check | Command | Result |
|---|---|---|
| Production build | `npm run build` | Passes. Initial JS 134 KB transferred |
| Unit tests | `npm test` | 14 of 14 pass (validation, lead endpoint incl. dedupe, spam, failure and rate limit, quote list, app shell) |
| Route, theme and viewport sweep with axe-core | `node scripts/qa.mjs` | 13 routes x 2 viewports x 2 themes = 52 page views: 0 axe violations (WCAG 2.2 A/AA and best practice), 0 horizontal overflow, 0 page errors, one `h1` per page. The only console messages are the expected 404 on the not-found route |
| Conversion journey | `node scripts/e2e-journey.mjs` | Home → Fingerlings → reload → quote with product carried over → back and forward → submit → lead delivered to the webhook with a valid signature, reference shown, focus on confirmation, list cleared, "Repeat my last request" offered |
| Failure states | same, with a dead webhook and with no destination | Both show "Nothing was sent", keep inputs, and offer email and phone |
| Keyboard, focus, theme, motion | `node scripts/a11y-interactions.mjs` | Skip link, focus to heading after navigation, visible focus rings, keyboard filters, menu opens and closes with focus returned, contact bar hides while typing, system theme applied before hydration, manual theme remembered with no flash, no running animations under reduced motion |
| API | curl | 201 valid, 200 duplicate with same reference, 422 invalid, 400 too fast, silent drop for honeypot, 301 for `/contacts` and `/about/`, 404 for unknown pages and unknown product slugs |

## Lighthouse (mobile, simulated slow 4G, Lighthouse 12)

| Page | Performance | Accessibility | Best practices | SEO | FCP | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|---|
| `/` | 91 | 100 | 100 | 100 | 2.5 s | 2.8 s | 140 ms | 0 |
| `/products` | 90 | 100 | 100 | 100 | 2.5 s | 3.1 s | 120 ms | 0 |
| `/products/artemia` | 89 | 100 | 100 | 100 | 2.5 s | 2.9 s | 190 ms | 0 |
| `/quote` | 87 | 100 | 100 | 100 | 2.8 s | 3.1 s | 180 ms | 0 |

These are lab numbers from a local server, not field Core Web Vitals. LCP is text (no hero image), so it depends mostly on HTML and CSS delivery; a CDN in front of the Node server should bring LCP under 2.5 s. The largest remaining cost is the PrimeNG theme engine in the initial bundle (about 106 KB raw of preset tokens).

## Browsers

Chromium (Playwright 1.56) was used for every automated run. Safari and Firefox were not available in this environment; the site uses no Chromium-only features for content (scroll-driven entrance animations and view transitions are progressive enhancements that simply do not run elsewhere).

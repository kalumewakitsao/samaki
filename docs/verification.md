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
| Route, theme and viewport sweep with axe-core | `node scripts/qa.mjs` | 13 routes x 2 viewports x 2 themes = 52 page views: 0 axe violations (WCAG 2.2 A/AA and best practice), 0 horizontal overflow at these two widths (see the responsive pass below for the full width range), 0 page errors, one `h1` per page. The only console messages are the expected 404 on the not-found route |
| Conversion journey | `node scripts/e2e-journey.mjs` | Home → Fingerlings → reload → quote with product carried over → back and forward → submit → lead delivered to the webhook with a valid signature, reference shown, focus on confirmation, list cleared, "Repeat my last request" offered |
| Failure states | same, with a dead webhook and with no destination | Both show "Nothing was sent", keep inputs, and offer email and phone |
| Keyboard, focus, theme, motion | `node scripts/a11y-interactions.mjs` | Skip link, focus to heading after navigation, visible focus rings, keyboard filters, menu opens and closes with focus returned, contact bar hides while typing, system theme applied before hydration, manual theme remembered with no flash, no running animations under reduced motion |
| API | curl | 201 valid, 200 duplicate with same reference, 422 invalid, 400 too fast, silent drop for honeypot, 301 for `/contacts` and `/about/`, 404 for unknown pages and unknown product slugs |

## Responsive pass

The first sweep only used 390 px and 1440 px. A wider sweep found sideways scrolling at 320, 360, 480 and 900 px that it had missed: the header tools pushed the menu button off small phones, and a long email address widened the footer. Both are fixed, and the check now covers:

| Check | Result |
|---|---|
| Sideways scroll | 13 routes x 18 widths (320, 360, 375, 390, 414, 480, 600, 768, 834, 900, 1024, 1180, 1280, 1366, 1440, 1680, 1920, 2560) = 234 page views in dark theme, plus 132 in light: 0 with horizontal overflow |
| axe-core at 320, 768, 1024 and 1920 px | 10 routes x 4 widths x 2 themes = 80 page views: 0 violations |
| Landscape phone (844 x 390) | Home and quote pages checked by eye |

What changed by screen size:

- **Small phones (under 384 px)**: the logo scales down and the theme switch moves into the menu, so the header fits at 320 px.
- **Phones**: category tiles sit two across with the icon above the name; popular products and "who we work with" become swipeable rows that show a slice of the next card; the catalogue and services lists use compact rows (picture beside the text); process steps put the number beside the text; product pages use a shorter picture; the form progress is a three-part bar; checkboxes and radios are 24 px; email addresses wrap at the @ instead of mid-word; footer links sit in two columns. The home page at 320 px went from 12,463 px tall to 9,313 px.
- **Tablets (768 px up)**: the hero and product pages go two-column instead of stacking a very large picture above the text; the quote page's side boxes sit side by side; the footer uses three columns.
- **Laptops (1024 to 1279 px)**: the hero headline steps down a size, category tiles go three across, and four-up card grids wait until 1152 px so cards are not squeezed (two-across cards get a wider, shorter picture).
- **Large screens**: the content width grows gently from 76rem to 86rem at 2560 px.

Before and after images: `docs/screenshots/responsive/`.

## Lighthouse (mobile, simulated slow 4G, Lighthouse 12)

| Page | Performance | Accessibility | Best practices | SEO | FCP | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|---|
| `/` | 91 (88 after the responsive pass, within run-to-run noise) | 100 | 100 | 100 | 2.5 s | 2.8 s | 140 ms | 0 |
| `/products` | 90 | 100 | 100 | 100 | 2.5 s | 3.1 s | 120 ms | 0 |
| `/products/artemia` | 89 | 100 | 100 | 100 | 2.5 s | 2.9 s | 190 ms | 0 |
| `/quote` | 87 | 100 | 100 | 100 | 2.8 s | 3.1 s | 180 ms | 0 |

These are lab numbers from a local server, not field Core Web Vitals. LCP is text (no hero image), so it depends mostly on HTML and CSS delivery; a CDN in front of the Node server should bring LCP under 2.5 s. The largest remaining cost is the PrimeNG theme engine in the initial bundle (about 106 KB raw of preset tokens).

## Premium pass (sticky navbar, phone-first calls to action)

- Navbar stays pinned while scrolling (checked in `scripts/a11y-interactions.mjs`); the call button with the number is always in it.
- Overflow sweep: 12 routes x 15 widths (320 to 2560), dark theme, 0 pages with sideways scroll.
- axe: 80 page views (320, 768, 1024, 1920; light and dark), 0 violations. Keyboard checks: 18 of 18 pass.
- Unit tests: 19 of 19 (adds the open-now status in Nairobi time).
- Lighthouse mobile after the monochrome restyle: home 91/100/100/100 (LCP 2.6 s, CLS 0.062), fingerlings 90/100/100/100 (performance, accessibility, best practices, SEO).
- Screenshots in `docs/screenshots/premium/`.

## Browsers

Chromium (Playwright 1.56) was used for every automated run. Safari and Firefox were not available in this environment; the site uses no Chromium-only features for content (scroll-driven entrance animations and view transitions are progressive enhancements that simply do not run elsewhere).

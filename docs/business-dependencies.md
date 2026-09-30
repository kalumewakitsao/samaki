# Business dependencies and release risks

These need an answer or an action from Samaki Express. Each has a safe default in place, so the site works without them.

| # | Dependency | Why it matters | Current state |
|---|---|---|---|
| 1 | **A lead destination**: a Google Sheet webhook and/or Resend email for samakiexpresske@gmail.com | Without it the form correctly refuses to accept requests and offers email and phone instead | Not configured |
| 2 | **Hosting that can run Node** (for SSR, the lead API and 301s), or a static host plus a serverless function for `/api/enquiries` | Static-only hosting loses the lead API | Current host unknown |
| 3 | Confirm WhatsApp on 0704 944 034 | Enables WhatsApp buttons site-wide (`BUSINESS.whatsapp.enabled`) | Off |
| 4 | Fingerling species, sizes and pack sizes for feeds and hormones | Richer product pages and better search | Asked in the form |
| 5 | Delivery areas, lead times and costs | A delivery section with real terms | "Agreed when we confirm your order" |
| 6 | Proof: customer testimonials with consent, real farm counts, certifications (for example, KMFRI or county fisheries registration) | Trust section on home and About | Removed; nothing unverified is shown |
| 7 | Real photography of stock, products, team and farms | Replaces illustrations on product and About pages | Illustrations in place |
| 8 | Original logo source file | Decide whether to keep old recognition | New mark designed |
| 9 | Privacy notice review | Kenya Data Protection Act compliance; the notice is written plainly but not reviewed by a lawyer | Draft live at `/privacy` |
| 10 | Analytics account (Plausible or similar) | Turns on funnel measurement | Off |
| 11 | DNS and Google Search Console access | Submit the sitemap, watch the redirect change | Not available |

## Release plan

1. **Preview**: run `npm run build && npm run serve:ssr` (or deploy the branch to a preview host) and review every route on a phone and a laptop in both themes.
2. **Connect leads**: set `LEAD_WEBHOOK_URL` and/or the Resend variables on the preview, send a test request, confirm it arrives, then send one from a phone.
3. **Decide the open items** above (WhatsApp at least).
4. **Deploy** to a Node host (Render, Railway, Fly.io, a VPS, or Firebase App Hosting / Cloud Run). Build: `npm ci && npm run build`. Start: `node dist/samaki/server/server.mjs`. Set `PORT` and the lead variables. Hosts that cannot run Node can serve `dist/samaki/browser` (all pages are prerendered, `_redirects` included) but need `/api/enquiries` provided separately.
5. **Switch DNS** for www.samakiexpress.co.ke, keeping the apex redirecting to www.
6. **After launch**: submit `sitemap.xml` in Search Console, check that the old trailing-slash URLs return 301, watch the lead inbox for a week, and turn on analytics.

## Risks

- **Search equity**: URLs change from `/about/` to `/about`. Mitigated by 301s on the server and in `_redirects`, canonical tags, and a new sitemap. Rankings may move for a few weeks.
- **Lead loss during cutover**: until a destination is configured, the form sends people to email and phone. Do not switch DNS before step 2.
- **Unknown hosting**: if the current host is static-only, the lead API needs a separate function.
- **Content accuracy**: product descriptions are general. Samaki Express should read each product page once before launch.

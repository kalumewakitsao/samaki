# Business discovery, routes and redirects

Audit date: 30 September 2026. Sources: the live site at www.samakiexpress.co.ke (read page by page), the public listings found by search, and this repository.

## What Samaki Express is

Samaki Express EA Ltd is an **aquaculture supplier and advisory business**, not a seafood retailer. It sells to fish farmers:

| Offer | Verified items |
|---|---|
| Fingerlings | Fingerlings for stocking (species and sizes not listed on the live site) |
| Feeds | Artemia, Wean Mix |
| Hatchery inputs | Ovaprim, Ovatide |
| Water testing | Dissolved oxygen analyzer, 7-in-1 water tester, ammonium test kit, nitrite (NO2) test |
| Aeration and pumps | Air compressor, Vento air pump, submersible pump |
| Filtration | Internal liquid filter |
| Services | Fingerlings and hatchery supply, feed and water management, on-site farm support, health and biosecurity, farm audits and advisory, training, logistics and delivery |

**Customers** named by the live site: hatcheries, pond and cage farms, small-scale farmers and farm managers, people starting new farms.
**Where**: office at Kairo, Waiyaki Way, next to Nairobi School, Nairobi. The live site says field visits happen "across East Africa".
**How orders work today**: no prices, no checkout. The live site pushes "Get a Quote" and "Contact" forms, but neither form has a visible backend (no action, provider or confirmation), so it is unclear whether enquiries reached anyone.
**Contact**: 0704 944 034, samakiexpresske@gmail.com, Monday to Friday 9:00 to 18:00. No WhatsApp link, social links, analytics, canonical tags, sitemap (404) or social preview tags were found.

### Credibility problems found on the live site

- **Conflicting numbers**: "500+ farmers served" on the home page and "1,200+ farms supported" on the services page; "98% survival rate" is shown as both a result and a "target"; "48-hour average delivery" and "10+ years" have no source.
- **Testimonials that cannot be used**: the three home-page testimonials are attributed to Caroline Awino, Janeffer Nafula and Vanessa Musula, who are also listed as staff on the About page.
- **Unverified certification**: "certified disease-free" and "certified fingerlings" with no certifying body.

None of these appear on the new site. See [business-dependencies.md](business-dependencies.md) for what would let us add proof back.

### The repository before this change

Angular 17.3 standalone app with Bootstrap 5.3 (CSS and JS bundle), three placeholder routes (`/`, `/about`, `/contacts`) showing "PRINCESS NELIMA …" text, a navbar missing its `RouterLinkActive` import, and specs that expected the CLI scaffold. It was not the code behind the live site, which has different routes and content.

## User journeys and friction on the live site

1. **"What do you sell?"** The home page leads with a slogan ("Transforming Aquaculture in East Africa") and generic cards; the actual products are two clicks away.
2. **"How much and can you deliver to me?"** No prices, no delivery areas and no explanation of what happens after "Get a Quote".
3. **Quote form** asks for a "system type" and "package" with no context, and does not say what happens next.
4. **Product cards** have no detail pages, so there is nothing to link to, share or rank for.
5. **Competing CTAs**: "Get Free Consultation", "Get a Quote", "Talk to an Expert", "Start a Service Plan", "Book a Call" and a newsletter box all compete.
6. **Trust** undermined by the conflicting statistics and staff testimonials above.

## Route disposition

| Old URL | Status | New URL | Purpose and primary action |
|---|---|---|---|
| `/` | Redesigned | `/` | Explain the offer in one line, route to products or services. Primary: Request a quote |
| `/products/` | Redesigned | `/products` | Searchable, filterable catalogue (13 items, 6 categories). Primary: Add to quote |
| n/a | New | `/products/:slug` (13 pages) | What it is, who it is for, what to tell us. Primary: Request a quote for this product |
| `/services/` | Redesigned | `/services` | Services and how we work. Primary: Request a service |
| n/a | New | `/services/:slug` (7 pages) | Scope of each service. Primary: Request this service |
| `/quote/` | Redesigned | `/quote` | Quote list and enquiry form. Primary: Send quote request |
| `/about/` | Redesigned | `/about` | Mission, values, team. Primary: Request a quote |
| `/contact/` | Redesigned | `/contact` | Channels, hours, map link, message form. Primary: Call or send a message |
| `/contacts` (repo) | Redirected | `/contact` | |
| n/a | New | `/faq` | Ordering, delivery and visit questions. Primary: Request a quote |
| n/a | New | `/privacy` | Privacy notice for enquiry data |
| anything else | 404 | Not-found page with real 404 status and helpful links | |

Legacy home-page anchors ("Explore Products", "Get Free Consultation") map to `/products` and `/quote`.

## Redirect map (all 301)

Defined once in `src/server/redirects.ts`. The Node server applies them, the Angular router mirrors them for in-app links, and `public/_redirects` carries them for static hosts.

| From | To |
|---|---|
| Any URL with a trailing slash, e.g. `/about/`, `/products/` | Same URL without the slash |
| `/home`, `/index.html` | `/` |
| `/contacts`, `/contact-us` | `/contact` |
| `/get-a-quote`, `/request-a-quote` | `/quote` |
| `/shop`, `/product` | `/products` |
| `/service` | `/services` |
| `/faqs` | `/faq` |
| `/privacy-policy` | `/privacy` |

Nothing redirects to the home page by default: unknown URLs get the 404 page.

## Content sources

Every fact on the site traces to the live site: product names and one-line summaries (Products page), service descriptions and the four-step process (Services page), mission, vision, values, team names and roles, focus areas (About page), phone, email, address and hours (Contact page), meta description. Longer product descriptions explain general, well-established aquaculture uses (for example, Artemia as a first feed) without claims about price, pack size, stock or certification. Copy lives in `src/app/core/data/catalogue.ts`, `business.ts` and the page templates.

## Open business questions (continued with reversible defaults)

| Question | Default used |
|---|---|
| Which fingerling species and sizes are sold? | Asked in the quote form ("the species you farm") |
| Is 0704 944 034 on WhatsApp? | WhatsApp actions built but off (`BUSINESS.whatsapp.enabled`) |
| Where do enquiries go? | Webhook or email, configured by environment variable; nothing is shown as sent until delivered |
| Where exactly do you deliver and at what cost? | "Agreed when we confirm your order" |
| Is there a real logo file to keep? | The live `logo.webp` could not be downloaded from this environment; a new mark was designed (see brand guide) |
| Who hosts the live site and DNS? | Unknown; see release plan |

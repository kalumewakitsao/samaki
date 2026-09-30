# Samaki Express brand and component guide

## Idea

**Good water, good stock, good advice.** Samaki Express helps fish farmers grow healthy fish. The identity pairs the calm precision of water science with the warmth of people who visit your farm. Light theme: sunlit water over warm limestone. Dark theme: the pond at night, deep water lit by a bright teal.

## What we took from the references

| Reference | Principle applied | How it shows up |
|---|---|---|
| schul.co.ke | A headline that states the product plainly, one clear entry point, restrained navigation | "Fingerlings, feeds and expert help for your fish farm." Five nav items and one persistent primary action |
| Linear | Precise type scale, tight rhythm, dark mode designed as its own palette, product storytelling in sequenced sections | Token-driven spacing and type, a deep "Beyond supply" band telling the four-step process, a dark theme with its own teal and shadows |
| Airbnb | Discovery by category, friendly cards, trust and next steps spelled out, mobile-first tap targets | Category tiles and filter chips, cards with one clear action, "How ordering works", sticky mobile contact bar, 44px+ targets |

Nothing was copied: no layouts, assets or proprietary fonts from these sites.

## Logo and favicon

A fish in a rounded, pond-shaped tile. The tail is drawn as a forward chevron (the "express"), and a gold sun sits above the water. The wordmark sets **Samaki** in bold and *Express* in regular weight, brand teal. Files: `public/favicon.svg` (adapts to dark browser UI), `favicon.ico`, `apple-touch-icon.png`, `icon-192/512.png`, a maskable icon and `og-image.png`, all rendered by `npm run icons`.
The previous `logo.webp` could not be retrieved from this environment, so recognition could not be compared. If the old logo has equity, share the source file and we can carry its colour or letterforms into this mark.

## Colour

Defined in `src/styles/_tokens.scss`, switched by `[data-theme]`. PrimeNG reads the same variables through `src/app/core/theme/samaki-preset.ts`.

| Role | Light | Dark | Contrast (text pairs) |
|---|---|---|---|
| Background | `#F6F4EE` limestone | `#071417` night pond | |
| Surface | `#FFFFFF` | `#0D1F23` | |
| Ink | `#0B1F22` | `#E8F1EE` | 15.5 : 1 / 16.3 : 1 |
| Secondary ink | `#3A4F53` | `#B1C4C0` | 7.9 : 1 / 10.3 : 1 |
| Tertiary ink | `#56696C` | `#8FA6A2` | 5.3 : 1 / 6.6 : 1 |
| Brand (lake teal) | `#0B6E5F`, white text | `#3FD1AE`, dark text | 6.2 : 1 / 8.9 : 1 |
| Brand text/links | `#0A6356` | `#5EDCBD` | 6.5 : 1 / 11.1 : 1 |
| Accent (sun gold) | `#F2B33D`, dark text | `#F5C15A` | 9.8 : 1 |
| Deep band | `#0B2B2E` | `#0D2A2D` | secondary text 8.1 : 1 |
| Danger | `#B42318` | `#FF8F80` | 6.6 : 1 / 7.7 : 1 |
| Success | `#0F6F45` | `#6ADCA4` | |

Rules: teal for actions and links, gold only for highlights and the one accent CTA per page, deep band at most once or twice per page. Axe reports no contrast failures on any route in either theme.

## Typography

| Use | Font | Licence |
|---|---|---|
| Display, headings and body | Geist (variable, self-hosted Latin subset) | SIL OFL 1.1 |

Self-hosted (Latin subset, about 31 KB), preloaded, `font-display: swap`, with metric-matched fallbacks so text does not shift. Scale: 13, 15, 17 (body), 19, then fluid 21 to 24, 26 to 36, 32 to 52, and 40 to 80 px for the display size. Headings use tight negative tracking and balanced wrapping; body copy is 17 px at 1.6 line height with a 38rem measure for mobile readability.

## Spacing, radius, elevation, motion

- Spacing: 4 px base (`--s-1` to `--s-24`), fluid section padding and gutters.
- Radius: 6, 10, 14, 22, 32 px and pill. Controls use 10 px, cards 22 px, feature panels 32 px, buttons and chips are pills.
- Elevation: three tinted shadows; dark mode uses deeper, softer shadows and relies more on borders.
- Motion: 120, 200, 320 and 560 ms with an ease-out curve. Section entrances use CSS scroll-driven animations (no JavaScript, never hide content where unsupported); cards lift on hover; route changes cross-fade with the View Transitions API; bubbles and fish drift slowly in illustrations. Everything stops under `prefers-reduced-motion`.

## Illustration and photography

- **Now**: 16 spot illustrations and a hero scene drawn for this site as SVG (AI-assisted, hand-tuned), plus a 37-icon line set on a 24 px grid with 1.75 px rounded strokes. Illustrations use their own tokens (`--ill-*`) so each scene is recoloured for dark mode.
- **Next**: replace illustrations on product pages with real photography as it becomes available. Direction: natural light, real farms and hatcheries, hands at work (netting, testing water, feeding), close-ups of healthy fingerlings in clear water, products shot on the limestone background colour. No stock photos of ocean fish or seafood plates, which misrepresent the business.

## Components

| Component | Notes |
|---|---|
| Button | Primary teal, secondary outline, quiet, accent gold; 40, 48 and 56 px heights; arrow nudges on hover |
| Offering card | Illustration, category badge, title link (the whole card is clickable), summary, "Add to quote" toggle |
| Category tile and filter chip | Icon plus label; chips are toggle buttons with `aria-pressed` and sync to the URL |
| Enquiry form | PrimeNG InputText, Select, Textarea and Checkbox styled by tokens; numbered sections with live progress; error summary with links to fields; success and failure panels |
| Header | Sticky, translucent, active link state, theme switch, quote list with count, deferred mobile drawer (dialog semantics, Escape closes, focus returns) |
| Mobile contact bar | Call plus the next best action; hides while typing so it never covers inputs |
| CTA band | Deep band with one gold action and a phone action |
| Breadcrumbs, FAQ disclosure, notices | Native elements first (`details`, lists), styled by tokens |

## 2026-09-30 direction: calm and monochrome

The owner asked for an apple.com feel with no unusual colours or backgrounds, citing linear.app, bang-olufsen.com, framer.com and mercury.com. The site now uses white and light grey surfaces (true black and graphite in dark mode), near-black type and one blue accent (`#0071e3`) for actions and links. Headings are Geist at weight 500 with tight tracking; small labels are uppercase and letter-spaced. Motion is CSS scroll-driven: the hero settles in on load and eases back as you scroll, and cards rise softly into place. All of it stops under reduced motion. Older colour notes below describe the first redesign.

## Calling us is the main action

Phone calls are the main way customers reach Samaki Express, so the number is the primary call to action everywhere: blue `.btn--call` buttons in the sticky navbar, the hero, product pages, the call band, the closing band and the phone action bar. Quote requests are secondary. An open-now dot and label (Mon to Fri, 9 am to 6 pm, Nairobi time) sits next to the number when the browser can compute it; the server render shows the hours instead.

## Voice

Confident, warm, concise, specific. Say what happens next ("We confirm price, availability and delivery with you"), use the farmer's words (ponds, cages, stocking date), avoid jargon and superlatives, and never claim numbers, certifications or guarantees we cannot show.

| Instead of | Write |
|---|---|
| Transforming Aquaculture in East Africa | Fingerlings, feeds and expert help for your fish farm. |
| Get Free Consultation / Start a Service Plan / Book a Call | Request a quote |
| Submit | Send quote request |
| 98% survival rate | (removed until verified) |

# Samaki Express website

Public website for Samaki Express EA Ltd: fingerlings, hatchery inputs, water testing, aeration equipment and farm support for fish farmers. Angular 21 with server-side rendering and prerendering, PrimeNG 21 form controls, and a small Express API that delivers quote requests.

## Run it

```bash
npm ci
npm start                 # dev server on http://localhost:4200
npm run build             # Netlify production build, prerenders 28 routes
npm run build:node        # standalone Node/Express build
npm run serve:ssr         # serve the build on http://localhost:4000
npm test                  # unit tests (Vitest)
```

Set environment variables from `.env.example` (the server does not automatically load that file) and configure at least one lead destination before going live; without one the form refuses to accept requests and points people to phone and email.

## Where things live

| Path                                               | What                                                                                                             |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `src/app/core/data/`                               | Business facts (`business.ts`) and the product and service catalogue (`catalogue.ts`)                            |
| `src/app/core/enquiry/`                            | Shared enquiry validation, quote list store, API client                                                          |
| `src/server/`                                      | Lead delivery endpoint and redirect map                                                                          |
| `src/styles/`, `src/app/core/theme/`               | Design tokens, global styles, PrimeNG preset                                                                     |
| `src/app/ui/`, `src/app/layout/`, `src/app/pages/` | Components, shell and routes                                                                                     |
| `scripts/`                                         | SEO file generation, icon rendering, QA, end-to-end and accessibility checks                                     |
| `docs/`                                            | Discovery and routes, brand guide, leads and analytics, verification, dependencies and release plan, screenshots |

## QA scripts (against a running server)

```bash
node scripts/qa.mjs http://localhost:4000 qa-output      # every route, both themes, mobile and desktop, axe
node scripts/e2e-journey.mjs http://localhost:4000       # home to delivered lead
node scripts/a11y-interactions.mjs http://localhost:4000 # keyboard, focus, theme, motion
```

## Netlify deployment

See [docs/netlify-deployment.md](docs/netlify-deployment.md) for build settings, lead delivery configuration and launch checks.

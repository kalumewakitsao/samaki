# Deploy Samaki Express to Netlify

Import this repository into Netlify. If this app is part of a larger repository, set the base directory to the directory containing this project's package.json and netlify.toml.

- Build command: `npm run build`
- Publish directory: `dist/samaki/browser`
- Node: 22.22 or newer within Node 22 (configured in `.nvmrc` and `netlify.toml`)
- Functions: `netlify/functions`

The pinned Angular runtime in package-lock.json packages Angular SSR as an Edge Function. Known pages are prerendered; unknown pages retain the Angular 404 response. The edge handler passes `/api/*` through to the Express Netlify Function. Do not add a catch-all `/* /index.html 200` rewrite: it would obscure real 404s. Legacy redirects are generated during prebuild and also handled in the edge entry.

## Enable enquiry delivery

Set at least one channel in Netlify environment variables with **Functions** scope, then redeploy:

1. Webhook: `LEAD_WEBHOOK_URL`, plus optional `LEAD_WEBHOOK_SECRET` for signed requests.
2. Email: `RESEND_API_KEY`, `LEAD_EMAIL_TO`, and `LEAD_EMAIL_FROM` using a verified Resend sender.

Use production destinations only in the production context. For deploy previews, use a separate test destination or leave delivery unconfigured. Never commit credentials. With no channel configured, `/api/enquiries/status` returns `{"accepting":false}` and the forms offer phone/email instead of reporting a false success.

Leave `LEAD_STORE_FILE` unset on Netlify: local files do not provide durable storage. Store records in the webhook destination or CRM. Current rate limiting and duplicate detection are in-memory per function instance, not globally persistent; a shared store is needed if global guarantees are required.

## Verify before switching the domain

- Open `/services`, `/products/fingerlings`, and refresh each directly.
- Check `/home` redirects to `/`, and an unknown path returns HTTP 404.
- Check `/api/enquiries/status` returns JSON and the expected availability.
- With a test delivery destination configured, submit a quote and contact request and confirm receipt and reference numbers.
- Check mobile navigation and the quote list.

Connect `www.samakiexpress.co.ke` as the primary domain and redirect the apex domain to it when ready. SEO canonical URLs and sitemap already use this production domain. Do not switch DNS until the preview and delivery checks pass.

## Local commands

`npm start` retains the Express dev server/API on port 4200 through `src/server.node.ts`.

`npm run build:node && npm run serve:ssr` builds and serves the standalone Node version.

Use Netlify CLI 26 or later for `netlify build` and `netlify serve` to check the Netlify adapter locally. A real deployment is a separate step; these project changes do not publish the site.

References: [Angular on Netlify](https://docs.netlify.com/build/frameworks/framework-setup-guides/angular/) and [Express on Netlify](https://docs.netlify.com/build/frameworks/framework-setup-guides/express/).

## Dependency audit

The preparation audit found development-tool advisories in the existing Angular build worker (`piscina`) and Vitest dependencies. They are not included in the browser or enquiry function bundles. Plan a compatible build-tool update separately; do not use `npm audit fix --force`, which currently proposes an Angular downgrade.

import { PrerenderFallback, RenderMode, ServerRoute } from '@angular/ssr';
import { PRODUCTS, SERVICES } from './core/data/catalogue';

export const serverRoutes: ServerRoute[] = [
  ...['', 'products', 'services', 'quote', 'about', 'contact', 'faq', 'privacy'].map(
    (path): ServerRoute => ({ path, renderMode: RenderMode.Prerender }),
  ),
  {
    path: 'products/:slug',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Server,
    getPrerenderParams: async () => PRODUCTS.map((p) => ({ slug: p.slug })),
  },
  {
    path: 'services/:slug',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Server,
    getPrerenderParams: async () => SERVICES.map((s) => ({ slug: s.slug })),
  },
  // Unknown URLs render on the server so they can answer with a real 404 status.
  { path: '**', renderMode: RenderMode.Server },
];

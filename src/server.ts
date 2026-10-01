import { AngularAppEngine, createRequestHandler } from '@angular/ssr';
import {
  getAllowedHosts,
  getContext,
  getTrustProxyHeaders,
} from '@netlify/angular-runtime/app-engine.js';
import { REDIRECTS } from './server/redirects';

const engine = new AngularAppEngine({
  allowedHosts: [
    'www.samakiexpress.co.ke',
    'samakiexpress.co.ke',
    'localhost',
    '127.0.0.1',
    ...getAllowedHosts(),
  ],
  trustProxyHeaders: getTrustProxyHeaders(),
});

export async function netlifyAppEngineHandler(request: Request): Promise<Response> {
  const context = getContext();
  const url = new URL(request.url);
  // Edge rendering runs before Netlify rewrites. Pass API requests through to the Node function.
  if (url.pathname === '/api' || url.pathname.startsWith('/api/')) {
    return context ? context.next() : Response.json({ code: 'not_configured' }, { status: 503 });
  }
  if (request.method === 'GET' || request.method === 'HEAD') {
    const path = url.pathname.length > 1 ? url.pathname.replace(/\/+$/, '') : '/';
    const target = REDIRECTS[path.toLowerCase()] ?? (path !== url.pathname ? path : null);
    if (target)
      return new Response(null, { status: 301, headers: { location: target + url.search } });
  }
  const response =
    (await engine.handle(request, context)) ?? new Response('Not found', { status: 404 });
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-Frame-Options', 'DENY');
  return response;
}

export const reqHandler = createRequestHandler(netlifyAppEngineHandler);

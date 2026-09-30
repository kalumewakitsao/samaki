import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import { leadRouter } from './server/leads';
import { REDIRECTS } from './server/redirects';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use((_req, res, next) => {
  res.set({
    'x-content-type-options': 'nosniff',
    'referrer-policy': 'strict-origin-when-cross-origin',
    'x-frame-options': 'DENY',
    'permissions-policy': 'camera=(), microphone=(), geolocation=()',
  });
  next();
});

/** Permanent redirects for replaced URLs, and one canonical form without a trailing slash. */
app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next();
  const [path, query = ''] = req.originalUrl.split('?');
  const qs = query ? `?${query}` : '';
  const trimmed = path.length > 1 ? path.replace(/\/+$/, '') : path;
  const target = REDIRECTS[trimmed.toLowerCase()] ?? (trimmed !== path ? trimmed : null);
  if (target) return res.redirect(301, target + qs);
  next();
});

app.use('/api', leadRouter());
app.use('/api', (_req, res) => {
  res.status(404).json({ code: 'not_found' });
});

app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
    setHeaders(res, filePath) {
      // Hashed bundles are immutable; everything else is revalidated.
      if (!/-[A-Z0-9]{8}\.(js|css)$/.test(filePath) && !filePath.includes('/media/')) {
        res.setHeader('cache-control', 'public, max-age=3600');
      }
    },
  }),
);

app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }
    console.log(`Samaki Express listening on http://localhost:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);

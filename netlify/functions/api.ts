import express from 'express';
import serverless from 'serverless-http';
import { leadRouter } from '../../src/server/leads';

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use((_req, res, next) => {
  res.set('Cache-Control', 'no-store');
  res.set('X-Content-Type-Options', 'nosniff');
  next();
});
const router = leadRouter();
app.use('/api', router);
app.use('/.netlify/functions/api', router);
app.use((_req, res) => {
  res.status(404).json({ code: 'not_found' });
});
export const handler = serverless(app);

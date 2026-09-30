import { createHmac, randomBytes } from 'node:crypto';
import { appendFile } from 'node:fs/promises';
import type { Request, Response, Router } from 'express';
import express from 'express';
import {
  EnquiryPayload,
  LeadStatus,
  enquiryToText,
  looksAutomated,
  normalisePhone,
  sanitiseEnquiry,
  validateEnquiry,
} from '../app/core/enquiry/enquiry-schema';

/**
 * Lead delivery.
 *
 * An enquiry counts as delivered only when at least one operational channel
 * accepts it. Channels are configured with environment variables:
 *
 *   LEAD_WEBHOOK_URL      POST the lead as JSON (Google Apps Script, Zapier, Make, a CRM)
 *   LEAD_WEBHOOK_SECRET   optional, signs the body as X-Samaki-Signature: sha256=<hex>
 *   RESEND_API_KEY        send the lead by email through Resend
 *   LEAD_EMAIL_TO         inbox that receives leads
 *   LEAD_EMAIL_FROM       verified sender, e.g. "Samaki Express <leads@samakiexpress.co.ke>"
 *   LEAD_STORE_FILE       optional JSON Lines audit log of every lead and its status
 *
 * With no channel configured the endpoint answers 503 and the form offers
 * phone and email instead. It never reports success for an undelivered lead.
 */

export interface LeadRecord {
  reference: string;
  receivedAt: string;
  status: LeadStatus;
  statusHistory: { status: LeadStatus; at: string }[];
  enquiry: Omit<EnquiryPayload, 'website' | 'elapsedMs' | 'idempotencyKey'>;
}

interface Channel {
  name: string;
  send(record: LeadRecord): Promise<void>;
}

type Env = Record<string, string | undefined>;

const DEDUPE_WINDOW_MS = 24 * 60 * 60 * 1000;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 6;
const TIMEOUT_MS = 8000;

export function configuredChannels(env: Env, fetchImpl: typeof fetch = fetch): Channel[] {
  const channels: Channel[] = [];
  const webhook = env['LEAD_WEBHOOK_URL'];
  if (webhook) {
    channels.push({
      name: 'webhook',
      async send(record) {
        const body = JSON.stringify(record);
        const headers: Record<string, string> = { 'content-type': 'application/json' };
        const secret = env['LEAD_WEBHOOK_SECRET'];
        if (secret) headers['x-samaki-signature'] = `sha256=${createHmac('sha256', secret).update(body).digest('hex')}`;
        const res = await fetchImpl(webhook, { method: 'POST', headers, body, signal: AbortSignal.timeout(TIMEOUT_MS) });
        if (!res.ok) throw new Error(`webhook responded ${res.status}`);
      },
    });
  }
  const key = env['RESEND_API_KEY'];
  const to = env['LEAD_EMAIL_TO'];
  const from = env['LEAD_EMAIL_FROM'];
  if (key && to && from) {
    channels.push({
      name: 'email',
      async send(record) {
        const e = record.enquiry;
        const subject = `${e.type === 'quote' ? 'Quote request' : 'Enquiry'} ${record.reference}: ${e.name}${e.location ? `, ${e.location}` : ''}`;
        const res = await fetchImpl('https://api.resend.com/emails', {
          method: 'POST',
          headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
          body: JSON.stringify({
            from,
            to: to.split(',').map((s) => s.trim()),
            reply_to: e.email || undefined,
            subject,
            text: `${enquiryToText({ ...e, website: '', elapsedMs: 0, idempotencyKey: '' }, record.reference)}\n\nReceived: ${record.receivedAt}\nSent from: ${e.sourcePath}`,
          }),
          signal: AbortSignal.timeout(TIMEOUT_MS),
        });
        if (!res.ok) throw new Error(`email provider responded ${res.status}`);
      },
    });
  }
  return channels;
}

export function newReference(now = new Date()): string {
  const d = now.toISOString().slice(2, 10).replace(/-/g, '');
  const r = randomBytes(3).toString('hex').toUpperCase();
  return `SX-${d}-${r}`;
}

export interface LeadRouterOptions {
  env?: Env;
  fetchImpl?: typeof fetch;
  now?: () => Date;
  log?: (msg: string) => void;
}

export function leadRouter(options: LeadRouterOptions = {}): Router {
  const env = options.env ?? process.env;
  const now = options.now ?? (() => new Date());
  const log = options.log ?? ((m: string) => console.log(m));
  const channels = configuredChannels(env, options.fetchImpl);
  const seen = new Map<string, { reference: string; at: number }>();
  const hits = new Map<string, number[]>();

  const router = express.Router();
  router.use(express.json({ limit: '20kb' }));

  router.get('/enquiries/status', (_req, res) => {
    res.set('cache-control', 'no-store').json({ accepting: channels.length > 0 });
  });

  router.post('/enquiries', async (req: Request, res: Response) => {
    res.set('cache-control', 'no-store');
    const t = now().getTime();

    const ip = req.ip ?? 'unknown';
    const recent = (hits.get(ip) ?? []).filter((at) => t - at < RATE_WINDOW_MS);
    if (recent.length >= RATE_MAX) {
      res.status(429).json({ code: 'rate_limited', message: 'You have sent several requests in a short time. Please wait a few minutes, or call us.' });
      return;
    }
    recent.push(t);
    hits.set(ip, recent);

    const payload = sanitiseEnquiry(req.body);
    if (!payload.idempotencyKey) {
      res.status(400).json({ code: 'bad_request', message: 'Please reload the page and try again.' });
      return;
    }

    for (const [k, v] of seen) if (t - v.at > DEDUPE_WINDOW_MS) seen.delete(k);
    const previous = seen.get(payload.idempotencyKey);
    if (previous) {
      res.status(200).json({ reference: previous.reference, duplicate: true });
      return;
    }

    if (payload.website) {
      // A hidden field was filled in: a bot. Answer like a success so it moves on, deliver nothing.
      log(`[leads] honeypot triggered from ${ip}`);
      res.status(201).json({ reference: newReference(now()) });
      return;
    }
    if (looksAutomated(payload)) {
      res.status(400).json({ code: 'too_fast', message: 'That was quicker than we expected. Please check your details and send again.' });
      return;
    }

    const errors = validateEnquiry(payload);
    if (Object.keys(errors).length) {
      res.status(422).json({ code: 'invalid', errors });
      return;
    }

    if (channels.length === 0) {
      res.status(503).json({ code: 'not_configured', message: 'Online requests are unavailable right now.' });
      return;
    }

    const receivedAt = now().toISOString();
    const { website: _w, elapsedMs: _e, idempotencyKey: _k, ...enquiry } = payload;
    const record: LeadRecord = {
      reference: newReference(now()),
      receivedAt,
      status: 'received',
      statusHistory: [{ status: 'received', at: receivedAt }],
      enquiry: { ...enquiry, phone: normalisePhone(enquiry.phone) },
    };

    const results = await Promise.allSettled(channels.map((c) => c.send(record)));
    const delivered = channels.filter((_, i) => results[i].status === 'fulfilled').map((c) => c.name);
    results.forEach((r, i) => {
      if (r.status === 'rejected') log(`[leads] ${channels[i].name} failed for ${record.reference}: ${String(r.reason)}`);
    });

    if (env['LEAD_STORE_FILE']) {
      await appendFile(env['LEAD_STORE_FILE'], JSON.stringify({ ...record, deliveredVia: delivered }) + '\n').catch((err) =>
        log(`[leads] could not write store: ${String(err)}`),
      );
    }

    if (delivered.length === 0) {
      res.status(502).json({ code: 'delivery_failed', message: 'We could not send your request just now.' });
      return;
    }

    seen.set(payload.idempotencyKey, { reference: record.reference, at: t });
    log(`[leads] ${record.reference} delivered via ${delivered.join(', ')}`);
    res.status(201).json({ reference: record.reference });
  });

  return router;
}

import express from 'express';
import type { AddressInfo } from 'node:net';
import { leadRouter } from './leads';

const body = (over: Record<string, unknown> = {}) => ({
  type: 'quote',
  items: [{ slug: 'artemia', name: 'Artemia', quantity: '2 kg' }],
  location: 'Kisumu',
  name: 'Achieng',
  phone: '0712345678',
  contactMethod: 'phone',
  idempotencyKey: 'key-1',
  website: '',
  elapsedMs: 8000,
  ...over,
});

async function start(env: Record<string, string>, fetchImpl?: typeof fetch) {
  const app = express();
  app.use('/api', leadRouter({ env, fetchImpl, log: () => {} }));
  const server = app.listen(0);
  await new Promise((r) => server.once('listening', r));
  const url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api`;
  const post = (b: unknown) =>
    fetch(`${url}/enquiries`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(b),
    });
  return { url, post, close: () => server.close() };
}

describe('lead endpoint', () => {
  it('answers 503 and delivers nothing when no destination is configured', async () => {
    const s = await start({});
    const res = await s.post(body());
    expect(res.status).toBe(503);
    expect((await (await fetch(`${s.url}/enquiries/status`)).json()).accepting).toBe(false);
    s.close();
  });

  it('delivers to the webhook, signs it, and dedupes retries', async () => {
    const calls: { url: string; init: RequestInit }[] = [];
    const fake = (async (url: string, init: RequestInit) => {
      calls.push({ url, init });
      return new Response('{}', { status: 200 });
    }) as unknown as typeof fetch;
    const s = await start(
      { LEAD_WEBHOOK_URL: 'https://hooks.example/lead', LEAD_WEBHOOK_SECRET: 's' },
      fake,
    );
    const first = await s.post(body());
    expect(first.status).toBe(201);
    const { reference } = await first.json();
    expect(reference).toMatch(/^SX-\d{6}-[0-9A-F]{6}$/);
    const lead = JSON.parse(String(calls[0].init.body));
    expect(lead.status).toBe('received');
    expect(lead.enquiry.phone).toBe('+254712345678');
    expect(lead.enquiry.website).toBeUndefined();
    expect((calls[0].init.headers as Record<string, string>)['x-samaki-signature']).toMatch(
      /^sha256=/,
    );

    const retry = await s.post(body());
    expect(retry.status).toBe(200);
    expect((await retry.json()).reference).toBe(reference);
    expect(calls.length).toBe(1);
    s.close();
  });

  it('reports failure when every channel fails', async () => {
    const failing = (async () => new Response('', { status: 500 })) as unknown as typeof fetch;
    const s = await start({ LEAD_WEBHOOK_URL: 'https://hooks.example/lead' }, failing);
    expect((await s.post(body())).status).toBe(502);
    s.close();
  });

  it('rejects invalid, automated and honeypot submissions without delivering', async () => {
    let delivered = 0;
    const fake = (async () => {
      delivered++;
      return new Response('{}');
    }) as unknown as typeof fetch;
    const s = await start({ LEAD_WEBHOOK_URL: 'https://hooks.example/lead' }, fake);
    expect((await s.post(body({ idempotencyKey: 'a', phone: '' }))).status).toBe(422);
    expect((await s.post(body({ idempotencyKey: 'b', elapsedMs: 100 }))).status).toBe(400);
    expect((await s.post(body({ idempotencyKey: 'c', website: 'x' }))).status).toBe(201);
    expect(delivered).toBe(0);
    s.close();
  });

  it('rate limits bursts from one address', async () => {
    const fake = (async () => new Response('{}')) as unknown as typeof fetch;
    const s = await start({ LEAD_WEBHOOK_URL: 'https://hooks.example/lead' }, fake);
    const statuses = [];
    for (let i = 0; i < 8; i++)
      statuses.push((await s.post(body({ idempotencyKey: `r${i}` }))).status);
    expect(statuses.slice(0, 6).every((x) => x === 201)).toBe(true);
    expect(statuses[7]).toBe(429);
    s.close();
  });
});

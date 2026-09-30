import { EnquiryPayload, enquiryToText, looksAutomated, normalisePhone, sanitiseEnquiry, validateEnquiry } from './enquiry-schema';

const valid = (over: Partial<EnquiryPayload> = {}): EnquiryPayload => ({
  ...sanitiseEnquiry({
    type: 'quote',
    items: [{ slug: 'artemia', name: 'Artemia', quantity: '2 kg' }],
    location: 'Kisumu',
    name: 'Achieng',
    phone: '0712 345 678',
    idempotencyKey: 'abc',
    elapsedMs: 5000,
  }),
  ...over,
});

describe('enquiry schema', () => {
  it('accepts a complete quote request', () => {
    expect(validateEnquiry(valid())).toEqual({});
  });

  it('requires items and a location for quotes, and a message for general enquiries', () => {
    const e = validateEnquiry(valid({ items: [], location: '' }));
    expect(e.items).toBeTruthy();
    expect(e.location).toBeTruthy();
    const g = validateEnquiry(valid({ type: 'general', items: [], location: '', message: '' }));
    expect(g.message).toBeTruthy();
    expect(g.items).toBeUndefined();
  });

  it('checks phone and email formats', () => {
    expect(validateEnquiry(valid({ phone: '123' })).phone).toContain('0712');
    expect(validateEnquiry(valid({ email: 'nope' })).email).toBeTruthy();
    expect(validateEnquiry(valid({ contactMethod: 'email', email: '' })).email).toBeTruthy();
    expect(validateEnquiry(valid({ phone: '+254 712 345 678', email: 'a@b.co' }))).toEqual({});
  });

  it('sanitises unknown input to safe types and lengths', () => {
    const p = sanitiseEnquiry({ name: 'x'.repeat(500), items: [{ slug: 'Bad Slug!<>', name: 1 }], contactMethod: 'fax', farmType: 'moon' });
    expect(p.name.length).toBe(80);
    expect(p.items[0].slug).toBe('adlug');
    expect(p.contactMethod).toBe('phone');
    expect(p.farmType).toBe('');
    expect(sanitiseEnquiry(null).type).toBe('quote');
  });

  it('flags honeypot and too-fast submissions', () => {
    expect(looksAutomated(valid({ website: 'spam' }))).toBe(true);
    expect(looksAutomated(valid({ elapsedMs: 300 }))).toBe(true);
    expect(looksAutomated(valid())).toBe(false);
  });

  it('normalises Kenyan phone numbers', () => {
    expect(normalisePhone('0712 345 678')).toBe('+254712345678');
    expect(normalisePhone('254712345678')).toBe('+254712345678');
    expect(normalisePhone('+44 20 7946 0000')).toBe('+442079460000');
  });

  it('summarises an enquiry as plain text', () => {
    const text = enquiryToText(valid(), 'SX-1');
    expect(text).toContain('Reference: SX-1');
    expect(text).toContain('Artemia: 2 kg');
    expect(text).toContain('Marketing consent: no');
  });
});

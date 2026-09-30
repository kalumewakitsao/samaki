/**
 * Enquiry contract shared by the browser form and the server endpoint, so both
 * sides validate with the same rules. No runtime imports: the server bundle and
 * unit tests use this file directly.
 */

export type EnquiryType = 'quote' | 'general';
export type ContactMethod = 'phone' | 'whatsapp' | 'email';
export type FarmType = 'pond' | 'cage' | 'tank' | 'hatchery' | 'new' | 'other';

export interface EnquiryItem {
  slug: string;
  name: string;
  quantity: string;
}

export interface EnquiryPayload {
  type: EnquiryType;
  items: EnquiryItem[];
  farmType: FarmType | '';
  location: string;
  name: string;
  phone: string;
  email: string;
  contactMethod: ContactMethod;
  message: string;
  marketingConsent: boolean;
  /** Generated once per form, reused on retries so the server can drop duplicates. */
  idempotencyKey: string;
  /** Honeypot. Real people never see or fill this field. */
  website: string;
  /** Milliseconds between the form being shown and submitted. */
  elapsedMs: number;
  /** The page the enquiry was sent from. */
  sourcePath: string;
}

export type LeadStatus = 'received' | 'acknowledged' | 'qualified' | 'quoted' | 'won' | 'closed';

export const LEAD_STATUSES: readonly LeadStatus[] = [
  'received',
  'acknowledged',
  'qualified',
  'quoted',
  'won',
  'closed',
];

export const FARM_TYPES: readonly { value: FarmType; label: string }[] = [
  { value: 'pond', label: 'Pond farm' },
  { value: 'cage', label: 'Cage farm' },
  { value: 'tank', label: 'Tanks or recirculating system' },
  { value: 'hatchery', label: 'Hatchery' },
  { value: 'new', label: 'Planning a new farm' },
  { value: 'other', label: 'Something else' },
];

export const LIMITS = {
  name: 80,
  phone: 20,
  email: 120,
  location: 80,
  message: 1500,
  quantity: 60,
  items: 20,
  /** Submissions faster than this are treated as automated. */
  minElapsedMs: 2500,
} as const;

export type FieldErrors = Partial<Record<'items' | 'location' | 'name' | 'phone' | 'email' | 'message' | 'contactMethod' | 'form', string>>;

const PHONE_RE = /^\+?[0-9][0-9\s-]{7,18}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidPhone(value: string): boolean {
  return PHONE_RE.test(value.trim()) && value.replace(/\D/g, '').length >= 9;
}

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

/** Normalises Kenyan numbers to +254 format; leaves other international numbers alone. */
export function normalisePhone(value: string): string {
  const digits = value.replace(/[^\d+]/g, '');
  if (/^0[17]\d{8}$/.test(digits)) return `+254${digits.slice(1)}`;
  if (/^254\d{9}$/.test(digits)) return `+${digits}`;
  return digits;
}

function text(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

/** Coerces unknown input into a payload with safe types and lengths. */
export function sanitiseEnquiry(input: unknown): EnquiryPayload {
  const raw = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>;
  const items = Array.isArray(raw['items']) ? raw['items'] : [];
  const type = raw['type'] === 'general' ? 'general' : 'quote';
  const contact = raw['contactMethod'];
  const farm = raw['farmType'];
  return {
    type,
    items: items.slice(0, LIMITS.items).map((i) => {
      const item = (i && typeof i === 'object' ? i : {}) as Record<string, unknown>;
      return {
        slug: text(item['slug'], 80).replace(/[^a-z0-9-]/g, ''),
        name: text(item['name'], 80),
        quantity: text(item['quantity'], LIMITS.quantity),
      };
    }),
    farmType: FARM_TYPES.some((f) => f.value === farm) ? (farm as FarmType) : '',
    location: text(raw['location'], LIMITS.location),
    name: text(raw['name'], LIMITS.name),
    phone: text(raw['phone'], LIMITS.phone),
    email: text(raw['email'], LIMITS.email),
    contactMethod: contact === 'whatsapp' || contact === 'email' ? contact : 'phone',
    message: text(raw['message'], LIMITS.message),
    marketingConsent: raw['marketingConsent'] === true,
    idempotencyKey: text(raw['idempotencyKey'], 64).replace(/[^a-zA-Z0-9-]/g, ''),
    website: text(raw['website'], 200),
    elapsedMs: typeof raw['elapsedMs'] === 'number' && Number.isFinite(raw['elapsedMs']) ? raw['elapsedMs'] : 0,
    sourcePath: text(raw['sourcePath'], 200),
  };
}

/** Returns field errors written for the person filling in the form. Empty when valid. */
export function validateEnquiry(p: EnquiryPayload): FieldErrors {
  const errors: FieldErrors = {};
  if (p.type === 'quote') {
    if (p.items.length === 0) errors.items = 'Add at least one product or service you would like a quote for.';
    if (!p.location) errors.location = 'Tell us your town or county so we can check delivery.';
  } else if (!p.message) {
    errors.message = 'Tell us how we can help.';
  }
  if (!p.name) errors.name = 'Enter your name.';
  if (!p.phone) errors.phone = 'Enter a phone number so we can reach you.';
  else if (!isValidPhone(p.phone)) errors.phone = 'Enter a phone number like 0712 345 678 or +254 712 345 678.';
  if (p.email && !isValidEmail(p.email)) errors.email = 'Enter an email address like name@example.com, or leave it empty.';
  if (p.contactMethod === 'email' && !p.email) errors.email = 'Add your email address, or choose another way for us to contact you.';
  return errors;
}

export function looksAutomated(p: EnquiryPayload): boolean {
  return p.website.length > 0 || p.elapsedMs < LIMITS.minElapsedMs;
}

/** Plain-text summary used for email bodies and mailto fallbacks. */
export function enquiryToText(p: EnquiryPayload, reference?: string): string {
  const lines = [
    reference ? `Reference: ${reference}` : '',
    `Type: ${p.type === 'quote' ? 'Quote request' : 'General enquiry'}`,
    p.items.length ? 'Items:' : '',
    ...p.items.map((i) => `  - ${i.name}${i.quantity ? `: ${i.quantity}` : ''}`),
    p.farmType ? `Farm: ${FARM_TYPES.find((f) => f.value === p.farmType)?.label}` : '',
    p.location ? `Location: ${p.location}` : '',
    `Name: ${p.name}`,
    `Phone: ${p.phone}`,
    p.email ? `Email: ${p.email}` : '',
    `Preferred contact: ${p.contactMethod}`,
    p.message ? `Message: ${p.message}` : '',
    `Marketing consent: ${p.marketingConsent ? 'yes' : 'no'}`,
  ];
  return lines.filter(Boolean).join('\n');
}

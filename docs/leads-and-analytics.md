# Lead capture and analytics

## How an enquiry travels

1. The visitor builds a **quote list** (stored on their device) from product and service pages, then completes the quote form: items with quantities, town or county, optional farm type, name, phone, optional email, preferred contact method, optional message, and an optional, separate tick-box for marketing tips. The contact page uses the same form in "general" mode (message required, no items).
2. The browser validates with the same rules the server uses (`src/app/core/enquiry/enquiry-schema.ts`), shows an error summary linked to each field, and keeps inputs in session storage so a reload or failure never loses them.
3. `POST /api/enquiries` (in `src/server/leads.ts`) sanitises and validates again, then:
   - rejects bursts (6 per 10 minutes per IP, answered 429),
   - drops bots silently (hidden honeypot field) and asks too-fast submissions (under 2.5 s) to resend,
   - de-duplicates retries by an idempotency key generated once per form (same reference returned for 24 hours),
   - delivers to every configured channel and answers **201 with a reference** (for example `SX-260930-9F187A`) only if at least one channel accepted the lead.
4. Nothing configured: 503 and the form says nothing was sent, then offers a pre-filled email, phone, and WhatsApp when enabled. All channels failing: 502 with the same fallbacks. The site never shows success for an undelivered lead.

## Configure delivery

Set on the Node server (see `.env.example`):

| Variable | Purpose |
|---|---|
| `LEAD_WEBHOOK_URL` | POST each lead as JSON: a Google Apps Script bound to a Sheet, Zapier, Make or a CRM endpoint |
| `LEAD_WEBHOOK_SECRET` | Optional HMAC-SHA256 signature in `X-Samaki-Signature: sha256=<hex>` |
| `RESEND_API_KEY`, `LEAD_EMAIL_TO`, `LEAD_EMAIL_FROM` | Email each lead through Resend; reply-to is the customer's email when given |
| `LEAD_STORE_FILE` | Optional JSON Lines audit file on the server |

**Recommended for Samaki Express today**: a Google Sheet via Apps Script webhook (free, shared with the team, one row per lead) plus email to samakiexpresske@gmail.com. Both need an account owner to set up; neither is connected yet.

### Lead record and status

```json
{
  "reference": "SX-260930-9F187A",
  "receivedAt": "2026-09-30T11:37:10.201Z",
  "status": "received",
  "statusHistory": [{ "status": "received", "at": "2026-09-30T11:37:10.201Z" }],
  "enquiry": { "type": "quote", "items": [{ "slug": "fingerlings", "name": "Fingerlings", "quantity": "3,000" }],
    "farmType": "", "location": "Kisumu", "name": "…", "phone": "+254712345678", "email": "",
    "contactMethod": "phone", "message": "", "marketingConsent": false, "sourcePath": "/quote" }
}
```

Status progression: `received → acknowledged → qualified → quoted → won | closed`. The site sets `received`; the team moves the rest in the Sheet or CRM (a status column with those values). No admin screen is built, because a spreadsheet or CRM already does this better for a team this size.

## Analytics

Provider-agnostic, cookie-free, and off until configured (`src/app/core/site-config.ts`, Plausible supported). Events carry no personal data: only slugs, paths, channels and counts. Every event is also dispatched as a `samaki:analytics` DOM event, which the end-to-end test records.

| Event | When | Properties |
|---|---|---|
| `offering_view` | Product or service page viewed | `offering`, `kind` |
| `cta_click` | Any quote CTA | `cta`, `page`, `offering` |
| `quote_list_add` / `quote_list_remove` | Item added or removed | `offering` |
| `catalogue_filter` / `catalogue_search` | Category chip or search used | `category` / `results` |
| `enquiry_start` | First edit of a form | `type` |
| `enquiry_submit` | Send pressed with valid input | `type`, `items` |
| `enquiry_success` | Server confirmed delivery | `type`, `items`, `contact` |
| `enquiry_error` | Validation or delivery failure | `type`, `reason` |
| `contact_click` | Phone, email, WhatsApp or map link | `channel`, `page` |
| `theme_change` | Theme switched | `theme` |

### Baseline measurement plan

Funnel: sessions → `offering_view` → `quote_list_add` or `cta_click` → `enquiry_start` → `enquiry_submit` → `enquiry_success`, plus `contact_click` as a parallel conversion. Record four weeks of baseline once analytics is on, then review monthly: enquiry conversion rate (successes per session), start-to-success completion, error reasons, and the share of phone versus form leads. Tie `won` leads in the Sheet back to the site reference to report real sales. No conversion results are reported here because none have been measured yet.

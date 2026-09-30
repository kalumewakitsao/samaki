/**
 * Business facts shown across the site.
 *
 * Every value here was read from the live site (www.samakiexpress.co.ke) on
 * 2026-09-30. Anything not yet confirmed by Samaki Express is switched off
 * rather than guessed. See docs/business-dependencies.md before changing a flag.
 */
export const BUSINESS = {
  legalName: 'Samaki Express EA Ltd',
  name: 'Samaki Express',
  siteUrl: 'https://www.samakiexpress.co.ke',
  tagline: 'Fingerlings, feeds and farm support for fish farmers in East Africa',
  phone: {
    display: '0704 944 034',
    tel: '+254704944034',
  },
  email: 'samakiexpresske@gmail.com',
  /** The address split at the @, so long lines can wrap there instead of mid-word. */
  emailParts: ['samakiexpresske', 'gmail.com'] as const,
  address: {
    street: 'Kairo, Waiyaki Way, next to Nairobi School',
    locality: 'Nairobi',
    country: 'KE',
    countryName: 'Kenya',
    mapsUrl: 'https://maps.google.com/?q=Kairo%20Waiyaki%20Way%20Nairobi',
  },
  hours: {
    display: 'Monday to Friday, 9:00 am to 6:00 pm',
    short: 'Mon to Fri, 9 am to 6 pm',
    schema: ['Mo-Fr 09:00-18:00'],
    /** Machine-readable version of the hours above, in Nairobi time (UTC+3, no daylight saving). */
    days: [1, 2, 3, 4, 5],
    opensHour: 9,
    closesHour: 18,
    utcOffsetHours: 3,
  },
  /**
   * WhatsApp is off until Samaki Express confirms which number answers
   * WhatsApp messages. Set `enabled: true` and the number (digits only,
   * international format) to show WhatsApp actions everywhere.
   */
  whatsapp: {
    enabled: false,
    number: '254704944034',
  },
} as const;

export function whatsappLink(text: string): string | null {
  if (!BUSINESS.whatsapp.enabled) return null;
  return `https://wa.me/${BUSINESS.whatsapp.number}?text=${encodeURIComponent(text)}`;
}

export function mailtoLink(subject: string, body = ''): string {
  const params = new URLSearchParams({ subject, body });
  return `mailto:${BUSINESS.email}?${params.toString().replace(/\+/g, '%20')}`;
}

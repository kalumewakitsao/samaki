import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { SITE_CONFIG } from '../site-config';

/**
 * Privacy-conscious funnel analytics. No cookies and no personal data: event
 * properties carry offering slugs, page paths and channels only, never names,
 * phone numbers or messages. Events go to Plausible when configured, and are
 * always dispatched as a DOM event so tests and tag managers can observe them.
 * The event catalogue is documented in docs/analytics.md.
 */
export type AnalyticsEvent =
  | 'offering_view'
  | 'cta_click'
  | 'quote_list_add'
  | 'quote_list_remove'
  | 'catalogue_filter'
  | 'catalogue_search'
  | 'enquiry_start'
  | 'enquiry_submit'
  | 'enquiry_success'
  | 'enquiry_error'
  | 'contact_click'
  | 'theme_change';

type Props = Record<string, string | number | boolean>;

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Props }) => void;
  }
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private loaded = false;

  track(event: AnalyticsEvent, props: Props = {}): void {
    if (!this.browser) return;
    this.ensureProvider();
    window.dispatchEvent(new CustomEvent('samaki:analytics', { detail: { event, props } }));
    window.plausible?.(event, { props });
  }

  private ensureProvider(): void {
    if (this.loaded) return;
    this.loaded = true;
    const { provider, domain, scriptUrl } = SITE_CONFIG.analytics;
    if (provider !== 'plausible' || !domain) return;
    window.plausible =
      window.plausible ??
      function (...args: unknown[]) {
        ((window.plausible as unknown as { q?: unknown[] }).q ??= []).push(args);
      };
    const s = document.createElement('script');
    s.defer = true;
    s.dataset['domain'] = domain;
    s.src = scriptUrl;
    document.head.appendChild(s);
  }
}

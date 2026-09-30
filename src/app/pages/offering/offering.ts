import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, PLATFORM_ID, RESPONSE_INIT, computed, effect, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BUSINESS, mailtoLink, whatsappLink } from '../../core/data/business';
import { IllustrationId, Offering, findCategory, findOffering, offeringArt, findProduct, findService, offeringUrl } from '../../core/data/catalogue';
import { QuoteListStore } from '../../core/enquiry/quote-list.store';
import { AnalyticsService } from '../../core/services/analytics.service';
import { SeoService, breadcrumbJsonLd } from '../../core/services/seo.service';
import { Breadcrumbs, Crumb } from '../../ui/breadcrumbs';
import { CtaBand } from '../../ui/cta-band';
import { Icon } from '../../ui/icon';
import { Illustration } from '../../ui/illustration';
import { OfferingCard } from '../../ui/offering-card';

/** Detail page for one product (/products/:slug) or service (/services/:slug). */
@Component({
  selector: 'sx-offering',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Breadcrumbs, CtaBand, Icon, Illustration, OfferingCard],
  templateUrl: './offering.html',
  styleUrl: './offering.scss',
})
export class OfferingPage {
  readonly slug = input.required<string>();
  readonly kind = input.required<'product' | 'service'>();

  private readonly seo = inject(SeoService);
  private readonly router = inject(Router);
  private readonly response = inject(RESPONSE_INIT, { optional: true });
  protected readonly list = inject(QuoteListStore);
  protected readonly analytics = inject(AnalyticsService);
  protected readonly business = BUSINESS;

  protected readonly item = computed<Offering | undefined>(() =>
    this.kind() === 'product' ? findProduct(this.slug()) : findService(this.slug()),
  );
  protected readonly inList = computed(() => this.list.items().some((i) => i.slug === this.slug()));
  protected readonly section = computed(() =>
    this.kind() === 'product' ? { label: 'Products', path: '/products' } : { label: 'Services', path: '/services' },
  );
  protected readonly trail = computed<Crumb[]>(() => [
    { label: 'Home', path: '/' },
    this.section(),
    { label: this.item()?.name ?? 'Not found' },
  ]);
  protected readonly art = computed<IllustrationId>(() => {
    const o = this.item();
    if (!o) return 'water';
    return offeringArt(o);
  });
  protected readonly tag = computed(() => {
    const o = this.item();
    return o?.kind === 'product' ? findCategory(o.category).name : 'Farm service';
  });
  protected readonly related = computed(() =>
    (this.item()?.related ?? []).map((s) => findOffering(s)).filter((o): o is Offering => !!o),
  );
  protected readonly askEmail = computed(() => mailtoLink(`Question about ${this.item()?.name ?? ''}`));
  protected readonly askWhatsapp = computed(() => whatsappLink(`Hello Samaki Express, I have a question about ${this.item()?.name ?? ''}.`));

  constructor() {
    const browser = isPlatformBrowser(inject(PLATFORM_ID));
    effect(() => {
      const o = this.item();
      if (!o) {
        if (this.response) this.response.status = 404;
        this.seo.set({ title: 'Page not found', description: 'This page does not exist.', path: this.router.url, noindex: true });
        return;
      }
      const path = offeringUrl(o);
      this.seo.set({
        title: o.kind === 'product' ? `${o.name}: request a quote` : o.name,
        description: `${o.summary} Request a quote from Samaki Express in Nairobi.`,
        path,
        jsonLd: [
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: this.section().label, path: this.section().path },
            { name: o.name, path },
          ]),
          o.kind === 'service'
            ? {
                '@context': 'https://schema.org',
                '@type': 'Service',
                name: o.name,
                description: o.summary,
                provider: { '@id': `${BUSINESS.siteUrl}/#business` },
                url: `${BUSINESS.siteUrl}${path}`,
              }
            : {
                '@context': 'https://schema.org',
                '@type': 'Thing',
                name: o.name,
                description: o.summary,
                url: `${BUSINESS.siteUrl}${path}`,
              },
        ],
      });
      if (browser) this.analytics.track('offering_view', { offering: o.slug, kind: o.kind });
    });
  }

  requestQuote(): void {
    const o = this.item();
    if (!o) return;
    this.list.add(o.slug);
    this.analytics.track('cta_click', { cta: 'offering_quote', offering: o.slug });
    this.router.navigate(['/quote']);
  }

  toggleList(): void {
    const o = this.item();
    if (!o) return;
    if (this.inList()) this.list.remove(o.slug);
    else this.list.add(o.slug);
  }
}

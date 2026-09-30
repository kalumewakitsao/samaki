import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, PLATFORM_ID, inject, input } from '@angular/core';
import { BUSINESS, whatsappLink } from '../../core/data/business';
import { findOffering } from '../../core/data/catalogue';
import { QuoteListStore } from '../../core/enquiry/quote-list.store';
import { AnalyticsService } from '../../core/services/analytics.service';
import { SeoService } from '../../core/services/seo.service';
import { Breadcrumbs } from '../../ui/breadcrumbs';
import { EnquiryForm } from '../../ui/enquiry-form/enquiry-form';
import { Icon } from '../../ui/icon';

@Component({
  selector: 'sx-quote',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Breadcrumbs, EnquiryForm, Icon],
  template: `
    <section class="head">
      <div class="container">
        <sx-breadcrumbs [trail]="[{ label: 'Home', path: '/' }, { label: 'Request a quote' }]" />
        <div class="intro">
          <h1 class="h1">Request a quote</h1>
          <p class="lead">Tell us what you need and where you are. We confirm price, availability and delivery with you. Nothing is final until you agree.</p>
        </div>
      </div>
    </section>
    <section class="body">
      <div class="container layout">
        <div class="panel">
          <sx-enquiry-form type="quote" />
        </div>
        <aside class="aside" aria-label="About your request">
          <div class="box">
            <h2 class="h3">What happens next</h2>
            <ol class="steps" role="list">
              <li><span>1</span><p>Our team reviews your request.</p></li>
              <li><span>2</span><p>We contact you during business hours to confirm quantities, price and delivery.</p></li>
              <li><span>3</span><p>Once you agree, we arrange delivery or a farm visit.</p></li>
            </ol>
          </div>
          <div class="box">
            <h2 class="h3">Prefer to talk?</h2>
            <ul class="contact" role="list">
              <li><sx-icon name="phone" /><a [href]="'tel:' + business.phone.tel" (click)="analytics.track('contact_click', { channel: 'phone', page: 'quote' })">{{ business.phone.display }}</a></li>
              @if (whatsapp) {
                <li><sx-icon name="chat" /><a [href]="whatsapp" target="_blank" rel="noopener" (click)="analytics.track('contact_click', { channel: 'whatsapp', page: 'quote' })">WhatsApp us</a></li>
              }
              <li><sx-icon name="mail" /><a [href]="'mailto:' + business.email" (click)="analytics.track('contact_click', { channel: 'email', page: 'quote' })">{{ business.email }}</a></li>
              <li><sx-icon name="clock" /><span>{{ business.hours.display }}</span></li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  `,
  styles: `
    .head { padding-block: var(--s-6) var(--s-8); }
    .intro { display: grid; gap: var(--s-4); margin-top: var(--s-6); max-width: 44rem; }
    .body { padding-bottom: var(--section-y); }
    .layout { display: grid; gap: var(--s-8); align-items: start; }
    @media (min-width: 62rem) { .layout { grid-template-columns: minmax(0, 1.7fr) minmax(0, 1fr); } }
    .panel { padding: clamp(1.25rem, 0.8rem + 2vw, 2.5rem); border-radius: var(--r-xl); background: var(--c-surface); border: 1px solid var(--c-line); box-shadow: var(--shadow-2); }
    .aside { display: grid; gap: var(--s-4); }
    @media (min-width: 62rem) { .aside { position: sticky; top: 6rem; } }
    .box { display: grid; gap: var(--s-4); padding: var(--s-6); border-radius: var(--r-lg); border: 1px solid var(--c-line); background: var(--c-bg-tint); }
    .steps { display: grid; gap: var(--s-4); list-style: none; padding: 0; }
    .steps li { display: grid; grid-template-columns: 1.75rem 1fr; gap: var(--s-3); color: var(--c-ink-2); }
    .steps span { display: grid; place-items: center; width: 1.75rem; height: 1.75rem; border-radius: var(--r-pill); background: var(--c-brand-soft); color: var(--c-brand-soft-ink); font-weight: 700; font-size: var(--fs-sm); }
    .contact { display: grid; gap: var(--s-2); list-style: none; padding: 0; }
    .contact li { display: grid; grid-template-columns: 1.25rem 1fr; gap: var(--s-3); align-items: center; min-height: var(--tap); }
    .contact sx-icon { width: 1.1rem; height: 1.1rem; color: var(--c-brand-text); }
    .contact a { font-weight: 600; overflow-wrap: anywhere; }
  `,
})
export class QuotePage {
  /** Optional ?item=slug adds an offering to the quote list, for links from outside the site. */
  readonly item = input<string>();
  protected readonly business = BUSINESS;
  protected readonly whatsapp = whatsappLink('Hello Samaki Express, I would like a quote for ');
  protected readonly analytics = inject(AnalyticsService);
  private readonly list = inject(QuoteListStore);

  constructor() {
    inject(SeoService).set({
      title: 'Request a quote',
      description: 'Request a quote for fingerlings, hatchery inputs, water testing, aeration equipment or a farm visit. We confirm price, availability and delivery with you.',
      path: '/quote',
    });
    if (isPlatformBrowser(inject(PLATFORM_ID))) {
      queueMicrotask(() => {
        const slug = this.item();
        if (slug && findOffering(slug)) this.list.add(slug);
      });
    }
  }
}

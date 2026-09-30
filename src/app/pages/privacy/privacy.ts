import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BUSINESS } from '../../core/data/business';
import { SeoService } from '../../core/services/seo.service';
import { Breadcrumbs } from '../../ui/breadcrumbs';

@Component({
  selector: 'sx-privacy',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Breadcrumbs],
  template: `
    <section class="section">
      <div class="container">
        <sx-breadcrumbs [trail]="[{ label: 'Home', path: '/' }, { label: 'Privacy notice' }]" />
        <article class="prose doc">
          <h1 class="h1">Privacy notice</h1>
          <p class="small">Last updated 30 September 2026</p>
          <p>This notice explains how {{ business.legalName }} ("Samaki Express", "we") handles the personal information you give us through this website, in line with Kenya's Data Protection Act, 2019.</p>

          <h2>What we collect</h2>
          <p>When you send a quote request or a message, we collect what you enter: your name, phone number, email address if you give it, your town or county, your farm type, the products or services you ask about, and your message.</p>
          <p>We do not use advertising cookies. If we measure how the site is used, we do so without cookies and without collecting personal details.</p>

          <h2>Why we use it</h2>
          <ul>
            <li>To reply to your request or message, prepare a quote and arrange delivery or a visit.</li>
            <li>To keep a record of requests so we can follow them up.</li>
            <li>To send farming tips and offers, only if you tick the box asking for them.</li>
          </ul>

          <h2>Who we share it with</h2>
          <p>Only with the service providers that deliver your request to our team, such as our email provider, and only for that purpose. We do not sell your information.</p>

          <h2>How long we keep it</h2>
          <p>For as long as we need it to handle your request and any order that follows, and as required by law.</p>

          <h2>Your rights</h2>
          <p>You can ask to see the information we hold about you, correct it, delete it, or stop receiving tips and offers. Email <a [href]="'mailto:' + business.email">{{ business.email }}</a> or call {{ business.phone.display }}.</p>

          <p><a routerLink="/contact">Contact us</a> with any questions about this notice.</p>
        </article>
      </div>
    </section>
  `,
  styles: `
    .doc { margin-top: var(--s-8); }
    .doc .h1 { color: var(--c-ink); }
  `,
})
export class PrivacyPage {
  protected readonly business = BUSINESS;
  constructor() {
    inject(SeoService).set({
      title: 'Privacy notice',
      description: 'How Samaki Express uses the details you share in quote requests and messages.',
      path: '/privacy',
    });
  }
}

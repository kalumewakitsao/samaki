import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BUSINESS, whatsappLink } from '../../core/data/business';
import { AnalyticsService } from '../../core/services/analytics.service';
import { SeoService, breadcrumbJsonLd } from '../../core/services/seo.service';
import { Breadcrumbs } from '../../ui/breadcrumbs';
import { CallBand } from '../../ui/call-band';
import { EnquiryForm } from '../../ui/enquiry-form/enquiry-form';
import { Icon } from '../../ui/icon';
import { Illustration } from '../../ui/illustration';

@Component({
  selector: 'sx-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Breadcrumbs, CallBand, EnquiryForm, Icon, Illustration],
  template: `
    <section class="head">
      <div class="container">
        <sx-breadcrumbs [trail]="[{ label: 'Home', path: '/' }, { label: 'Contact' }]" />
        <div class="intro">
          <h1 class="h1">Talk to Samaki Express</h1>
          <p class="lead">
            The quickest way to reach us is a phone call. You can also email, visit us in Nairobi,
            or send a <a routerLink="/quote">quote request</a> for prices and orders.
          </p>
        </div>
      </div>
    </section>

    <sx-call-band source="contact" />

    <section class="channels-wrap">
      <div class="container">
        <ul class="channels" role="list">
          @if (whatsapp) {
            <li>
              <a
                class="channel"
                [href]="whatsapp"
                target="_blank"
                rel="noopener"
                (click)="track('whatsapp')"
              >
                <span class="icon-tile"><sx-icon name="chat" /></span>
                <span class="c-label">WhatsApp</span>
                <strong>Message us</strong>
                <span class="small muted">We reply during business hours</span>
              </a>
            </li>
          }
          <li>
            <a class="channel" [href]="'mailto:' + business.email" (click)="track('email')">
              <span class="icon-tile"><sx-icon name="mail" /></span>
              <span class="c-label">Email</span>
              <strong class="email"
                >{{ business.emailParts[0] }}@<wbr />{{ business.emailParts[1] }}</strong
              >
              <span class="small muted">Good for detailed questions</span>
            </a>
          </li>
          <li>
            <a
              class="channel"
              [href]="business.address.mapsUrl"
              target="_blank"
              rel="noopener"
              (click)="track('map')"
            >
              <span class="icon-tile"><sx-icon name="pin" /></span>
              <span class="c-label">Visit us <sx-icon name="external" class="ext" /></span>
              <strong>{{ business.address.street }}</strong>
              <span class="small muted"
                >{{ business.address.locality }}, {{ business.address.countryName }}</span
              >
            </a>
          </li>
        </ul>
      </div>
    </section>

    <section class="section">
      <div class="container layout">
        <div class="panel">
          <h2 class="h2">Send us a message</h2>
          <p class="muted intro-p">
            Questions about a product, a farm visit or an existing order. We reply during business
            hours.
          </p>
          <sx-enquiry-form type="general" />
        </div>
        <aside class="aside">
          <a
            class="map"
            [href]="business.address.mapsUrl"
            target="_blank"
            rel="noopener"
            (click)="track('map')"
          >
            <sx-illustration name="support" label="" />
            <span class="map-label"
              ><sx-icon name="pin" /> Open in Google Maps <sx-icon name="external"
            /></span>
          </a>
          <div class="box">
            <h2 class="h3">Opening hours</h2>
            <p class="muted">{{ business.hours.display }}</p>
            <p class="small muted">Next to Nairobi School on Waiyaki Way, Kairo.</p>
          </div>
        </aside>
      </div>
    </section>
  `,
  styles: `
    .head {
      padding-block: var(--s-6) var(--s-8);
    }
    .intro {
      display: grid;
      gap: var(--s-4);
      margin-top: var(--s-6);
      max-width: 44rem;
    }
    .channels {
      display: grid;
      gap: var(--s-3);
      list-style: none;
      padding: 0;
      grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
    }
    .channel {
      display: grid;
      gap: var(--s-1);
      height: 100%;
      padding: var(--s-5);
      border-radius: var(--r-lg);
      background: var(--c-surface);
      border: 1px solid var(--c-line);
      color: var(--c-ink);
      text-decoration: none;
      transition:
        transform var(--dur-3) var(--ease-out),
        box-shadow var(--dur-3) var(--ease-out),
        border-color var(--dur-2);
    }
    .channel:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-2);
      border-color: var(--c-brand);
    }
    .channel .icon-tile {
      margin-bottom: var(--s-3);
    }
    .c-label {
      display: inline-flex;
      align-items: center;
      gap: var(--s-1);
      font-size: var(--fs-sm);
      color: var(--c-ink-2);
    }
    .ext {
      width: 0.9rem;
      height: 0.9rem;
    }
    .channel strong {
      font-size: var(--fs-lg);
      overflow-wrap: anywhere;
    }
    .channel .email {
      font-size: var(--fs-base);
    }
    .layout {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: var(--s-8);
      align-items: start;
    }
    @media (min-width: 62rem) {
      .layout {
        grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
      }
    }
    .panel {
      padding: clamp(1.25rem, 0.8rem + 2vw, 2.5rem);
      border-radius: var(--r-xl);
      background: var(--c-surface);
      border: 1px solid var(--c-line);
      box-shadow: var(--shadow-2);
    }
    .intro-p {
      margin: var(--s-2) 0 var(--s-6);
    }
    .aside {
      display: grid;
      gap: var(--s-4);
    }
    .map {
      position: relative;
      display: block;
      border-radius: var(--r-xl);
      overflow: hidden;
      border: 1px solid var(--c-line);
      text-decoration: none;
    }
    .map sx-illustration {
      aspect-ratio: 4 / 3;
      transition: transform var(--dur-4) var(--ease-out);
    }
    .map:hover sx-illustration {
      transform: scale(1.03);
    }
    .map-label {
      position: absolute;
      left: var(--s-4);
      bottom: var(--s-4);
      display: inline-flex;
      align-items: center;
      gap: var(--s-2);
      padding: 0.55rem 0.9rem;
      border-radius: var(--r-pill);
      background: var(--c-surface);
      color: var(--c-ink);
      font-weight: 620;
      font-size: var(--fs-sm);
      box-shadow: var(--shadow-2);
    }
    .map-label sx-icon {
      width: 1rem;
      height: 1rem;
    }
    .box {
      display: grid;
      gap: var(--s-2);
      padding: var(--s-6);
      border-radius: var(--r-lg);
      background: var(--c-bg-tint);
      border: 1px solid var(--c-line);
    }
  `,
})
export class ContactPage {
  protected readonly business = BUSINESS;
  protected readonly whatsapp = whatsappLink('Hello Samaki Express, ');
  private readonly analytics = inject(AnalyticsService);

  constructor() {
    inject(SeoService).set({
      title: 'Contact us',
      description: `Call ${BUSINESS.phone.display}, email ${BUSINESS.email} or visit Samaki Express at Kairo, Waiyaki Way, next to Nairobi School. Open ${BUSINESS.hours.short}.`,
      path: '/contact',
      jsonLd: [
        breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ]),
      ],
    });
  }

  track(channel: string): void {
    this.analytics.track('contact_click', { channel, page: 'contact' });
  }
}

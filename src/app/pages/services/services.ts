import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PROCESS, SERVICES } from '../../core/data/catalogue';
import { SeoService, breadcrumbJsonLd } from '../../core/services/seo.service';
import { Breadcrumbs } from '../../ui/breadcrumbs';
import { CtaBand } from '../../ui/cta-band';
import { OfferingCard } from '../../ui/offering-card';

@Component({
  selector: 'sx-services',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Breadcrumbs, CtaBand, OfferingCard],
  template: `
    <section class="head">
      <div class="container">
        <sx-breadcrumbs [trail]="[{ label: 'Home', path: '/' }, { label: 'Services' }]" />
        <div class="intro">
          <h1 class="h1">Farm services that turn good inputs into good harvests</h1>
          <p class="lead">From hatchery supply to farm visits, training and delivery. Pick what you need, or ask us to put together a plan for your farm.</p>
          <div class="cluster">
            <a class="btn" routerLink="/quote">Request a service</a>
            <a class="btn btn--secondary" routerLink="/contact">Talk to our team</a>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--surface" aria-labelledby="list-title">
      <div class="container">
        <h2 class="visually-hidden" id="list-title">Our services</h2>
        <ul class="grid grid--3" role="list">
          @for (s of services; track s.slug) {
            <li class="reveal"><sx-offering-card [offering]="s" /></li>
          }
        </ul>
      </div>
    </section>

    <section class="section" aria-labelledby="how-title">
      <div class="container">
        <div class="section-head">
          <p class="eyebrow">How we work with you</p>
          <h2 class="h2" id="how-title">A simple cycle, repeated every season</h2>
        </div>
        <ol class="cycle" role="list">
          @for (p of process; track p.title; let i = $index) {
            <li class="reveal">
              <span class="num">{{ i + 1 }}</span>
              <div>
                <h3 class="h3">{{ p.title }}</h3>
                <p class="muted">{{ p.body }}</p>
              </div>
            </li>
          }
        </ol>
      </div>
    </section>

    <sx-cta-band source="services" heading="Not sure which service you need?" body="Describe your farm and what is worrying you. We will suggest where to start and what it involves." />
  `,
  styles: `
    .head { padding-block: var(--s-6) var(--s-12); }
    .intro { display: grid; gap: var(--s-5); margin-top: var(--s-6); max-width: 48rem; }
    ul.grid { list-style: none; padding: 0; }
    .cycle { list-style: none; padding: 0; display: grid; gap: var(--s-4); }
    @media (min-width: 48rem) { .cycle { grid-template-columns: repeat(2, 1fr); } }
    .cycle li { display: grid; grid-template-columns: auto 1fr; gap: var(--s-4); padding: var(--s-6); border-radius: var(--r-lg); border: 1px solid var(--c-line); background: var(--c-surface); }
    .num { display: grid; place-items: center; width: 2.5rem; height: 2.5rem; border-radius: var(--r-pill); background: var(--c-accent); color: #1d1400; font-family: var(--font-display); font-weight: 750; }
  `,
})
export class ServicesPage {
  protected readonly services = SERVICES;
  protected readonly process = PROCESS;

  constructor() {
    inject(SeoService).set({
      title: 'Fish farm services: hatchery supply, farm visits, training and delivery',
      description:
        'Hatchery supply, feed and water management, on-site farm support, health and biosecurity, audits, training and delivery for fish farmers.',
      path: '/services',
      jsonLd: [breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }])],
    });
  }
}

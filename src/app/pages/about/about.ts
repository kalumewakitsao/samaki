import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BUSINESS } from '../../core/data/business';
import { SeoService, breadcrumbJsonLd } from '../../core/services/seo.service';
import { Breadcrumbs } from '../../ui/breadcrumbs';
import { CtaBand } from '../../ui/cta-band';
import { Icon } from '../../ui/icon';
import { Illustration } from '../../ui/illustration';

@Component({
  selector: 'sx-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Breadcrumbs, CtaBand, Icon, Illustration],
  template: `
    <section class="head">
      <div class="container">
        <sx-breadcrumbs [trail]="[{ label: 'Home', path: '/' }, { label: 'About' }]" />
        <div class="hero">
          <div class="stack stack--lg">
            <p class="eyebrow">About {{ business.legalName }}</p>
            <h1 class="h1">Farmers need dependable access to quality fingerlings, feeds and expertise. That is why we exist.</h1>
            <p class="lead">Samaki Express delivers end-to-end aquaculture support, from quality inputs to advice and delivery, so fish farmers can grow with confidence.</p>
          </div>
          <sx-illustration name="support" label="Illustration of a fish farm with a pond and a location pin" class="art" />
        </div>
      </div>
    </section>

    <section class="section section--surface" aria-labelledby="mv-title">
      <div class="container">
        <h2 class="visually-hidden" id="mv-title">Mission and vision</h2>
        <div class="grid grid--2">
          <article class="mv reveal">
            <p class="eyebrow">Our mission</p>
            <p class="statement">Deliver end-to-end aquaculture solutions, from quality inputs to advisory and logistics.</p>
          </article>
          <article class="mv reveal">
            <p class="eyebrow">Our vision</p>
            <p class="statement">Lead the growth of aquaculture in East Africa with sustainable technology and expert support.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="values-title">
      <div class="container">
        <div class="section-head">
          <p class="eyebrow">What guides us</p>
          <h2 class="h2" id="values-title">Our values</h2>
        </div>
        <ul class="grid grid--4 values" role="list">
          @for (v of values; track v.title) {
            <li class="reveal">
              <span class="icon-tile"><sx-icon [name]="v.icon" /></span>
              <h3 class="h3">{{ v.title }}</h3>
              <p class="muted">{{ v.body }}</p>
            </li>
          }
        </ul>
      </div>
    </section>

    <section class="section section--tint" aria-labelledby="team-title">
      <div class="container">
        <div class="section-head section-head--split">
          <div class="stack">
            <p class="eyebrow">The team</p>
            <h2 class="h2" id="team-title">The people you will speak to</h2>
          </div>
          <p class="muted">From your first call to a visit on your farm, you deal with a small team that knows fish farming.</p>
        </div>
        <ul class="team" role="list">
          @for (t of team; track t.name) {
            <li class="reveal">
              <span class="avatar" aria-hidden="true">{{ initials(t.name) }}</span>
              <div>
                <h3 class="name">{{ t.name }}</h3>
                <p class="small muted">{{ t.role }}</p>
              </div>
            </li>
          }
        </ul>
      </div>
    </section>

    <section class="section" aria-labelledby="focus-title">
      <div class="container focus">
        <div class="stack">
          <p class="eyebrow">Where we help most</p>
          <h2 class="h2" id="focus-title">Our areas of focus</h2>
          <a class="text-link" routerLink="/services">Explore services <sx-icon name="arrow-right" /></a>
        </div>
        <ul class="ticks" role="list">
          <li><sx-icon name="check" /><span>Hatchery setup and breeding programmes</span></li>
          <li><sx-icon name="check" /><span>Pond and cage farm improvement</span></li>
          <li><sx-icon name="check" /><span>Feed planning, water testing and logistics</span></li>
          <li><sx-icon name="check" /><span>Training for farm owners and their teams</span></li>
        </ul>
      </div>
    </section>

    <sx-cta-band source="about" heading="Visit us or send a request" [body]="'Find us at ' + business.address.street + ', ' + business.address.locality + ', ' + business.hours.display.toLowerCase() + '. Or send a request and we will call you.'" />
  `,
  styles: `
    .head { padding-block: var(--s-6) var(--s-16); }
    .hero { display: grid; gap: var(--s-10); margin-top: var(--s-6); align-items: center; }
    @media (min-width: 62rem) { .hero { grid-template-columns: 1.3fr 1fr; } }
    .art { aspect-ratio: 4 / 3; border-radius: var(--r-xl); border: 1px solid var(--c-line); box-shadow: var(--shadow-2); }
    .mv { display: grid; gap: var(--s-4); padding: clamp(1.5rem, 1rem + 2vw, 2.5rem); border-radius: var(--r-xl); background: var(--c-bg-tint); border: 1px solid var(--c-line); }
    .statement { font-family: var(--font-display); font-size: var(--fs-2xl); line-height: 1.2; letter-spacing: -0.02em; font-weight: 650; text-wrap: balance; }
    ul.grid, .team { list-style: none; padding: 0; }
    .values li { display: grid; gap: var(--s-3); align-content: start; }
    .team { display: grid; gap: var(--s-4); grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr)); }
    .team li { display: flex; align-items: center; gap: var(--s-4); padding: var(--s-5); border-radius: var(--r-lg); background: var(--c-surface); border: 1px solid var(--c-line); }
    .avatar { display: grid; place-items: center; width: 3.25rem; height: 3.25rem; flex-shrink: 0; border-radius: var(--r-pill); background: var(--c-brand); color: var(--c-brand-ink); font-family: var(--font-display); font-weight: 700; }
    .team li:nth-child(3n + 2) .avatar { background: var(--c-accent); color: #1d1400; }
    .team li:nth-child(3n) .avatar { background: var(--c-deep); color: var(--c-deep-ink); }
    .name { font-family: var(--font-body); font-size: var(--fs-base); font-weight: 650; }
    .focus { display: grid; gap: var(--s-8); }
    @media (min-width: 60rem) { .focus { grid-template-columns: 1fr 1.2fr; } }
    .focus .ticks li { font-size: var(--fs-lg); padding-bottom: var(--s-3); border-bottom: 1px solid var(--c-line); }
  `,
})
export class AboutPage {
  protected readonly business = BUSINESS;
  protected readonly values = [
    { icon: 'sprout', title: 'Sustainability', body: 'We favour responsible farming practices that protect water, stock and livelihoods for the long term.' },
    { icon: 'gauge', title: 'Innovation', body: 'Practical tools and methods that help farms produce more with less waste.' },
    { icon: 'people', title: 'Community', body: 'Farmer-first support, with hands-on training and advice that is easy to reach.' },
    { icon: 'shield', title: 'Integrity', body: 'Straight answers on what we can supply, when, and at what price.' },
  ];
  protected readonly team = [
    { name: 'Vanessa Musula', role: 'Operations Lead' },
    { name: 'Mercy Achieng', role: 'Client Success' },
    { name: 'Lorna Nandwa', role: 'Field Specialist' },
    { name: 'Janeffer Nafula', role: 'Hatchery Technician' },
    { name: 'Caroline Awino', role: 'Training Coordinator' },
  ];

  constructor() {
    inject(SeoService).set({
      title: 'About us',
      description:
        'Samaki Express EA Ltd supplies fingerlings, feeds and equipment and supports fish farmers with training, advice and delivery. Based in Nairobi.',
      path: '/about',
      jsonLd: [breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }])],
    });
  }

  protected initials(name: string): string {
    return name
      .split(' ')
      .map((p) => p[0])
      .join('')
      .slice(0, 2);
  }
}

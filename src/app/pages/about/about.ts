import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BUSINESS } from '../../core/data/business';
import { SeoService, breadcrumbJsonLd } from '../../core/services/seo.service';
import { Breadcrumbs } from '../../ui/breadcrumbs';
import { AboutValues } from './values';
import { AboutFocus } from './focus';
import { Icon } from '../../ui/icon';
import { Illustration } from '../../ui/illustration';

@Component({
  selector: 'sx-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Breadcrumbs, AboutValues, AboutFocus, Icon, Illustration],
  template: `
    <section class="head">
      <div class="container">
        <sx-breadcrumbs [trail]="[{ label: 'Home', path: '/' }, { label: 'About' }]" />
        <div class="hero">
          <div class="about-intro">
            <p class="eyebrow about-kicker">
              <span aria-hidden="true"></span>About {{ business.legalName }}
            </p>
            <h1 class="about-title">
              Your farm.<br /><em class="type-accent">Our shared ambition.</em>
            </h1>
            <div class="about-story">
              <p class="about-hook">Good stock is just the beginning.</p>
              <p class="about-description">
                You need people you can count on, too. We bring fingerlings, feeds and practical
                know-how together, so you can spend less time figuring it all out and more time
                growing your farm.
              </p>
            </div>
            <a class="about-link" routerLink="/services"
              >Get to know how we help <sx-icon name="arrow-right"
            /></a>
          </div>
          <sx-illustration
            name="support"
            label="Illustration of a fish farm with a pond and a location pin"
            class="art"
          />
        </div>
      </div>
    </section>

    <section class="section purpose" aria-labelledby="mv-title">
      <div class="container">
        <div class="section-head section-head--split purpose-head">
          <div class="stack">
            <p class="eyebrow">Our purpose</p>
            <h2 class="h2" id="mv-title">
              Better farming.<br /><em class="type-accent">Bigger possibilities.</em>
            </h2>
          </div>
          <p class="lead">
            Practical support for the farm you run today. A shared ambition for what aquaculture can
            become.
          </p>
        </div>
        <div class="purpose-grid">
          <article class="purpose-card purpose-card--mission" aria-labelledby="mission-title">
            <div class="purpose-top">
              <p class="eyebrow">01 / Our mission</p>
              <span class="purpose-icon"><sx-icon name="fish" /></span>
            </div>
            <h3 id="mission-title">
              Everything you need.<br /><em class="type-accent">Every step of the way.</em>
            </h3>
            <p class="purpose-body">
              Deliver end-to-end aquaculture solutions, from quality inputs to advisory and
              logistics.
            </p>
            <div class="purpose-bottom">
              <span>Here for your next step</span
              ><a routerLink="/services">How we help <sx-icon name="arrow-right" /></a>
            </div>
          </article>
          <article class="purpose-card purpose-card--vision" aria-labelledby="vision-title">
            <div class="purpose-top">
              <p class="eyebrow">02 / Our vision</p>
              <span class="purpose-icon"><sx-icon name="sprout" /></span>
            </div>
            <h3 id="vision-title">
              A thriving future.<br /><em class="type-accent">Growing together.</em>
            </h3>
            <p class="purpose-body">
              Lead the growth of aquaculture in East Africa with sustainable technology and expert
              support.
            </p>
            <div class="purpose-bottom">
              <span>Our ambition for East Africa</span><sx-icon name="sprout" />
            </div>
          </article>
        </div>
      </div>
    </section>

    <sx-about-values />

    <section class="section team-section" aria-labelledby="team-title">
      <div class="container">
        <div class="section-head section-head--split">
          <div class="stack">
            <p class="eyebrow">Good people. Real support.</p>
            <h2 class="h2" id="team-title">
              The people<br /><em class="type-accent">you will speak to.</em>
            </h2>
          </div>
          <p class="lead">
            From your first call to a visit on your farm, you deal with a small team that knows fish
            farming.
          </p>
        </div>
        <ul class="team" role="list">
          @for (t of team; track t.name; let i = $index) {
            <li class="person">
              <div class="person-art" aria-hidden="true">
                <span class="person-number">0{{ i + 1 }} / SAMAKI</span>
                <span class="person-initials">{{ initials(t.name) }}</span>
                <span class="person-symbol"><sx-icon [name]="teamIcons[i]" /></span>
              </div>
              <div class="person-details">
                <h3 class="name">{{ t.name }}</h3>
                <p class="person-role">{{ t.role }}</p>
              </div>
            </li>
          }
        </ul>
        <div class="team-contact">
          <span class="team-contact-icon"><sx-icon name="chat" /></span>
          <p>
            A question, a plan, or just getting started?<br /><strong
              >Let's talk about your farm.</strong
            >
          </p>
          <a class="btn" [href]="'tel:' + business.phone.tel"
            ><sx-icon name="phone" /> Talk to the team</a
          >
        </div>
      </div>
    </section>

    <sx-about-focus />
  `,
  styles: `
    .head {
      padding-block: var(--s-6) var(--s-16);
    }
    .hero {
      display: grid;
      gap: var(--s-10);
      margin-top: var(--s-6);
      align-items: center;
    }
    @media (min-width: 62rem) {
      .hero {
        grid-template-columns: 1.3fr 1fr;
      }
    }
    .art {
      aspect-ratio: 4 / 3;
      border-radius: var(--r-xl);
      border: 1px solid var(--c-line);
      box-shadow: var(--shadow-2);
    }
    .about-intro {
      display: grid;
      gap: 1.75rem;
      padding-block: 1rem;
    }
    .about-kicker {
      font-size: 0.65rem;
      letter-spacing: 0.1em;
      gap: 0.65rem;
    }
    .about-kicker > span {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--c-brand-text);
      flex-shrink: 0;
    }
    .about-title {
      font-family: var(--font-display);
      font-size: clamp(3.1rem, 5.6vw, 5.6rem);
      font-weight: 500;
      line-height: 1.02;
      letter-spacing: -0.045em;
    }
    .about-title em {
      color: var(--c-brand-text);
      display: inline-block;
      padding-right: 0.06em;
    }
    .about-story {
      border-left: 2px solid var(--c-line-strong);
      padding-left: 1.25rem;
      max-width: 33rem;
    }
    .about-hook {
      font-size: clamp(1.15rem, 1.7vw, 1.4rem);
      font-weight: 500;
      color: var(--c-ink);
      margin-bottom: 0.65rem;
    }
    .about-description {
      color: var(--c-ink-2);
      font-size: 1.0625rem;
      line-height: 1.7;
    }
    .about-link {
      display: inline-flex;
      align-items: center;
      justify-self: start;
      gap: 0.7rem;
      color: var(--c-brand-text);
      min-height: 44px;
      text-decoration: none;
      font-weight: 500;
    }
    .about-link:hover {
      text-decoration: underline;
      text-underline-offset: 5px;
    }
    .about-link sx-icon {
      width: 18px;
      height: 18px;
    }
    @media (max-width: 35.99rem) {
      .about-intro {
        gap: 1.4rem;
      }
      .about-title {
        font-size: clamp(2.8rem, 10.5vw, 3.8rem);
      }
      .about-kicker {
        font-size: 0.56rem;
        letter-spacing: 0.06em;
      }
      .about-description {
        font-size: 1rem;
      }
    }
    .purpose {
      background: var(--c-bg-tint);
    }
    .purpose-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1.5rem;
    }
    .purpose-card {
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      padding: clamp(1.5rem, 3vw, 3rem);
      border-radius: 24px;
    }
    .purpose-card--mission {
      background: #073d39;
      color: #fffdf3;
      --purpose-muted: #c8ddd4;
      --purpose-accent: #d8ef79;
      --purpose-line: #ffffff30;
    }
    .purpose-card--vision {
      background: #e5edcb;
      color: #173f35;
      --purpose-muted: #456047;
      --purpose-accent: #376045;
      --purpose-line: #173f3526;
    }
    .purpose-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 2.75rem;
    }
    .purpose-top .eyebrow {
      color: var(--purpose-muted);
      font-size: 0.7rem;
      letter-spacing: 0.08em;
    }
    .purpose-icon {
      width: 52px;
      height: 52px;
      display: grid;
      place-items: center;
      border: 1px solid var(--purpose-line);
      border-radius: 16px;
      color: var(--purpose-accent);
      transform: rotate(-8deg);
    }
    .purpose-icon sx-icon {
      width: 26px;
      height: 26px;
    }
    .purpose-card h3 {
      color: inherit;
      font-size: clamp(2rem, 3.1vw, 3rem);
      line-height: 1.12;
      letter-spacing: -0.035em;
      font-weight: 500;
    }
    .purpose-card h3 em {
      color: var(--purpose-accent);
      font-size: 1.12em;
    }
    .purpose-body {
      max-width: 35ch;
      color: var(--purpose-muted);
      margin-block: 1.5rem 2.5rem;
      font-size: 1.0625rem;
      line-height: 1.65;
    }
    .purpose-bottom {
      margin-top: auto;
      padding-top: 1.25rem;
      border-top: 1px solid var(--purpose-line);
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.75rem;
      font-size: 0.8rem;
      color: var(--purpose-muted);
    }
    .purpose-bottom a {
      color: inherit;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      min-height: 44px;
      text-underline-offset: 4px;
    }
    .purpose-bottom sx-icon {
      width: 18px;
      height: 18px;
    }
    .team-section {
      background: var(--c-bg-tint);
    }
    .team {
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: 1rem;
    }
    .person {
      min-width: 0;
      border-radius: 20px;
      overflow: hidden;
      background: var(--c-surface);
      border: 1px solid var(--c-line);
    }
    .person-art {
      position: relative;
      isolation: isolate;
      display: grid;
      place-items: center;
      aspect-ratio: 1 / 1.1;
      overflow: hidden;
      background: #dce8b8;
      color: #234936;
    }
    .person:nth-child(2) .person-art {
      background: #f1d4c0;
      color: #704735;
    }
    .person:nth-child(3) .person-art {
      background: #cce3dc;
      color: #28554c;
    }
    .person:nth-child(4) .person-art {
      background: #e0dcef;
      color: #50416e;
    }
    .person:nth-child(5) .person-art {
      background: #f3e5b6;
      color: #6e582c;
    }
    .person-art::before,
    .person-art::after {
      content: '';
      position: absolute;
      border-radius: 50%;
      border: 1px solid currentColor;
      opacity: 0.15;
      width: 140%;
      aspect-ratio: 1;
      z-index: -1;
    }
    .person-art::before {
      top: 32%;
      left: -40%;
    }
    .person-art::after {
      top: 40%;
      left: -20%;
    }
    .person-number {
      position: absolute;
      top: 1rem;
      left: 1rem;
      font: 500 0.58rem var(--font-label);
      letter-spacing: 0.05em;
    }
    .person-initials {
      font-family: var(--font-accent);
      font-style: italic;
      font-size: clamp(3.5rem, 5.6vw, 6rem);
      letter-spacing: -0.06em;
      padding-right: 0.1em;
    }
    .person-symbol {
      position: absolute;
      bottom: 0.8rem;
      right: 0.8rem;
      display: grid;
      place-items: center;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: #fffdf380;
    }
    .person-symbol sx-icon {
      width: 18px;
      height: 18px;
    }
    .person-details {
      padding: 1.25rem 1rem;
    }
    .name {
      font-family: var(--font-display);
      font-size: 1.18rem;
      font-weight: 550;
      line-height: 1.2;
    }
    .person-role {
      color: var(--c-ink-2);
      font-size: 0.85rem;
      margin-top: 0.45rem;
    }
    .team-contact {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-top: 2rem;
      padding-top: 1.75rem;
      border-top: 1px solid var(--c-line);
    }
    .team-contact-icon {
      display: grid;
      place-items: center;
      width: 48px;
      height: 48px;
      flex-shrink: 0;
      background: var(--c-brand-soft);
      color: var(--c-brand-text);
      border-radius: 14px;
    }
    .team-contact-icon sx-icon {
      width: 24px;
      height: 24px;
    }
    .team-contact p {
      font-size: 0.95rem;
      color: var(--c-ink-2);
    }
    .team-contact strong {
      color: var(--c-ink);
      font-weight: 500;
    }
    .team-contact .btn {
      margin-left: auto;
    }
    .team-contact .btn sx-icon {
      width: 18px;
      height: 18px;
    }
    @media (prefers-reduced-motion: no-preference) {
      .person {
        transition:
          transform 220ms ease,
          box-shadow 220ms ease;
      }
      .person:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-2);
      }
    }
    @media (max-width: 63.99rem) {
      .team {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
      .person-initials {
        font-size: 5rem;
      }
    }
    @media (max-width: 43.99rem) {
      .purpose-grid {
        grid-template-columns: 1fr;
      }
      .purpose-top {
        margin-bottom: 2rem;
      }
      .team {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.75rem;
      }
      .person-details {
        padding: 1rem 0.85rem;
      }
      .name {
        font-size: 1.1rem;
      }
      .team-contact {
        flex-wrap: wrap;
      }
      .team-contact p {
        flex: 1;
      }
      .team-contact .btn {
        width: 100%;
        margin-left: 0;
      }
    }
    @media (max-width: 23rem) {
      .person-initials {
        font-size: 4rem;
      }
      .person-number {
        font-size: 0.5rem;
        left: 0.75rem;
      }
      .person-role {
        font-size: 0.8rem;
      }
    }
  `,
})
export class AboutPage {
  protected readonly business = BUSINESS;
  protected readonly teamIcons = ['clipboard', 'chat', 'sprout', 'fish', 'cap'];
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
      jsonLd: [
        breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ]),
      ],
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

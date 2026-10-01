import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BUSINESS } from '../../core/data/business';
import { OpenStatus } from '../../core/services/open-status';
import { AnalyticsService } from '../../core/services/analytics.service';
import { Icon } from '../../ui/icon';
@Component({
  selector: 'sx-about-focus',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon],
  template: ` <section class="section focus-section" aria-labelledby="focus-title">
      <div class="container focus-layout">
        <div class="focus-intro">
          <p class="eyebrow">Our areas of focus</p>
          <h2 class="h2" id="focus-title">
            The right support.<br /><em class="type-accent">Where it counts.</em>
          </h2>
          <p class="lead">
            From hatchery to harvest, we help you make the next step a practical one.
          </p>
          <a class="btn btn--secondary" routerLink="/services"
            >Explore all services <sx-icon name="arrow-right" /></a
          ><span class="focus-mark" aria-hidden="true"
            ><sx-icon name="fish" /><span>FROM SMALL STARTS<br />TO STRONGER FARMS</span></span
          >
        </div>
        <ol class="focus-list" role="list">
          @for (f of focus; track f.title; let i = $index) {
            <li>
              <a [routerLink]="f.link"
                ><span class="focus-number">0{{ i + 1 }}</span
                ><span class="focus-copy"
                  ><h3>{{ f.title }}</h3>
                  <span>{{ f.body }}</span></span
                ><sx-icon name="arrow-right"
              /></a>
            </li>
          }
        </ol>
      </div>
    </section>
    <section class="section visit-section" aria-labelledby="visit-title">
      <div class="container">
        <div class="visit-panel">
          <div class="visit-copy">
            <p class="eyebrow">A real place. A real conversation.</p>
            <h2 id="visit-title">Visit us.<br />Or <em class="type-accent">say hello.</em></h2>
            <p>
              Bring your questions, your plans, or your next order. Let's work out what your farm
              needs.
            </p>
            <a
              class="visit-phone"
              [href]="'tel:' + business.phone.tel"
              (click)="analytics.track('contact_click', { channel: 'phone', page: 'about_visit' })"
              ><sx-icon name="phone" />{{ business.phone.display }}</a
            >
          </div>
          <div class="visit-options">
            <article>
              <span class="option-icon"><sx-icon name="pin" /></span>
              <div>
                <h3>Come by Nairobi</h3>
                <p>{{ business.address.street }}, {{ business.address.locality }}.</p>
                <p class="visit-hours">{{ business.hours.short }}</p>
                <a
                  class="visit-link"
                  [href]="business.address.mapsUrl"
                  target="_blank"
                  rel="noopener"
                  >Get directions <span class="visually-hidden">(opens in a new tab)</span
                  ><sx-icon name="arrow-right"
                /></a>
              </div>
            </article>
            <article>
              <span class="option-icon"><sx-icon name="chat" /></span>
              <div>
                <h3>Tell us what you need</h3>
                <p>Send one request. We'll confirm availability, price and delivery with you.</p>
                <a
                  class="btn"
                  routerLink="/quote"
                  (click)="analytics.track('cta_click', { cta: 'about_visit_quote' })"
                  >Request a quote <sx-icon name="arrow-right"
                /></a>
              </div>
            </article>
            <p class="open-status">
              <span class="status-dot" [class.is-open]="status()?.open" aria-hidden="true"></span
              >{{ status()?.label ?? business.hours.short }}
            </p>
          </div>
        </div>
      </div>
    </section>`,
  styles: `
    .focus-layout {
      display: grid;
      grid-template-columns: 1fr 1.25fr;
      gap: clamp(2rem, 5vw, 5rem);
      align-items: start;
    }
    .focus-intro {
      display: grid;
      gap: 1.5rem;
      justify-items: start;
    }
    .focus-intro .lead {
      max-width: 30ch;
    }
    .focus-intro .btn sx-icon {
      width: 18px;
      height: 18px;
    }
    .focus-mark {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-top: 1rem;
      color: var(--c-brand-text);
      font: 0.6rem/1.8 var(--font-label);
      letter-spacing: 0.1em;
    }
    .focus-mark sx-icon {
      width: 48px;
      height: 48px;
    }
    .focus-list {
      list-style: none;
      padding: 0;
      border-top: 1px solid var(--c-line);
    }
    .focus-list a {
      display: grid;
      grid-template-columns: 2rem 1fr 2rem;
      align-items: center;
      gap: 1rem;
      padding: 1.75rem 0.25rem;
      border-bottom: 1px solid var(--c-line);
      color: var(--c-ink);
      text-decoration: none;
      transition: background 180ms ease;
    }
    .focus-list a:hover {
      background: var(--c-brand-soft);
    }
    .focus-number {
      font: 0.75rem var(--font-label);
      color: var(--c-brand-text);
      align-self: start;
      padding-top: 0.4rem;
    }
    .focus-copy h3 {
      font-size: clamp(1.35rem, 2vw, 1.8rem);
      font-weight: 500;
      margin-bottom: 0.4rem;
    }
    .focus-copy > span {
      color: var(--c-ink-2);
      font-size: 1rem;
    }
    .focus-list sx-icon {
      width: 24px;
      height: 24px;
    }
    .visit-section {
      padding-top: 0;
    }
    .visit-panel {
      display: grid;
      grid-template-columns: 1.05fr 1fr;
      gap: clamp(2rem, 5vw, 5rem);
      padding: clamp(1.5rem, 4vw, 4rem);
      border-radius: 28px;
      background: #dfecc2;
      color: #173f35;
      --c-ink: #173f35;
      --c-ink-2: #456047;
      --c-brand: #174c39;
      --c-brand-hover: #0b382a;
      --c-brand-ink: #fffdf3;
    }
    .visit-copy .eyebrow {
      color: #456047;
      font-size: 0.65rem;
      letter-spacing: 0.08em;
    }
    .visit-copy h2 {
      font-size: clamp(3rem, 5vw, 5rem);
      font-weight: 500;
      line-height: 1.02;
      letter-spacing: -0.045em;
      margin-block: 2rem 1.5rem;
    }
    .visit-copy > p:not(.eyebrow) {
      color: #456047;
      max-width: 32ch;
      font-size: 1.1rem;
    }
    .visit-phone {
      display: inline-flex;
      align-items: center;
      gap: 0.8rem;
      margin-top: 2rem;
      color: #173f35;
      font-size: clamp(1.4rem, 2.2vw, 2rem);
      text-decoration: none;
      min-height: 44px;
    }
    .visit-phone:hover {
      text-decoration: underline;
      text-underline-offset: 5px;
    }
    .visit-phone sx-icon {
      width: 24px;
      height: 24px;
    }
    .visit-options {
      display: grid;
      align-content: start;
      gap: 1rem;
    }
    .visit-options article {
      display: grid;
      grid-template-columns: 40px 1fr;
      gap: 1rem;
      background: #fffdf3;
      padding: 1.5rem;
      border-radius: 18px;
    }
    .option-icon {
      display: grid;
      place-items: center;
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: #eaf0dc;
    }
    .option-icon sx-icon {
      width: 21px;
      height: 21px;
    }
    .visit-options h3 {
      font-size: 1.4rem;
      font-weight: 500;
      margin-bottom: 0.5rem;
    }
    .visit-options article p {
      color: #456047;
      font-size: 0.95rem;
    }
    .visit-hours {
      margin-top: 0.6rem;
    }
    .visit-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: #173f35;
      min-height: 44px;
      margin-top: 0.5rem;
      text-underline-offset: 4px;
    }
    .visit-link sx-icon,
    .visit-options .btn sx-icon {
      width: 18px;
      height: 18px;
    }
    .visit-options .btn {
      margin-top: 1rem;
      font-size: 0.95rem;
    }
    .open-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8rem;
      color: #456047;
    }
    .open-status .status-dot {
      background: #58704a;
    }
    .open-status .is-open {
      background: #1d7f3a;
    }
    @media (max-width: 55rem) {
      .focus-layout,
      .visit-panel {
        grid-template-columns: 1fr;
      }
      .focus-mark {
        display: none;
      }
    }
    @media (max-width: 35.99rem) {
      .focus-list a {
        grid-template-columns: 1.5rem 1fr 1.25rem;
        gap: 0.65rem;
      }
      .visit-options article {
        grid-template-columns: 1fr;
        padding: 1.25rem;
      }
      .visit-options .btn {
        width: 100%;
      }
    }
  `,
})
export class AboutFocus {
  protected readonly business = BUSINESS;
  protected readonly status = inject(OpenStatus).state;
  protected readonly analytics = inject(AnalyticsService);
  protected readonly focus = [
    {
      title: 'Start with a strong hatchery',
      body: 'Hatchery setup and breeding programmes.',
      link: '/services/hatchery-supply',
    },
    {
      title: 'Get more from your farm',
      body: 'Practical support for pond and cage farms.',
      link: '/services/farm-audits-advisory',
    },
    {
      title: 'Keep the essentials right',
      body: 'Feed planning, water testing and logistics.',
      link: '/services/feed-water-management',
    },
    {
      title: 'Build skills that stay',
      body: 'Hands-on training for owners and farm teams.',
      link: '/services/training',
    },
  ];
}

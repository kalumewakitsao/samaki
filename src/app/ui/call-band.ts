import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BUSINESS, mailtoLink } from '../core/data/business';
import { AnalyticsService } from '../core/services/analytics.service';
import { OpenStatus } from '../core/services/open-status';
import { Icon } from './icon';

/** The phone number, announced: a compact band with the number set large. */
@Component({
  selector: 'sx-call-band',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon],
  template: `
    <section class="band" aria-labelledby="call-band-title">
      <div class="container">
        <div class="panel reveal">
          <div class="copy">
            <p class="kicker">
              <span class="status-dot" [class.is-open]="status()?.open" aria-hidden="true"></span>
              {{ status()?.label ?? business.hours.display }}
            </p>
            <h2 class="title" id="call-band-title">
              <span class="pre">Talk to a specialist</span>
              <a
                class="number"
                [href]="'tel:' + business.phone.tel"
                (click)="
                  analytics.track('contact_click', { channel: 'phone', page: source() + '_band' })
                "
                >{{ business.phone.display }}</a
              >
            </h2>
            <p class="note">
              Stocking, feeding, water quality or an order: call and a person on our team answers.
            </p>
          </div>
          <div class="actions">
            <a
              class="btn btn--call btn--xl"
              [href]="'tel:' + business.phone.tel"
              (click)="
                analytics.track('contact_click', { channel: 'phone', page: source() + '_band' })
              "
            >
              <span class="call-ring"><sx-icon name="phone" /></span> Call now
            </a>
            <div class="alt">
              <a
                class="alt-link"
                routerLink="/quote"
                (click)="analytics.track('cta_click', { cta: source() + '_band_quote' })"
                ><sx-icon name="list" /> Send a quote request</a
              >
              <a
                class="alt-link"
                [href]="email"
                (click)="
                  analytics.track('contact_click', { channel: 'email', page: source() + '_band' })
                "
                ><sx-icon name="mail" /> Email us</a
              >
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .band {
      padding-block: clamp(1.5rem, 1rem + 2vw, 3rem);
    }
    .panel {
      position: relative;
      display: grid;
      gap: var(--s-6);
      align-items: center;
      padding: clamp(1.5rem, 1rem + 2.5vw, 3rem);
      border-radius: var(--r-xl);
      overflow: hidden;
      color: var(--c-ink);
      background: #d8ef79;
      --c-ink: #173f35;
      --c-ink-2: #34583c;
      --c-ink-3: #405c38;
      --c-brand-text: #173f35;
      --c-brand: #174c39;
      --c-brand-ink: #fffef9;
      --c-brand-hover: #0b382a;
    }
    @media (min-width: 56rem) {
      .panel {
        grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
        gap: var(--s-10);
      }
    }
    .copy {
      display: grid;
      gap: var(--s-3);
    }
    .kicker {
      display: inline-flex;
      align-items: center;
      gap: var(--s-2);
      font-size: var(--fs-sm);
      font-weight: 600;
      color: var(--c-ink-3);
    }
    .title {
      display: grid;
      gap: var(--s-1);
      color: var(--c-ink);
    }
    .pre {
      font-size: var(--fs-xl);
      font-weight: 650;
      letter-spacing: -0.02em;
      color: var(--c-ink-2);
    }
    .number {
      justify-self: start;
      font-family: var(--font-display);
      font-size: clamp(2.5rem, 1.2rem + 5.4vw, 5.25rem);
      font-weight: 700;
      line-height: 1;
      letter-spacing: -0.035em;
      color: var(--c-ink);
      text-decoration: none;
      white-space: nowrap;
      border-radius: var(--r-sm);
    }
    .number:hover {
      text-decoration: underline;
      text-decoration-thickness: 3px;
      text-underline-offset: 8px;
    }
    .note {
      max-width: 34rem;
      color: var(--c-ink-3);
    }
    .actions {
      display: grid;
      gap: var(--s-4);
      justify-items: stretch;
    }
    @media (min-width: 30rem) {
      .actions {
        justify-items: start;
      }
    }
    @media (min-width: 56rem) {
      .actions {
        justify-items: end;
      }
    }
    .alt {
      display: flex;
      flex-wrap: wrap;
      gap: var(--s-2) var(--s-5);
    }
    .alt-link {
      display: inline-flex;
      align-items: center;
      gap: var(--s-2);
      min-height: var(--tap);
      color: var(--c-brand-text);
      font-weight: 500;
      text-decoration: none;
    }
    .alt-link:hover {
      text-decoration: underline;
    }
    .alt-link sx-icon {
      width: 1.1rem;
      height: 1.1rem;
    }
  `,
})
export class CallBand {
  protected readonly business = BUSINESS;
  protected readonly analytics = inject(AnalyticsService);
  protected readonly status = inject(OpenStatus).state;
  protected readonly email = mailtoLink('Question for Samaki Express');
  readonly source = input('unknown');
}

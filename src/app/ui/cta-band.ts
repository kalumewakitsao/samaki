import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BUSINESS } from '../core/data/business';
import { AnalyticsService } from '../core/services/analytics.service';
import { Icon } from './icon';

/** Closing call to action used at the end of most pages. */
@Component({
  selector: 'sx-cta-band',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon],
  template: `
    <section class="section section--deep" aria-labelledby="cta-heading">
      <div class="container inner reveal">
        <div class="stack">
          <h2 class="h1" id="cta-heading">{{ heading() }}</h2>
          <p class="lead">{{ body() }}</p>
        </div>
        <div class="actions">
          <a
            class="btn btn--accent btn--lg"
            routerLink="/quote"
            (click)="analytics.track('cta_click', { cta: 'cta_band_quote', page: source() })"
          >
            Request a quote <sx-icon name="arrow-right" class="icon--arrow" />
          </a>
          <a
            class="btn btn--secondary btn--lg"
            [href]="'tel:' + business.phone.tel"
            (click)="analytics.track('contact_click', { channel: 'phone', page: source() })"
          >
            <sx-icon name="phone" /> Call {{ business.phone.display }}
          </a>
          <p class="small hours">{{ business.hours.display }}</p>
        </div>
      </div>
    </section>
  `,
  styles: `
    .inner {
      display: grid;
      gap: var(--s-8);
      align-items: end;
    }
    @media (min-width: 60rem) {
      .inner {
        grid-template-columns: 1.3fr 1fr;
      }
    }
    .actions {
      display: grid;
      gap: var(--s-3);
      justify-items: stretch;
    }
    @media (min-width: 30rem) {
      .actions {
        justify-items: start;
      }
    }
    .btn--secondary {
      --btn-ink: var(--c-deep-ink);
      --btn-border: rgb(255 255 255 / 0.3);
      --btn-bg-hover: rgb(255 255 255 / 0.08);
    }
    .hours {
      color: var(--c-deep-ink-2);
    }
  `,
})
export class CtaBand {
  protected readonly business = BUSINESS;
  protected readonly analytics = inject(AnalyticsService);
  readonly heading = input('Tell us what your farm needs');
  readonly body = input(
    'Send one request for fingerlings, feeds, equipment or a farm visit. We confirm availability, price and delivery with you before anything is final.',
  );
  readonly source = input('unknown');
}

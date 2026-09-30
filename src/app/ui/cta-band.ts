import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BUSINESS } from '../core/data/business';
import { AnalyticsService } from '../core/services/analytics.service';
import { OpenStatus } from '../core/services/open-status';
import { Icon } from './icon';

/** Closing call to action used at the end of most pages. */
@Component({
  selector: 'sx-cta-band',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon],
  template: `
    <section class="band" aria-labelledby="cta-heading">
      <div class="container">
        <div class="panel reveal">
          <div class="copy">
            <h2 class="h2" id="cta-heading">{{ heading() }}</h2>
            <p class="lead">{{ body() }}</p>
          </div>
          <div class="actions">
            <a
              class="btn btn--call btn--xl"
              [href]="'tel:' + business.phone.tel"
              (click)="analytics.track('contact_click', { channel: 'phone', page: source() })"
            >
              <span class="call-ring"><sx-icon name="phone" /></span> Call
              {{ business.phone.display }}
            </a>
            <a
              class="btn btn--glass btn--lg"
              routerLink="/quote"
              (click)="analytics.track('cta_click', { cta: 'cta_band_quote', page: source() })"
            >
              Request a quote <sx-icon name="arrow-right" class="icon--arrow" />
            </a>
            <p class="small hours">
              <span class="status-dot" [class.is-open]="status()?.open" aria-hidden="true"></span>
              {{ status()?.label ?? business.hours.display }}
            </p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .band {
      padding-block: clamp(2rem, 1rem + 3vw, 4.5rem);
    }
    .panel {
      display: grid;
      gap: var(--s-8);
      align-items: center;
      padding: clamp(1.75rem, 1rem + 3vw, 3.5rem);
      border-radius: var(--r-xl);
      color: #e9f3ef;
      background:
        radial-gradient(100% 120% at 100% 100%, rgb(245 184 63 / 0.2), transparent 55%),
        linear-gradient(135deg, #0b2b2e, #0d3f40);
      box-shadow: var(--shadow-3);
      --c-ink: #fff;
      --c-ink-2: #cfe9e1;
      --c-focus: #7be6cb;
      --ring: 0 0 0 3px #0b2b2e, 0 0 0 5px #7be6cb;
    }
    @media (min-width: 60rem) {
      .panel {
        grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
      }
    }
    .copy {
      display: grid;
      gap: var(--s-3);
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
    .hours {
      display: inline-flex;
      align-items: center;
      gap: var(--s-2);
      color: #a8c4bd;
    }
  `,
})
export class CtaBand {
  protected readonly business = BUSINESS;
  protected readonly analytics = inject(AnalyticsService);
  protected readonly status = inject(OpenStatus).state;
  readonly heading = input('Tell us what your farm needs');
  readonly body = input(
    'Send one request for fingerlings, feeds, equipment or a farm visit. We confirm availability, price and delivery with you before anything is final.',
  );
  readonly source = input('unknown');
}

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
            <p class="eyebrow">Good things grow from here</p>
            <h2 id="cta-heading">
              @if (heading() === 'Your next chapter starts with a conversation.') {
                Your next chapter<br />starts with <em>a conversation.</em>
              } @else {
                {{ heading() }}
              }
            </h2>
            <p class="lead">{{ body() }}</p>
          </div>
          <div class="actions">
            <div class="contact-intro">
              <span class="contact-icon" aria-hidden="true"><sx-icon name="chat" /></span>
              <div>
                <span class="contact-label">Talk to Samaki</span>
                <p>A real team. Ready to help.</p>
              </div>
            </div>
            <a
              class="btn btn--call btn--xl"
              [href]="'tel:' + business.phone.tel"
              (click)="analytics.track('contact_click', { channel: 'phone', page: source() })"
            >
              <span class="call-ring"><sx-icon name="phone" /></span> Call
              {{ business.phone.display }}
            </a>
            <a
              class="btn quote-link"
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
      padding-block: clamp(2rem, 5vw, 4.5rem);
    }
    .panel {
      display: grid;
      grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
      gap: clamp(2rem, 5vw, 5rem);
      align-items: center;
      padding: clamp(1.5rem, 4.5vw, 4rem);
      border-radius: 24px;
      color: #fffdf3;
      background: #073d39;
      position: relative;
      overflow: hidden;
      isolation: isolate;
    }
    .panel::before {
      content: '';
      position: absolute;
      width: 32rem;
      height: 32rem;
      border: 1px solid #ffffff12;
      border-radius: 50%;
      left: -13rem;
      bottom: -26rem;
      box-shadow:
        0 0 0 3rem #ffffff04,
        0 0 0 6rem #ffffff04,
        0 0 0 9rem #ffffff04;
      z-index: -1;
      pointer-events: none;
    }
    .eyebrow {
      color: #d8ef79;
      font-size: 0.65rem;
      margin-bottom: 1.5rem;
    }
    h2 {
      color: #fffdf3;
      font-size: clamp(2.25rem, 3.7vw, 3.75rem);
      line-height: 1.08;
      font-weight: 500;
      letter-spacing: -0.04em;
      max-width: 18ch;
      margin: 0;
      text-wrap: balance;
    }
    h2 em {
      color: #d8ef79;
      font-family: var(--font-accent);
      font-weight: 400;
    }
    .lead {
      color: #c8ddd4;
      font-size: 1rem;
      line-height: 1.75;
      max-width: 48ch;
      margin-top: 1.5rem;
    }
    .actions {
      display: grid;
      gap: 0.85rem;
      padding: clamp(1.25rem, 2.5vw, 2rem);
      border-radius: 18px;
      background: #f6f5e9;
      color: #173f35;
      box-shadow: 0 12px 30px #001f1c26;
      --c-brand: #d8ef79;
      --c-brand-ink: #173f35;
      --c-brand-hover: #e6ff91;
      --c-brand-text: #173f35;
    }
    .contact-intro {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      margin-bottom: 0.9rem;
    }
    .contact-icon {
      display: grid;
      place-items: center;
      width: 46px;
      height: 46px;
      border: 1px solid #173f3526;
      border-radius: 14px;
      flex-shrink: 0;
    }
    .contact-icon sx-icon {
      width: 24px;
      height: 24px;
    }
    .contact-label {
      font-size: 1.25rem;
      font-weight: 500;
    }
    .contact-intro p {
      font-size: 0.85rem;
      color: #52685a;
      margin-top: 0.2rem;
    }
    .actions .btn {
      width: 100%;
      border-radius: 12px;
      font-size: 1rem;
    }
    .quote-link {
      border: 1px solid #173f3540;
      color: #173f35;
      background: transparent;
      min-height: 52px;
    }
    .quote-link:hover {
      background: #e8eddb;
      border-color: #173f35;
    }
    .hours {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      color: #52685a;
      font-size: 0.75rem;
      margin-top: 0.25rem;
    }
    .status-dot {
      background: #718475;
    }
    .status-dot.is-open {
      background: #347751;
    }
    @media (max-width: 55rem) {
      .panel {
        grid-template-columns: 1fr;
      }
      h2 {
      color: #fffdf3;
        max-width: 22ch;
      }
      .actions {
        max-width: 30rem;
        width: 100%;
      }
    }
    @media (max-width: 30rem) {
      .panel {
        border-radius: 20px;
        padding: 1.5rem;
        gap: 1.75rem;
      }
      h2 {
      color: #fffdf3;
        font-size: 2.35rem;
      }
      .eyebrow {
        font-size: 0.6rem;
      }
      .actions {
        padding: 1.1rem;
      }
      .contact-intro {
        gap: 0.65rem;
      }
      .contact-label {
        font-size: 1.1rem;
      }
      .contact-intro p {
        font-size: 0.75rem;
      }
      .actions .btn {
        font-size: 0.9rem;
        padding-inline: 0.6rem;
      }
    }
  `,
})
export class CtaBand {
  protected readonly business = BUSINESS;
  protected readonly analytics = inject(AnalyticsService);
  protected readonly status = inject(OpenStatus).state;
  readonly heading = input('Your next chapter starts with a conversation.');
  readonly body = input(
    'Send one request for fingerlings, feeds, equipment or a farm visit. We confirm availability, price and delivery with you before anything is final.',
  );
  readonly source = input('unknown');
}

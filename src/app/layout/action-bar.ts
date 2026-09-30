import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  PLATFORM_ID,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs';
import { BUSINESS, whatsappLink } from '../core/data/business';
import { QuoteListStore } from '../core/enquiry/quote-list.store';
import { AnalyticsService } from '../core/services/analytics.service';
import { Icon } from '../ui/icon';

/**
 * Mobile contact bar. Sits in its own reserved space at the bottom of the page
 * (the page pads for it), and steps aside while someone types in a form field
 * so it never covers inputs or the on-screen keyboard.
 */
@Component({
  selector: 'sx-action-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon],
  host: { '[class.is-hidden]': 'typing()' },
  template: `
    <div class="bar" role="region" aria-label="Quick contact">
      <a
        class="btn btn--call call"
        [href]="'tel:' + business.phone.tel"
        (click)="analytics.track('contact_click', { channel: 'phone', page: 'action_bar' })"
      >
        <sx-icon name="phone" /> Call {{ business.phone.display }}
      </a>
      @if (whatsapp) {
        <a
          class="btn btn--secondary"
          [href]="whatsapp"
          target="_blank"
          rel="noopener"
          (click)="analytics.track('contact_click', { channel: 'whatsapp', page: 'action_bar' })"
        >
          <sx-icon name="chat" /> WhatsApp
        </a>
      }
      @if (onQuote()) {
        <a
          class="btn btn--secondary"
          [href]="'mailto:' + business.email"
          (click)="analytics.track('contact_click', { channel: 'email', page: 'action_bar' })"
        >
          <sx-icon name="mail" /> Email
        </a>
      } @else {
        <a
          class="btn btn--secondary"
          routerLink="/quote"
          (click)="analytics.track('cta_click', { cta: 'action_bar_quote' })"
        >
          {{ list.count() ? 'Quote (' + list.count() + ')' : 'Get a quote' }}
        </a>
      }
    </div>
  `,
  styles: `
    :host {
      position: fixed;
      inset: auto 0 0 0;
      z-index: var(--z-actionbar);
      padding: var(--s-3) max(var(--s-4), env(safe-area-inset-left))
        calc(var(--s-3) + env(safe-area-inset-bottom));
      background: color-mix(in srgb, var(--c-bg) 90%, transparent);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-top: 1px solid var(--c-line);
      transition: transform var(--dur-3) var(--ease-out);
    }
    :host(.is-hidden) {
      transform: translateY(110%);
    }
    .bar {
      display: grid;
      grid-auto-flow: column;
      grid-template-columns: minmax(0, 1.7fr);
      grid-auto-columns: minmax(0, 1fr);
      gap: var(--s-2);
    }
    .btn {
      min-height: 50px;
      padding-inline: var(--s-3);
      font-size: 0.975rem;
    }
    .call {
      font-weight: 720;
      box-shadow: none;
    }
    @media (min-width: 48rem) {
      :host {
        display: none;
      }
    }
  `,
})
export class ActionBar {
  protected readonly business = BUSINESS;
  protected readonly whatsapp = whatsappLink('Hello Samaki Express, I would like to ask about ');
  protected readonly list = inject(QuoteListStore);
  protected readonly analytics = inject(AnalyticsService);
  protected readonly typing = signal(false);
  private readonly router = inject(Router);
  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );
  protected readonly onQuote = computed(() => this.url().startsWith('/quote'));

  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
    const doc = inject(DOCUMENT);
    const isField = (t: EventTarget | null) =>
      t instanceof HTMLElement &&
      (t.matches('input, textarea, select, [contenteditable]') || !!t.closest('.p-select'));
    doc.addEventListener('focusin', (e) => this.typing.set(isField(e.target)));
    doc.addEventListener('focusout', () =>
      setTimeout(() => this.typing.set(isField(doc.activeElement))),
    );
  }
}

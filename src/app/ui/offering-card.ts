import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IllustrationId,
  Offering,
  findCategory,
  offeringArt,
  offeringUrl,
} from '../core/data/catalogue';
import { QuoteListStore } from '../core/enquiry/quote-list.store';
import { Icon } from './icon';
import { Illustration } from './illustration';

@Component({
  selector: 'sx-offering-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon, Illustration],
  host: { class: 'card card--interactive' },
  template: `
    <sx-illustration class="art" [name]="art()" />
    <div class="card__body">
      <span class="badge">{{ tag() }}</span>
      <h3 class="h3">
        <a class="card__link" [routerLink]="url()">{{ offering().name }}</a>
      </h3>
      <p class="muted">{{ offering().summary }}</p>
    </div>
    <div class="foot">
      <span class="text-link" aria-hidden="true">Details <sx-icon name="arrow-right" /></span>
      <button
        type="button"
        class="btn btn--sm"
        [class.btn--secondary]="!inList()"
        (click)="toggle()"
        [attr.aria-label]="(inList() ? 'In quote list: ' : 'Add to quote: ') + offering().name"
        [attr.aria-pressed]="inList()"
      >
        <sx-icon [name]="inList() ? 'check' : 'plus'" />
        {{ inList() ? 'In quote list' : 'Add to quote' }}
      </button>
    </div>
  `,
  styles: `
    :host {
      height: 100%;
      container-type: inline-size;
    }
    .art {
      aspect-ratio: 16 / 10;
      border-bottom: 1px solid var(--c-line);
    }
    /* Wide cards (two across on tablets) get a shorter picture. */
    @container (min-width: 24rem) {
      .art {
        aspect-ratio: 2 / 1;
      }
    }
    .art ::ng-deep svg {
      transition: transform var(--dur-4) var(--ease-out);
    }
    :host:hover .art ::ng-deep svg {
      transform: scale(1.04);
    }
    .card__body {
      gap: var(--s-1);
      padding: var(--s-4) var(--s-5) var(--s-3);
    }
    .card__body .h3 {
      font-size: var(--fs-lg);
    }
    .card__body .muted {
      font-size: var(--fs-sm);
    }
    .foot {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: var(--s-2) var(--s-3);
      padding: 0 var(--s-5) var(--s-4);
    }
    .foot .text-link {
      font-size: var(--fs-sm);
    }
    .foot .btn {
      position: relative;
      z-index: 2;
    }
    /* Catalogue rows on phones: thumbnail beside the text, so a list of 13 stays scannable. */
    @media (max-width: 35.99rem) {
      :host(.card--row) {
        display: grid;
        grid-template-columns: clamp(5.5rem, 26vw, 7.5rem) minmax(0, 1fr);
        grid-template-rows: 1fr auto;
      }
      :host(.card--row) .art {
        grid-row: 1 / span 2;
        aspect-ratio: auto;
        height: 100%;
        min-height: 9rem;
        border-bottom: 0;
        border-right: 1px solid var(--c-line);
      }
      :host(.card--row) .card__body {
        gap: var(--s-1);
        padding: var(--s-4) var(--s-4) var(--s-2);
      }
      :host(.card--row) .card__body .muted {
        font-size: var(--fs-sm);
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      :host(.card--row) .h3 {
        font-size: var(--fs-lg);
      }
      :host(.card--row) .badge {
        justify-self: start;
      }
      :host(.card--row) .foot {
        padding: 0 var(--s-4) var(--s-4);
      }
    }
  `,
})
export class OfferingCard {
  readonly offering = input.required<Offering>();
  private readonly list = inject(QuoteListStore);

  protected readonly url = computed(() => offeringUrl(this.offering()));
  protected readonly inList = computed(() =>
    this.list.items().some((i) => i.slug === this.offering().slug),
  );
  protected readonly art = computed<IllustrationId>(() => {
    const o = this.offering();
    return offeringArt(o);
  });
  protected readonly tag = computed(() => {
    const o = this.offering();
    return o.kind === 'product' ? findCategory(o.category).shortName : 'Service';
  });

  toggle(): void {
    const slug = this.offering().slug;
    if (this.inList()) this.list.remove(slug);
    else this.list.add(slug);
  }
}

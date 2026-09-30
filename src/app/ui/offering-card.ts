import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IllustrationId, Offering, findCategory, offeringArt, offeringUrl } from '../core/data/catalogue';
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
      <button type="button" class="btn btn--sm" [class.btn--secondary]="!inList()" (click)="toggle()"
        [attr.aria-label]="(inList() ? 'Remove ' : 'Add ') + offering().name + (inList() ? ' from' : ' to') + ' your quote list'"
        [attr.aria-pressed]="inList()">
        <sx-icon [name]="inList() ? 'check' : 'plus'" />
        {{ inList() ? 'In quote list' : 'Add to quote' }}
      </button>
    </div>
  `,
  styles: `
    :host { height: 100%; }
    .art { aspect-ratio: 4 / 3; border-bottom: 1px solid var(--c-line); }
    .art ::ng-deep svg { transition: transform var(--dur-4) var(--ease-out); }
    :host:hover .art ::ng-deep svg { transform: scale(1.04); }
    .card__body { padding-bottom: var(--s-3); }
    .foot { display: flex; align-items: center; justify-content: space-between; gap: var(--s-3); padding: 0 var(--s-6) var(--s-5); }
    .foot .text-link { font-size: var(--fs-sm); }
    .foot .btn { position: relative; z-index: 2; }
  `,
})
export class OfferingCard {
  readonly offering = input.required<Offering>();
  private readonly list = inject(QuoteListStore);

  protected readonly url = computed(() => offeringUrl(this.offering()));
  protected readonly inList = computed(() => this.list.items().some((i) => i.slug === this.offering().slug));
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

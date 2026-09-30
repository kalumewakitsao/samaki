import { ChangeDetectionStrategy, Component, computed, inject, input, linkedSignal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { InputText } from 'primeng/inputtext';
import { CATEGORIES, CategoryId, PRODUCTS, findCategory } from '../../core/data/catalogue';
import { AnalyticsService } from '../../core/services/analytics.service';
import { SeoService, breadcrumbJsonLd } from '../../core/services/seo.service';
import { Breadcrumbs } from '../../ui/breadcrumbs';
import { CtaBand } from '../../ui/cta-band';
import { Icon } from '../../ui/icon';
import { OfferingCard } from '../../ui/offering-card';

@Component({
  selector: 'sx-products',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, InputText, Breadcrumbs, CtaBand, Icon, OfferingCard],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class ProductsPage {
  /** Bound from ?category= and ?q= so filtered views can be shared and survive reloads. */
  readonly category = input<string>();
  readonly q = input<string>();

  private readonly router = inject(Router);
  private readonly analytics = inject(AnalyticsService);
  protected readonly categories = CATEGORIES;

  protected readonly active = linkedSignal<CategoryId | null>(() => {
    const c = this.category();
    return CATEGORIES.some((x) => x.id === c) ? (c as CategoryId) : null;
  });
  protected readonly search = linkedSignal(() => this.q() ?? '');

  protected readonly results = computed(() => {
    const cat = this.active();
    const term = this.search().trim().toLowerCase();
    return PRODUCTS.filter((p) => !cat || p.category === cat).filter(
      (p) => !term || `${p.name} ${p.summary} ${findCategory(p.category).name}`.toLowerCase().includes(term),
    );
  });
  protected readonly counts = computed(() =>
    Object.fromEntries(CATEGORIES.map((c) => [c.id, PRODUCTS.filter((p) => p.category === c.id).length])),
  );
  protected readonly heading = computed(() => {
    const c = this.active();
    return c ? findCategory(c).name : 'All products';
  });

  constructor() {
    inject(SeoService).set({
      title: 'Products: fingerlings, hatchery feeds, water testing and aeration',
      description:
        'Fingerlings, Artemia and Wean Mix feeds, Ovaprim and Ovatide, water test kits, dissolved oxygen meters, air pumps and filters for fish farms. Request a quote.',
      path: '/products',
      jsonLd: [breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Products', path: '/products' }])],
    });
  }

  setCategory(id: CategoryId | null): void {
    this.active.set(id);
    this.sync();
    this.analytics.track('catalogue_filter', { category: id ?? 'all' });
  }

  onSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
    this.sync();
  }

  commitSearch(): void {
    if (this.search().trim()) this.analytics.track('catalogue_search', { results: this.results().length });
  }

  clear(): void {
    this.active.set(null);
    this.search.set('');
    this.sync();
  }

  private sync(): void {
    this.router.navigate([], {
      queryParams: { category: this.active() ?? null, q: this.search().trim() || null },
      replaceUrl: true,
      preserveFragment: true,
    });
  }
}

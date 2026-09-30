import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { AnalyticsService } from '../services/analytics.service';
import { findOffering } from '../data/catalogue';
import type { EnquiryItem } from './enquiry-schema';

const LIST_KEY = 'samaki-quote-list';
const LAST_KEY = 'samaki-last-request';

/**
 * The visitor's quote list: offerings they want priced together. Stored on the
 * device only, so a returning customer finds their list, and their last sent
 * request, waiting for them.
 */
@Injectable({ providedIn: 'root' })
export class QuoteListStore {
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly analytics = inject(AnalyticsService);
  private readonly _items = signal<EnquiryItem[]>([]);
  private readonly _last = signal<EnquiryItem[]>([]);

  readonly items = this._items.asReadonly();
  readonly count = computed(() => this._items().length);
  readonly lastRequest = this._last.asReadonly();

  constructor() {
    if (!this.browser) return;
    this._items.set(this.read(LIST_KEY));
    this._last.set(this.read(LAST_KEY));
  }

  has(slug: string): boolean {
    return this._items().some((i) => i.slug === slug);
  }

  add(slug: string, quantity = ''): void {
    const offering = findOffering(slug);
    if (!offering || this.has(slug)) return;
    this.update([...this._items(), { slug, name: offering.name, quantity }]);
    this.analytics.track('quote_list_add', { offering: slug });
  }

  remove(slug: string): void {
    this.update(this._items().filter((i) => i.slug !== slug));
    this.analytics.track('quote_list_remove', { offering: slug });
  }

  setQuantity(slug: string, quantity: string): void {
    this.update(this._items().map((i) => (i.slug === slug ? { ...i, quantity } : i)));
  }

  /** Called after a request is delivered: remembers it for a quick repeat order and empties the list. */
  completed(items: EnquiryItem[]): void {
    this._last.set(items);
    this.write(LAST_KEY, items);
    this.update([]);
  }

  repeatLast(): void {
    const merged = [...this._items()];
    for (const item of this._last()) if (!merged.some((m) => m.slug === item.slug)) merged.push(item);
    this.update(merged);
  }

  private update(items: EnquiryItem[]): void {
    this._items.set(items);
    this.write(LIST_KEY, items);
  }

  private read(key: string): EnquiryItem[] {
    try {
      const parsed = JSON.parse(localStorage.getItem(key) ?? '[]');
      return Array.isArray(parsed) ? parsed.filter((i) => findOffering(i?.slug)).slice(0, 20) : [];
    } catch {
      return [];
    }
  }

  private write(key: string, items: EnquiryItem[]): void {
    if (!this.browser) return;
    try {
      localStorage.setItem(key, JSON.stringify(items));
    } catch {
      // Storage unavailable: the list still works for this visit.
    }
  }
}

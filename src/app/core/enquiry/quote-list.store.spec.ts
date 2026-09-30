import { TestBed } from '@angular/core/testing';
import { QuoteListStore } from './quote-list.store';

describe('QuoteListStore', () => {
  beforeEach(() => localStorage.clear());

  it('adds known offerings once, persists them and remembers the last request', () => {
    const store = TestBed.inject(QuoteListStore);
    store.add('artemia');
    store.add('artemia');
    store.add('not-a-product');
    expect(store.count()).toBe(1);
    store.setQuantity('artemia', '2 kg');
    expect(JSON.parse(localStorage.getItem('samaki-quote-list')!)[0].quantity).toBe('2 kg');

    store.completed(store.items());
    expect(store.count()).toBe(0);
    store.repeatLast();
    expect(store.items()[0]).toEqual({ slug: 'artemia', name: 'Artemia', quantity: '2 kg' });
  });
});

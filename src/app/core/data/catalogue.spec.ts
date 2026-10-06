import { findProduct, findService, offeringImage } from './catalogue';

describe('catalogue image helpers', () => {
  it('uses a real product photo when one exists, and falls back to the illustration otherwise', () => {
    expect(offeringImage(findProduct('artemia')!)).toBe('/images/artemia.jpg');
    expect(offeringImage(findService('delivery')!)).toBeUndefined();
  });
});

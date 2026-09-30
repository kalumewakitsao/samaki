import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { BUSINESS } from '../data/business';

export interface PageSeo {
  title: string;
  description: string;
  path: string;
  /** Extra JSON-LD blocks for this page. The organisation block is always added. */
  jsonLd?: object[];
  noindex?: boolean;
}

const OG_IMAGE = `${BUSINESS.siteUrl}/og-image.png`;

export function organisationJsonLd(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${BUSINESS.siteUrl}/#business`,
    name: BUSINESS.name,
    legalName: BUSINESS.legalName,
    url: BUSINESS.siteUrl,
    logo: `${BUSINESS.siteUrl}/icon-512.png`,
    image: OG_IMAGE,
    description:
      'Fingerlings, hatchery feeds, water testing, aeration equipment and farm support for fish farmers.',
    telephone: BUSINESS.phone.tel,
    email: BUSINESS.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.address.street,
      addressLocality: BUSINESS.address.locality,
      addressCountry: BUSINESS.address.country,
    },
    openingHours: BUSINESS.hours.schema,
  };
}

export function breadcrumbJsonLd(trail: { name: string; path: string }[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: `${BUSINESS.siteUrl}${t.path === '/' ? '' : t.path}`,
    })),
  };
}

/** Sets title, description, canonical, social tags and structured data for a page, on the server and in the browser. */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);

  set(page: PageSeo): void {
    const url = `${BUSINESS.siteUrl}${page.path === '/' ? '/' : page.path}`;
    const fullTitle = page.path === '/' ? page.title : `${page.title} | ${BUSINESS.name}`;
    this.title.setTitle(fullTitle);

    const tags: [string, string, 'name' | 'property'][] = [
      ['description', page.description, 'name'],
      ['robots', page.noindex ? 'noindex, follow' : 'index, follow', 'name'],
      ['og:type', 'website', 'property'],
      ['og:site_name', BUSINESS.name, 'property'],
      ['og:locale', 'en_KE', 'property'],
      ['og:title', fullTitle, 'property'],
      ['og:description', page.description, 'property'],
      ['og:url', url, 'property'],
      ['og:image', OG_IMAGE, 'property'],
      ['og:image:width', '1200', 'property'],
      ['og:image:height', '630', 'property'],
      ['og:image:alt', 'Samaki Express: fingerlings, feeds and farm support', 'property'],
      ['twitter:card', 'summary_large_image', 'name'],
      ['twitter:title', fullTitle, 'name'],
      ['twitter:description', page.description, 'name'],
      ['twitter:image', OG_IMAGE, 'name'],
    ];
    for (const [key, content, attr] of tags) {
      this.meta.updateTag({ [attr]: key, content }, `${attr}="${key}"`);
    }

    let link = this.doc.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.rel = 'canonical';
      this.doc.head.appendChild(link);
    }
    link.href = url;

    this.doc.head.querySelectorAll('script[data-seo]').forEach((s) => s.remove());
    for (const block of [organisationJsonLd(), ...(page.jsonLd ?? [])]) {
      const script = this.doc.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo', '');
      script.textContent = JSON.stringify(block).replace(/</g, '\\u003c');
      this.doc.head.appendChild(script);
    }
  }
}

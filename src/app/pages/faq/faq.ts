import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BUSINESS } from '../../core/data/business';
import { SeoService, breadcrumbJsonLd } from '../../core/services/seo.service';
import { Breadcrumbs } from '../../ui/breadcrumbs';
import { CtaBand } from '../../ui/cta-band';
import { Icon } from '../../ui/icon';

interface Qa {
  q: string;
  a: string;
  link?: { label: string; path: string };
}

const GROUPS: { title: string; items: Qa[] }[] = [
  {
    title: 'Ordering',
    items: [
      {
        q: 'How do I order?',
        a: 'Add the products or services you need to your quote list and send one request with your quantities and location. Our team contacts you to confirm availability, price and delivery. Nothing is final until you agree. You can also call us.',
        link: { label: 'Request a quote', path: '/quote' },
      },
      {
        q: 'Why are prices not shown online?',
        a: 'Prices depend on the quantities you need and on delivery to your area, so we confirm them for each request. Send a quote request or call us for a price.',
      },
      {
        q: 'Can I order the same items again?',
        a: 'Yes. After you send a request, this site remembers it on your device. Next time, open the quote page and choose "Repeat my last request", then adjust quantities if needed.',
      },
      {
        q: 'Can you help me choose the right product?',
        a: 'Yes. Tell us your farm type, its size and what you are trying to fix, and we will suggest what to order and how much.',
        link: { label: 'Talk to us', path: '/contact' },
      },
    ],
  },
  {
    title: 'Delivery and visits',
    items: [
      {
        q: 'Do you deliver?',
        a: 'Yes. We deliver fingerlings, feeds and equipment. The delivery date and cost are agreed with you when we confirm your order.',
        link: { label: 'About delivery', path: '/services/delivery' },
      },
      {
        q: 'Which areas do you cover?',
        a: 'We are based in Nairobi and support farmers across East Africa. Tell us your town or county in your request and we will confirm delivery or a visit to your area.',
      },
      {
        q: 'Can someone visit my farm?',
        a: 'Yes. Our field team visits farms to assess how they run and leaves you with a practical action plan.',
        link: { label: 'On-site farm support', path: '/services/on-site-farm-support' },
      },
    ],
  },
  {
    title: 'Getting started',
    items: [
      {
        q: 'I am new to fish farming. Where do I start?',
        a: 'Start with a conversation. Our training and farm assessment services help you plan your ponds, stocking and feeding before you spend on stock.',
        link: { label: 'Training and upskilling', path: '/services/training' },
      },
      {
        q: 'Do you supply hatcheries?',
        a: 'Yes. We supply spawning hormones such as Ovaprim and Ovatide, first feeds such as Artemia and Wean Mix, and tank filtration, and we support hatchery setup and breeding programmes.',
        link: { label: 'Hatchery inputs', path: '/products' },
      },
    ],
  },
  {
    title: 'About us',
    items: [
      {
        q: 'Where are you and when are you open?',
        a: `We are at ${BUSINESS.address.street}, ${BUSINESS.address.locality}. We are open ${BUSINESS.hours.display.toLowerCase()}.`,
        link: { label: 'Contact details', path: '/contact' },
      },
      {
        q: 'How do you use my details?',
        a: 'Only to reply to your request or message. We send farming tips and offers only if you ask for them, and you can stop them at any time.',
        link: { label: 'Privacy notice', path: '/privacy' },
      },
    ],
  },
];

@Component({
  selector: 'sx-faq',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Breadcrumbs, CtaBand, Icon],
  template: `
    <section class="head">
      <div class="container">
        <sx-breadcrumbs [trail]="[{ label: 'Home', path: '/' }, { label: 'FAQ' }]" />
        <div class="intro">
          <h1 class="h1">Questions and answers</h1>
          <p class="lead">
            How ordering, delivery and farm visits work. Cannot find your answer? Call
            {{ business.phone.display }}.
          </p>
        </div>
      </div>
    </section>
    <section class="section body">
      <div class="container layout">
        <nav class="toc" aria-label="Topics">
          <ul role="list">
            @for (g of groups; track g.title) {
              <li>
                <a [href]="'/faq#' + slug(g.title)">{{ g.title }}</a>
              </li>
            }
          </ul>
        </nav>
        <div class="groups">
          @for (g of groups; track g.title) {
            <section [id]="slug(g.title)" [attr.aria-labelledby]="slug(g.title) + '-h'">
              <h2 class="h3 g-title" [id]="slug(g.title) + '-h'">{{ g.title }}</h2>
              @for (item of g.items; track item.q) {
                <details>
                  <summary>
                    <span>{{ item.q }}</span
                    ><sx-icon name="plus" />
                  </summary>
                  <div class="answer">
                    <p>{{ item.a }}</p>
                    @if (item.link; as l) {
                      <a class="text-link" [routerLink]="l.path"
                        >{{ l.label }} <sx-icon name="arrow-right"
                      /></a>
                    }
                  </div>
                </details>
              }
            </section>
          }
        </div>
      </div>
    </section>
    <sx-cta-band
      source="faq"
      heading="Still have a question?"
      body="Ask it in a quote request, or call us during business hours. A person on our team will answer."
    />
  `,
  styles: `
    .head {
      padding-block: var(--s-6) 0;
    }
    .intro {
      display: grid;
      gap: var(--s-4);
      margin-top: var(--s-6);
      max-width: 44rem;
    }
    .body {
      padding-top: var(--s-10);
    }
    .layout {
      display: grid;
      gap: var(--s-8);
    }
    @media (min-width: 62rem) {
      .layout {
        grid-template-columns: 14rem 1fr;
        gap: var(--s-16);
      }
      .toc {
        position: sticky;
        top: 6rem;
        align-self: start;
      }
    }
    .toc ul {
      display: flex;
      flex-wrap: wrap;
      gap: var(--s-2);
      list-style: none;
      padding: 0;
    }
    @media (min-width: 62rem) {
      .toc ul {
        display: grid;
        gap: 0;
      }
    }
    .toc a {
      display: inline-flex;
      align-items: center;
      min-height: var(--tap);
      padding: 0 var(--s-3);
      border-radius: var(--r-pill);
      color: var(--c-ink-2);
      text-decoration: none;
      font-weight: 560;
    }
    .toc a:hover {
      color: var(--c-ink);
      background: var(--c-surface-2);
    }
    .groups {
      display: grid;
      gap: var(--s-12);
      max-width: 48rem;
    }
    .g-title {
      margin-bottom: var(--s-3);
      scroll-margin-top: 6rem;
    }
    details {
      border-bottom: 1px solid var(--c-line);
    }
    summary {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--s-4);
      min-height: 3.5rem;
      padding: var(--s-4) 0;
      cursor: pointer;
      list-style: none;
      font-weight: 620;
      font-size: var(--fs-lg);
      color: var(--c-ink);
    }
    summary::-webkit-details-marker {
      display: none;
    }
    summary sx-icon {
      width: 1.25rem;
      height: 1.25rem;
      color: var(--c-brand-text);
      transition: transform var(--dur-3) var(--ease-out);
    }
    details[open] summary sx-icon {
      transform: rotate(45deg);
    }
    summary:focus-visible {
      border-radius: var(--r-xs);
    }
    .answer {
      display: grid;
      gap: var(--s-3);
      padding-bottom: var(--s-5);
      color: var(--c-ink-2);
      max-width: var(--measure);
    }
    @media (prefers-reduced-motion: no-preference) {
      details[open] .answer {
        animation: open var(--dur-3) var(--ease-out);
      }
    }
    @keyframes open {
      from {
        opacity: 0;
        transform: translateY(-4px);
      }
      to {
        opacity: 1;
        transform: none;
      }
    }
  `,
})
export class FaqPage {
  protected readonly business = BUSINESS;
  protected readonly groups = GROUPS;

  constructor() {
    inject(SeoService).set({
      title: 'Questions and answers',
      description:
        'How to order fingerlings, feeds and equipment from Samaki Express, how delivery and farm visits work, and where to find us.',
      path: '/faq',
      jsonLd: [
        breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'FAQ', path: '/faq' },
        ]),
        {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: GROUPS.flatMap((g) => g.items).map((i) => ({
            '@type': 'Question',
            name: i.q,
            acceptedAnswer: { '@type': 'Answer', text: i.a },
          })),
        },
      ],
    });
  }

  protected slug(s: string): string {
    return s.toLowerCase().replace(/[^a-z]+/g, '-');
  }
}

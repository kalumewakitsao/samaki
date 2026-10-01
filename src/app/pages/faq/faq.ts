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
  templateUrl: './faq.html',
  styleUrl: './faq.scss',
})
export class FaqPage {
  protected readonly business = BUSINESS;
  protected readonly groups = GROUPS;
  protected readonly topicIcons = ['list', 'truck', 'sprout', 'people'];

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

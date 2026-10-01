import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BUSINESS } from '../../core/data/business';
import { CATEGORIES, PROCESS, SERVICES, findProduct } from '../../core/data/catalogue';
import { AnalyticsService } from '../../core/services/analytics.service';
import { SeoService } from '../../core/services/seo.service';
import { HomeHero } from './hero';
import { Testimonials } from './testimonials';
import { CallBand } from '../../ui/call-band';
import { CtaBand } from '../../ui/cta-band';
import { Icon } from '../../ui/icon';
import { Illustration } from '../../ui/illustration';
import { OfferingCard } from '../../ui/offering-card';

@Component({
  selector: 'sx-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    Icon,
    Illustration,
    OfferingCard,
    CtaBand,
    CallBand,
    HomeHero,
    Testimonials,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomePage {
  protected readonly business = BUSINESS;
  protected readonly categories = CATEGORIES;
  protected readonly services = SERVICES.slice(0, 6);
  protected readonly process = PROCESS;
  protected readonly featured = [
    'fingerlings',
    'artemia',
    'dissolved-oxygen-analyzer',
    'vento-airpump',
  ].map((s) => findProduct(s)!);
  protected readonly analytics = inject(AnalyticsService);

  protected readonly audiences = [
    {
      icon: 'flask',
      title: 'Hatcheries',
      body: 'Spawning hormones, Artemia, weaning feeds and tank filtration, plus support with setup and breeding programmes.',
      link: '/products',
      query: { category: 'hatchery' },
      cta: 'Hatchery inputs',
    },
    {
      icon: 'droplet',
      title: 'Pond farms',
      body: 'Fingerlings for stocking, water testing kits and aeration, with feeding and water plans that fit your ponds.',
      link: '/products',
      query: { category: 'testing' },
      cta: 'Water testing',
    },
    {
      icon: 'fish',
      title: 'Cage farms',
      body: 'Stock, monitoring and practical advice to keep cage production on track through each cycle.',
      link: '/services/farm-audits-advisory',
      query: null,
      cta: 'Audits and advisory',
    },
    {
      icon: 'sprout',
      title: 'New farmers',
      body: 'Starting out? Get the basics right with training, a farm assessment and a first order sized to your space.',
      link: '/services/training',
      query: null,
      cta: 'Training',
    },
  ];

  protected readonly journey = [
    {
      icon: 'list',
      title: 'Build your list',
      body: 'Add the products and services you need. Your list is saved on this device.',
    },
    {
      icon: 'mail',
      title: 'Send one request',
      body: 'Add quantities and your location. It takes about two minutes.',
    },
    {
      icon: 'phone',
      title: 'We confirm the details',
      body: 'Our team contacts you to confirm availability, price and delivery.',
    },
    {
      icon: 'truck',
      title: 'Delivery or a visit',
      body: 'Your order is delivered, or a specialist visits your farm, on the date you agree.',
    },
  ];

  constructor() {
    inject(SeoService).set({
      title: 'Samaki Express | Fingerlings, feeds and fish farm support in Kenya',
      description:
        'Fingerlings, hatchery feeds, water testing kits, aeration equipment and hands-on farm support for fish farmers. Based in Nairobi. Request a quote.',
      path: '/',
      socialTitle: 'Your fish farm. Supplied. Supported. | Samaki Express',
      socialDescription:
        'Fingerlings, feeds, equipment and hands-on farm support in Kenya. Tell us what your farm needs — we’ll help you plan your next step.',
    });
  }
}

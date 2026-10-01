import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SERVICES } from '../../core/data/catalogue';
import { SeoService, breadcrumbJsonLd } from '../../core/services/seo.service';
import { Breadcrumbs } from '../../ui/breadcrumbs';
import { CtaBand } from '../../ui/cta-band';
import { Icon } from '../../ui/icon';
import { BUSINESS } from '../../core/data/business';
import { QuoteListStore } from '../../core/enquiry/quote-list.store';

@Component({
  selector: 'sx-services',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Breadcrumbs, CtaBand, Icon],
  templateUrl: './services.html',
  styleUrl: './services.scss',
})
export class ServicesPage {
  protected readonly business = BUSINESS;
  protected readonly services = SERVICES.map((service, i) => ({
    ...service,
    outcome: [
      'Give your next cycle a strong start.',
      'Make feeding and water care work together.',
      'Get a fresh pair of eyes on your farm.',
      'Build healthier daily routines.',
      'Understand what is holding your farm back.',
      'Give your team the confidence to grow.',
      'Get your supplies to the farm.',
    ][i],
    need: [
      'Planning to stock a pond or run a hatchery? Get inputs and breeding support matched to your plan.',
      'Unsure about feeding or water conditions? Build a practical routine for your next production cycle.',
      'Some questions are easier to answer on the farm. A field specialist can assess your setup and help you decide what to do next.',
      'Want a more consistent approach to fish health? Get help with screening, vaccination guidance and biosecurity.',
      'Ready to review how your farm is performing? Understand your operation and plan your next cycle with clearer information.',
      'New to fish farming, or bringing your team up to speed? Turn advice into skills you can use every day.',
      'Need fingerlings, feeds or equipment delivered? Agree the timing and handling with our team before your order is final.',
    ][i],
  }));
  protected readonly startingPoints = [
    {
      icon: 'sprout',
      title: 'I’m starting a fish farm',
      detail: 'Build your knowledge before you stock.',
      slug: 'training',
    },
    {
      icon: 'droplet',
      title: 'My farm needs attention',
      detail: 'Get practical help with your setup.',
      slug: 'on-site-farm-support',
    },
    {
      icon: 'fish',
      title: 'I’m planning my next cycle',
      detail: 'Organise stock, inputs and support.',
      slug: 'hatchery-supply',
    },
  ];
  protected readonly process = [
    {
      title: 'Tell us about your farm',
      body: 'Share your location, your setup and the challenge or goal you have in mind.',
    },
    {
      title: 'Agree the right support',
      body: 'We discuss what you need and confirm scope, availability, timing and cost.',
    },
    {
      title: 'Put your plan to work',
      body: 'Arrange your supplies, farm visit or training once you are happy to proceed.',
    },
    {
      title: 'Know your next step',
      body: 'Leave with practical guidance. Call the team when you need a second opinion.',
    },
  ];
  protected readonly list = inject(QuoteListStore);
  protected toggle(slug: string): void {
    if (this.list.has(slug)) this.list.remove(slug);
    else this.list.add(slug);
  }

  constructor() {
    inject(SeoService).set({
      title: 'Fish farm services: hatchery supply, farm visits, training and delivery',
      description:
        'Hatchery supply, feed and water management, on-site farm support, health and biosecurity, audits, training and delivery for fish farmers.',
      path: '/services',
      jsonLd: [
        breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
        ]),
      ],
    });
  }
}

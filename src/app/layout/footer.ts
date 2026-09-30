import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BUSINESS, whatsappLink } from '../core/data/business';
import { CATEGORIES, SERVICES } from '../core/data/catalogue';
import { AnalyticsService } from '../core/services/analytics.service';
import { Icon } from '../ui/icon';
import { Logo } from '../ui/logo';

@Component({
  selector: 'sx-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon, Logo],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  protected readonly business = BUSINESS;
  protected readonly categories = CATEGORIES;
  protected readonly services = SERVICES;
  protected readonly whatsapp = whatsappLink('Hello Samaki Express, I would like to ask about ');
  protected readonly analytics = inject(AnalyticsService);
  protected readonly year = new Date().getFullYear();
}

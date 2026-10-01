import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BUSINESS } from '../../core/data/business';
import { CATEGORIES } from '../../core/data/catalogue';
import { AnalyticsService } from '../../core/services/analytics.service';
import { Icon } from '../../ui/icon';

@Component({
  selector: 'sx-home-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class HomeHero {
  protected readonly business = BUSINESS;
  protected readonly categories = CATEGORIES;
  protected readonly analytics = inject(AnalyticsService);
}

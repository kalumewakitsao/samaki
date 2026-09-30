import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { Drawer } from 'primeng/drawer';
import { BUSINESS } from '../core/data/business';
import { QuoteListStore } from '../core/enquiry/quote-list.store';
import { AnalyticsService } from '../core/services/analytics.service';
import { Icon } from '../ui/icon';
import { Logo } from '../ui/logo';
import { ThemeToggle } from '../ui/theme-toggle';
import { NAV } from './nav';

@Component({
  selector: 'sx-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, Drawer, Icon, Logo, ThemeToggle],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected readonly nav = NAV;
  protected readonly business = BUSINESS;
  protected readonly list = inject(QuoteListStore);
  protected readonly analytics = inject(AnalyticsService);
  protected readonly menuOpen = signal(false);

  constructor() {
    inject(Router)
      .events.pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.menuOpen.set(false));
  }
}

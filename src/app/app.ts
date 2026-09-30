import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, PLATFORM_ID, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, skip } from 'rxjs';
import { ActionBar } from './layout/action-bar';
import { Footer } from './layout/footer';
import { Header } from './layout/header';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, Header, Footer, ActionBar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
    const doc = inject(DOCUMENT);
    // After in-app navigation, move focus to the new page's heading so keyboard
    // and screen-reader users start at the top of the new content.
    inject(Router)
      .events.pipe(
        filter((e) => e instanceof NavigationEnd),
        skip(1),
        takeUntilDestroyed(),
      )
      .subscribe((e) => {
        if (e.urlAfterRedirects.includes('#')) return;
        setTimeout(() => {
          const target = doc.querySelector<HTMLElement>('main h1') ?? doc.getElementById('main');
          if (!target) return;
          target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
        });
      });
  }
}

import { ChangeDetectionStrategy, Component, RESPONSE_INIT, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';
import { Icon } from '../../ui/icon';
import { Illustration } from '../../ui/illustration';

@Component({
  selector: 'sx-not-found',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon, Illustration],
  template: `
    <section class="section">
      <div class="container layout">
        <div class="stack stack--lg">
          <p class="eyebrow">Error 404</p>
          <h1 class="h1">This page swam off</h1>
          <p class="lead">The link may be old or mistyped. Here are the places most people are looking for.</p>
          <ul class="links" role="list">
            <li><a routerLink="/products"><sx-icon name="fish" /> Products</a></li>
            <li><a routerLink="/services"><sx-icon name="people" /> Farm services</a></li>
            <li><a routerLink="/quote"><sx-icon name="list" /> Request a quote</a></li>
            <li><a routerLink="/contact"><sx-icon name="phone" /> Contact us</a></li>
          </ul>
          <a class="btn" routerLink="/"><sx-icon name="home" /> Go to the home page</a>
        </div>
        <sx-illustration name="fingerlings" label="" class="art" />
      </div>
    </section>
  `,
  styles: `
    .layout { display: grid; gap: var(--s-10); align-items: center; }
    @media (min-width: 60rem) { .layout { grid-template-columns: 1.2fr 1fr; } }
    .art { aspect-ratio: 4 / 3; border-radius: var(--r-xl); border: 1px solid var(--c-line); }
    .links { display: grid; gap: var(--s-2); list-style: none; padding: 0; }
    @media (min-width: 36rem) { .links { grid-template-columns: 1fr 1fr; } }
    .links a { display: flex; align-items: center; gap: var(--s-3); min-height: 52px; padding: 0 var(--s-4); border-radius: var(--r-md); background: var(--c-surface); border: 1px solid var(--c-line); color: var(--c-ink); text-decoration: none; font-weight: 600; }
    .links a:hover { border-color: var(--c-brand); }
    .links sx-icon { width: 1.2rem; height: 1.2rem; color: var(--c-brand-text); }
    .btn { justify-self: start; }
  `,
})
export class NotFoundPage {
  constructor() {
    const res = inject(RESPONSE_INIT, { optional: true });
    if (res) res.status = 404;
    inject(SeoService).set({ title: 'Page not found', description: 'This page does not exist.', path: inject(Router).url, noindex: true });
  }
}

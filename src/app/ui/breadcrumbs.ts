import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from './icon';

export interface Crumb {
  label: string;
  path?: string;
}

@Component({
  selector: 'sx-breadcrumbs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon],
  template: `
    <nav aria-label="Breadcrumb">
      <ol role="list">
        @for (c of trail(); track c.label; let last = $last) {
          <li>
            @if (c.path && !last) {
              <a [routerLink]="c.path">{{ c.label }}</a>
              <sx-icon name="chevron-right" />
            } @else {
              <span aria-current="page">{{ c.label }}</span>
            }
          </li>
        }
      </ol>
    </nav>
  `,
  styles: `
    ol { display: flex; flex-wrap: wrap; align-items: center; gap: var(--s-1) var(--s-2); font-size: var(--fs-sm); color: var(--c-ink-2); }
    li { display: inline-flex; align-items: center; gap: var(--s-2); }
    a { color: var(--c-ink-2); text-decoration: none; padding-block: var(--s-2); }
    a:hover { color: var(--c-ink); text-decoration: underline; }
    sx-icon { width: 0.9rem; height: 0.9rem; opacity: 0.6; }
    [aria-current] { color: var(--c-ink); font-weight: 560; }
  `,
})
export class Breadcrumbs {
  readonly trail = input.required<Crumb[]>();
}

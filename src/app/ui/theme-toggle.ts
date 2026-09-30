import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { AnalyticsService } from '../core/services/analytics.service';
import { ThemeService } from '../core/services/theme.service';
import { Icon } from './icon';

@Component({
  selector: 'sx-theme-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon],
  template: `
    <button type="button" class="toggle" (click)="toggle()" [attr.aria-label]="label()" [title]="label()">
      <sx-icon class="sun" name="sun" />
      <sx-icon class="moon" name="moon" />
    </button>
  `,
  styles: `
    .toggle {
      position: relative; display: grid; place-items: center;
      width: var(--tap); height: var(--tap); border-radius: var(--r-pill);
      border: 1px solid var(--c-line); background: var(--c-surface); color: var(--c-ink);
      transition: background-color var(--dur-2) var(--ease-out), border-color var(--dur-2);
    }
    .toggle:hover { background: var(--c-surface-2); border-color: var(--c-line-strong); }
    sx-icon { grid-area: 1 / 1; width: 1.2rem; height: 1.2rem; transition: transform var(--dur-3) var(--ease-out), opacity var(--dur-2); }
    .moon { opacity: 0; transform: rotate(-60deg) scale(0.6); }
    :host-context([data-theme='dark']) .sun { opacity: 0; transform: rotate(60deg) scale(0.6); }
    :host-context([data-theme='dark']) .moon { opacity: 1; transform: none; }
  `,
})
export class ThemeToggle {
  private readonly theme = inject(ThemeService);
  private readonly analytics = inject(AnalyticsService);
  protected readonly label = computed(() => (this.theme.theme() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'));

  toggle(): void {
    this.theme.toggle();
    this.analytics.track('theme_change', { theme: this.theme.theme() });
  }
}

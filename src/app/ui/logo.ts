import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Samaki Express mark: a fish in a pond-shaped tile, its tail drawn as a
 * forward chevron (express), with the sun above the water.
 */
@Component({
  selector: 'sx-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg class="mark" viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <rect width="40" height="40" rx="11" fill="var(--logo-tile, var(--c-ink))" />
      <circle cx="31" cy="9.5" r="3.2" fill="var(--ill-fish)" />
      <path
        d="M5 13.5 L10.5 20 L5 26.5"
        fill="none"
        stroke="var(--logo-fish, var(--c-bg))"
        stroke-width="2.6"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M11 20 C15.5 12.8 24.5 11.6 33.5 20 C24.5 28.4 15.5 27.2 11 20 Z"
        fill="var(--logo-fish, var(--c-bg))"
      />
      <circle cx="27.4" cy="18.6" r="1.7" fill="var(--logo-tile, var(--c-ink))" />
      <path
        d="M21.5 15.6 Q23.2 20 21.5 24.4"
        fill="none"
        stroke="var(--logo-tile, var(--c-ink))"
        stroke-width="1.5"
        stroke-linecap="round"
      />
    </svg>
    @if (!compact()) {
      <span class="word"><span class="a">Samaki</span><span class="b">Express</span></span>
    }
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: calc(var(--logo-size, 1.3rem) * 0.46);
      color: var(--c-ink);
    }
    .mark {
      flex-shrink: 0;
      width: calc(var(--logo-size, 1.3rem) * 1.73);
      height: calc(var(--logo-size, 1.3rem) * 1.73);
    }
    .word {
      display: inline-flex;
      align-items: baseline;
      gap: 0.3rem;
      font-family: var(--font-display);
      font-size: var(--logo-size, 1.3rem);
      white-space: nowrap;
      line-height: 1;
      letter-spacing: -0.03em;
    }
    .a {
      font-weight: 700;
    }
    .b {
      font-weight: 400;
      color: var(--c-ink-3);
    }
  `,
})
export class Logo {
  readonly compact = input(false);
}

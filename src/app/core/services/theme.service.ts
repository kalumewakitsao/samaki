import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';

export type Theme = 'light' | 'dark';
const STORAGE_KEY = 'samaki-theme';

/**
 * Light and dark themes. The first paint is handled by the inline script in
 * index.html; this service keeps the choice in sync afterwards. With no saved
 * choice the site follows the system setting, live.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly doc = inject(DOCUMENT);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  readonly theme = signal<Theme>('light');

  constructor() {
    if (!this.browser) return;
    this.theme.set(
      this.doc.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light',
    );
    window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!this.saved()) this.apply(e.matches ? 'dark' : 'light');
    });
  }

  toggle(): void {
    const next: Theme = this.theme() === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage can be blocked; the theme still changes for this visit.
    }
    this.apply(next);
  }

  private saved(): Theme | null {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      return v === 'dark' || v === 'light' ? v : null;
    } catch {
      return null;
    }
  }

  private apply(theme: Theme): void {
    const root = this.doc.documentElement;
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme;
    this.theme.set(theme);
  }
}

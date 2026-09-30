import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { App } from './app';

describe('App', () => {
  it('renders the shell with skip link, navigation and footer', async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([]), provideHttpClient(), providePrimeNG()],
    }).compileComponents();
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.skip')?.getAttribute('href')).toBe('#main');
    expect(el.querySelectorAll('nav[aria-label="Main"] a').length).toBe(5);
    expect(el.querySelector('footer')?.textContent).toContain('0704 944 034');
  });
});

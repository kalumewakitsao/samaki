import { Routes } from '@angular/router';
import { REDIRECTS } from '../server/redirects';

/** Client-side copies of the server's permanent redirects, for static hosting and in-app links. */
const legacy: Routes = Object.entries(REDIRECTS).map(([from, to]) => ({
  path: from.slice(1),
  redirectTo: to === '/' ? '' : to.slice(1),
  pathMatch: 'full',
}));

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then((m) => m.HomePage) },
  { path: 'products', loadComponent: () => import('./pages/products/products').then((m) => m.ProductsPage) },
  { path: 'products/:slug', loadComponent: () => import('./pages/offering/offering').then((m) => m.OfferingPage), data: { kind: 'product' } },
  { path: 'services', loadComponent: () => import('./pages/services/services').then((m) => m.ServicesPage) },
  { path: 'services/:slug', loadComponent: () => import('./pages/offering/offering').then((m) => m.OfferingPage), data: { kind: 'service' } },
  { path: 'quote', loadComponent: () => import('./pages/quote/quote').then((m) => m.QuotePage) },
  { path: 'about', loadComponent: () => import('./pages/about/about').then((m) => m.AboutPage) },
  { path: 'contact', loadComponent: () => import('./pages/contact/contact').then((m) => m.ContactPage) },
  { path: 'faq', loadComponent: () => import('./pages/faq/faq').then((m) => m.FaqPage) },
  { path: 'privacy', loadComponent: () => import('./pages/privacy/privacy').then((m) => m.PrivacyPage) },
  ...legacy,
  { path: '**', loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFoundPage) },
];

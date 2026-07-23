import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'test-storage',
    loadComponent: () =>
      import('./test-storage-page/test-storage-page').then((m) => m.TestStoragePage),
  },
  {
    path: 'bakery/workshop',
    loadComponent: () =>
      import('./features/workshop/workshop-page/workshop-page').then((m) => m.WorkshopPage),
  },
  {
    path: 'bakery/workshop/apply',
    loadComponent: () =>
      import('./features/workshop/apply-page/apply-page').then((m) => m.ApplyPage),
  },
  {
    path: 'bakery/workshop/checkout',
    loadComponent: () =>
      import('./features/workshop/checkout-page/checkout-page').then((m) => m.CheckoutPage),
  },
  {
    path: 'bakery/workshop/payment',
    loadComponent: () =>
      import('./features/workshop/payment-page/payment-page').then((m) => m.PaymentPage),
  },
  {
    path: 'bakery/workshop/admin',
    loadComponent: () =>
      import('./features/workshop/admin-page/admin-page').then((m) => m.AdminPage),
  },
];

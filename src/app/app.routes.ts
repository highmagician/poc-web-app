import { Routes } from '@angular/router';

import { adminAuthGuard } from './auth/admin-auth.guard';
import { clientStatusGuard } from './auth/client-status.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'firebase',
    pathMatch: 'full',
  },
  {
    path: 'firebase',
    loadComponent: () =>
      import('./features/firebase-page/firebase-page').then((m) => m.FirebasePage),
  },
  {
    path: 'test-storage',
    loadComponent: () =>
      import('./test-storage-page/test-storage-page').then((m) => m.TestStoragePage),
  },
  {
    path: 'promptpay-demo',
    loadComponent: () =>
      import('./promptpay-demo-page/promptpay-demo-page').then((m) => m.PromptPayDemoPage),
  },
  {
    path: 'fcm-demo',
    loadComponent: () => import('./fcm-demo-page/fcm-demo-page').then((m) => m.FcmDemoPage),
  },
  {
    path: 'email-demo',
    loadComponent: () =>
      import('./email-demo-page/email-demo-page').then((m) => m.EmailDemoPage),
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
    path: 'bakery/workshop/check-status/login',
    loadComponent: () =>
      import('./features/workshop/check-status-login-page/check-status-login-page').then(
        (m) => m.CheckStatusLoginPage,
      ),
  },
  {
    path: 'bakery/workshop/check-status',
    canActivate: [clientStatusGuard],
    loadComponent: () =>
      import('./features/workshop/check-status-page/check-status-page').then(
        (m) => m.CheckStatusPage,
      ),
  },
  {
    path: 'bakery/workshop/admin/login',
    loadComponent: () =>
      import('./features/workshop/admin-login-page/admin-login-page').then(
        (m) => m.AdminLoginPage,
      ),
  },
  {
    path: 'bakery/workshop/admin',
    canActivate: [adminAuthGuard],
    loadComponent: () =>
      import('./features/workshop/admin-page/admin-page').then((m) => m.AdminPage),
  },
];

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from './auth.service';

export const adminAuthGuard: CanActivateFn = async (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  await authService.waitUntilReady();

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/bakery/workshop/admin/login'], {
    queryParams: { returnUrl: state.url },
  });
};

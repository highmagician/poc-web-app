import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { ClientStatusService } from '../features/workshop/client-status.service';

export const clientStatusGuard: CanActivateFn = (_route, state) => {
  const clientStatusService = inject(ClientStatusService);
  const router = inject(Router);

  if (clientStatusService.application()) {
    return true;
  }

  return router.createUrlTree(['/bakery/workshop/check-status/login'], {
    queryParams: { returnUrl: state.url },
  });
};

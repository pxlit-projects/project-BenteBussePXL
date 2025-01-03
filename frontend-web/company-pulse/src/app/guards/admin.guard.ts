import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { inject } from '@angular/core';

export const AdminGuard: CanActivateFn = (route, state) => {
  const authService : AuthService = inject(AuthService);
  const router : Router = inject(Router);
  if (authService.isEditor()) {
    return true;
  }
  router.navigate(['']);
  return false;
};

import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { inject } from '@angular/core';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService : AuthService = inject(AuthService);
  const router : Router = inject(Router);
  console.log(authService.loggedIn);
  if (authService.loggedIn) {
    return true;
  }
  router.navigate(['login']);
  return false;
};

import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import {
  StorageKeys,
  StorageService,
} from '../services/storage/storage.service';

import { isTokenExpired } from '../../core/jwt.utils';

/** Requires a stored access token (browser only; SSR always allows). */
export const authGuard: CanActivateFn = () => {
  const platformId = inject(PLATFORM_ID);
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const router = inject(Router);
  const token = inject(StorageService).getKey<string>(StorageKeys.AuthToken);

  // No token at all → send to register
  if (!token) {
    return router.createUrlTree(['/account/register']);
  }

  // Token exists but is expired → clear it and send to home
  if (isTokenExpired(token)) {
    inject(StorageService).removeKey(StorageKeys.AuthToken); // clean up
    return router.createUrlTree(['/']);
  }

  return true;
};

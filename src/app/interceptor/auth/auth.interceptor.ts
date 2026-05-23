import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  HttpEvent,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  StorageKeys,
  StorageService,
} from '../../services/storage/storage.service';

/** Paths that must not receive a Bearer token (e.g. login/signup). */
const PUBLIC_AUTH_PATH_MARKERS = ['/api/auth/login', '/api/auth/signup'];

function isPublicAuthRequest(url: string): boolean {
  return PUBLIC_AUTH_PATH_MARKERS.some((segment) => url.includes(segment));
}

/**
 * Adds the stored access token as `Authorization: Bearer …` for API calls.
 */
export const authInterceptor: HttpInterceptorFn = (
  request,
  next,
): Observable<HttpEvent<unknown>> => {
  const storage = inject(StorageService);
  const platformId = inject(PLATFORM_ID);

  if (isPublicAuthRequest(request.url)) {
    console.log('authInterceptor: Skipping token for public auth endpoint:', request.url);
    return next(request);
  }

  const isBrowser = isPlatformBrowser(platformId);
  if (!isBrowser) {
    console.log('authInterceptor: Not in browser context, skipping token');
    return next(request);
  }

  const accessToken = storage.getKey<string>(StorageKeys.AuthToken);
  
  console.log('authInterceptor - URL:', request.url, 'Token:', accessToken ? 'present' : 'MISSING');
  
  if (!accessToken) {
    console.warn('authInterceptor: No access token found for protected route:', request.url);
    return next(request);
  }

  console.log('authInterceptor: Adding Bearer token to request');
  return next(
    request.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  );
};

export function mapRequestWithHeaders(
  accessToken: string | null,
  request: HttpRequest<unknown>,
): HttpRequest<unknown> {
  if (!accessToken) {
    return request;
  }
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

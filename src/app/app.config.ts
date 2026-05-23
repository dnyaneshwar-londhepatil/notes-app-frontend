import {
  ApplicationConfig,
  provideZoneChangeDetection,
  importProvidersFrom,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import {
  LocalStorageDriver,
  EMPTY_DRIVER,
  type Driver,
} from './services/storage/storage-drivers';
import { authInterceptor } from './interceptor/auth/auth.interceptor';

function localStorageDriverFactory(): Driver {
  const platformId = inject(PLATFORM_ID);
  
  // Only use real localStorage on the browser
  if (isPlatformBrowser(platformId)) {
    return globalThis.localStorage as unknown as Driver;
  }
  return EMPTY_DRIVER;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    importProvidersFrom(NgbModule),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    {
      provide: LocalStorageDriver,
      useFactory: localStorageDriverFactory,
    },
  ],
};

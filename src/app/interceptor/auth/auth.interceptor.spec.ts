import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn } from '@angular/common/http';

import { authInterceptor } from './auth.interceptor';
import { LocalStorageDriver, EMPTY_DRIVER } from '../../services/storage/storage-drivers';
import { StorageService } from '../../services/storage/storage.service';

describe('authInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => authInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StorageService,
        { provide: LocalStorageDriver, useValue: EMPTY_DRIVER },
      ],
    });
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { StorageService } from './storage.service';
import { LocalStorageDriver, EMPTY_DRIVER } from './storage-drivers';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: LocalStorageDriver, useValue: EMPTY_DRIVER }],
    });
    service = TestBed.inject(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

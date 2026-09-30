import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { NotesService } from './notes.service';
import { LocalStorageDriver } from '../storage/storage-drivers';

describe('NotesService', () => {
  let service: NotesService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: LocalStorageDriver,
          useValue: { getItem: () => 'test-token' },
        },
      ],
    });
    service = TestBed.inject(NotesService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('shares an in-flight notes request', () => {
    service.getNotes();
    service.getNotes();

    const request = httpTesting.expectOne((req) =>
      req.url.endsWith('/api/notes'),
    );
    expect(request.request.method).toBe('GET');
    const note = {
      _id: 'note-1',
      category: 'work',
      title: 'Test note',
      content: 'Test content',
      isPinned: false,
      userId: 'user-1',
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    };
    request.flush([note]);

    expect(service.notes()).toEqual([note]);
  });
});

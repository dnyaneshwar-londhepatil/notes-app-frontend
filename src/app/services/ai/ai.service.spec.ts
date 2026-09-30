import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { AiService } from './ai.service';

describe('AiService', () => {
  let service: AiService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AiService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('sends content and note id to the summarize endpoint', () => {
    service.summarizeNotes('Note content', 'note-1').subscribe();

    const request = httpTesting.expectOne((req) =>
      req.url.endsWith('/api/ai/summarize'),
    );
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      content: 'Note content',
      noteId: 'note-1',
    });
    request.flush({ success: true, summary: 'Saved', note: {} });
  });
});

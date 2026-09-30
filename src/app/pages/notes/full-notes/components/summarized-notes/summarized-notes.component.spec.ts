import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { signal } from '@angular/core';
import { Subject } from 'rxjs';

import { SummarizedNotesComponent } from './summarized-notes.component';
import { AiService } from '../../../../../services/ai/ai.service';

describe('SummarizedNotesComponent', () => {
  let component: SummarizedNotesComponent;
  let fixture: ComponentFixture<SummarizedNotesComponent>;
  let summaries: ReturnType<typeof signal<Record<string, string>>>;
  let summarizeNotes: jasmine.Spy;

  beforeEach(async () => {
    summaries = signal<Record<string, string>>({});
    summarizeNotes = jasmine.createSpy('summarizeNotes').and.returnValue(new Subject());
    await TestBed.configureTestingModule({
      imports: [SummarizedNotesComponent],
      providers: [
        {
          provide: AiService,
          useValue: {
            summaries,
            summaryErrors: signal<Record<string, string>>({}),
            summarizeNotes,
            setSummary: () => {},
            setSummaryError: () => {},
            clearSummaryError: () => {},
          },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummarizedNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('does not request a summary when the detail view opens', () => {
    fixture.componentRef.setInput('noteId', 'note-1');
    fixture.componentRef.setInput('content', 'Note content');
    fixture.detectChanges();

    expect(summarizeNotes).not.toHaveBeenCalled();
  });

  it('types a summary received from the shared signal', fakeAsync(() => {
    fixture.componentRef.setInput('noteId', 'note-1');
    fixture.detectChanges();

    summaries.set({ 'note-1': 'Ready' });
    fixture.detectChanges();
    tick(54);

    expect(component.typedSummary()).toBe('Ready');
  }));
});

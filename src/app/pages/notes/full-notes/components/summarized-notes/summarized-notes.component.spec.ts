import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { SummarizedNotesComponent } from './summarized-notes.component';
import { AiService } from '../../../../../services/ai/ai.service';
import { NotesService } from '../../../../../services/notes/notes.service';

describe('SummarizedNotesComponent', () => {
  let component: SummarizedNotesComponent;
  let fixture: ComponentFixture<SummarizedNotesComponent>;
  let summarizeNotes: jasmine.Spy;
  let updateNoteSummary: jasmine.Spy;

  beforeEach(async () => {
    summarizeNotes = jasmine.createSpy('summarizeNotes').and.returnValue(new Subject());
    updateNoteSummary = jasmine.createSpy('updateNoteSummary');
    await TestBed.configureTestingModule({
      imports: [SummarizedNotesComponent],
      providers: [
        {
          provide: AiService,
          useValue: {
            summarizeNotes,
          },
        },
        { provide: NotesService, useValue: { updateNoteSummary } },
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

  it('types a summary received from the persisted note field', fakeAsync(() => {
    fixture.componentRef.setInput('noteId', 'note-1');
    fixture.componentRef.setInput('summary', 'Ready');
    fixture.detectChanges();

    tick(54);

    expect(component.typedSummary()).toBe('Ready');
  }));

  it('persists a regenerated summary through NotesService', () => {
    const response = new Subject<{ success: boolean; summary: string; note: object }>();
    summarizeNotes.and.returnValue(response);
    fixture.componentRef.setInput('noteId', 'note-1');
    fixture.componentRef.setInput('content', 'Note content');
    fixture.detectChanges();

    component.regenerateSummary();
    response.next({ success: true, summary: 'Updated', note: {} });

    expect(summarizeNotes).toHaveBeenCalledWith('Note content', 'note-1');
    expect(updateNoteSummary).toHaveBeenCalledWith('note-1', 'Updated');
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { NotesCardComponent } from './notes-card.component';
import { AiService } from '../../../services/ai/ai.service';
import { ModalService } from '../../../services/modal/modal.service';
import { NotesService } from '../../../services/notes/notes.service';

describe('NotesCardComponent', () => {
  let component: NotesCardComponent;
  let fixture: ComponentFixture<NotesCardComponent>;
  let summarizeNotes: jasmine.Spy;
  let updateNoteSummary: jasmine.Spy;

  beforeEach(async () => {
    summarizeNotes = jasmine.createSpy('summarizeNotes').and.returnValue(new Subject());
    updateNoteSummary = jasmine.createSpy('updateNoteSummary');
    await TestBed.configureTestingModule({
      imports: [NotesCardComponent],
      providers: [
        {
          provide: AiService,
          useValue: {
            summarizeNotes,
          },
        },
        { provide: NotesService, useValue: { updateNoteSummary } },
        { provide: ModalService, useValue: { open: () => {} } },
        { provide: Router, useValue: { navigate: () => Promise.resolve(true) } },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotesCardComponent);
    fixture.componentRef.setInput('note', {
      _id: 'note-1',
      category: 'work',
      title: 'Test note',
      content: 'Test content',
      isPinned: false,
      userId: 'user-1',
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    });
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sends only one summary request while a request is pending', () => {
    component.handleSummarize('note content');
    component.handleSummarize('note content');

    expect(summarizeNotes).toHaveBeenCalledTimes(1);
  });

  it('updates the note with the API summary', () => {
    const response = new Subject<{ success: boolean; summary: string; note: object }>();
    summarizeNotes.and.returnValue(response);

    component.handleSummarize('note content');
    response.next({
      success: true,
      summary: 'Generated summary',
      note: {},
    });

    expect(summarizeNotes).toHaveBeenCalledWith('note content', 'note-1');
    expect(updateNoteSummary).toHaveBeenCalledWith(
      'note-1',
      'Generated summary',
    );
  });
});

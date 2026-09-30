import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { NotesCardComponent } from './notes-card.component';
import { AiService } from '../../../services/ai/ai.service';
import { ModalService } from '../../../services/modal/modal.service';

describe('NotesCardComponent', () => {
  let component: NotesCardComponent;
  let fixture: ComponentFixture<NotesCardComponent>;
  let summarizeNotes: jasmine.Spy;

  beforeEach(async () => {
    summarizeNotes = jasmine.createSpy('summarizeNotes').and.returnValue(new Subject());
    await TestBed.configureTestingModule({
      imports: [NotesCardComponent],
      providers: [
        { provide: AiService, useValue: { summarizeNotes } },
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
});

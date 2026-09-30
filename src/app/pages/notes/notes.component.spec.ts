import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { NotesComponent } from './notes.component';
import { NotesService } from '../../services/notes/notes.service';
import { AuthService } from '../../services/auth/auth.service';
import { ModalService } from '../../services/modal/modal.service';
import { AiService } from '../../services/ai/ai.service';
import { Note } from '../../interfaces/notes';

describe('NotesComponent', () => {
  let component: NotesComponent;
  let fixture: ComponentFixture<NotesComponent>;
  let notes: ReturnType<typeof signal<Note[]>>;
  let error: ReturnType<typeof signal<string | null>>;

  beforeEach(async () => {
    notes = signal<Note[]>([]);
    error = signal<string | null>(null);
    await TestBed.configureTestingModule({
      imports: [NotesComponent],
      providers: [
        {
          provide: NotesService,
          useValue: {
            notes,
            error,
            isLoading: signal(false),
            getNotes: jasmine.createSpy('getNotes'),
          },
        },
        { provide: AuthService, useValue: { logout: () => {} } },
        { provide: ModalService, useValue: { open: () => {}, closeModal: () => {} } },
        { provide: AiService, useValue: { summarizeNotes: () => of({ summary: '' }) } },
        { provide: Router, useValue: { navigate: () => Promise.resolve(true) } },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders notes after the notes signal is populated', () => {
    notes.set([
      {
        _id: 'note-1',
        category: 'work',
        title: 'Rendered note',
        content: 'Note content',
        isPinned: false,
        userId: 'user-1',
        createdAt: new Date('2026-01-01'),
        updatedAt: new Date('2026-01-01'),
      },
    ]);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.note-title').textContent)
      .toContain('Rendered note');
  });

  it('shows a failed notes load instead of a blank list', () => {
    error.set('Unable to load notes');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent)
      .toContain('Unable to load notes');
  });
});

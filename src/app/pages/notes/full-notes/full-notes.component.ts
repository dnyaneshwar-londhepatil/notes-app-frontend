import {
  Component,
  computed,
  effect,
  inject,
  signal,
  Signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotesService } from '../../../services/notes/notes.service';
import { NotesListComponent } from './components/notes-list/notes-list.component';
import { NoteDetailsComponent } from './components/note-details/note-details.component';
import { Note } from '../../../interfaces/notes';
import { ButtonComponent } from '../../../shared/button/button.component';

@Component({
  selector: 'app-full-notes',
  imports: [NotesListComponent, NoteDetailsComponent, ButtonComponent],
  templateUrl: './full-notes.component.html',
  styleUrl: './full-notes.component.scss',
})
export class FullNotesComponent {
  public notesService = inject(NotesService);

  public getAllNotes = computed(() => this.notesService.notes());

  public notesCount = computed(() => this.getAllNotes().length);

  public selectedNote = signal<Note | null>(null);

  public selectedNoteId = signal('');

  public activatedRoute = inject(ActivatedRoute);

  public router = inject(Router);

  public notesList: Signal<Note[]> = computed(() => {
    if (this.notesCount() === 0) {
      return [];
    }

    return this.getAllNotes();
  });

  constructor() {
    this.notesService.getNotes();
    this.activatedRoute.params.subscribe((params) => {
      this.selectedNoteId.set(params['id']);
    });

    effect(() => {
      this.selectedNote.set(
        this.getAllNotes().find(
          (note) => note?._id === this.selectedNoteId(),
        ) ?? null,
      );

      const selectedNote = this.getAllNotes().find(
        (note) => note?._id === this.selectedNoteId(),
      );

      this.selectedNote.set(selectedNote ?? null);
    });
  }

  public onNoteSelected(noteId: string) {
    const allNotes = this.getAllNotes();
    const selectedNote = allNotes.find((note) => note?._id === noteId);

    this.selectedNote.set(selectedNote ?? null);
  }

  public handleBackNavigation() {
    this.selectedNote.set(null);
    this.router.navigate(['/notes-list']);
  }
}

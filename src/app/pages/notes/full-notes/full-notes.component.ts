import { Component, computed, effect, inject, Signal } from '@angular/core';
import { NotesService } from '../../../services/notes/notes.service';
import { NotesListComponent } from './components/notes-list/notes-list.component';
import { NoteDetailsComponent } from './components/note-details/note-details.component';
import { Note } from '../../../interfaces/notes';

@Component({
  selector: 'app-full-notes',
  imports: [NotesListComponent, NoteDetailsComponent],
  templateUrl: './full-notes.component.html',
  styleUrl: './full-notes.component.scss',
})
export class FullNotesComponent {
  public notesService = inject(NotesService);

  public getAllNotes = computed(() => this.notesService.notes());

  public notesCount = computed(() => this.getAllNotes().length);

  public notesList: Signal<Note[]> = computed(() => {
    if (this.notesCount() === 0) {
      return [];
    }

    return this.getAllNotes();
  });

  constructor() {
    this.notesService.getNotes();

    effect(() => {
      console.log('All notes:', this.getAllNotes());
    });
  }
}

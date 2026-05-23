import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  inject,
  PLATFORM_ID,
  computed,
  effect,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { defer, of } from 'rxjs';

import { SearchNotesComponent } from './search-notes/search-notes.component';
import { NotesCardComponent } from './notes-card/notes-card.component';
import { NotesService } from '../../services/notes/notes.service';
import { Note } from '../../interfaces/notes';

@Component({
  selector: 'app-notes',
  imports: [SearchNotesComponent, NotesCardComponent],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.scss',
})
export class NotesComponent {
  private readonly notesService = inject(NotesService);

  private readonly platformId = inject(PLATFORM_ID);

  public getAllNotes = computed(() => this.notesService.notes());

  constructor() {
    this.notesService.getNotes();
  }

  public filterNotes(category: string) {
    console.log(`Filtering notes in NotesComponent by category: ${category}`);
    switch (category) {
      case 'all': {
        this.getAllNotes = computed(() => this.notesService.notes());
        break;
      }
      case 'personal': {
        this.getAllNotes = computed(() =>
          this.notesService
            .notes()
            .filter((note) => note.category === 'personal'),
        );
        break;
      }
      case 'ideas': {
        this.getAllNotes = computed(() =>
          this.notesService.notes().filter((note) => note.category === 'ideas'),
        );
        break;
      }
      case 'work': {
        this.getAllNotes = computed(() =>
          this.notesService.notes().filter((note) => note.category === 'work'),
        );
        break;
      }
      case 'urgent': {
        this.getAllNotes = computed(() =>
          this.notesService
            .notes()
            .filter((note) => note.category === 'urgent'),
        );
        break;
      }
      default: {
        this.getAllNotes = computed(() => this.notesService.notes());
        break;
      }
    }
  }
}

import { Component, computed, inject, signal } from '@angular/core';
import { debounceTime, distinctUntilChanged, of, Subject, switchMap } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { SearchNotesComponent } from './search-notes/search-notes.component';
import { NotesCardComponent } from './notes-card/notes-card.component';
import { NotesService } from '../../services/notes/notes.service';
import { Note, SearchResultNote } from '../../interfaces/notes';

@Component({
  selector: 'app-notes',
  imports: [SearchNotesComponent, NotesCardComponent],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.scss',
})
export class NotesComponent {
  private readonly notesService = inject(NotesService);

  private readonly searchQueries = new Subject<string>();

  private readonly searchedNotes = signal<SearchResultNote[] | null>(null);

  private readonly activeCategory = signal('all');

  public readonly isLoading = this.notesService.isLoading;

  public readonly error = this.notesService.error;

  public getAllNotes = computed(() => {
    const notes = this.searchedNotes() ?? this.notesService.notes();
    const category = this.activeCategory();
    return category === 'all'
      ? notes
      : notes.filter((note) => note.category === category);
  });

  constructor() {
    this.notesService.getNotes();

    this.searchQueries
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((query) =>
          query
            ? this.notesService.searchNotes(query).pipe(
                catchError(() => of([] as SearchResultNote[])),
              )
            : of(null),
        ),
      )
      .subscribe((results) => this.searchedNotes.set(results));
  }

  public filterNotes(category: string) {
    this.activeCategory.set(category);
  }

  public searchNotes(query: string) {
    this.searchQueries.next(query.trim());
  }
}

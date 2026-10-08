import { inject, Injectable, signal, effect } from '@angular/core';
import {
  Note,
  CreateNotePayload,
  SearchNotesResponse,
  SearchResultNote,
} from '../../interfaces/notes';
import { ApiConfigService } from '../api-config/api-config.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError, tap, finalize, map } from 'rxjs/operators';
import { StorageKeys, StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  private readonly apiConfig = inject(ApiConfigService);

  private readonly storageService = inject(StorageService);

  private readonly http = inject(HttpClient);

  readonly isLoading = signal(false);

  readonly error = signal<string | null>(null);

  public notes = signal<Note[]>([]);

  private hasLoaded = signal(false);

  constructor() {}

  public getNotes(forceRefresh: boolean = false): void {
    if (this.isLoading()) {
      return;
    }

    if (!forceRefresh && this.hasLoaded()) {
      return;
    }

    const token = this.storageService.getKey<string>(StorageKeys.AuthToken);

    if (!token) {
      this.error.set('Authentication token is missing. Please log in again.');
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const url = this.apiConfig.url('api/notes');

    this.error.set(null);
    this.isLoading.set(true);

    this.http
      .get<Note[]>(url, { headers })
      .pipe(
        tap((response) => {
          this.notes.set(response);
          this.error.set(null);
          this.hasLoaded.set(true);
        }),
        catchError((err: HttpErrorResponse) => {
          this.error.set(
            err.error?.message ||
              err.statusText ||
              'Unable to load notes. Please try again.',
          );

          return EMPTY;
        }),
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe();
  }

  public searchNotes(query: string): Observable<SearchResultNote[]> {
    const token = this.storageService.getKey<string>(StorageKeys.AuthToken);

    if (!token) {
      this.error.set('Authentication token is missing. Please log in again.');
      return throwError(() => new Error('Authentication token is missing.'));
    }

    const url = this.apiConfig.url('api/notes/search');

    this.error.set(null);

    return this.http
      .post<SearchNotesResponse>(url, { query }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .pipe(
        map((response) => response.results),
        tap(() => this.error.set(null)),
        catchError((err: HttpErrorResponse) => {
          this.error.set(
            err.error?.message ||
              err.statusText ||
              'Unable to search notes. Please try again.',
          );
          return throwError(() => err);
        }),
      );
  }

  public updateNoteSummary(noteId: string, summarizedNotes: string): void {
    this.notes.update((current) =>
      current.map((note) =>
        note._id === noteId ? { ...note, summarizedNotes } : note,
      ),
    );
  }

  public addNewNote(payload: CreateNotePayload): Observable<Note> {
    const url = this.apiConfig.url('api/notes');

    return this.http.post<Note>(url, payload).pipe(
      tap((newNote) => {
        this.notes.update((current) => [...current, newNote]);
        this.error.set(null);
        this.hasLoaded.set(false); // Force refresh on next getNotes call to ensure data consistency
      }),
      catchError((err: HttpErrorResponse) => {
        this.error.set(err.error?.message ?? err.statusText);
        return throwError(() => err);
      }),
      finalize(() => this.isLoading.set(false)),
    );
  }

  public deleteNote(noteId: string): Observable<void> {
    const url = this.apiConfig.url(`api/notes/${noteId}`);

    return this.http.delete<void>(url).pipe(
      tap(() => {
        this.notes.update((current) =>
          current.filter((note) => note._id !== noteId),
        );
        this.error.set(null);
        this.hasLoaded.set(false); // Force refresh on next getNotes call to ensure data consistency
      }),
      catchError((err: HttpErrorResponse) => {
        this.error.set(err.error?.message ?? err.statusText);
        return throwError(() => err);
      }),
      finalize(() => this.isLoading.set(false)),
    );
  }
}

import { inject, Injectable, signal, effect } from '@angular/core';
import { Note, CreateNotePayload } from '../../interfaces/notes';
import { ApiConfigService } from '../api-config/api-config.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, finalize } from 'rxjs/operators';
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

  constructor() {}

  public getNotes(): void {
    const token = this.storageService.getKey<string>(StorageKeys.AuthToken);

    if (!token) {
      this.error.set('Authentication token is missing. Please log in again.');
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const url = this.apiConfig.url('api/notes');

    this.isLoading.set(true);

    this.http
      .get<Note[]>(url, { headers })
      .pipe(
        tap((response) => {
          this.notes.set(response);
          this.error.set(null);
        }),
        catchError((err: HttpErrorResponse) => {
          this.error.set(err.error?.message ?? err.statusText);

          return throwError(() => err);
        }),
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe();
  }

  public addNewNote(payload: CreateNotePayload): Observable<Note> {
    const url = this.apiConfig.url('api/notes');

    return this.http.post<Note>(url, payload).pipe(
      tap((newNote) => {
        this.notes.update((current) => [...current, newNote]);
        this.error.set(null);
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
      }),
      catchError((err: HttpErrorResponse) => {
        this.error.set(err.error?.message ?? err.statusText);
        return throwError(() => err);
      }),
      finalize(() => this.isLoading.set(false)),
    );
  }
}

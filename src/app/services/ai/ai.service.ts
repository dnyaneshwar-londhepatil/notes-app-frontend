import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiConfigService } from '../api-config/api-config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AiService {
  private readonly apiConfig = inject(ApiConfigService);
  private readonly http = inject(HttpClient);

  public readonly summaries = signal<Record<string, string>>({});

  public readonly summaryErrors = signal<Record<string, string>>({});

  public setSummary(noteId: string, summary: string): void {
    this.summaries.update((current) => ({ ...current, [noteId]: summary }));
    this.clearSummaryError(noteId);
  }

  public clearSummaryError(noteId: string): void {
    this.summaryErrors.update((current) => {
      const next = { ...current };
      delete next[noteId];
      return next;
    });
  }

  public setSummaryError(noteId: string, message: string): void {
    this.summaryErrors.update((current) => ({ ...current, [noteId]: message }));
  }

  public summarizeNotes(content: string): Observable<{ summary: string }> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = this.apiConfig.url('api/ai/summarize');

    return this.http.post<{ summary: string }>(url, { content }, { headers });
  }
}

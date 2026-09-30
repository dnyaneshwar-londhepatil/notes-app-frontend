import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiConfigService } from '../api-config/api-config.service';
import { Observable } from 'rxjs';
import { Note } from '../../interfaces/notes';

@Injectable({
  providedIn: 'root',
})
export class AiService {
  private readonly apiConfig = inject(ApiConfigService);
  private readonly http = inject(HttpClient);

  public summarizeNotes(
    content: string,
    noteId: string,
  ): Observable<{ success: boolean; summary: string; note: Note }> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = this.apiConfig.url('api/ai/summarize');

    return this.http.post<{ success: boolean; summary: string; note: Note }>(
      url,
      { content, noteId },
      { headers },
    );
  }
}

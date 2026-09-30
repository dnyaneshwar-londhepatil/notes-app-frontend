import {
  Component,
  OnDestroy,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { Subscription, finalize } from 'rxjs';
import { AiService } from '../../../../../services/ai/ai.service';
import { NotesService } from '../../../../../services/notes/notes.service';
import { ButtonComponent } from '../../../../../shared/button/button.component';

@Component({
  selector: 'app-summarized-notes',
  imports: [ButtonComponent],
  templateUrl: './summarized-notes.component.html',
  styleUrl: './summarized-notes.component.scss',
})
export class SummarizedNotesComponent implements OnDestroy {
  public noteId = input('');
  public content = input('');
  public summary = input('');
  public typedSummary = signal('');
  public isGenerating = signal(false);
  public isTyping = signal(false);
  public error = signal<string | null>(null);

  private readonly aiService = inject(AiService);
  private readonly notesService = inject(NotesService);
  private request?: Subscription;
  private typingTimer?: ReturnType<typeof setInterval>;

  private readonly summaryEffect = effect(() => {
    const summary = this.summary();
    if (summary) this.error.set(null);
    this.typeText(summary);
  });

  public regenerateSummary(): void {
    const content = this.content().trim();
    const noteId = this.noteId();
    if (!content || !noteId || this.isGenerating()) return;

    this.request?.unsubscribe();
    this.clearTyping();
    this.error.set(null);
    this.isGenerating.set(true);

    this.request = this.aiService
      .summarizeNotes(content, noteId)
      .pipe(finalize(() => this.isGenerating.set(false)))
      .subscribe({
        next: ({ summary }) =>
          this.notesService.updateNoteSummary(noteId, summary),
        error: (error) => {
          const message =
            error?.error?.message ?? 'Unable to generate the summary.';
          this.error.set(message);
        },
      });
  }

  private typeText(text: string): void {
    this.clearTyping();
    this.typedSummary.set('');
    if (!text) return;

    let index = 0;
    this.isTyping.set(true);

    this.typingTimer = setInterval(() => {
      index = Math.min(index + 2, text.length);
      this.typedSummary.set(text.slice(0, index));

      if (index >= text.length) this.clearTyping();
    }, 18);
  }

  private clearTyping(): void {
    if (this.typingTimer !== undefined) {
      clearInterval(this.typingTimer);
      this.typingTimer = undefined;
    }
    this.isTyping.set(false);
  }

  ngOnDestroy(): void {
    this.request?.unsubscribe();
    this.clearTyping();
  }
}
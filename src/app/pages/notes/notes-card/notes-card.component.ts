import { Component, input, inject } from '@angular/core';
import { TagComponent } from '../../../shared/tag/tag.component';
import { ButtonComponent } from '../../../shared/button/button.component';
import { Note } from '../../../interfaces/notes';
import { ModalService } from '../../../services/modal/modal.service';
import { DeleteNoteComponent } from '../delete-note/delete-note.component';
import { UpperCasePipe } from '@angular/common';
import { AiService } from '../../../services/ai/ai.service';

@Component({
  selector: 'app-notes-card',
  imports: [TagComponent, ButtonComponent, UpperCasePipe],
  templateUrl: './notes-card.component.html',
  styleUrl: './notes-card.component.scss',
})
export class NotesCardComponent {
  public note = input<Note>();

  public modalService = inject(ModalService);

  public aiService = inject(AiService);

  public dateFormat(): string {
    const createdAt = new Date(this.note()?.createdAt as Date);
    const dateParts = Intl.DateTimeFormat('en', {
      month: 'short',
      year: 'numeric',
      day: 'numeric',
    })
      .formatToParts(createdAt)
      .reduce<{ year: number; month: string; day: number }>(
        (carry, parts) => {
          switch (parts.type) {
            case 'day':
            case 'year':
            case 'month':
              carry[parts.type] = parts.value as never;
              break;
          }
          return carry;
        },
        {
          year: 0,
          month: '',
          day: 0,
        },
      );

    return `${dateParts.day} ${dateParts.month} ${dateParts.year}`;
  }

  public handleDelete() {
    console.log(this.note());
    this.modalService.open(DeleteNoteComponent, {
      size: 'md',
      data: {
        selectedNoteId: this.note()?._id,
      },
    });
  }

  public handleSummarize(content: string) {
    console.log('Summarize notes functionality triggered', content);
    return this.aiService.summarizeNotes(content).subscribe((summary) => {
      console.log('Note summarized:', summary);
    });
  }
}

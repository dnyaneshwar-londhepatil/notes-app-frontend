import { DatePipe } from '@angular/common';
import {
  Component,
  input,
  inject,
  signal,
  output,
  effect,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Note } from '../../../../../interfaces/notes';
import { ButtonComponent } from '../../../../../shared/button/button.component';
import { not } from 'rxjs/internal/util/not';

@Component({
  selector: 'app-notes-list',
  imports: [DatePipe, ButtonComponent],
  templateUrl: './notes-list.component.html',
  styleUrl: './notes-list.component.scss',
})
export class NotesListComponent {
  public notesList = input<Note[]>();

  public activatedRoute = inject(ActivatedRoute);

  public selectedNoteIdFromList = signal('');

  public selectedNoteId = input('');

  public selectedNote = output<string>();

  constructor() {
    effect(() => {
      this.selectedNoteIdFromList.set(this.selectedNoteId());
    });
  }

  public handleNoteSelection(noteId: string) {
    this.selectedNoteIdFromList.set(noteId);
    this.selectedNote.emit(noteId);
  }
}

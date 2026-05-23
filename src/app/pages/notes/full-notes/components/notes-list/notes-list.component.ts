import { DatePipe } from '@angular/common';
import { Component, input, inject, signal, output } from '@angular/core';
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

  public selectedNoteId = signal('');

  public selectedNote = output<string>();

  constructor() {
    this.activatedRoute.params.subscribe((params) => {
      this.selectedNoteId.set(params['id']);
    });
  }

  public handleNoteSelection(noteId: string) {
    this.selectedNoteId.set(noteId);
    this.selectedNote.emit(noteId);
  }
}

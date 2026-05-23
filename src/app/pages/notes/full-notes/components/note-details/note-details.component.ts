import { Component, input } from '@angular/core';
import { Note } from '../../../../../interfaces/notes';

@Component({
  selector: 'app-note-details',
  imports: [],
  templateUrl: './note-details.component.html',
  styleUrl: './note-details.component.scss',
})
export class NoteDetailsComponent {
  public selectedNote = input<Note | null>(null);
}

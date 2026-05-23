import { Component, input } from '@angular/core';
import { Note } from '../../../../../interfaces/notes';
import { TagComponent } from '../../../../../shared/tag/tag.component';
import { UpperCasePipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-note-details',
  imports: [TagComponent, UpperCasePipe, DatePipe],
  templateUrl: './note-details.component.html',
  styleUrl: './note-details.component.scss',
})
export class NoteDetailsComponent {
  public selectedNote = input<Note | null>(null);
}

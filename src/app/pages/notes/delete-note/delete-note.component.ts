import { Component, inject, input } from '@angular/core';
import { ButtonComponent } from '../../../shared/button/button.component';
import { ModalService } from '../../../services/modal/modal.service';
import { NotesService } from '../../../services/notes/notes.service';

@Component({
  selector: 'app-delete-note',
  imports: [ButtonComponent],
  templateUrl: './delete-note.component.html',
  styleUrl: './delete-note.component.scss',
})
export class DeleteNoteComponent {
  public modalService = inject(ModalService);
  public notesService = inject(NotesService);
  public selectedNoteId = input<string>('');

  public cancelDeleteAction(): void {
    this.modalService.closeModal();
  }

  public handleDeleteNote(): void {
    console.log('Note ID to delete:', this.selectedNoteId());
    this.notesService.deleteNote(this.selectedNoteId()).subscribe({
      next: () => {
        this.modalService.closeModal();
      },
      error: (err) => {
        console.error('Error deleting note:', err);
      },
    });
  }
}

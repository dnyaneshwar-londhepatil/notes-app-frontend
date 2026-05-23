import { Component, inject } from '@angular/core';
import { ButtonComponent } from '../../../shared/button/button.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NotesService } from '../../../services/notes/notes.service';
import { CreateNotePayload } from '../../../interfaces/notes';
import { ModalService } from '../../../services/modal/modal.service';

@Component({
  selector: 'app-add-notes',
  imports: [ButtonComponent, ReactiveFormsModule],
  templateUrl: './add-notes.component.html',
  styleUrl: './add-notes.component.scss',
})
export class AddNotesComponent {
  private readonly noteService = inject(NotesService);
  private readonly modalService = inject(ModalService);

  newNoteForm = new FormGroup({
    title: new FormControl(),
    note: new FormControl(),
    category: new FormControl(),
  });

  handleNewNote() {
    const payload = {
      title: this.newNoteForm.getRawValue().title,
      content: this.newNoteForm.getRawValue().note,
      category: this.newNoteForm.getRawValue().category,
    };

    this.noteService.addNewNote(payload as CreateNotePayload).subscribe({
      next: () => {
        this.modalService.closeModal();
      },
    });
  }

  handleCancel(): void {
    this.modalService.closeModal();
  }
}

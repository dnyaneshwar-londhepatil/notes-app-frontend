import { Component, inject, signal } from '@angular/core';
import { ButtonComponent } from '../../../shared/button/button.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NotesService } from '../../../services/notes/notes.service';
import { CreateNotePayload } from '../../../interfaces/notes';
import { ModalService } from '../../../services/modal/modal.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-add-notes',
  imports: [ButtonComponent, ReactiveFormsModule],
  templateUrl: './add-notes.component.html',
  styleUrl: './add-notes.component.scss',
})
export class AddNotesComponent {
  private readonly noteService = inject(NotesService);
  private readonly modalService = inject(ModalService);

  public isSaving = signal(false);

  newNoteForm = new FormGroup({
    title: new FormControl(),
    note: new FormControl(),
    category: new FormControl(),
  });

  handleNewNote() {
    if (this.isSaving()) {
      return;
    }

    const payload = {
      title: this.newNoteForm.getRawValue().title,
      content: this.newNoteForm.getRawValue().note,
      category: this.newNoteForm.getRawValue().category,
    };

    this.isSaving.set(true);
    this.noteService
      .addNewNote(payload as CreateNotePayload)
      .pipe(finalize(() => this.isSaving.set(false)))
      .subscribe({
        next: () => {
          this.modalService.closeModal();
        },
      });
  }

  handleCancel(): void {
    this.modalService.closeModal();
  }
}

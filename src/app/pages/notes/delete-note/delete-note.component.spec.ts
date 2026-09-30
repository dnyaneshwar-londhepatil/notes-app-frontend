import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { DeleteNoteComponent } from './delete-note.component';
import { NotesService } from '../../../services/notes/notes.service';
import { ModalService } from '../../../services/modal/modal.service';

describe('DeleteNoteComponent', () => {
  let component: DeleteNoteComponent;
  let fixture: ComponentFixture<DeleteNoteComponent>;
  let deleteNote: jasmine.Spy;

  beforeEach(async () => {
    deleteNote = jasmine.createSpy('deleteNote').and.returnValue(new Subject());
    await TestBed.configureTestingModule({
      imports: [DeleteNoteComponent],
      providers: [
        { provide: NotesService, useValue: { deleteNote } },
        { provide: ModalService, useValue: { closeModal: () => {} } },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sends only one delete request while a request is pending', () => {
    component.handleDeleteNote();
    component.handleDeleteNote();

    expect(deleteNote).toHaveBeenCalledTimes(1);
  });
});

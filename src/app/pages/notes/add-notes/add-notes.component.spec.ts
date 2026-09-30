import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { AddNotesComponent } from './add-notes.component';
import { NotesService } from '../../../services/notes/notes.service';
import { ModalService } from '../../../services/modal/modal.service';

describe('AddNotesComponent', () => {
  let component: AddNotesComponent;
  let fixture: ComponentFixture<AddNotesComponent>;
  let addNewNote: jasmine.Spy;

  beforeEach(async () => {
    addNewNote = jasmine.createSpy('addNewNote').and.returnValue(new Subject());
    await TestBed.configureTestingModule({
      imports: [AddNotesComponent],
      providers: [
        { provide: NotesService, useValue: { addNewNote } },
        { provide: ModalService, useValue: { closeModal: () => {} } },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sends only one create request while a request is pending', () => {
    component.newNoteForm.setValue({
      title: 'Title',
      note: 'Content',
      category: 'work',
    });

    component.handleNewNote();
    component.handleNewNote();

    expect(addNewNote).toHaveBeenCalledTimes(1);
  });
});

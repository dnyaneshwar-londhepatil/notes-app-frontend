import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummarizedNotesComponent } from './summarized-notes.component';

describe('SummarizedNotesComponent', () => {
  let component: SummarizedNotesComponent;
  let fixture: ComponentFixture<SummarizedNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummarizedNotesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummarizedNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

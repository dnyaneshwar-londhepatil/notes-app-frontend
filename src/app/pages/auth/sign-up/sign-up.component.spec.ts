import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { SignUpComponent } from './sign-up.component';
import { AuthService } from '../../../services/auth/auth.service';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let signUp: jasmine.Spy;

  beforeEach(async () => {
    signUp = jasmine.createSpy('signUp').and.returnValue(new Subject());
    await TestBed.configureTestingModule({
      imports: [SignUpComponent],
      providers: [
        { provide: AuthService, useValue: { signUp } },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sends only one sign-up request while a request is pending', () => {
    component.signUpForm.setValue({
      userName: 'Person',
      email: 'person@example.com',
      password: 'Password1!',
    });

    component.handleRegistration();
    component.handleRegistration();

    expect(signUp).toHaveBeenCalledTimes(1);
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { Subject } from 'rxjs';

import { SignInComponent } from './sign-in.component';
import { AuthService } from '../../../services/auth/auth.service';
import { StorageService } from '../../../services/storage/storage.service';

describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;
  let signInResponse: Subject<unknown>;
  let signIn: jasmine.Spy;

  beforeEach(async () => {
    signInResponse = new Subject();
    signIn = jasmine.createSpy('signIn').and.returnValue(signInResponse);
    await TestBed.configureTestingModule({
      imports: [SignInComponent],
      providers: [
        { provide: AuthService, useValue: { error: signal(null), signIn } },
        { provide: StorageService, useValue: { setKey: () => {} } },
        { provide: Router, useValue: { navigate: () => Promise.resolve(true) } },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sends only one sign-in request while a request is pending', () => {
    component.signInForm.setValue({
      email: 'person@example.com',
      password: 'secret1',
    });

    component.handleSignIn();
    component.handleSignIn();

    expect(signIn).toHaveBeenCalledTimes(1);
  });
});

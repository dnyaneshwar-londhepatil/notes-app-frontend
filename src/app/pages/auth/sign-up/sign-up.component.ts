import { Component, inject, output, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';

import { AuthService } from '../../../services/auth/auth.service';
import { AuthState } from '../../../interfaces/auth-state';
import { ButtonComponent } from '../../../shared/button/button.component';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  public authService = inject(AuthService);

  public AuthState = AuthState;

  public isLoading = signal(false);

  signUpForm = new FormGroup({
    userName: new FormControl('', [Validators.required]),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/),
    ]),
  });

  public goToSignIn = output<void>();

  handleRegistration() {
    if (this.isLoading()) {
      return;
    }

    const { userName, email, password } = this.signUpForm.value;
    if (!userName || !email || !password) {
      return;
    }
    if (this.signUpForm.valid) {
      this.isLoading.set(true);
      this.authService
        .signUp({ userName, email, password })
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe({
        next: (response) => {
          this.goToSignIn.emit();
        },
        error: (error) => {
          console.log('Sign up failed:', error);
          // Handle error - show error message
        },
        });
    }
  }
}

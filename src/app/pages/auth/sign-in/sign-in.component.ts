import { Component, output, inject, signal, computed } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import {
  StorageKeys,
  StorageService,
} from '../../../services/storage/storage.service';
import { SignInResponse } from '../../../interfaces/auth-response';
import { ButtonComponent } from '../../../shared/button/button.component';
import { ErrorMessagesComponent } from '../../../shared/error-messages/error-messages.component';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorStateHighlightDirective } from '../../../directives/error-state-highlight/error-state-highlight.directive';
import { MarkFormTouchedDirective } from '../../../directives/mark-form-touched/mark-form-touched.directive';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    ErrorMessagesComponent,
    ErrorStateHighlightDirective,
    MarkFormTouchedDirective,
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent {
  public goToSignUp = output<void>();

  public authService = inject(AuthService);

  private readonly storageService = inject(StorageService);

  private readonly router = inject(Router);

  public isLoading = signal(false);

  public serverValidationErrors = signal({
    email: '',
    password: '',
    signInForm: '',
  });

  fieldValidationRules = computed(() => {
    const serverValidationErrors = this.serverValidationErrors();
    return {
      email: {
        required: 'Email is required',
        email: 'Please enter a valid email address',
        pattern: 'Please enter a valid email address',
        serverValidation: serverValidationErrors.email,
      },
      password: {
        required: 'Password is required',
        minLength: 'Password must be at least 6 characters long',
        serverValidation: serverValidationErrors.password,
      },
      signInForm: {
        serverValidation: serverValidationErrors.signInForm,
      },
    };
  });

  signInForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
      ],
    }),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  handleSignIn() {
    if (this.isLoading()) {
      return;
    }

    if (!this.signInForm.valid) {
      return;
    }

    const { email, password } = this.signInForm.value;

    if (email && password) {
      this.isLoading.set(true);
      this.authService.signIn({ email, password }).subscribe({
        next: (response: SignInResponse) => {
          this.isLoading.set(false);
          console.log('Sign-in successful:', response);
          // Handle successful sign-in, e.g., navigate to dashboard, store token, etc.

          this.storageService.setKey(
            StorageKeys.AuthToken,
            response.accessToken,
          );

          this.router.navigate(['/notes-list']);
        },
        error: (error) => {
          this.isLoading.set(false);
          console.log(
            'Sign-in error type:',
            error instanceof HttpErrorResponse,
          );
          if (error instanceof HttpErrorResponse) {
            console.error('Sign-in error 1:', error);
            this.mapErrors(error);
          }
          // Handle sign-in error, e.g., show error message to user
        },
      });
    }
  }

  mapErrors(signInError: HttpErrorResponse) {
    const errorMessage =
      signInError.error?.message || 'An unknown error occurred';

    this.signInForm.setErrors({
      serverValidation: errorMessage,
    });

    this.signInForm.markAllAsTouched();
  }
}

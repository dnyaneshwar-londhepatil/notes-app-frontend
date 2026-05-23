import { Component, output, inject, signal } from '@angular/core';
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

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent {
  public goToSignUp = output<void>();

  public authService = inject(AuthService);

  private readonly storageService = inject(StorageService);

  private readonly router = inject(Router);

  public isLoading = signal(false);

  signInForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  handleSignIn() {
    this.isLoading.set(true);

    if (!this.signInForm.valid) {
      return;
    }

    const { email, password } = this.signInForm.value;

    if (email && password) {
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
          console.error('Sign-in failed:', error);
          // Handle sign-in error, e.g., show error message to user
        },
      });
    }
  }
}
